import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { TrendingUp, BookOpen, GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Progress Tracking | Kaputra Academy",
};

export default async function ParentProgressPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "PARENT") {
    redirect("/login");
  }

  const children = await prisma.user.findMany({
    where: { parentId: session.user.id },
    include: {
      academicReports: {
        include: { course: { select: { title: true } } },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-[#CA8E25]" />
          Progress Tracking
        </h1>
        <p className="text-slate-400 mt-2">Monitor your children's academic progress across all courses.</p>
      </div>

      {children.length > 0 ? (
        <div className="space-y-8">
          {children.map((child) => {
            const avgProgress = child.academicReports.length > 0
              ? Math.round(child.academicReports.reduce((s, r) => s + r.progress, 0) / child.academicReports.length)
              : 0;

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
                  <div className="ml-auto flex items-center gap-2 bg-[#CA8E25]/10 border border-[#CA8E25]/20 px-3 py-1.5 rounded-xl">
                    <TrendingUp className="h-4 w-4 text-[#CA8E25]" />
                    <span className="text-sm font-black text-[#CA8E25]">{avgProgress}% avg</span>
                  </div>
                </div>

                {child.academicReports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {child.academicReports.map((r) => (
                      <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-white flex items-center gap-2">
                            <BookOpen className="h-3.5 w-3.5 text-[#CA8E25]" />
                            {r.course.title}
                          </p>
                          <span className={`text-sm font-black px-2.5 py-0.5 rounded-xl border ${
                            r.grade.startsWith("A") ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                              : r.grade.startsWith("B") ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                              : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                          }`}>
                            {r.grade}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Completion</span>
                            <span className="font-bold text-white">{r.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2">
                            <div className="bg-gradient-to-r from-[#CA8E25] to-amber-400 h-2 rounded-full transition-all"
                              style={{ width: `${r.progress}%` }} />
                          </div>
                        </div>
                        {r.completedModules && (
                          <p className="text-xs text-slate-400"><span className="font-bold text-slate-300">Modules:</span> {r.completedModules}</p>
                        )}
                        {r.skillAssessment && (
                          <p className="text-xs text-slate-400"><span className="font-bold text-slate-300">Skills:</span> {r.skillAssessment}</p>
                        )}
                        {r.teacherNotes && (
                          <p className="text-xs text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                            <span className="font-bold text-slate-300">Notes:</span> {r.teacherNotes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-sm">
                    No progress data available for {child.name} yet.
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
