"use client";

import { useState } from "react";
import {
  CheckSquare, Clock, LogIn, LogOut, Calendar,
  AlertCircle, CheckCircle2, Users, Search, BookOpen, Save, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { teacherCheckIn, teacherCheckOut } from "@/actions/teacherAttendance";
import { markAttendance } from "@/actions/dashboard";
import { motion, AnimatePresence } from "framer-motion";

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  workingHours: number;
}

interface Student {
  id: string;
  name: string;
  courseId: string;
}

interface Course {
  id: string;
  title: string;
}

interface StudentAttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  date: string;
  status: string;
  notes: string | null;
}

export default function AttendanceClient({
  records,
  hasCheckedInToday,
  hasCheckedOutToday,
  courses,
  students,
  studentAttendanceRecords,
}: {
  records: AttendanceRecord[];
  hasCheckedInToday: boolean;
  hasCheckedOutToday: boolean;
  courses: Course[];
  students: Student[];
  studentAttendanceRecords: StudentAttendanceRecord[];
}) {
  const [activeTab, setActiveTab] = useState<"my-attendance" | "student-attendance">("student-attendance");
  const [checkedIn, setCheckedIn] = useState(hasCheckedInToday);
  const [checkedOut, setCheckedOut] = useState(hasCheckedOutToday);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Student Attendance States
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [localStudentRecords, setLocalStudentRecords] = useState<StudentAttendanceRecord[]>(studentAttendanceRecords);
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({});

  const showStatus = (t: "success" | "error", text: string) => {
    setMessage({ type: t, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleCheckIn = async () => {
    setLoading(true);
    const res = await teacherCheckIn();
    if (res.success) {
      showStatus("success", "Checked in successfully!");
      setCheckedIn(true);
    } else {
      showStatus("error", res.error || "Check-in failed.");
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    setLoading(true);
    const res = await teacherCheckOut();
    if (res.success) {
      showStatus("success", "Checked out successfully!");
      setCheckedOut(true);
    } else {
      showStatus("error", res.error || "Check-out failed.");
    }
    setLoading(false);
  };

  const handleMarkStudentAttendance = async (studentId: string, status: string) => {
    const notes = studentNotes[studentId] || "";
    const dateObj = new Date(selectedDate);
    
    const res = await markAttendance({
      studentId,
      courseId: selectedCourseId,
      date: dateObj,
      status,
      notes,
    });

    if (res.success && res.record) {
      showStatus("success", `Attendance recorded successfully.`);
      const updated: StudentAttendanceRecord = {
        id: res.record.id,
        studentId: res.record.studentId,
        studentName: students.find(s => s.id === studentId)?.name || "Unknown student",
        courseId: res.record.courseId,
        courseTitle: courses.find(c => c.id === selectedCourseId)?.title || "Unknown class",
        date: res.record.date instanceof Date ? res.record.date.toISOString() : new Date(res.record.date).toISOString(),
        status: res.record.status,
        notes: res.record.notes,
      };

      setLocalStudentRecords(prev => {
        const index = prev.findIndex(r => 
          r.studentId === studentId && 
          r.courseId === selectedCourseId && 
          r.date.startsWith(selectedDate)
        );
        if (index !== -1) {
          const next = [...prev];
          next[index] = updated;
          return next;
        } else {
          return [updated, ...prev];
        }
      });
    } else {
      showStatus("error", res.error || "Failed to save attendance.");
    }
  };

  const handleSaveNotes = async (studentId: string, currentStatus: string) => {
    if (!currentStatus) {
      showStatus("error", "Please select an attendance status first before adding notes.");
      return;
    }
    await handleMarkStudentAttendance(studentId, currentStatus);
  };

  const getStudentStatus = (studentId: string) => {
    const match = localStudentRecords.find(r => 
      r.studentId === studentId && 
      r.courseId === selectedCourseId && 
      r.date.startsWith(selectedDate)
    );
    return match ? { status: match.status, notes: match.notes || "", id: match.id } : { status: "", notes: "", id: "" };
  };

  const filteredStudents = students.filter(s => s.courseId === selectedCourseId);

  const statusColor = (status: string) => {
    switch (status) {
      case "PRESENT": return "bg-emerald-500/10 text-emerald-450 border-emerald-550";
      case "LATE": return "bg-amber-500/10 text-amber-450 border-amber-550";
      case "ABSENT": return "bg-red-500/10 text-red-450 border-red-550";
      case "EXCUSED": return "bg-blue-500/10 text-blue-450 border-blue-550";
      default: return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  const teacherStats = [
    { label: "Present", value: records.filter(r => r.status === "PRESENT").length },
    { label: "Late", value: records.filter(r => r.status === "LATE").length },
    { label: "Absent", value: records.filter(r => r.status === "ABSENT").length },
    { label: "Total Hours", value: records.reduce((sum, r) => sum + r.workingHours, 0).toFixed(1) },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <CheckSquare className="h-8 w-8 text-[#CA8E25]" />
          Attendance Panel
        </h1>
        <p className="text-slate-400 mt-2">
          Manage classroom student attendance and record your check-in/out working logs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-850 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("student-attendance")}
          className={`px-5 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "student-attendance"
              ? "border-[#CA8E25] text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Student Attendance CMS
          </span>
        </button>
        <button
          onClick={() => setActiveTab("my-attendance")}
          className={`px-5 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "my-attendance"
              ? "border-[#CA8E25] text-white"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> My Work Check-In
          </span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm font-semibold">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Contents */}
      {activeTab === "student-attendance" ? (
        <div className="space-y-6">
          {/* Controls: Course and Date selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <div className="space-y-2">
              <label className="text-xs uppercase font-black tracking-widest text-[#CA8E25]">Select Class / Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-slate-700"
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-black tracking-widest text-[#CA8E25]">Attendance Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-slate-700"
              />
            </div>
          </div>

          {/* Student attendance list */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <span className="font-bold text-white text-sm">Class Roster ({filteredStudents.length} Students)</span>
            </div>

            {filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-400">
                      <th className="text-left py-4 px-6 font-bold">Student Name</th>
                      <th className="text-left py-4 px-6 font-bold">Mark Status</th>
                      <th className="text-left py-4 px-6 font-bold">Notes / Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => {
                      const { status: currentStatus, notes: savedNotes } = getStudentStatus(student.id);
                      if (studentNotes[student.id] === undefined && savedNotes) {
                        // Prefill draft notes local state
                        studentNotes[student.id] = savedNotes;
                      }

                      return (
                        <tr key={student.id} className="border-b border-slate-850 hover:bg-slate-900/20 transition">
                          <td className="py-4 px-6 font-bold text-white">
                            <span className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-750 flex items-center justify-center text-xs text-[#CA8E25]">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                              {student.name}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2 flex-wrap">
                              {[
                                { status: "PRESENT", label: "Present", colorClass: "hover:bg-emerald-500 hover:text-black border-emerald-500/30 text-emerald-400 bg-emerald-500/5" },
                                { status: "LATE", label: "Late", colorClass: "hover:bg-amber-500 hover:text-black border-amber-500/30 text-amber-400 bg-amber-500/5" },
                                { status: "ABSENT", label: "Absent", colorClass: "hover:bg-red-500 hover:text-black border-red-500/30 text-red-400 bg-red-500/5" },
                                { status: "EXCUSED", label: "Excused", colorClass: "hover:bg-blue-500 hover:text-black border-blue-500/30 text-blue-400 bg-blue-500/5" },
                              ].map(btn => {
                                const isSelected = currentStatus === btn.status;
                                return (
                                  <button
                                    key={btn.status}
                                    onClick={() => handleMarkStudentAttendance(student.id, btn.status)}
                                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                                      isSelected
                                        ? "bg-[#CA8E25] text-black border-[#CA8E25]"
                                        : btn.colorClass
                                    }`}
                                  >
                                    {btn.label}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 max-w-xs">
                              <input
                                type="text"
                                value={studentNotes[student.id] || ""}
                                placeholder="Add notes (e.g. sick leaf)..."
                                onChange={(e) => setStudentNotes({ ...studentNotes, [student.id]: e.target.value })}
                                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none w-full"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSaveNotes(student.id, currentStatus)}
                                className="text-slate-400 hover:text-white shrink-0 hover:bg-slate-900"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="font-bold">No students registered in this class.</p>
              </div>
            )}
          </div>

          {/* Historical Logs List */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Historical Student Attendance Records</h3>
            {localStudentRecords.length > 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-400">
                        <th className="text-left py-3.5 px-6 font-bold">Date</th>
                        <th className="text-left py-3.5 px-6 font-bold">Student Name</th>
                        <th className="text-left py-3.5 px-6 font-bold">Course / Class</th>
                        <th className="text-left py-3.5 px-6 font-bold">Status</th>
                        <th className="text-left py-3.5 px-6 font-bold">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localStudentRecords.map(log => (
                        <tr key={log.id} className="border-b border-slate-850/50 text-slate-300">
                          <td className="py-3 px-6 font-mono text-xs">
                            {new Date(log.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-6 font-bold text-white">{log.studentName}</td>
                          <td className="py-3 px-6 text-slate-400">{log.courseTitle}</td>
                          <td className="py-3 px-6">
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${statusColor(log.status)}`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-xs text-slate-500 italic max-w-xs truncate">
                            {log.notes || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-950 border border-slate-800 rounded-2xl">
                No past student attendances recorded yet.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* My Attendance Tab */
        <div className="space-y-6 animate-fadeIn">
          {/* Check In/Out Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <Button
              onClick={handleCheckIn}
              disabled={loading || checkedIn}
              className={`rounded-2xl py-8 text-lg font-bold flex flex-col items-center gap-2 transition ${
                checkedIn
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed"
                  : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500"
              }`}
            >
              <LogIn className="h-8 w-8" />
              {checkedIn ? "Already Checked In" : "Check In"}
            </Button>
            <Button
              onClick={handleCheckOut}
              disabled={loading || !checkedIn || checkedOut}
              className={`rounded-2xl py-8 text-lg font-bold flex flex-col items-center gap-2 transition ${
                checkedOut
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed"
                  : !checkedIn
                    ? "bg-slate-950 text-slate-650 border border-slate-800 cursor-not-allowed"
                    : "bg-gradient-to-br from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500"
              }`}
            >
              <LogOut className="h-8 w-8" />
              {checkedOut ? "Already Checked Out" : "Check Out"}
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {teacherStats.map(stat => (
              <div key={stat.label} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Attendance History */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">My Attendance History</h2>
            {records.length > 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="text-left py-3 px-4 font-semibold">Date</th>
                        <th className="text-left py-3 px-4 font-semibold">Check In</th>
                        <th className="text-left py-3 px-4 font-semibold">Check Out</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Working Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map(r => (
                        <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition">
                          <td className="py-3 px-4 text-white font-medium">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-slate-500" />
                              {new Date(r.date).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusColor(r.status)}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white font-semibold">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-slate-500" />
                              {r.workingHours}h
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl text-center text-slate-400">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-white">No check-in logs yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
