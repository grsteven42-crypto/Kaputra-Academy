"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createInvoice } from "@/actions/invoice";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CampProgramPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleRegister = async (course: any) => {
        if (session?.user) {
            try {
                const amount = course.price * 15000; // Convert mock $ to IDR
                const res = await createInvoice({
                    itemId: course.title,
                    itemType: "PROGRAM",
                    amount,
                });
                if (res.success) {
                    router.push(`/student/invoices/${res.invoiceId}`);
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            router.push("/login");
        }
    };

    const courses = [
        {
            id: 1,
            title: "Matematika SD - Dasar & Logika",
            desc: "Belajar operasi hitung, pecahan, dan logika dasar dengan metode mudah dipahami.",
            category: "SD",
            price: 49,
        },
        {
            id: 2,
            title: "IPA SMP - Fisika & Biologi",
            desc: "Materi IPA SMP lengkap dari energi, gaya, hingga sistem organ tubuh manusia.",
            category: "SMP",
            price: 69,
        },
        {
            id: 3,
            title: "Matematika SMA - Aljabar & Trigonometri",
            desc: "Kuasai materi SMA untuk ujian sekolah dan persiapan kuliah.",
            category: "SMA",
            price: 89,
        },
        {
            id: 4,
            title: "Persiapan UTBK - TPS & TKA",
            desc: "Strategi lolos PTN dengan latihan soal intensif dan pembahasan lengkap.",
            category: "UTBK",
            price: 129,
        },
        {
            id: 5,
            title: "TOEFL Preparation",
            desc: "Latihan listening, reading, dan structure untuk skor TOEFL tinggi.",
            category: "TOEFL",
            price: 99,
        },
        {
            id: 6,
            title: "Dasar Pemrograman (Coding Beginner)",
            desc: "Belajar coding dari nol: logika, HTML, CSS, dan JavaScript dasar.",
            category: "Programming",
            price: 119,
        },
    ];

    const categories = [
        "All",
        "SD",
        "SMP",
        "SMA",
        "UTBK",
        "TOEFL",
        "Programming",
    ];

    return (
        <div className="w-full bg-slate-50 min-h-screen pb-20">
            {/* HERO */}
            <section className="bg-[#072147] py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Camp Programs
                    </h1>

                    <p className="text-white/80 max-w-2xl mx-auto">
                        Explore our exciting camp programs designed to help students learn,
                        grow, and achieve their academic goals.
                    </p>
                </div>
            </section>

            {/* FILTER */}
            <div className="container mx-auto px-4 mt-12">
                <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                    {/* SEARCH */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CA8E25] w-full md:w-80"
                        />
                        <Button className="bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-semibold">
                            Search
                        </Button>
                    </div>

                    {/* CATEGORY FILTER */}
                    <select className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CA8E25] bg-white">
                        {categories.map((cat) => (
                            <option key={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <motion.div
                            key={course.id}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all"
                        >
                            {/* IMAGE */}
                            <div className="h-40 bg-slate-200 flex items-center justify-center">
                                <span className="text-slate-500 font-medium">
                                    {course.category}
                                </span>
                            </div>

                            {/* CONTENT */}
                            <div className="p-5 flex flex-col h-[220px]">
                                <div className="text-xs font-semibold uppercase text-[#CA8E25] mb-2">
                                    {course.category}
                                </div>

                                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">
                                    {course.title}
                                </h3>

                                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                                    {course.desc}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-lg text-slate-900">
                                        ${course.price}
                                    </span>

                                    <Button
                                        size="sm"
                                        className="bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-semibold"
                                        onClick={() => handleRegister(course)}
                                    >
                                        Register
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* LOGIN NOTICE */}
                {!session?.user && (
                    <div className="mt-12 bg-[#072147] rounded-2xl p-6 text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Ready to Join a Camp Program?
                        </h3>

                        <p className="text-white/80 mb-4">
                            Students must create an account and log in before registering for
                            any camp program.
                        </p>

                        <Link href="/register">
                            <Button className="bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-semibold">
                                Create Account
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}