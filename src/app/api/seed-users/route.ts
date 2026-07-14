import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: false,
    message: "This endpoint is disabled for security. To run it again, uncomment the implementation in src/app/api/seed-users/route.ts."
  });
}

/*
// Uncomment below to reactivate the account creator/seeder

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const passwordHash = await bcrypt.hash("password123", 10);

    // 1. Create/Update Parent
    const parentEmail = "parent@kaputra.com";
    let parent = await prisma.user.findUnique({
      where: { email: parentEmail }
    });

    if (parent) {
      parent = await prisma.user.update({
        where: { id: parent.id },
        data: {
          passwordHash,
          isActive: true,
          role: "PARENT"
        }
      });
    } else {
      parent = await prisma.user.create({
        data: {
          name: "Test Parent",
          email: parentEmail,
          passwordHash,
          phone: "08123456789",
          role: "PARENT",
          isActive: true
        }
      });
    }

    // 2. Create/Update Student
    const studentIdStr = "STUDENT1";
    let student = await prisma.user.findFirst({
      where: { studentIdStr: studentIdStr }
    });

    if (student) {
      student = await prisma.user.update({
        where: { id: student.id },
        data: {
          passwordHash,
          isActive: true,
          role: "STUDENT",
          parentId: parent.id
        }
      });
    } else {
      student = await prisma.user.create({
        data: {
          name: "Test Student",
          email: "student@kaputra.local",
          passwordHash,
          phone: "08123456780",
          role: "STUDENT",
          studentIdStr: studentIdStr,
          isActive: true,
          parentId: parent.id
        }
      });
    }

    // 3. Create/Update Teacher
    const teacherEmail = "teacher@kaputra.com";
    let teacher = await prisma.user.findUnique({
      where: { email: teacherEmail }
    });

    if (teacher) {
      teacher = await prisma.user.update({
        where: { id: teacher.id },
        data: {
          passwordHash,
          isActive: true,
          role: "TEACHER"
        }
      });
    } else {
      teacher = await prisma.user.create({
        data: {
          name: "Test Teacher",
          email: teacherEmail,
          passwordHash,
          phone: "08123456781",
          role: "TEACHER",
          isActive: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Accounts successfully created/updated!",
      accounts: {
        parent: {
          email: parent.email,
          role: parent.role,
          password: "password123"
        },
        student: {
          studentId: student.studentIdStr,
          email: student.email,
          role: student.role,
          password: "password123"
        },
        teacher: {
          email: teacher.email,
          role: teacher.role,
          password: "password123"
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
*/
