"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Layers, 
  Calendar, 
  CreditCard, 
  LogOut, 
  LayoutDashboard,
  Settings,
  Menu
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine user role from pathname
  const isTeacher = pathname.includes("/teacher");
  const isAdmin = pathname.includes("/admin");
  const isStudent = pathname.includes("/student");

  const menuItems = [
    ...(isStudent ? [
      { name: "Overview", href: "/student", icon: LayoutDashboard },
      { name: "My Classes", href: "/student/classes", icon: BookOpen },
      { name: "Payment History", href: "/student/payments", icon: CreditCard },
      { name: "Profile", href: "/student/profile", icon: Settings },
    ] : []),
    ...(isTeacher ? [
      { name: "Overview", href: "/teacher", icon: LayoutDashboard },
      { name: "Assigned Classes", href: "/teacher/classes", icon: BookOpen },
      { name: "Student List", href: "/teacher/students", icon: Users },
      { name: "Schedule", href: "/teacher/schedule", icon: Calendar },
    ] : []),
    ...(isAdmin ? [
      { name: "Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Courses", href: "/admin/courses", icon: BookOpen },
      { name: "Students", href: "/admin/students", icon: GraduationCap },
      { name: "Teachers", href: "/admin/teachers", icon: Users },
      { name: "Verify Payments", href: "/admin/payments", icon: CreditCard },
      { name: "CMS Content", href: "/admin/cms", icon: Layers },
    ] : []),
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform transform md:translate-x-0 md:relative ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 justify-between">
          <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-500" />
            <span>Kaputra Academy <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full capitalize">{isTeacher ? "Teacher" : isAdmin ? "Admin" : "Student"}</span></span>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            &times;
          </Button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <span className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
                  <Icon className="h-5 w-5" />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-900 gap-3">
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 z-10">
          <Button variant="ghost" size="icon" className="md:hidden text-slate-400" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">John Doe</p>
              <p className="text-xs text-slate-400 capitalize">{isTeacher ? "Instructor" : isAdmin ? "Administrator" : "Student"}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-slate-700">
              JD
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
