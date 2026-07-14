"use client";

import { useState } from "react";
import {
  Sliders, Save, TrendingUp, BookOpen, Users,
  AlertCircle, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateStudentProgress } from "@/actions/progress";
import { motion, AnimatePresence } from "framer-motion";

interface ReportItem {
  id: string;
  studentName: string;
  studentId: string;
  courseName: string;
  grade: string;
  progress: number;
  teacherNotes: string | null;
  skillAssessment: string | null;
  completedModules: string | null;
}

export default function ProgressCMSClient({
  reports: initialReports,
}: {
  reports: ReportItem[];
}) {
  const [reports, setReports] = useState(initialReports);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    progress: number;
    completedModules: string;
    teacherNotes: string;
    skillAssessment: string;
  }>({ progress: 0, completedModules: "", teacherNotes: "", skillAssessment: "" });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const showStatus = (t: "success" | "error", text: string) => {
    setMessage({ type: t, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const startEditing = (item: ReportItem) => {
    setEditingId(item.id);
    setFormData({
      progress: item.progress,
      completedModules: item.completedModules || "",
      teacherNotes: item.teacherNotes || "",
      skillAssessment: item.skillAssessment || "",
    });
  };

  const handleSave = async (id: string) => {
    setLoading(true);
    const res = await updateStudentProgress(id, formData);
    if (res.success) {
      showStatus("success", "Progress updated!");
      setReports(prev =>
        prev.map(r => r.id === id ? { ...r, ...formData } : r)
      );
      setEditingId(null);
    } else {
      showStatus("error", res.error || "Failed.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Sliders className="h-8 w-8 text-[#CA8E25]" />
          Student Progress CMS
        </h1>
        <p className="text-slate-400 mt-2">
          Update student completion percentages, mark modules, and add recommendations.
        </p>
      </div>

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

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map(item => (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {item.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.studentName}</h3>
                    <p className="text-xs text-slate-500 font-mono">{item.studentId}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <BookOpen className="h-3 w-3" /> {item.courseName}
                    </p>
                  </div>
                </div>

                {editingId === item.id ? (
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Progress (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={formData.progress}
                          onChange={e => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase">Completed Modules</label>
                        <input
                          type="text"
                          value={formData.completedModules}
                          onChange={e => setFormData(prev => ({ ...prev, completedModules: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                          placeholder="Module 1, Module 2..."
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Teacher Notes & Recommendations</label>
                      <textarea
                        rows={3}
                        value={formData.teacherNotes}
                        onChange={e => setFormData(prev => ({ ...prev, teacherNotes: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        placeholder="Notes about the student's performance..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Skill Assessment</label>
                      <input
                        type="text"
                        value={formData.skillAssessment}
                        onChange={e => setFormData(prev => ({ ...prev, skillAssessment: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        placeholder="Logic: 85, Algebra: 90..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleSave(item.id)}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 font-semibold flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {loading ? "Saving..." : "Save Progress"}
                      </Button>
                      <Button onClick={() => setEditingId(null)} variant="ghost" className="rounded-xl border border-slate-800 text-slate-400">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-[#CA8E25]" />
                        <span className="text-sm text-slate-400 font-medium">Progress</span>
                        <span className="text-lg font-bold text-white">{item.progress}%</span>
                      </div>
                      <Button
                        onClick={() => startEditing(item)}
                        className="bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 rounded-xl text-xs px-3 py-1.5 font-semibold border border-blue-500/20"
                      >
                        Edit Progress
                      </Button>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(item.progress, 100)}%` }}
                      />
                    </div>
                    {item.completedModules && (
                      <p className="text-xs text-slate-400 mb-1"><span className="font-semibold text-slate-300">Modules:</span> {item.completedModules}</p>
                    )}
                    {item.teacherNotes && (
                      <p className="text-xs text-slate-400 mb-1"><span className="font-semibold text-slate-300">Notes:</span> {item.teacherNotes}</p>
                    )}
                    {item.skillAssessment && (
                      <p className="text-xs text-slate-400"><span className="font-semibold text-slate-300">Skills:</span> {item.skillAssessment}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 max-w-xl mx-auto space-y-3">
          <Users className="h-10 w-10 text-[#CA8E25] mx-auto opacity-50" />
          <p className="font-bold text-white text-lg">No student reports found</p>
          <p className="text-sm">Create academic reports for your students first using the Academic Report CMS.</p>
        </div>
      )}
    </div>
  );
}
