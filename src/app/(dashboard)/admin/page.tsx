import prisma from "@/lib/db";
import RegistrationList from "@/components/admin/RegistrationList";
import {
  Users,
  GraduationCap,
  BookOpen,
  CreditCard
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Kaputra Academy",
};

export default async function AdminDashboard() {
  // 1. Fetch Stats from DB
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  const totalTeachers = await prisma.user.count({ where: { role: "TEACHER" } });
  const totalCourses = await prisma.course.count();
  const pendingApprovalsCount = await prisma.registration.count({ where: { status: "VERIFYING" } });

  const stats = [
    { name: "Total Students", value: totalStudents.toString(), icon: GraduationCap, color: "from-blue-600 to-indigo-600" },
    { name: "Total Teachers", value: totalTeachers.toString(), icon: Users, color: "from-emerald-600 to-teal-600" },
    { name: "Total Courses", value: totalCourses.toString(), icon: BookOpen, color: "from-amber-600 to-orange-600" },
    { name: "Pending Verification", value: pendingApprovalsCount.toString(), icon: CreditCard, color: "from-rose-600 to-pink-600" },
  ];

  // 2. Fetch Registrations
  const registrations = await prisma.registration.findMany({
    include: {
      course: true,
      payment: true,
      placementTest: {
        select: {
          studentIdStr: true,
          testCode: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Control Panel</h1>
          <p className="text-slate-400">System overview and registration approval hubs.</p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-slate-400 font-medium">{stat.name}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Registrations List Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Verification & Enrollment Requests</h2>
        <RegistrationList initialRegistrations={registrations} />
      </div>
    </div>
  );
}
