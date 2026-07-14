import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import ParentEnrollClient from "./ParentEnrollClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Register Child Class | Kaputra Academy",
};

export default async function ParentEnrollPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "PARENT") {
    redirect("/login");
  }

  // Fetch children of this parent
  const children = await prisma.user.findMany({
    where: {
      parentId: session.user.id,
      role: "STUDENT",
    },
    select: {
      id: true,
      name: true,
      studentIdStr: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <ParentEnrollClient
      childrenList={JSON.parse(JSON.stringify(children))}
    />
  );
}
