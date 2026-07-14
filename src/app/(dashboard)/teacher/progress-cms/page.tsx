import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import ProgressCMSClient from "./ProgressCMSClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student Progress CMS | Kaputra Academy",
};

export default async function TeacherProgressCMSPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  // Get teacher's assigned course IDs
  const assignments = await prisma.teacherAssignment.findMany({
    where: { teacherId: session.user.id },
    select: { courseId: true },
  });
  const courseIds = assignments.map((a) => a.courseId);

  // Fetch academic reports for those courses
  const reports = await prisma.academicReport.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      student: { select: { id: true, name: true, studentIdStr: true } },
      course: { select: { title: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const formatted = reports.map((r) => ({
    id: r.id,
    studentName: r.student.name,
    studentId: r.student.studentIdStr || r.student.id,
    courseName: r.course.title,
    grade: r.grade,
    progress: r.progress,
    teacherNotes: r.teacherNotes,
    skillAssessment: r.skillAssessment,
    completedModules: r.completedModules,
  }));

  return <ProgressCMSClient reports={formatted} />;
}
