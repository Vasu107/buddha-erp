"use client";

import { useState } from "react";
import {
  Megaphone, Plus, Search, FileText, Upload, Trash2,
  CheckCircle2, Eye, Clock, Globe, Building2
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "text" | "pdf";
  fileName?: string;
  audience: "All Students" | "Final Year" | "3rd Year" | "2nd Year" | "1st Year";
  createdAt: string;
  publishedBy: string;
  isPinned: boolean;
}

const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Mid-Semester Examination Schedule",
    content: "The mid-semester examinations for 5th semester will commence from 20th October 2026. Students are advised to check the detailed timetable attached below.",
    type: "text",
    audience: "3rd Year",
    createdAt: "2026-10-01",
    publishedBy: "HOD - CSE",
    isPinned: true,
  },
  {
    id: "2",
    title: "Lab Session Rescheduled",
    content: "The DBMS Lab session scheduled for 3rd October has been rescheduled to 5th October, 10:00 AM – 12:00 PM in Lab-3.",
    type: "text",
    audience: "3rd Year",
    createdAt: "2026-09-30",
    publishedBy: "HOD - CSE",
    isPinned: false,
  },
];

export default function HodAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audience: "All Students" as Announcement["audience"],
    type: "text" as "text" | "pdf",
    fileName: "",
  });

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((p) => ({ ...p, fileName: file.name, type: "pdf" }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) return;
    const newAnn: Announcement = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      type: formData.type,
      fileName: formData.fileName || undefined,
      audience: formData.audience,
      createdAt: new Date().toISOString().split("T")[0],
      publishedBy: "HOD - CSE",
      isPinned: false,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    setFormData({ title: "", content: "", audience: "All Students", type: "text", fileName: "" });
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = (id: string) =>
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));

  const handlePin = (id: string) =>
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Department Announcements</h1>
          <p className="text-slate-500 text-sm mt-0.5">Publish notices and announcements to department students.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C13A00] to-[#8B2500] text-white font-bold text-sm shadow-md hover:opacity-90 transition"
        >
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {/* Toast */}
      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" /> Announcement published successfully!
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-[#8B2500]/20 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Megaphone size={18} className="text-[#8B2500]" /> Create Announcement
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Announcement Title *</label>
              <input
                type="text"
                placeholder="e.g. Mid-Semester Exam Schedule Released"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Target Audience</label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData((p) => ({ ...p, audience: e.target.value as Announcement["audience"] }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
              >
                {["All Students", "Final Year", "3rd Year", "2nd Year", "1st Year"].map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Announcement Content *</label>
            <textarea
              rows={4}
              placeholder="Type your announcement here..."
              value={formData.content}
              onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Attach PDF (Optional)</label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#8B2500]/40 transition group">
              <Upload size={18} className="text-slate-400 group-hover:text-[#8B2500]" />
              <span className="text-sm text-slate-500">
                {formData.fileName ? <span className="text-[#8B2500] font-bold">{formData.fileName}</span> : "Click to upload PDF document"}
              </span>
              <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSubmit} className="px-5 py-2 rounded-xl bg-[#8B2500] text-white font-bold text-sm hover:bg-[#C13A00] transition">
              Publish Announcement
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search announcements..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
        />
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.map((ann) => (
          <div key={ann.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${ann.isPinned ? "border-[#8B2500]/30" : "border-slate-100"}`}>
            {ann.isPinned && (
              <div className="bg-[#FFF5F0] px-5 py-1.5 flex items-center gap-1.5 text-xs font-bold text-[#8B2500] border-b border-[#8B2500]/10">
                📌 Pinned Announcement
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="font-bold text-slate-800">{ann.title}</h3>
                    {ann.type === "pdf" && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-bold ring-1 ring-red-200">
                        <FileText size={11} /> PDF Attached
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold ring-1 ring-blue-200">
                      {ann.audience}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{ann.content}</p>
                  {ann.fileName && (
                    <button className="mt-2 text-xs text-[#8B2500] font-semibold hover:underline flex items-center gap-1">
                      <Eye size={12} /> View {ann.fileName}
                    </button>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock size={11} /> {ann.createdAt}</span>
                    <span className="flex items-center gap-1"><Building2 size={11} /> {ann.publishedBy}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handlePin(ann.id)}
                    title={ann.isPinned ? "Unpin" : "Pin"}
                    className={`p-1.5 rounded-lg text-xs transition ${ann.isPinned ? "bg-[#FFF5F0] text-[#8B2500]" : "hover:bg-slate-100 text-slate-400"}`}
                  >
                    📌
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <Megaphone size={36} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No announcements found</p>
          </div>
        )}
      </div>
    </div>
  );
}
