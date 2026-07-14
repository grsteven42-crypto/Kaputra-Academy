"use server";

import prisma from "@/lib/db";
import { generateStudentId } from "@/lib/idGenerator";
import { redirect } from "next/navigation";

export async function submitRegistration(formData: FormData) {
  const studentName = formData.get("studentName") as string;
  const dateOfBirthStr = formData.get("dateOfBirth") as string;
  const parentName = formData.get("parentName") as string;
  const parentPhone = formData.get("parentPhone") as string;
  const parentEmail = formData.get("parentEmail") as string;

  if (!studentName || !dateOfBirthStr || !parentName || !parentPhone || !parentEmail) {
    throw new Error("Missing required fields");
  }

  const dateOfBirth = new Date(dateOfBirthStr);
  const currentYear = new Date().getFullYear();
  const dobYear = dateOfBirth.getFullYear();
  const studentAge = currentYear - dobYear;

  // Generate unique Student ID (e.g. initials + DOB like MDC211006)
  const studentId = await generateStudentId(studentName, dateOfBirth);

  // Generate unique student virtual email placeholder
  const virtualEmail = `${studentId.toLowerCase()}@kaputra.local`;

  // Find or create Parent User
  let parentUser = await prisma.user.findUnique({
    where: { email: parentEmail },
  });

  if (!parentUser) {
    parentUser = await prisma.user.create({
      data: {
        name: parentName,
        email: parentEmail,
        phone: parentPhone,
        passwordHash: "", // Blank password until set (or parent doesn't log in directly)
        role: "PARENT",
        isActive: false, // Will become verified upon student activation
      },
    });
  }

  // Create inactive Student User
  await prisma.user.create({
    data: {
      name: studentName,
      email: virtualEmail,
      passwordHash: "", // Password created during activation
      role: "STUDENT",
      studentIdStr: studentId,
      parentId: parentUser.id,
      isActive: false,
      dateOfBirth: dateOfBirth,
    },
  });



  // Redirect to registration page with success query param
  redirect(`/register?success=true&studentId=${studentId}`);
}
