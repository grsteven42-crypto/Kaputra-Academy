import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import SalaryClient from "./SalaryClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Salary Details | Kaputra Academy",
};

export default async function TeacherSalaryPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  const salaries = await prisma.salary.findMany({
    where: { teacherId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const totalEarned = salaries
    .filter((s) => s.status === "PAID")
    .reduce((sum, s) => sum + s.baseSalary + s.bonus, 0);

  const pendingAmount = salaries
    .filter((s) => s.status === "PENDING")
    .reduce((sum, s) => sum + s.baseSalary + s.bonus, 0);

  const currentMonth = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const currentMonthSalary = salaries.find((s) => s.month === currentMonth);

  return (
    <SalaryClient
      salaries={JSON.parse(JSON.stringify(salaries))}
      totalEarned={totalEarned}
      pendingAmount={pendingAmount}
      currentMonthSalary={
        currentMonthSalary
          ? JSON.parse(JSON.stringify(currentMonthSalary))
          : null
      }
      teacherName={session.user.name || "Teacher"}
    />
  );
}
