import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { CheckSquare, UserCheck, UserX, Clock, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Attendance | Kaputra Academy",
};

export default async function StudentAttendancePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const records = await prisma.attendance.findMany({
    where: { studentId: session.user.id },
    include: { course: { select: { title: true } } },
    orderBy: { date: "desc" },
  });

  const totalPresent = records.filter((r) => r.status === "PRESENT").length;
  const totalLate = records.filter((r) => r.status === "LATE").length;
  const totalAbsent = records.filter((r) => r.status === "ABSENT").length;
  const totalExcused = records.filter((r) => r.status === "EXCUSED").length;
  const total = records.length;
  const attendanceRate = total > 0 ? Math.round(((totalPresent + totalLate) / total) * 100) : 0;

  const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
    PRESENT: { label: "Present", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400" },
    LATE: { label: "Late", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400" },
    ABSENT: { label: "Absent", color: "text-red-400 bg-red-500/10 border-red-500/20", dot: "bg-red-400" },
    EXCUSED: { label: "Excused", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", dot: "bg-blue-400" },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <CheckSquare className="h-8 w-8 text-[#CA8E25]" />
          My Attendance
        </h1>
        <p className="text-slate-400 mt-2">
          View your attendance record across all enrolled classes.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Present", value: totalPresent, icon: UserCheck, color: "from-emerald-600 to-teal-600" },
          { label: "Late", value: totalLate, icon: Clock, color: "from-amber-600 to-orange-600" },
          { label: "Absent", value: totalAbsent, icon: UserX, color: "from-red-600 to-rose-600" },
          { label: "Excused", value: totalExcused, icon: AlertTriangle, color: "from-blue-600 to-indigo-600" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                <p className="text-3xl font-black text-white mt-1">{s.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance Rate Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-white">Overall Attendance Rate</span>
          <span className="text-2xl font-black text-[#CA8E25]">{attendanceRate}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-[#CA8E25] to-amber-400 transition-all"
            style={{ width: `${attendanceRate}%` }}
          />
        </div>
        <p className="text-xs text-slate-500">Based on {total} recorded sessions</p>
      </div>

      {/* Records Table */}
      {records.length > 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white">Attendance History</h2>
          </div>
          <div className="divide-y divide-slate-800/60">
            {records.map((r) => {
              const cfg = statusConfig[r.status] || statusConfig.ABSENT;
              return (
                <div key={r.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 gap-2 hover:bg-slate-900/40 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {new Date(r.date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                      </p>
                      <p className="text-xs text-slate-500">{r.course.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-5 sm:ml-0">
                    {r.notes && <p className="text-xs text-slate-500 italic max-w-[200px] truncate">{r.notes}</p>}
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 p-12 rounded-2xl text-center space-y-3">
          <CheckSquare className="h-10 w-10 text-[#CA8E25] mx-auto opacity-40" />
          <p className="font-bold text-white text-lg">No attendance records yet</p>
          <p className="text-sm text-slate-500">Your attendance will appear here once your teacher marks it.</p>
        </div>
      )}
    </div>
  );
}
