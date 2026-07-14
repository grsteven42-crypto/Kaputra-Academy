import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { Clock, BookOpen, GraduationCap, Bell } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Schedule | Kaputra Academy",
};

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const DAY_SHORT: Record<string, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed",
  THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

const typeColor: Record<string, string> = {
  CLASS_START: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  HOMEWORK: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  MOCK_TEST: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  DEADLINE: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default async function ParentSchedulePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "PARENT") {
    redirect("/login");
  }

  const children = await prisma.user.findMany({
    where: { parentId: session.user.id },
    include: {
      studentSchedules: {
        include: {
          course: { select: { title: true } },
          teacher: { select: { name: true } },
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
    },
  });

  // Gather all child course IDs for reminders
  const allEnrollments = await prisma.enrollment.findMany({
    where: {
      studentId: { in: children.map((c) => c.id) },
      status: "ACTIVE",
    },
    select: { itemId: true },
  });
  const courseIds = [...new Set(allEnrollments.map((e) => e.itemId))];

  const reminders = await prisma.reminder.findMany({
    where: {
      OR: [{ courseId: { in: courseIds } }, { courseId: null }],
    },
    include: { teacher: { select: { name: true } } },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    take: 15,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Clock className="h-8 w-8 text-[#CA8E25]" />
          Schedule
        </h1>
        <p className="text-slate-400 mt-2">
          Your children's weekly class schedules and active reminders.
        </p>
      </div>

      {children.length > 0 ? (
        <div className="space-y-10">
          {children.map((child) => {
            const schedules = child.studentSchedules;
            const byDay = DAYS.reduce<Record<string, typeof schedules>>((acc, d) => {
              acc[d] = schedules.filter((s) => s.dayOfWeek === d);
              return acc;
            }, {});

            return (
              <div key={child.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    {child.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{child.name}</h2>
                    <p className="text-xs text-slate-500 font-mono">{child.studentIdStr || "—"}</p>
                  </div>
                </div>

                {schedules.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {DAYS.map((day) => {
                      const daySch = byDay[day];
                      const hasClasses = daySch.length > 0;
                      return (
                        <div key={day}
                          className={`rounded-2xl border p-4 space-y-3 ${hasClasses
                            ? "bg-slate-950 border-slate-800"
                            : "bg-slate-900/20 border-slate-800/40 opacity-40"}`}>
                          <span className="text-xs font-black uppercase tracking-widest text-[#CA8E25]">
                            {DAY_SHORT[day]}
                          </span>
                          {hasClasses ? daySch.map((s) => (
                            <div key={s.id} className="bg-slate-900 rounded-xl p-2.5 space-y-1">
                              <p className="text-xs font-bold text-white truncate">{s.course?.title || "—"}</p>
                              <p className="text-[10px] text-slate-500">{s.startTime} – {s.endTime}</p>
                              <p className="text-[10px] text-slate-500">{s.teacher.name}</p>
                            </div>
                          )) : (
                            <p className="text-[10px] text-slate-600 text-center py-1">No classes</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-sm">
                    No schedule assigned for {child.name} yet.
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

      {/* Reminders section */}
      {reminders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#CA8E25]" /> Teacher Reminders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reminders.map((r) => {
              const cfg = typeColor[r.type] || "text-slate-400 bg-slate-800 border-slate-700";
              return (
                <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white">{r.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${cfg}`}>
                      {r.type.replace("_", " ")}
                    </span>
                  </div>
                  {r.description && <p className="text-xs text-slate-400">{r.description}</p>}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-800">
                    <span>{r.teacher.name}</span>
                    {r.dueDate && (
                      <span className="font-semibold text-[#CA8E25]">
                        Due: {new Date(r.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
