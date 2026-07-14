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

export async function teacherCheckIn() {
  try {
    const user = await checkTeacher();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if already checked in today
    const existing = await prisma.teacherAttendance.findFirst({
      where: {
        teacherId: user.id,
        date: { gte: todayStart },
      },
    });

    if (existing) {
      return { success: false, error: "You have already checked in today." };
    }

    const record = await prisma.teacherAttendance.create({
      data: {
        teacherId: user.id,
        date: todayStart,
        checkIn: now,
        status: now.getHours() >= 9 ? "LATE" : "PRESENT",
        workingHours: 0,
      },
    });

    revalidatePath("/teacher/attendance");
    return { success: true, item: record };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function teacherCheckOut() {
  try {
    const user = await checkTeacher();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const existing = await prisma.teacherAttendance.findFirst({
      where: {
        teacherId: user.id,
        date: { gte: todayStart },
      },
    });

    if (!existing) {
      return { success: false, error: "You must check in first before checking out." };
    }

    if (existing.checkOut) {
      return { success: false, error: "You have already checked out today." };
    }

    const checkInTime = existing.checkIn ? new Date(existing.checkIn).getTime() : now.getTime();
    const workingHours = parseFloat(((now.getTime() - checkInTime) / (1000 * 60 * 60)).toFixed(2));

    const record = await prisma.teacherAttendance.update({
      where: { id: existing.id },
      data: {
        checkOut: now,
        workingHours,
      },
    });

    revalidatePath("/teacher/attendance");
    return { success: true, item: record };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
