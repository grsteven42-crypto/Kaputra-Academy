import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import MaterialsClient from "./MaterialsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Learning Materials | Kaputra Academy",
};

export default async function MaterialsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const role = session.user.role;
  const userId = session.user.id;

  // Check enrollment
  const activeEnrollments = await prisma.enrollment.findMany({
    where: {
      studentId: userId,
      status: "ACTIVE",
    },
  });

  const isUnlocked = activeEnrollments.length > 0 || ["ADMIN", "TEACHER"].includes(role);

  // Fetch courses with learning materials
  let courses: any[] = [];
  if (role === "TEACHER") {
    const teacherAssignments = await prisma.teacherAssignment.findMany({
      where: { teacherId: userId },
      include: {
        course: {
          include: {
            materials: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });
    courses = teacherAssignments.map((ta) => ta.course);
  } else if (role === "ADMIN") {
    courses = await prisma.course.findMany({
      include: {
        materials: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } else {
    // Student: find courses they are enrolled in
    const courseIds = activeEnrollments.map((e) => e.itemId);
    courses = await prisma.course.findMany({
      where: {
        id: { in: courseIds },
      },
      include: {
        materials: {
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  return (
    <MaterialsClient
      initialCourses={courses}
      isUnlocked={isUnlocked}
      userRole={role}
    />
  );
}
