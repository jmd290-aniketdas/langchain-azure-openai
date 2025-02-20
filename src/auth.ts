import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { prisma } from "./lib/prisma";
import { signInSchema } from "./lib/validators/signin-schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Github,
    Google,
    MicrosoftEntraID,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = signInSchema.parse(credentials);

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            throw new Error("User not found");
          }

          if (!user.passwordHash) {
            throw new Error("Password not set");
          }

          const isValid = Bun.password.verifySync(password, user.passwordHash);
          if (!isValid) {
            throw new Error("Invalid password");
          }

          return user;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  session: { strategy: "database" },
  pages: { signIn: "/login", newUser: "/register", signOut: "/logout" },
});
