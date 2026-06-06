"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  Clock, 
  Star,
  ArrowUpRight,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeacherDashboard() {
  const stats = [
    { name: "Total Students", value: "248", icon: Users, change: "+12% this month", color: "from-blue-600 to-indigo-600" },
    { name: "Active Classes", value: "4", icon: BookOpen, change: "Current semester", color: "from-emerald-600 to-teal-600" },
    { name: "Weekly Hours", value: "16h", icon: Clock, change: "On schedule", color: "from-amber-600 to-orange-600" },
    { name: "Instructor Rating", value: "4.9/5", icon: Star, change: "98 reviews", color: "from-purple-600 to-pink-600" },
  ];

  const assignedClasses = [
    { id: 1, title: "Advanced Full-Stack Web Development", students: 84, schedule: "Mon, Wed (10:00 AM - 12:00 PM)", level: "Advanced" },
    { id: 2, title: "Introduction to Python Programming", students: 120, schedule: "Tue, Thu (2:00 PM - 4:00 PM)", level: "Beginner" },
    { id: 3, title: "UI/UX Design Fundamentals", students: 44, schedule: "Friday (9:00 AM - 1:00 PM)", level: "Intermediate" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, Professor!</h1>
          <p className="text-slate-400">Here's what's happening with your classes and students today.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl">
          Create Announcement
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-slate-400 font-medium">{stat.name}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                <span className="text-xs text-slate-500 block mt-2">{stat.change}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                <Icon className="h-6 w-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Classes List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Assigned Classes</h2>
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300">View All</Button>
          </div>
          <div className="space-y-4">
            {assignedClasses.map((cls) => (
              <div key={cls.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    {cls.level}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{cls.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    {cls.schedule}
                  </p>
                </div>
                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">{cls.students}</span>
                    <span className="text-xs text-slate-500 block">students</span>
                  </div>
                  <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-900 rounded-xl">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule/Activities */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Today's Schedule</h2>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="relative pl-6 border-l-2 border-blue-500">
              <span className="text-xs font-bold text-blue-400 block uppercase">10:00 AM - 12:00 PM</span>
              <h4 className="text-sm font-semibold text-white mt-1">Full-Stack Web Dev - Class A</h4>
              <p className="text-xs text-slate-400 mt-0.5">Topic: Next.js Server Actions</p>
            </div>
            <div className="relative pl-6 border-l-2 border-slate-800">
              <span className="text-xs font-bold text-slate-500 block uppercase">02:00 PM - 04:00 PM</span>
              <h4 className="text-sm font-semibold text-slate-300 mt-1">Python Programming - Class B</h4>
              <p className="text-xs text-slate-400 mt-0.5">Topic: Data Structures & Lists</p>
            </div>
            <div className="relative pl-6 border-l-2 border-slate-800">
              <span className="text-xs font-bold text-slate-500 block uppercase">04:30 PM - 05:30 PM</span>
              <h4 className="text-sm font-semibold text-slate-300 mt-1">Office Hours / Consultations</h4>
              <p className="text-xs text-slate-400 mt-0.5">1-on-1 student assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
