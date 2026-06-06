"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CreditCard,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const stats = [
    { name: "Total Students", value: "1,248", icon: GraduationCap, color: "from-blue-600 to-indigo-600" },
    { name: "Total Teachers", value: "32", icon: Users, color: "from-emerald-600 to-teal-600" },
    { name: "Total Courses", value: "24", icon: BookOpen, color: "from-amber-600 to-orange-600" },
    { name: "Pending Payments", value: "7", icon: CreditCard, color: "from-rose-600 to-pink-600" },
  ];

  const pendingPayments = [
    { id: "PAY-9821", name: "Alice Cooper", course: "Advanced Full-Stack Web Development", amount: "$299", date: "June 2, 2026", status: "UNDER_VERIFICATION" },
    { id: "PAY-9820", name: "Bob Marley", course: "UI/UX Design Fundamentals", amount: "$199", date: "June 1, 2026", status: "PAYMENT_SUBMITTED" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Control Panel</h1>
          <p className="text-slate-400">System overview and content management hubs.</p>
        </div>
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
        {/* Pending Payments Verification list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Pending Payment Approvals</h2>
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300">View All Verification Requests</Button>
          </div>
          
          <div className="space-y-4">
            {pendingPayments.map((pay) => (
              <div key={pay.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {pay.id}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {pay.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{pay.name}</h3>
                  <p className="text-sm text-slate-400">Course: <span className="text-slate-300">{pay.course}</span></p>
                  <p className="text-sm font-semibold text-white">Amount Paid: {pay.amount}</p>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="border-rose-800 hover:bg-rose-950 text-rose-400 rounded-xl gap-1">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CMS / Content quick edits */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">CMS Management</h2>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <p className="text-sm text-slate-400">Select a section of the public website to edit dynamically:</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start border-slate-800 text-slate-300 hover:bg-slate-900 rounded-xl">
                Homepage Hero Banner
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-800 text-slate-300 hover:bg-slate-900 rounded-xl">
                About Us Content
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-800 text-slate-300 hover:bg-slate-900 rounded-xl">
                Contact Details & Maps
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
