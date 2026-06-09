"use server";

import prisma from "@/lib/db";

export async function validateTestCode(studentId: string, code: string) {
  try {
    const test = await prisma.placementTest.findUnique({
      where: { testCode: code },
      include: {
        registration: true,
      },
    });

    if (!test) {
      return { success: false, error: "Invalid Placement Test Code." };
    }

    if (test.studentIdStr !== studentId) {
      return { success: false, error: "Student ID does not match this Test Code." };
    }

    if (test.status === "SUBMITTED" || test.status === "REVIEWED") {
      return { success: false, error: "This Placement Test has already been submitted and the code is used." };
    }

    // Update status to IN_PROGRESS if it was NOT_STARTED
    if (test.status === "NOT_STARTED") {
      await prisma.placementTest.update({
        where: { id: test.id },
        data: {
          status: "IN_PROGRESS",
          startedAt: new Date(),
        },
      });
    }

    return {
      success: true,
      testId: test.id,
      studentName: test.registration.studentName,
      status: test.status,
      savedAnswers: test.answers ? JSON.parse(test.answers) : {},
    };
  } catch (error: any) {
    console.error("Validation error:", error);
    return { success: false, error: "An error occurred during validation." };
  }
}

export async function saveTestProgress(code: string, answers: Record<string, string>) {
  try {
    await prisma.placementTest.update({
      where: { testCode: code },
      data: {
        answers: JSON.stringify(answers),
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Save progress error:", error);
    return { success: false };
  }
}

export async function submitPlacementTest(code: string, answers: Record<string, string>) {
  try {
    await prisma.placementTest.update({
      where: { testCode: code },
      data: {
        answers: JSON.stringify(answers),
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Submit test error:", error);
    return { success: false, error: "Failed to submit test." };
  }
}
