import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAvailableCourses } from "@/actions/enrollClass";
import EnrollClient from "./EnrollClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Register Class | Kaputra Academy",
};

export default async function StudentEnrollPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const res = await getAvailableCourses(session.user.id);
  const courses = res.success && res.courses ? res.courses : [];

  return (
    <EnrollClient
      initialCourses={JSON.parse(JSON.stringify(courses))}
      studentId={session.user.id}
    />
  );
}
