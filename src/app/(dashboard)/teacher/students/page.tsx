import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, GraduationCap, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student List | Kaputra Academy",
};

export default async function TeacherStudentListPage({
  searchParams,
}: {
  searchParams: { courseId?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  // Get teacher assignments
  const assignments = await prisma.teacherAssignment.findMany({
    where: { teacherId: session.user.id },
    include: {
      course: true,
    },
  });

  const courseIds = assignments.map((a) => a.courseId);
  const filterCourseId = searchParams?.courseId;

  // If a specific course is filtered, only show students for that course
  const targetCourseIds = filterCourseId && courseIds.includes(filterCourseId)
    ? [filterCourseId]
    : courseIds;

  // Fetch enrollments with student data
  const enrollments = await prisma.enrollment.findMany({
    where: {
      itemId: { in: targetCourseIds },
      itemType: "CLASS",
      status: "ACTIVE",
    },
    include: {
      student: true,
    },
  });

  // Fetch academic reports for progress data
  const studentIds = enrollments.map((e) => e.studentId);
  const reports = await prisma.academicReport.findMany({
    where: {
      studentId: { in: studentIds },
      courseId: { in: targetCourseIds },
    },
  });

  // Map course titles
  const courseMap = new Map(assignments.map((a) => [a.courseId, a.course.title]));

  // Build student data
  const students = enrollments.map((e) => {
    const report = reports.find(
      (r) => r.studentId === e.studentId && r.courseId === e.itemId
    );
    return {
      id: e.student.id,
      name: e.student.name,
      studentIdStr: e.student.studentIdStr || "—",
      courseId: e.itemId,
      courseName: courseMap.get(e.itemId) || "Unknown",
      progress: report?.progress || 0,
    };
  });

  // Get the course filter name for display
  const filterCourseName = filterCourseId ? courseMap.get(filterCourseId) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Users className="h-8 w-8 text-[#CA8E25]" />
          Student List
        </h1>
        <p className="text-slate-400 mt-2">
          {filterCourseName
            ? `Showing students enrolled in "${filterCourseName}"`
            : "View all students enrolled in your assigned classes."}
        </p>
      </div>

      {/* Course Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Link href="/teacher/students">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition cursor-pointer ${
              !filterCourseId
                ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            All Classes
          </span>
        </Link>
        {assignments.map((a) => (
          <Link key={a.courseId} href={`/teacher/students?courseId=${a.courseId}`}>
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition cursor-pointer ${
                filterCourseId === a.courseId
                  ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
              }`}
            >
              {a.course.title}
            </span>
          </Link>
        ))}
      </div>

      {/* Student Grid */}
      {students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={`${student.id}-${student.courseId}`}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition shadow-lg space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{student.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{student.studentIdStr}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                <GraduationCap className="h-3.5 w-3.5 text-[#CA8E25]" />
                <span className="font-medium truncate">{student.courseName}</span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Progress
                  </span>
                  <span className="text-white font-bold">{student.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(student.progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 max-w-xl mx-auto space-y-3">
          <Users className="h-10 w-10 text-[#CA8E25] mx-auto opacity-50" />
          <p className="font-bold text-white text-lg">No students found</p>
          <p className="text-sm">
            {filterCourseId
              ? "No students are currently enrolled in this class."
              : "No students are enrolled in any of your assigned classes."}
          </p>
        </div>
      )}
    </div>
  );
}
