"use client";

import { useState } from "react";
import { Megaphone, CheckCircle2, ChevronDown, ChevronUp, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAnnouncementAsRead } from "@/actions/announcements";
import { motion, AnimatePresence } from "framer-motion";

interface AnnouncementItem {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  courseId: string | null;
  isPublished: boolean;
  publishDate: string;
  teacherName: string;
  courseName: string | null;
  isRead: boolean;
}

export default function StudentAnnouncementsClient({
  initialAnnouncements,
}: {
  initialAnnouncements: AnnouncementItem[];
}) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [marking, setMarking] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const handleMarkRead = async (id: string) => {
    setMarking(id);
    const res = await markAnnouncementAsRead(id);
    if (res.success) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
      );
    }
    setMarking(null);
  };

  const unreadCount = announcements.filter((a) => !a.isRead).length;
  const filtered = filter === "unread" ? announcements.filter((a) => !a.isRead) : announcements;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-[#CA8E25]" />
            Announcements
          </h1>
          <p className="text-slate-400 mt-2">
            Class and general announcements from your instructors.
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-xl">
            <Bell className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-bold text-blue-400">{unreadCount} unread</span>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition ${
              filter === f
                ? "bg-[#CA8E25]/20 text-[#CA8E25] border-[#CA8E25]/30"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            {f === "all" ? `All (${announcements.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl border transition ${
                a.isRead
                  ? "bg-slate-950 border-slate-800"
                  : "bg-slate-950 border-[#CA8E25]/30 shadow-[0_0_20px_rgba(202,142,37,0.05)]"
              }`}
            >
              {/* Header row */}
              <button
                className="w-full text-left px-6 py-4 flex items-start justify-between gap-4"
                onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {!a.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#CA8E25] mt-1.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-bold truncate ${a.isRead ? "text-slate-300" : "text-white"}`}>
                      {a.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{a.teacherName}</span>
                      {a.courseName && (
                        <>
                          <span className="text-slate-700">•</span>
                          <span className="text-xs text-slate-500">{a.courseName}</span>
                        </>
                      )}
                      <span className="text-slate-700">•</span>
                      <span className="text-xs text-slate-500">
                        {new Date(a.publishDate).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {expandedId === a.id ? (
                  <ChevronUp className="h-4 w-4 text-slate-500 shrink-0 mt-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500 shrink-0 mt-1" />
                )}
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {expandedId === a.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 space-y-4 border-t border-slate-800">
                      <p className="text-sm text-slate-300 leading-relaxed pt-4 whitespace-pre-wrap">
                        {a.description}
                      </p>
                      {!a.isRead && (
                        <Button
                          onClick={() => handleMarkRead(a.id)}
                          disabled={marking === a.id}
                          className="bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 border border-emerald-500/20 rounded-xl text-xs px-4 py-2 font-semibold flex items-center gap-2"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {marking === a.id ? "Marking..." : "Mark as Read"}
                        </Button>
                      )}
                      {a.isRead && (
                        <p className="text-xs text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Read
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 p-12 rounded-2xl text-center space-y-3">
          <Megaphone className="h-10 w-10 text-[#CA8E25] mx-auto opacity-40" />
          <p className="font-bold text-white text-lg">
            {filter === "unread" ? "All caught up!" : "No announcements yet"}
          </p>
          <p className="text-sm text-slate-500">
            {filter === "unread"
              ? "You've read all available announcements."
              : "Your teacher's announcements will appear here."}
          </p>
        </div>
      )}
    </div>
  );
}
