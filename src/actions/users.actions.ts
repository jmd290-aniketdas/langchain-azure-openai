"use server";

import { prisma } from "@/lib/prisma";
import { PasswordUpdateSchema } from "@/lib/validators/password-update-schema";
import { Authenticator } from "@/types/users.types";
import bcrypt from "bcryptjs";

// ! NextAuth doesnot populate ID of the user from the database in the session object, use Email Address instead of the ID to query user from database

const deleteUser = async (email: string) => {
  try {
    const user = await prisma.user.delete({ where: { email } });
    if (!user) throw new Error("Failed to delete User. User not Found.");

    return "Deleted user successfully";
  } catch (error) {
    throw error;
  }
};

const changePassword = async (
  email: string,
  data: PasswordUpdateSchema
): Promise<string> => {
  const { password, cnfPassword } = data;

  if (password !== cnfPassword) {
    throw new Error("Passwords don't match");
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const oldPasswordHash = user.passwordHash;
    const newPasswordHash = bcrypt.hashSync(password);

    if (oldPasswordHash === newPasswordHash)
      throw new Error("Both Passwords are same");

    const upd_user = await prisma.user.update({
      where: { email },
      data: { passwordHash: newPasswordHash },
    });

    if (!upd_user) throw new Error("Failed to update User Password");

    return "Password updated successfully";
  } catch (error) {
    throw error;
  }
};

const fetchUserLinkedAccountProviders = async (
  email: string
): Promise<string[]> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    });
    if (!user) throw new Error("User not found");

    const accountProviders = user.accounts.map((account) => account.provider);
    return accountProviders;
  } catch (error) {
    throw error;
  }
};

const fetchUserAuthenticators = async (
  email: string
): Promise<Authenticator[]> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { Authenticator: true },
    });
    if (!user) throw new Error("User not found");

    const authenticators = user.Authenticator.map((a) => ({
      credentialDeviceType: a.credentialDeviceType,
      counter: a.counter,
    }));
    return authenticators;
  } catch (error) {
    throw error;
  }
};

const changeUserName = async (email: string, newName: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const upd_user = await prisma.user.update({
      where: { email },
      data: { name: newName },
    });
    if (!upd_user) throw new Error("Failed to update User Name");

    return "Name changed successfully";
  } catch (error) {
    throw error;
  }
};

export {
  deleteUser,
  changePassword,
  fetchUserLinkedAccountProviders,
  fetchUserAuthenticators,
  changeUserName,
};
