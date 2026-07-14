"use client";

import { useState } from "react";
import {
  FileEdit, Plus, Save, X, CheckCircle2, AlertCircle,
  BookOpen, GraduationCap, TrendingUp, Users, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createStudentReport, updateAcademicReport, deleteAcademicReport } from "@/actions/progress";
import { motion, AnimatePresence } from "framer-motion";

interface Student {
  id: string;
  name: string;
  studentIdStr: string | null;
}

interface Course {
  id: string;
  title: string;
}

interface ReportItem {
  id: string;
  studentId: string;
  studentName: string;
  studentIdStr: string;
  courseId: string;
  courseName: string;
  grade: string;
  progress: number;
  teacherNotes: string | null;
  skillAssessment: string | null;
  completedModules: string | null;
}

interface Props {
  reports: ReportItem[];
  students: Student[];
  courses: Course[];
}

const GRADE_OPTIONS = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

export default function ReportCMSClient({ reports: initialReports, students, courses }: Props) {
  const [reports, setReports] = useState(initialReports);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const blankForm = {
    studentId: "",
    courseId: "",
    grade: "B",
    progress: 0,
    teacherNotes: "",
    skillAssessment: "",
    completedModules: "",
  };

  const [createForm, setCreateForm] = useState(blankForm);
  const [editForm, setEditForm] = useState({
    grade: "B",
    progress: 0,
    teacherNotes: "",
    skillAssessment: "",
    completedModules: "",
  });

  const showStatus = (t: "success" | "error", text: string) => {
    setMessage({ type: t, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const startEditing = (item: ReportItem) => {
    setEditingId(item.id);
    setEditForm({
      grade: item.grade,
      progress: item.progress,
      teacherNotes: item.teacherNotes || "",
      skillAssessment: item.skillAssessment || "",
      completedModules: item.completedModules || "",
    });
  };

  const handleCreate = async () => {
    if (!createForm.studentId || !createForm.courseId) {
      showStatus("error", "Please select a student and course.");
      return;
    }
    setLoading(true);
    const res = await createStudentReport(createForm);
    if (res.success && res.item) {
      const student = students.find((s) => s.id === createForm.studentId);
      const course = courses.find((c) => c.id === createForm.courseId);
      setReports((prev) => [
        {
          id: res.item!.id,
          studentId: res.item!.studentId,
          studentName: student?.name || "",
          studentIdStr: student?.studentIdStr || "",
          courseId: res.item!.courseId,
          courseName: course?.title || "",
          grade: res.item!.grade,
          progress: res.item!.progress,
          teacherNotes: res.item!.teacherNotes || null,
          skillAssessment: res.item!.skillAssessment || null,
          completedModules: res.item!.completedModules || null,
        },
        ...prev,
      ]);
      showStatus("success", "Report created successfully!");
      setShowCreate(false);
      setCreateForm(blankForm);
    } else {
      showStatus("error", res.error || "Failed to create report.");
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    const res = await updateAcademicReport(id, editForm);
    if (res.success) {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...editForm } : r))
      );
      showStatus("success", "Report updated!");
      setEditingId(null);
    } else {
      showStatus("error", res.error || "Failed to update.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this academic report? This action cannot be undone.")) {
      return;
    }
    setLoading(true);
    const res = await deleteAcademicReport(id);
    if (res.success) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      showStatus("success", "Report deleted successfully!");
    } else {
      showStatus("error", res.error || "Failed to delete report.");
    }
    setLoading(false);
  };

  const gradeColor = (g: string) => {
    if (g.startsWith("A")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (g.startsWith("B")) return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    if (g.startsWith("C")) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <FileEdit className="h-8 w-8 text-[#CA8E25]" />
            Academic Report CMS
          </h1>
          <p className="text-slate-400 mt-2">
            Create and edit student report cards with grades and evaluations.
          </p>
        </div>
        <Button
          onClick={() => { setShowCreate(true); setEditingId(null); }}
          className="bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-bold rounded-xl px-5 flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" />
          New Report
        </Button>
      </div>

      {/* Status banner */}
      <AnimatePresence>
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
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bg-slate-950 border border-[#CA8E25]/30 rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#CA8E25]" /> Create New Report
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Student</label>
                <select
                  value={createForm.studentId}
                  onChange={(e) => setCreateForm((p) => ({ ...p, studentId: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
                >
                  <option value="">Select student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.studentIdStr || s.id.slice(0, 6)})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Course</label>
                <select
                  value={createForm.courseId}
                  onChange={(e) => setCreateForm((p) => ({ ...p, courseId: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
                >
                  <option value="">Select course...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Grade</label>
                <select
                  value={createForm.grade}
                  onChange={(e) => setCreateForm((p) => ({ ...p, grade: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
                >
                  {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Progress (%)</label>
                <input
                  type="number" min={0} max={100}
                  value={createForm.progress}
                  onChange={(e) => setCreateForm((p) => ({ ...p, progress: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Teacher Notes</label>
              <textarea rows={3} value={createForm.teacherNotes}
                onChange={(e) => setCreateForm((p) => ({ ...p, teacherNotes: e.target.value }))}
                placeholder="Performance notes and recommendations..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Skill Assessment</label>
                <input type="text" value={createForm.skillAssessment}
                  onChange={(e) => setCreateForm((p) => ({ ...p, skillAssessment: e.target.value }))}
                  placeholder="Logic: 85, Algebra: 90..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Completed Modules</label>
                <input type="text" value={createForm.completedModules}
                  onChange={(e) => setCreateForm((p) => ({ ...p, completedModules: e.target.value }))}
                  placeholder="Module 1, Module 2..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreate} disabled={loading}
                className="bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-bold rounded-xl px-6 flex items-center gap-2">
                <Save className="h-4 w-4" />
                {loading ? "Creating..." : "Create Report"}
              </Button>
              <Button onClick={() => setShowCreate(false)} variant="ghost"
                className="rounded-xl border border-slate-800 text-slate-400">
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reports list */}
      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((item) => (
            <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Student Info */}
                <div className="flex items-center gap-4 min-w-[220px]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {item.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.studentName}</h3>
                    <p className="text-xs text-slate-500 font-mono">{item.studentIdStr}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <BookOpen className="h-3 w-3" /> {item.courseName}
                    </p>
                  </div>
                </div>

                {editingId === item.id ? (
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Grade</label>
                        <select value={editForm.grade}
                          onChange={(e) => setEditForm((p) => ({ ...p, grade: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#CA8E25]">
                          {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Progress (%)</label>
                        <input type="number" min={0} max={100} value={editForm.progress}
                          onChange={(e) => setEditForm((p) => ({ ...p, progress: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Teacher Notes</label>
                      <textarea rows={3} value={editForm.teacherNotes}
                        onChange={(e) => setEditForm((p) => ({ ...p, teacherNotes: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Skill Assessment</label>
                        <input type="text" value={editForm.skillAssessment}
                          onChange={(e) => setEditForm((p) => ({ ...p, skillAssessment: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Completed Modules</label>
                        <input type="text" value={editForm.completedModules}
                          onChange={(e) => setEditForm((p) => ({ ...p, completedModules: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#CA8E25]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => handleUpdate(item.id)} disabled={loading}
                        className="bg-[#CA8E25] hover:bg-[#D89A2B] text-black font-bold rounded-xl px-6 flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button onClick={() => setEditingId(null)} variant="ghost"
                        className="rounded-xl border border-slate-800 text-slate-400">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-black px-3 py-1 rounded-xl border ${gradeColor(item.grade)}`}>
                          {item.grade}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="h-4 w-4 text-[#CA8E25]" />
                          <span className="text-sm text-white font-bold">{item.progress}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => startEditing(item)}
                          className="bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 rounded-xl text-xs px-3 py-1.5 font-semibold border border-blue-500/20">
                          Edit Report
                        </Button>
                        <Button onClick={() => handleDelete(item.id)} disabled={loading}
                          className="bg-red-600/10 text-red-405 hover:bg-red-650/20 rounded-xl text-xs px-3 py-1.5 font-semibold border border-red-500/20 flex items-center justify-center">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3">
                      <div className="bg-gradient-to-r from-[#CA8E25] to-amber-400 h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.min(item.progress, 100)}%` }} />
                    </div>
                    <div className="space-y-1 text-xs text-slate-400">
                      {item.completedModules && <p><span className="font-semibold text-slate-300">Modules:</span> {item.completedModules}</p>}
                      {item.teacherNotes && <p><span className="font-semibold text-slate-300">Notes:</span> {item.teacherNotes}</p>}
                      {item.skillAssessment && <p><span className="font-semibold text-slate-300">Skills:</span> {item.skillAssessment}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 max-w-xl mx-auto space-y-3">
          <GraduationCap className="h-10 w-10 text-[#CA8E25] mx-auto opacity-50" />
          <p className="font-bold text-white text-lg">No reports yet</p>
          <p className="text-sm">Create the first academic report for your students using the button above.</p>
        </div>
      )}
    </div>
  );
}
