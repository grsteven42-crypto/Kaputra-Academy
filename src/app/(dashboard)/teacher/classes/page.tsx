import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Users, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Assigned Classes | Kaputra Academy",
};

export default async function AssignedClassesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  // Fetch teacher's assigned courses
  const teacher = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      teachingAssignments: {
        include: {
          course: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!teacher) {
    redirect("/login");
  }

  const assignments = teacher.teachingAssignments;
  const courseIds = assignments.map((ta) => ta.courseId);

  // Fetch active enrollments for student counts
  const enrollments = await prisma.enrollment.findMany({
    where: {
      itemId: { in: courseIds },
      status: "ACTIVE",
    },
  });

  const classes = assignments.map((ta) => {
    const course = ta.course;
    const studentCount = enrollments.filter((e) => e.itemId === course.id).length;
    return {
      id: course.id,
      title: course.title,
      type: course.type, // REGULAR, COMPETITION, etc.
      schedule: course.schedule,
      categoryName: course.category.name,
      studentCount,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-[#CA8E25]" />
          Assigned Classes
        </h1>
        <p className="text-slate-400 mt-2">
          View and manage the classes and student groups currently assigned to your curriculum.
        </p>
      </div>

      {classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition duration-250 shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-600/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                    {cls.type}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{cls.categoryName}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 line-clamp-2">
                    {cls.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-3 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                    <Calendar className="h-4 w-4 text-[#CA8E25]" />
                    <span className="font-medium">{cls.schedule || "Schedule not specified"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium">Enrolled Students:</span>
                  <div className="flex items-center gap-1.5 font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{cls.studentCount} active</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link href={`/teacher/students?courseId=${cls.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2 flex items-center justify-center gap-1.5 text-sm font-semibold transition">
                    View Student List
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 max-w-xl mx-auto space-y-3">
          <BookOpen className="h-10 w-10 text-[#CA8E25] mx-auto opacity-50" />
          <p className="font-bold text-white text-lg">No assigned classes found</p>
          <p className="text-sm">You are not currently assigned to teach any active classes. Please contact an administrator to get assigned.</p>
        </div>
      )}
    </div>
  );
}
