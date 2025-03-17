import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { prisma } from "./lib/prisma";
import { signInSchemaAuthParser } from "./lib/validators/signin-schema";
import {
  DEFAULT_LOGIN_ROUTE,
  DEFAULT_REGISTER_ROUTE,
} from "./lib/environment-variables";
import { MFATokenVerify } from "./actions/auth.server.actions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Github({ allowDangerousEmailAccountLinking: true }),
    Google({ allowDangerousEmailAccountLinking: true }),
    MicrosoftEntraID({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
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
              if (!verification)
                throw new Error("Authenticator Token not verified");
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
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: DEFAULT_LOGIN_ROUTE,
    newUser: DEFAULT_REGISTER_ROUTE,
    signOut: "/logout",
  },
});
