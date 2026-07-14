import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import MaterialsClient from "../../student/materials/MaterialsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Materials | Admin | Kaputra Academy",
};

export default async function AdminMaterialsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const courses = await prisma.course.findMany({
    include: {
      materials: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <MaterialsClient
      initialCourses={courses}
      isUnlocked={true}
      userRole="ADMIN"
    />
  );
}
