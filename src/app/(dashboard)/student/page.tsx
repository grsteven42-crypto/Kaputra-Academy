"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Award, 
  Calendar,
  AlertCircle,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const enrolledClasses = [
    { id: 1, title: "Advanced Full-Stack Web Development", progress: 68, nextLesson: "Next.js Server Actions", schedule: "Monday, 10:00 AM", instructor: "Prof. John Doe" },
    { id: 2, title: "UI/UX Design Fundamentals", progress: 12, nextLesson: "Wireframing with Figma", schedule: "Friday, 9:00 AM", instructor: "Prof. Jane Smith" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, John!</h1>
          <p className="text-slate-400">Keep up the great progress. You have 2 classes active.</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Courses Enrolled</p>
            <h3 className="text-3xl font-bold text-white mt-1">2</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Completed Courses</p>
            <h3 className="text-3xl font-bold text-white mt-1">0</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400">
            <Award className="h-6 w-6" />
          </div>
        </div>
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Study Streak</p>
            <h3 className="text-3xl font-bold text-white mt-1">5 days</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center text-amber-400">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Classes In Progress */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white">Active Courses</h2>
          <div className="space-y-4">
            {enrolledClasses.map((cls) => (
              <div key={cls.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{cls.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">Instructor: {cls.instructor}</p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 self-stretch sm:self-auto">
                    <PlayCircle className="h-4 w-4" />
                    Resume
                  </Button>
                </div>
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">Course Progress</span>
                    <span className="text-white font-bold">{cls.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${cls.progress}%` }} />
                  </div>
                </div>
                {/* Next lesson info */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-900">
                  <span>Next Lesson: <strong>{cls.nextLesson}</strong></span>
                  <span>{cls.schedule}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Action / Notices */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Notifications</h2>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex gap-3 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-amber-400">Payment Verification Pending</h4>
                <p className="text-xs text-slate-300 mt-1">Your payment proof for 'UI/UX Fundamentals' is under review by admin.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
