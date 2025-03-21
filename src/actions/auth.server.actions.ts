"use server";

import { signIn, signOut } from "@/auth";
import {
  APP_NAME,
  DEFAULT_LOGIN_ROUTE,
  DEFAULT_PREPROCESS_ROUTE,
  NEXTAUTH_URL
} from "@/lib/environment-variables";
import { prisma } from "@/lib/prisma";
import { generateBackupCode } from "@/lib/utils";
import { RegisterSchema } from "@/lib/validators/register-schema";
import { SignInSchema } from "@/lib/validators/signin-schema";
import {
  AuthenticationResponseJSON,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  RegistrationResponseJSON,
  VerifiedAuthenticationResponse,
  VerifiedRegistrationResponse,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { isoBase64URL, isoUint8Array } from "@simplewebauthn/server/helpers";
import bcrypt from "bcryptjs";
import { authenticator, totp } from "otplib";
import QRCode from "qrcode";

const integratedSignIn = async ({
  provider,
  credentialsData,
  credentialsMFAData,
  credentialsPasskeyData,
}: {
  provider: string;
  credentialsData?: SignInSchema;
  credentialsMFAData?: SignInSchema & { totp: string; backupCode: string };
  credentialsPasskeyData?: { email: string; credentialId: string };
}) => {
  try {
    if (provider === "credentials" && credentialsData)
      await credentialsSignIn(credentialsData);
    else if (provider === "credentialsMFA" && credentialsMFAData)
      await credentialSignInWithMFA(credentialsMFAData);
    else if (provider === "credentialsPasskey" && credentialsPasskeyData)
      await passkeySignIn(credentialsPasskeyData);
    else await signIn(provider, { redirectTo: DEFAULT_PREPROCESS_ROUTE });
  } catch (error) {
    throw error;
  }
};

const credentialsSignIn = async (data: SignInSchema) => {
  "use server";
  try {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    await signIn("credentials", formData);
  } catch (error) {
    throw error;
  }
};

const credentialSignInWithMFA = async (
  data: SignInSchema & { totp: string; backupCode: string }
) => {
  "use server";
  try {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.totp) formData.append("totp", data.totp);
    if (data.backupCode) formData.append("backupCode", data.backupCode);

    await signIn("credentials", formData);
  } catch (error) {
    throw error;
  }
};

const credentialsRegister = async (data: RegisterSchema) => {
  "use server";
  try {
    const { name, email, password, cnfPassword } = data;

    if (!name || !email || !password || !cnfPassword)
      throw new Error("All fields are required");

    if (password !== cnfPassword) throw new Error("Passwords do not match");

    const passwordHash = bcrypt.hashSync(password);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) throw new Error("User already exists. Please Login...");

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    if (!newUser) throw new Error("User not created");

    return newUser;
  } catch (error) {
    throw error;
  }
};

const generateWebAuthNRegistrationOptions = async (email: string) => {
  "use server";
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Register user first");

    const authenticators = await prisma.authenticator.findMany({
      where: {
        userId: user.id,
      },
    });

    const options = await generateRegistrationOptions({
      rpName: APP_NAME,
      rpID: new URL(NEXTAUTH_URL).hostname,
      userID: isoUint8Array.fromUTF8String(user.id),
      userName: user.email,
      userDisplayName: user.name ? user.name : undefined,
      attestationType: "direct",
      excludeCredentials: authenticators.map((auth) => ({
        id: auth.credentialID,
        transports: auth.transports ? JSON.parse(auth.transports) : [],
      })),
    });

    return options;
  } catch (error) {
    throw error;
  }
};

const verifyWebAuthNRegistrationResponse = async (
  email: string,
  attestation: RegistrationResponseJSON,
  options: PublicKeyCredentialCreationOptionsJSON
) => {
  "use server";
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Register user first");

    const verification = await verifyRegistrationResponse({
      response: attestation,
      expectedChallenge: options.challenge,
      expectedOrigin: NEXTAUTH_URL,
      expectedRPID: new URL(NEXTAUTH_URL).hostname,
    });

    if (!verification.verified) throw new Error("Passkey verification failed");

    return verification;
  } catch (error) {
    throw error;
  }
};

