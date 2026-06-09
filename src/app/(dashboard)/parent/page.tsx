import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import {
  Users,
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
  title: "Parent Dashboard | Kaputra Academy",
};

export default async function ParentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PARENT") {
    redirect("/login");
  }

  // Fetch parent user along with their children students
  const parent = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      children: {
        include: {
          enrollments: {
            where: { status: "ACTIVE" },
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  if (!parent) {
    redirect("/login");
  }

  const children = parent.children;

  // Mock progress report data and notifications
  const reports = children.map((child) => ({
    childName: child.name,
    studentId: child.studentIdStr,
    term: "Term 1, 2026",
    attendance: "95%",
    grades: "A",
    comments: "Excellent work in practical tasks. Consistent participation.",
  }));

  const notifications = [
    { id: 1, title: "Academic Report Published", content: "The midterm progress reports have been released. You can view them in the Reports section.", date: "June 8, 2026" },
    { id: 2, title: "Upcoming Parent-Teacher Meeting", content: "Parent-Teacher Association meeting is scheduled for June 28th at 9:00 AM.", date: "June 3, 2026" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome back, {parent.name}!</h1>
          <p className="text-slate-400">Parent Dashboard • Monitor your child's academic progress</p>
        </div>
        <Link href="/api/auth/signout">
          <Button variant="outline" className="border-slate-800 hover:bg-slate-900 text-slate-300 rounded-xl gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </Link>
      </div>

      {children.length === 0 ? (
        <div className="bg-slate-950 p-12 rounded-2xl border border-slate-800 text-center text-slate-500">
          No registered student accounts are linked to this parent account.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Monitor progress columns */}
          <div className="lg:col-span-2 space-y-8">

            {/* Student Monitor Cards */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Linked Students</h2>

              {children.map((child) => (
                <div key={child.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                  <div className="flex justify-between items-start border-b border-slate-900 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{child.name}</h3>
                      <p className="text-xs text-slate-500">Student ID: <span className="font-mono text-[#CA8E25] font-semibold">{child.studentIdStr}</span></p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>

                  {/* Attendance & Stats grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 block">Class Attendance</span>
                        <span className="text-xl font-extrabold text-white mt-1">95%</span>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-400">
                        <Award className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-500 block">Current Status</span>
                        <span className="text-xl font-extrabold text-white mt-1">Good Standing</span>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400">
                        <BookOpen className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {/* Course list */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-400">Enrolled Programs</h4>
                    {child.enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-900 flex justify-between items-center text-sm">
                        <div>
                          <p className="font-bold text-white">{enrollment.course.title}</p>
                          <p className="text-xs text-slate-500">Schedule: {enrollment.course.schedule}</p>
                        </div>
                        <span className="text-xs text-[#CA8E25] font-semibold">In Progress</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Reports section */}
            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-bold text-white">Academic Reports</h2>
              <div className="space-y-4">
                {reports.map((report, idx) => (
                  <div key={idx} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-[#CA8E25]">{report.childName}</h4>
                        <p className="text-xs text-slate-500">{report.term}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Grade</span>
                        <span className="text-xl font-black text-emerald-400">{report.grades}</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900 text-sm space-y-2">
                      <p className="text-xs text-slate-500">Instructor Comments:</p>
                      <p className="text-slate-300 leading-relaxed">"{report.comments}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              {notifications.map((notif) => (
                <div key={notif.id} className="space-y-2 border-b border-slate-900 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white text-sm">{notif.title}</h4>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> {notif.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{notif.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
