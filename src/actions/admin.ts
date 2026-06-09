"use server";

import prisma from "@/lib/db";
import { generateStudentId, generatePlacementTestCode } from "@/lib/idGenerator";
import { sendWelcomeEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function approveRegistration(registrationId: string) {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { course: true },
    });

    if (!registration) {
      throw new Error("Registration not found");
    }

    if (registration.status === "APPROVED") {
      throw new Error("Registration is already approved");
    }

    // 1. Generate unique Student ID
    const studentId = await generateStudentId();

    // 2. Generate unique Placement Test Code
    const testCode = await generatePlacementTestCode();

    // 3. Create Placement Test record
    await prisma.placementTest.create({
      data: {
        registrationId: registration.id,
        studentIdStr: studentId,
        testCode: testCode,
        status: "NOT_STARTED",
      },
    });

    // 4. Update Registration Status
    await prisma.registration.update({
      where: { id: registration.id },
      data: { status: "APPROVED" },
    });

    // 5. Send Welcome Email
    await sendWelcomeEmail({
      parentEmail: registration.parentEmail,
      parentName: registration.parentName,
      studentName: registration.studentName,
      studentId: studentId,
      programName: registration.course.title,
      placementTestCode: testCode,
    });

    revalidatePath("/admin");
    return { success: true, studentId, testCode };
  } catch (error: any) {
    console.error("Failed to approve registration:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectRegistration(registrationId: string) {
  try {
    await prisma.registration.update({
      where: { id: registrationId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to reject registration:", error);
    return { success: false, error: error.message };
  }
}
