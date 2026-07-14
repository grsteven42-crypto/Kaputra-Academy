"use client";

import { useState } from "react";
import { 
  Megaphone, Plus, Edit, Trash2, Eye, EyeOff, Calendar, 
  Users, BookOpen, Clock, AlertCircle, CheckCircle2, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement, 
  togglePublishAnnouncement 
} from "@/actions/announcements";
import { motion, AnimatePresence } from "framer-motion";

interface Course {
  id: string;
  title: string;
}

interface Student {
  id: string;
  name: string;
  studentIdStr: string | null;
  enrollments: { itemId: string }[];
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  courseId: string | null;
  isPublished: boolean;
  publishDate: Date | string;
  course?: Course | null;
  targetStudents?: { id: string; name: string; studentIdStr: string | null }[];
}

export default function AnnouncementsClient({
  initialAnnouncements,
  courses,
  students = [],
}: {
  initialAnnouncements: Announcement[];
  courses: Course[];
  students: Student[];
}) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("BOTH");
  const [courseId, setCourseId] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isTargeted, setIsTargeted] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Status message
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter students based on selected course and search query
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (student.studentIdStr && student.studentIdStr.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!courseId) return matchesSearch; // General: show all
    // Course selected: filter to students enrolled in that course
    return matchesSearch && student.enrollments.some(e => e.itemId === courseId);
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setTargetAudience("BOTH");
    setCourseId("");
    setIsTargeted(false);
    setSelectedStudentIds([]);
    setSearchQuery("");
    const now = new Date();
    // Format to yyyy-MM-ddThh:mm
    const tzoffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
    setPublishDate(localISOTime);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Announcement) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setTargetAudience(item.targetAudience);
    setCourseId(item.courseId || "");
    
    const hasTargeted = !!(item.targetStudents && item.targetStudents.length > 0);
    setIsTargeted(hasTargeted);
    setSelectedStudentIds(hasTargeted ? item.targetStudents!.map(s => s.id) : []);
    setSearchQuery("");

    const dateObj = new Date(item.publishDate);
    const tzoffset = dateObj.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(dateObj.getTime() - tzoffset)).toISOString().slice(0, 16);
    setPublishDate(localISOTime);
    setIsPublished(item.isPublished);
    setIsModalOpen(true);
  };

  const showStatus = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const toggleStudent = (sid: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(sid) ? prev.filter(id => id !== sid) : [...prev, sid]
    );
  };

  const selectAllFiltered = () => {
    const filteredIds = filteredStudents.map(s => s.id);
    setSelectedStudentIds(prev => {
      const union = new Set([...prev, ...filteredIds]);
      return Array.from(union);
    });
  };

  const clearAllFiltered = () => {
    const filteredIds = filteredStudents.map(s => s.id);
    setSelectedStudentIds(prev => prev.filter(id => !filteredIds.includes(id)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      showStatus("error", "Please fill in title and description.");
      return;
    }

    if (isTargeted && selectedStudentIds.length === 0) {
      showStatus("error", "Please select at least one student if you choose to target specific students.");
      return;
    }

    setLoading(true);
    const dateValue = publishDate ? new Date(publishDate) : new Date();
    const finalStudentIds = isTargeted ? selectedStudentIds : [];

    if (editingItem) {
      // Edit
      const res = await updateAnnouncement(editingItem.id, {
        title,
        description,
        targetAudience,
        courseId: courseId || undefined,
        isPublished,
        publishDate: dateValue,
        targetStudentIds: finalStudentIds,
      });

      if (res.success && res.item) {
        showStatus("success", "Announcement updated successfully!");
        setAnnouncements(prev =>
          prev.map(a => (a.id === editingItem.id ? (res.item as unknown as Announcement) : a))
        );
        setIsModalOpen(false);
      } else {
        showStatus("error", res.error || "Failed to update announcement.");
      }
    } else {
      // Create
      const res = await createAnnouncement({
        title,
        description,
        targetAudience,
        courseId: courseId || undefined,
        isPublished,
        publishDate: dateValue,
        targetStudentIds: finalStudentIds,
      });

      if (res.success && res.item) {
        showStatus("success", "Announcement created successfully!");
        setAnnouncements(prev => [res.item as unknown as Announcement, ...prev]);
        setIsModalOpen(false);
      } else {
        showStatus("error", res.error || "Failed to create announcement.");
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    const res = await deleteAnnouncement(id);
    if (res.success) {
      showStatus("success", "Announcement deleted successfully!");
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } else {
      showStatus("error", res.error || "Failed to delete announcement.");
    }
  };

  const handleTogglePublish = async (item: Announcement) => {
    const newPublishState = !item.isPublished;
    const res = await togglePublishAnnouncement(item.id, newPublishState);
    if (res.success) {
      showStatus("success", `Announcement ${newPublishState ? "published" : "unpublished"}!`);
      setAnnouncements(prev =>
        prev.map(a => (a.id === item.id ? { ...a, isPublished: newPublishState } : a))
      );
    } else {
      showStatus("error", res.error || "Operation failed.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-[#CA8E25]" />
            Announcements
          </h1>
          <p className="text-slate-400 mt-2">
            Publish reminders, school updates, and homework notices directly to student & parent dashboards.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 px-4 flex items-center gap-2 text-sm font-semibold transition self-start sm:self-center"
        >
          <Plus className="h-4.5 w-4.5" />
          Create Announcement
        </Button>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 p-4 rounded-xl border ${
              message.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid List */}
      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition flex flex-col md:flex-row justify-between md:items-start gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    item.isPublished 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}>
                    {item.isPublished ? "Published" : "Draft"}
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-600/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                    Audience: {item.targetAudience.toLowerCase()}
                  </span>

                  {item.course ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#CA8E25] bg-[#CA8E25]/10 px-2.5 py-0.5 rounded-full border border-[#CA8E25]/20 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {item.course.title}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-600/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                      All Classes
                    </span>
                  )}

                  {item.targetStudents && item.targetStudents.length > 0 ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-600/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Targeted ({item.targetStudents.length})
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-650/10 px-2.5 py-0.5 rounded-full border border-teal-500/20 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Broadcast All
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm whitespace-pre-line leading-relaxed">{item.description}</p>

                {item.targetStudents && item.targetStudents.length > 0 && (
                  <div className="text-xs text-slate-500 bg-slate-900/40 p-3 rounded-xl border border-slate-900 mt-2">
                    <span className="font-bold text-slate-400">Directed to:</span>{" "}
                    {item.targetStudents.map((s) => `${s.name} (${s.studentIdStr || "No ID"})`).join(", ")}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Published: {new Date(item.publishDate).toLocaleDateString()} at {new Date(item.publishDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-start">
                <Button
                  onClick={() => handleTogglePublish(item)}
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
                  title={item.isPublished ? "Unpublish" : "Publish"}
                >
                  {item.isPublished ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </Button>
                <Button
                  onClick={() => openEditModal(item)}
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-blue-400 hover:text-blue-300 hover:bg-slate-900"
                  title="Edit"
                >
                  <Edit className="h-4.5 w-4.5" />
                </Button>
                <Button
                  onClick={() => handleDelete(item.id)}
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-red-400 hover:text-red-300 hover:bg-slate-900"
                  title="Delete"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-950 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 max-w-xl mx-auto space-y-3">
            <Megaphone className="h-10 w-10 text-[#CA8E25] mx-auto opacity-50" />
            <p className="font-bold text-white text-lg">No announcements created yet</p>
            <p className="text-sm">Create announcements to notify students and parents about updates, syllabus adjustments, or tests.</p>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-[#CA8E25]" />
                  {editingItem ? "Edit Announcement" : "Create Announcement"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white text-xl font-bold font-mono"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Title</label>
                  <input
                     type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Geometry Quiz Schedule"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Description / Content</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Type description detail of the announcement here..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Target Audience</label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="BOTH">Students & Parents</option>
                      <option value="STUDENTS">Students Only</option>
                      <option value="PARENTS">Parents Only</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Target Class / Course</label>
                    <select
                      value={courseId}
                      onChange={(e) => {
                        setCourseId(e.target.value);
                        // Reset targeted students selection on course change to avoid selecting students outside course
                        setSelectedStudentIds([]);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">General (All Classes)</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* TARGET SPECIFIC STUDENTS */}
                <div className="space-y-2 border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase">Targeting Mode</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsTargeted(false)}
                        className={`text-xs px-3 py-1 rounded-lg border transition ${
                          !isTargeted 
                            ? "bg-blue-600/10 border-blue-500/30 text-blue-450 font-bold" 
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        All Students
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsTargeted(true)}
                        className={`text-xs px-3 py-1 rounded-lg border transition ${
                          isTargeted 
                            ? "bg-blue-600/10 border-blue-500/30 text-blue-450 font-bold" 
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        Specific Students
                      </button>
                    </div>
                  </div>

                  {isTargeted && (
                    <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                      {/* Search & Quick Controls */}
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                            placeholder="Search by student name or ID..."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={selectAllFiltered}
                          className="text-[10px] px-2 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-slate-300 font-semibold shrink-0"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={clearAllFiltered}
                          className="text-[10px] px-2 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-slate-300 font-semibold shrink-0"
                        >
                          Clear
                        </button>
                      </div>

                      {/* Students Checkbox List */}
                      <div className="max-h-[160px] overflow-y-auto divide-y divide-slate-900/60 border border-slate-850 rounded-lg bg-slate-950/70 p-1">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => {
                            const isChecked = selectedStudentIds.includes(student.id);
                            return (
                              <label
                                key={student.id}
                                className="flex items-center gap-3 p-2 hover:bg-slate-900/50 cursor-pointer rounded-md select-none"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleStudent(student.id)}
                                  className="w-3.5 h-3.5 rounded text-blue-600 bg-slate-900 border-slate-800"
                                />
                                <div className="text-xs flex-1 min-w-0">
                                  <p className="font-bold text-white truncate">{student.name}</p>
                                  {student.studentIdStr && (
                                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{student.studentIdStr}</p>
                                  )}
                                </div>
                              </label>
                            );
                          })
                        ) : (
                          <div className="p-6 text-center text-slate-500 text-xs">
                            No active students found {courseId ? "enrolled in this course" : ""}.
                          </div>
                        )}
                      </div>

                      {/* Summary indicator */}
                      <div className="text-[10px] text-slate-400 font-medium">
                        Selected: <span className="text-blue-400 font-bold">{selectedStudentIds.length}</span> students.
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Publish Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800"
                    />
                    <label htmlFor="isPublished" className="text-sm font-semibold text-slate-350 cursor-pointer">
                      Publish immediately
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-850 flex justify-end gap-3">
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    variant="ghost"
                    className="rounded-xl border border-slate-800 text-slate-450 hover:bg-slate-850"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-550 text-white rounded-xl px-6 font-semibold"
                  >
                    {loading ? "Saving..." : editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
