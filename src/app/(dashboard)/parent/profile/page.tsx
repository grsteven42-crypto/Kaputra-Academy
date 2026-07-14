import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import ParentProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Profile | Kaputra Academy",
};

export default async function ParentProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "PARENT") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, role: true },
  });

  if (!user) redirect("/login");

  return <ParentProfileClient user={user} />;
}
