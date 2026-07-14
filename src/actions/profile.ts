"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updatePassword(currentPass: string, newPass: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized access" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { success: false, error: "User profile not found" };
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPass, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Incorrect current password. Please try again." };
  }

  // Hash the new password and update user
  const newHash = await bcrypt.hash(newPass, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  return { success: true };
}
