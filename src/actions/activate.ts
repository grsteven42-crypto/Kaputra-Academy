"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function activateAccounts(formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const studentPassword = formData.get("studentPassword") as string;
  const parentPassword = formData.get("parentPassword") as string;

  if (!studentId || !studentPassword) {
    throw new Error("Missing required fields");
  }

  // 1. Find the inactive student account
  const student = await prisma.user.findUnique({
    where: { studentIdStr: studentId },
    include: { parent: true },
  });

  if (!student) {
    throw new Error("Student ID not found");
  }

  if (student.isActive) {
    throw new Error("Account is already activated.");
  }

  // 2. Hash student password
  const studentPasswordHash = await bcrypt.hash(studentPassword, 10);

  // 3. Update Student User to active
  await prisma.user.update({
    where: { id: student.id },
    data: {
      passwordHash: studentPasswordHash,
      isActive: true,
    },
  });

  // 4. Update Parent User to active/verified and set their password
  if (student.parent) {
    const parentUpdateData: { isActive: boolean; passwordHash?: string } = {
      isActive: true,
    };

    if (parentPassword) {
      parentUpdateData.passwordHash = await bcrypt.hash(parentPassword, 10);
    }

    await prisma.user.update({
      where: { id: student.parent.id },
      data: parentUpdateData,
    });
  }

  redirect("/login?activated=true");
}
