"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkTeacher() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function updateStudentProgress(
  reportId: string,
  data: {
    progress: number;
    completedModules: string;
    teacherNotes: string;
    skillAssessment: string;
  }
) {
  try {
    await checkTeacher();
    const item = await prisma.academicReport.update({
      where: { id: reportId },
      data: {
        progress: data.progress,
        completedModules: data.completedModules,
        teacherNotes: data.teacherNotes,
        skillAssessment: data.skillAssessment,
      },
    });
    revalidatePath("/teacher/progress-cms");
    return { success: true, item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createStudentReport(data: {
  studentId: string;
  courseId: string;
  grade: string;
  progress: number;
  teacherNotes: string;
  skillAssessment: string;
  completedModules: string;
}) {
  try {
    await checkTeacher();
    const item = await prisma.academicReport.create({
      data: {
        studentId: data.studentId,
        courseId: data.courseId,
        grade: data.grade,
        progress: data.progress,
        teacherNotes: data.teacherNotes,
        skillAssessment: data.skillAssessment,
        completedModules: data.completedModules,
      },
    });
    revalidatePath("/teacher/progress-cms");
    revalidatePath("/teacher/report-cms");
    return { success: true, item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAcademicReport(
  reportId: string,
  data: {
    grade: string;
    progress: number;
    teacherNotes: string;
    skillAssessment: string;
    completedModules: string;
  }
) {
  try {
    await checkTeacher();
    const item = await prisma.academicReport.update({
      where: { id: reportId },
      data: {
        grade: data.grade,
        progress: data.progress,
        teacherNotes: data.teacherNotes,
        skillAssessment: data.skillAssessment,
        completedModules: data.completedModules,
      },
    });
    revalidatePath("/teacher/report-cms");
    revalidatePath("/teacher/progress-cms");
    return { success: true, item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAcademicReport(reportId: string) {
  try {
    await checkTeacher();
    await prisma.academicReport.delete({
      where: { id: reportId },
    });
    revalidatePath("/teacher/report-cms");
    revalidatePath("/teacher/progress-cms");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
