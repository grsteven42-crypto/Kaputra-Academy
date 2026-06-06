"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CatalogPage() {
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

  const categories = ["All", "SD", "SMP", "SMA", "UTBK", "TOEFL", "Programming"];

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* HERO */}
      <section className="bg-slate-900 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Course Catalog
          </h1>
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
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>

          {/* CATEGORY FILTER */}
          <select className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
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
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all"
            >
              {/* IMAGE */}
              <div className="h-40 bg-slate-200 flex items-center justify-center">
                <span className="text-slate-400 text-sm">
                  {course.category}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <div className="text-xs font-semibold uppercase text-blue-600 mb-2">
                  {course.category}
                </div>

                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {course.desc}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-lg text-slate-900">
                    ${course.price}
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Daftar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}