const saveWebAuthNRegistrationResponse = async (
  email: string,
  verificationDetails: VerifiedRegistrationResponse
) => {
  "use server";
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Register user first");

    if (!verificationDetails.verified) throw new Error("Passkey not verified");

    if (!verificationDetails.registrationInfo)
      throw new Error("Empty Registration Info");

    const credentialID: string =
      verificationDetails.registrationInfo.credential.id;
    const userId: string = user.id;
    const providerAccountId: string = user.email;
    const credentialPublicKey: string = isoBase64URL.fromBuffer(
      verificationDetails.registrationInfo.credential.publicKey
    );
    const counter: number =
      verificationDetails.registrationInfo.credential.counter;
    const credentialDeviceType: string =
      verificationDetails.registrationInfo.credentialDeviceType;
    const credentialBackedUp: boolean =
      verificationDetails.registrationInfo.credentialBackedUp;
    const transports: string = JSON.stringify(
      verificationDetails.registrationInfo.credential.transports
    );

    const db_credentials = await prisma.authenticator.upsert({
      where: {
        userId_credentialID: {
          userId,
          credentialID,
        },
      },
      update: {
        credentialID,
        providerAccountId,
        credentialPublicKey,
        counter,
        credentialDeviceType,
        credentialBackedUp,
        transports,
      },
      create: {
        credentialID,
        userId,
        providerAccountId,
        credentialPublicKey,
        counter,
        credentialDeviceType,
        credentialBackedUp,
        transports,
      },
    });

    if (!db_credentials) throw new Error("Cannot create WebAuthN Credentials");

    return db_credentials;
  } catch (error) {
    throw error;
  }
};

const generateWebAuthNAuthenticationOptions = async () => {
  "use server";
  try {
    const options = await generateAuthenticationOptions({
      rpID: new URL(NEXTAUTH_URL).hostname,
      userVerification: "preferred",
    });
    return options;
  } catch (error) {
    throw error;
  }
};

const verifyWebAuthNAuthenticationResponse = async (
  attestation: AuthenticationResponseJSON,
  options: PublicKeyCredentialRequestOptionsJSON
) => {
  "use server";
  try {
    const authenticator = await prisma.authenticator.findFirst({
      where: { credentialID: attestation.id },
    });

    if (!authenticator) throw new Error("No Authenticators found");

    const verification = await verifyAuthenticationResponse({
      response: attestation,
      expectedChallenge: options.challenge,
      expectedOrigin: NEXTAUTH_URL,
      expectedRPID: new URL(NEXTAUTH_URL).hostname,
      credential: {
        id: authenticator.credentialID,
        publicKey: isoBase64URL.toBuffer(authenticator.credentialPublicKey),
        counter: authenticator.counter,
        transports: authenticator.transports
          ? JSON.parse(authenticator.transports)
          : [],
      },
    });

    if (!verification.verified) throw new Error("Passkey verification failed");

    return verification;
  } catch (error) {
    throw error;
  }
};

const saveWebAuthNAutenticationResponse = async (
  verification: VerifiedAuthenticationResponse
) => {
  "use server";
  try {
    if (!verification.verified) throw new Error("Passkey not verified");

    if (!verification.authenticationInfo)
      throw new Error("Empty Authentication Info");

    const credentialID = verification.authenticationInfo.credentialID;
    const newCounter = verification.authenticationInfo.newCounter;

    const authenticator = await prisma.authenticator.update({
      where: {
        credentialID,
      },
      data: {
        counter: newCounter,
      },
      include: { user: true },
    });
    return authenticator;
  } catch (error) {
    throw error;
  }
};

const passkeySignIn = async (data: { email: string; credentialId: string }) => {
  "use server";
  try {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("credentialId", data.credentialId);

    await signIn("credentials", formData);
  } catch (error) {
    throw error;
  }
};

const userSignOut = async () => {
  "use server";
  await signOut({ redirectTo: DEFAULT_LOGIN_ROUTE });
};

const MFASecretGenerate = async (email: string) => {
  "use server";
  try {
    const secret = authenticator.generateSecret();
    const otpauthUrl = totp.keyuri(email, APP_NAME, secret);
    const qrCodeDataURL = await QRCode.toDataURL(otpauthUrl);
    return {
      secret,
      otpauthUrl,
      qrCodeDataURL,
    };
  } catch (error) {
    throw error;
  }
};

const MFATokenVerify = async (token: string, email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    if (!user.twoFactorEnabled || !user.twoFactorSecret)
      throw new Error("MFA is not enabled by user. No secret found.");

    const verified = authenticator.check(token, user.twoFactorSecret);
    return verified;
  } catch (error) {
    throw error;
  }
};

const MFAActivate = async (token: string, secret: string, email: string) => {
  "use server";
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const verification = authenticator.check(token, secret);
    if (!verification) throw new Error("Token not verified");

    const backupCodes = generateBackupCode();

    const upd_user = await prisma.user.update({
      where: { email },
      data: { twoFactorSecret: secret, twoFactorEnabled: true, backupCodes },
    });
    if (!upd_user) throw new Error("Failed to update 2FA Secret");

    return upd_user;
  } catch (error) {
    throw error;
  }
};

export {
  credentialSignInWithMFA,
  credentialsRegister,
  credentialsSignIn,
  generateWebAuthNAuthenticationOptions,
  generateWebAuthNRegistrationOptions,
  integratedSignIn,
  MFAActivate,
  MFASecretGenerate,
  MFATokenVerify,
  passkeySignIn,
  saveWebAuthNAutenticationResponse,
  saveWebAuthNRegistrationResponse,
  userSignOut,
  verifyWebAuthNAuthenticationResponse,
  verifyWebAuthNRegistrationResponse
};

