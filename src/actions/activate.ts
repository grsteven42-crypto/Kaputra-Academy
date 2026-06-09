"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function activateAccounts(formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const studentEmail = formData.get("studentEmail") as string;
  const studentPassword = formData.get("studentPassword") as string;
  const parentPassword = formData.get("parentPassword") as string;

  if (!studentId || !studentEmail || !studentPassword || !parentPassword) {
    throw new Error("All fields are required");
  }

  // 1. Validate Placement Test submission
  const test = await prisma.placementTest.findUnique({
    where: { studentIdStr: studentId },
    include: {
      registration: {
        include: { course: true },
      },
    },
  });

  if (!test) {
    throw new Error("Student ID not found in placement tests");
  }

  if (test.status !== "SUBMITTED" && test.status !== "REVIEWED") {
    throw new Error("Placement test must be submitted before activating accounts");
  }

  // Check if student account already exists
  const existingStudent = await prisma.user.findUnique({
    where: { studentIdStr: studentId },
  });
  if (existingStudent) {
    throw new Error("Account is already activated.");
  }

  const { registration } = test;

  // 2. Hash passwords
  const studentPasswordHash = await bcrypt.hash(studentPassword, 10);
  const parentPasswordHash = await bcrypt.hash(parentPassword, 10);

  // 3. Create/Retrieve Parent User
  let parentUser = await prisma.user.findUnique({
    where: { email: registration.parentEmail },
  });

  if (!parentUser) {
    parentUser = await prisma.user.create({
      data: {
        name: registration.parentName,
        email: registration.parentEmail,
        phone: registration.parentPhone,
        passwordHash: parentPasswordHash,
        role: "PARENT",
      },
    });
  }

  // 4. Create Student User (Linked to Parent)
  const studentUser = await prisma.user.create({
    data: {
      name: registration.studentName,
      email: studentEmail,
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      studentIdStr: studentId,
      parentId: parentUser.id,
    },
  });

  // 5. Create active enrollment
  await prisma.enrollment.create({
    data: {
      studentId: studentUser.id,
      courseId: registration.courseId,
      status: "ACTIVE",
    },
  });

  redirect("/login?activated=true");
}
