import prisma from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Students | Admin Dashboard",
};

export default async function StudentsPage() {
    const students = await prisma.user.findMany({
        where: {
            role: "STUDENT",
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Students
                </h1>

                <p className="text-slate-400">
                    Manage all registered students.
                </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="text-left p-4 text-slate-400">
                                Name
                            </th>

                            <th className="text-left p-4 text-slate-400">
                                Email
                            </th>

                            <th className="text-left p-4 text-slate-400">
                                Created
                            </th>

                            <th className="text-right p-4 text-slate-400">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student) => (
                            <tr
                                key={student.id}
                                className="border-b border-slate-900"
                            >
                                <td className="p-4 text-white">
                                    {student.name}
                                </td>

                                <td className="p-4 text-slate-300">
                                    {student.email}
                                </td>

                                <td className="p-4 text-slate-300">
                                    {new Date(
                                        student.createdAt
                                    ).toLocaleDateString()}
                                </td>

                                <td className="p-4 text-right">
                                    <Link
                                        href={`/admin/students/${student.id}`}
                                    >
                                        <Button
                                            size="sm"
                                            className="bg-[#CA8E25] hover:bg-[#D89A2B] text-black"
                                        >
                                            View
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {students.length === 0 && (
                    <div className="p-10 text-center text-slate-500">
                        No students found.
                    </div>
                )}
            </div>
        </div>
    );
}