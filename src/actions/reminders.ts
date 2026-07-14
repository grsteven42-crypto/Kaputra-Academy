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

export async function createReminder(data: {
  title: string;
  description?: string;
  type: string;
  dueDate?: string;
  courseId?: string;
}) {
  try {
    const user = await checkTeacher();
    const item = await prisma.reminder.create({
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        courseId: data.courseId || null,
        teacherId: user.id,
      },
    });
    revalidatePath("/teacher/schedule");
    return { success: true, item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateReminder(
  id: string,
  data: {
    title: string;
    description?: string;
    type: string;
    dueDate?: string;
    courseId?: string;
  }
) {
  try {
    await checkTeacher();
    const item = await prisma.reminder.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        courseId: data.courseId || null,
      },
    });
    revalidatePath("/teacher/schedule");
    return { success: true, item };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteReminder(id: string) {
  try {
    await checkTeacher();
    await prisma.reminder.delete({ where: { id } });
    revalidatePath("/teacher/schedule");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
