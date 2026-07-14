import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import StudentDashboardClient from "./StudentDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student Dashboard | Kaputra Academy",
};

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Fetch student profile and active enrollments
  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      parent: true,
      enrollments: {
        where: { status: "ACTIVE" },
      },
    },
  });

  if (!student) {
    redirect("/login");
  }

  // Map out enrolled course IDs
  const courseIds = student.enrollments
    .filter((e) => e.itemType === "COURSE" || e.itemType === "CLASS" || e.itemType === "PROGRAM")
    .map((e) => e.itemId);

  // Fetch course details, categories, and assigned teachers
  const enrolledCourses = await prisma.course.findMany({
    where: {
      id: { in: courseIds },
    },
    include: {
      category: true,
      teachers: {
        include: {
          teacher: true,
        },
      },
    },
  });

  const coursesWithDetails = enrolledCourses.map((course) => ({
    id: course.id,
    title: course.title,
    schedule: course.schedule,
    price: course.price,
    type: course.type,
    categoryName: course.category.name,
    teachers: course.teachers.map((t) => ({
      id: t.teacher.id,
      name: t.teacher.name,
      email: t.teacher.email,
    })),
  }));

  // Match enrollments that did not resolve to a database Course CUID
  const resolvedCourseIds = enrolledCourses.map((c) => c.id);
  const unresolvedEnrollments = student.enrollments.filter(
    (e) => !resolvedCourseIds.includes(e.itemId)
  );

  const fallbackCourses = unresolvedEnrollments.map((e) => ({
    id: e.id,
    title: e.itemId, // e.g. "Regular Class - Private Class"
    schedule: "Schedule to be arranged with your instructor",
    price: 0,
    type: e.itemType === "CLASS" ? "REGULAR" : "COMPETITION",
    categoryName: e.itemType,
    teachers: [],
  }));

  const allCoursesWithDetails = [...coursesWithDetails, ...fallbackCourses];

  // Fetch entry placement test results
  let placementTest = null;
  if (student.studentIdStr) {
    placementTest = await prisma.placementTest.findUnique({
      where: { studentIdStr: student.studentIdStr },
    });
  }

  return (
    <StudentDashboardClient
      studentName={student.name}
      studentIdStr={student.studentIdStr}
      courses={allCoursesWithDetails}
      placementTest={placementTest ? {
        id: placementTest.id,
        testCode: placementTest.testCode,
        status: placementTest.status,
        score: placementTest.score,
        qualificationStatus: placementTest.qualificationStatus,
        submittedAt: placementTest.submittedAt,
      } : null}
    />
  );
}
