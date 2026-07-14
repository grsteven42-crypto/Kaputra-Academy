import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import StudentAnnouncementsClient from "./AnnouncementsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Announcements | Kaputra Academy",
};

export default async function StudentAnnouncementsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: session.user.id, status: "ACTIVE" },
    select: { itemId: true },
  });
  const courseIds = enrollments.map((e) => e.itemId);

  const items = await prisma.announcement.findMany({
    where: {
      isPublished: true,
      publishDate: { lte: new Date() },
      targetAudience: { in: ["STUDENTS", "BOTH"] },
      OR: [
        { courseId: null },
        { courseId: { in: courseIds } },
      ],
      AND: [
        {
          OR: [
            { targetStudents: { none: {} } }, // Send to everyone
            { targetStudents: { some: { id: session.user.id } } }, // Specific targeted student
          ],
        },
      ],
    },
    include: {
      teacher: { select: { name: true } },
      course: { select: { title: true } },
      reads: { where: { studentId: session.user.id } },
    },
    orderBy: { publishDate: "desc" },
  });

  const formatted = items.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    targetAudience: a.targetAudience,
    courseId: a.courseId,
    isPublished: a.isPublished,
    publishDate: a.publishDate.toISOString(),
    teacherName: a.teacher.name,
    courseName: a.course?.title || null,
    isRead: a.reads.length > 0,
  }));

  return <StudentAnnouncementsClient initialAnnouncements={formatted} />;
}
