import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth, { DefaultSession, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { MFATokenVerify } from "./actions/auth.server.actions";
import {
  DEFAULT_LOGIN_ROUTE,
  DEFAULT_REGISTER_ROUTE,
} from "./lib/environment-variables";
import { prisma } from "./lib/prisma";
import { signInSchemaAuthParser } from "./lib/validators/signin-schema";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      name: string;
      email: string;
      image?: string | null;
    };
  }
}

const adapter = PrismaAdapter(prisma);

const authorize = async (credentials: Partial<Record<string, unknown>>) => {
  const { email, password, credentialId, totp, backupCode } =
    signInSchemaAuthParser.parse(credentials);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  if (password) {
    if (!user.passwordHash) throw new Error("Password not set");

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) throw new Error("Invalid password");

    if (user.twoFactorEnabled) {
      if (!totp && !backupCode)
        throw new Error("TOTP or Backup Code are not provided");

      if (totp) {
        const verification = await MFATokenVerify(totp, email);
        if (!verification) throw new Error("Authenticator Token not verified");
      }

      if (backupCode) {
        if (user.backupCodes !== backupCode)
          throw new Error("Backup Code doesnot match");
      }
    }
  } else {
    const authenticator = await prisma.authenticator.findUnique({
      where: {
        credentialID: credentialId,
      },
    });
    if (!authenticator) throw new Error("No Authenticator associated");

    if (authenticator.userId !== user.id)
      throw new Error("Invalid Authenticator");
  }

  return user;
};

const authConfig: NextAuthConfig = {
  adapter,
  providers: [
    Github({ allowDangerousEmailAccountLinking: true }),
    Google({ allowDangerousEmailAccountLinking: true }),
    MicrosoftEntraID({ allowDangerousEmailAccountLinking: true }),
    Credentials({ authorize }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (account?.provider === "credentials") {
        const sessionToken = crypto.randomUUID();
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        const session = await adapter.createSession!({
          userId: user.id!,
          sessionToken,
          expires,
        });
        token.sessionId = session.sessionToken;
      }
      return token;
    },
  },
  jwt: {
    async encode({ token }) {
      return token?.sessionId as unknown as string;
    },
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days to session expiry
    updateAge: 24 * 60 * 60, // 24 hours to update session data into database
  },
  pages: {
    signIn: DEFAULT_LOGIN_ROUTE,
    newUser: DEFAULT_REGISTER_ROUTE,
    signOut: "/logout",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
