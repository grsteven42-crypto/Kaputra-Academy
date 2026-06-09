import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { 
  BookOpen, 
  Award, 
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Student Dashboard | Kaputra Academy",
};

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Fetch the student details and their active enrollments
  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      enrollments: {
        where: { status: "ACTIVE" },
        include: {
          course: true,
        },
      },
    },
  });

  if (!student) {
    redirect("/login");
  }

  const activeEnrollments = student.enrollments;

  // Mock schedule, assignments, and announcements based on the enrolled courses
  const announcements = [
    { id: 1, title: "Midterm Exam Schedule", content: "The midterm exams for all courses will start from July 15th. Please prepare accordingly.", date: "June 8, 2026" },
    { id: 2, title: "Holiday Announcement", content: "The academy will remain closed on June 25th in observance of the national holiday.", date: "June 5, 2026" },
  ];

  const assignments = activeEnrollments.map((enrollment, idx) => ({
    id: `asm-${enrollment.id}`,
    courseTitle: enrollment.course.title,
    title: idx === 0 ? "Project Proposal Submission" : "Practical Exercise 3",
    dueDate: idx === 0 ? "June 15, 2026" : "June 20, 2026",
    status: idx === 0 ? "Pending" : "Submitted",
  }));

  const attendanceRate = activeEnrollments.length > 0 ? "95%" : "0%";

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome back, {student.name}!</h1>
          <p className="text-slate-400">Student ID: <span className="font-mono text-[#CA8E25] font-bold">{student.studentIdStr}</span></p>
        </div>
        <Link href="/api/auth/signout">
          <Button variant="outline" className="border-slate-800 hover:bg-slate-900 text-slate-300 rounded-xl gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Courses Enrolled</p>
            <h3 className="text-3xl font-bold text-white mt-1">{activeEnrollments.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Attendance Rate</p>
            <h3 className="text-3xl font-bold text-white mt-1">{attendanceRate}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400">
            <Award className="h-6 w-6" />
          </div>
        </div>
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Pending Assignments</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {assignments.filter((a) => a.status === "Pending").length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center text-amber-400">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white">Your Courses & Schedule</h2>
          {activeEnrollments.length === 0 ? (
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center text-slate-500">
              You are not enrolled in any courses yet.
            </div>
          ) : (
            <div className="space-y-4">
              {activeEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{enrollment.course.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">Status: Active Enrollment</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-900/50 p-4 rounded-xl border border-slate-900">
                    <div>
                      <span className="text-xs text-slate-500 block">Weekly Schedule</span>
                      <span className="font-semibold text-white">{enrollment.course.schedule}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Progress</span>
                      <span className="font-semibold text-emerald-400">Good Standing (95% attendance)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Assignments */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-white">Assignments</h2>
            {assignments.length === 0 ? (
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center text-slate-500 text-sm">
                No assignments assigned yet.
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((asm) => (
                  <div key={asm.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
                    <div>
                      <h4 className="font-bold text-white">{asm.title}</h4>
                      <p className="text-xs text-slate-400">{asm.courseTitle} • Due: {asm.dueDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      asm.status === "Submitted" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {asm.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Announcements sidebar */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Announcements</h2>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="space-y-2 border-b border-slate-900 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#CA8E25] text-sm">{ann.title}</h4>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> {ann.date}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
