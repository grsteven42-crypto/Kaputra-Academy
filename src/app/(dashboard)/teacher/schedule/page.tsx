import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import ScheduleClient from "./ScheduleClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Schedule & Reminders | Kaputra Academy",
};

export default async function TeacherSchedulePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  // Fetch teacher's schedules
  const schedules = await prisma.schedule.findMany({
    where: { teacherId: session.user.id },
    include: { course: { select: { title: true } } },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  // Fetch teacher's reminders
  const reminders = await prisma.reminder.findMany({
    where: { teacherId: session.user.id },
    include: { course: { select: { id: true, title: true } } },
    orderBy: { dueDate: "asc" },
  });

  // Fetch assigned courses for dropdown
  const assignments = await prisma.teacherAssignment.findMany({
    where: { teacherId: session.user.id },
    include: { course: { select: { id: true, title: true } } },
  });

  const formattedSchedules = schedules.map((s) => ({
    id: s.id,
    dayOfWeek: s.dayOfWeek,
    startTime: s.startTime,
    endTime: s.endTime,
    type: s.type,
    courseName: s.course?.title || null,
  }));

  const formattedReminders = reminders.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    type: r.type,
    dueDate: r.dueDate ? r.dueDate.toISOString() : null,
    courseId: r.courseId,
    courseName: r.course?.title || null,
  }));

  const courses = assignments.map((a) => a.course);

  return (
    <ScheduleClient
      schedules={formattedSchedules}
      initialReminders={formattedReminders}
      courses={courses}
    />
  );
}
