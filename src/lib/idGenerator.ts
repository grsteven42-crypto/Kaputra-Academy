import prisma from "./db";

// Helper to generate the next Student ID (e.g., KPA-2026-0001)
export async function generateStudentId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `KPA-${currentYear}-`;

  // Find the highest student ID for the current year
  const lastStudent = await prisma.placementTest.findFirst({
    where: {
      studentIdStr: {
        startsWith: yearPrefix,
      },
    },
    orderBy: {
      studentIdStr: "desc",
    },
  });

  let nextNumber = 1;
  if (lastStudent && lastStudent.studentIdStr) {
    const parts = lastStudent.studentIdStr.split("-");
    const lastNum = parseInt(parts[2], 10);
    if (!isNaN(lastNum)) {
      nextNumber = lastNum + 1;
    }
  }

  // Format as KPA-YYYY-XXXX (padded to 4 digits)
  const paddedNumber = String(nextNumber).padStart(4, "0");
  return `${yearPrefix}${paddedNumber}`;
}

// Helper to generate a unique Placement Test Code (e.g., PT-KPA-8X3F9Q)
export async function generatePlacementTestCode(): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  let isUnique = false;

  while (!isUnique) {
    let randomPart = "";
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code = `PT-KPA-${randomPart}`;

    // Verify uniqueness in db
    const existing = await prisma.placementTest.findUnique({
      where: { testCode: code },
    });
    if (!existing) {
      isUnique = true;
    }
  }

  return code;
}
