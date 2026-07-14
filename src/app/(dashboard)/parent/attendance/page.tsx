import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { Calendar, UserCheck, UserX, Clock, AlertTriangle, GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Attendance | Kaputra Academy",
};

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  PRESENT: { label: "Present", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400" },
  LATE: { label: "Late", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400" },
  ABSENT: { label: "Absent", color: "text-red-400 bg-red-500/10 border-red-500/20", dot: "bg-red-400" },
  EXCUSED: { label: "Excused", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", dot: "bg-blue-400" },
};

export default async function ParentAttendancePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "PARENT") {
    redirect("/login");
  }

  const children = await prisma.user.findMany({
    where: { parentId: session.user.id },
    include: {
      attendanceRecords: {
        include: { course: { select: { title: true } } },
        orderBy: { date: "desc" },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Calendar className="h-8 w-8 text-[#CA8E25]" />
          Attendance Records
        </h1>
        <p className="text-slate-400 mt-2">
          View the attendance history for your children across all classes.
        </p>
      </div>

      {children.length > 0 ? (
        <div className="space-y-10">
          {children.map((child) => {
            const records = child.attendanceRecords;
            const totalPresent = records.filter((r) => r.status === "PRESENT").length;
            const totalLate = records.filter((r) => r.status === "LATE").length;
            const totalAbsent = records.filter((r) => r.status === "ABSENT").length;
            const totalExcused = records.filter((r) => r.status === "EXCUSED").length;
            const total = records.length;
            const rate = total > 0 ? Math.round(((totalPresent + totalLate) / total) * 100) : 0;

            return (
              <div key={child.id} className="space-y-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{child.name}</h2>
                      <p className="text-xs text-slate-500 font-mono">{child.studentIdStr || "—"}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#CA8E25]">{rate}% Attendance</span>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Present", value: totalPresent, icon: UserCheck, color: "from-emerald-600 to-teal-600" },
                    { label: "Late", value: totalLate, icon: Clock, color: "from-amber-600 to-orange-600" },
                    { label: "Absent", value: totalAbsent, icon: UserX, color: "from-red-600 to-rose-600" },
                    { label: "Excused", value: totalExcused, icon: AlertTriangle, color: "from-blue-600 to-indigo-600" },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">{s.label}</p>
                          <p className="text-xl font-black text-white">{s.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Rate bar */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Attendance Rate</span>
                    <span className="font-bold text-[#CA8E25]">{rate}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full bg-gradient-to-r from-[#CA8E25] to-amber-400"
                      style={{ width: `${rate}%` }} />
                  </div>
                </div>

                {/* Records */}
                {records.length > 0 ? (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="divide-y divide-slate-800/60">
                      {records.slice(0, 15).map((r) => {
                        const cfg = statusConfig[r.status] || statusConfig.ABSENT;
                        return (
                          <div key={r.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-900/30 transition">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                              <div>
                                <p className="text-sm text-white font-semibold">
                                  {new Date(r.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                </p>
                                <p className="text-xs text-slate-500">{r.course.title}</p>
                              </div>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                              {cfg.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm">
                    No attendance records yet for {child.name}.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 p-12 rounded-2xl text-center space-y-3">
          <GraduationCap className="h-10 w-10 text-[#CA8E25] mx-auto opacity-40" />
          <p className="font-bold text-white text-lg">No children linked</p>
          <p className="text-sm text-slate-500">Contact the admin to link your child's account.</p>
        </div>
      )}
    </div>
  );
}
