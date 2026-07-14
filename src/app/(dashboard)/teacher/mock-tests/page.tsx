import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import MockTestClient from "../../student/mock-test/MockTestClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Mock Tests | Kaputra Academy",
};

export default async function TeacherMockTestsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  const teacherAssignments = await prisma.teacherAssignment.findMany({
    where: { teacherId: session.user.id },
    include: {
      course: {
        include: {
          mockTests: {
            include: {
              questions: true,
              submissions: {
                include: {
                  student: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  const courses = teacherAssignments.map((ta) => ta.course);

  return (
    <MockTestClient
      initialCourses={courses}
      isUnlocked={true}
      userRole="TEACHER"
    />
  );
}
