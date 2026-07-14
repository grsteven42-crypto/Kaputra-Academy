import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Profile | Student Portal",
};

export default async function StudentProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      parent: true,
    },
  });

  if (!student) {
    redirect("/login");
  }

  return <ProfileClient user={student} />;
}
