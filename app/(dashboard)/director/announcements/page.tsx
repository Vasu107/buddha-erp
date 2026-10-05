"use client";

import { useState } from "react";
import {
  Megaphone, Plus, Search, Filter, FileText, Upload, Download,
  Pin, Trash2, Edit2, CheckCircle2, AlertTriangle, Info, Calendar,
  Paperclip, Eye, Tag, Users, GraduationCap, Building2, ExternalLink
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "All" | "Faculty" | "Students" | "HODs";
  priority: "Urgent" | "Important" | "General";
  date: string;
  pdfFile?: {
    name: string;
    size: string;
    url: string;
  };
  isPinned?: boolean;
}

const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Official Notification: End Semester Examination Schedule AY 2024-25",
    content: "All HODs, Faculty members, and Students are hereby informed that the End Semester Examinations for Odd Semester 2024-25 will commence from 15th November 2024. Detailed timetable attached in the official PDF below.",
    category: "All",
    priority: "Urgent",
    date: "2026-10-02",
    pdfFile: {
      name: "End_Sem_Exam_Schedule_2024.pdf",
      size: "2.4 MB",
      url: "#",
    },
    isPinned: true,
  },
  {
    id: "2",
    title: "Faculty Development Program (FDP) on AI & Cloud Computing",
    content: "A 5-day national level FDP is organized by CSE Department from October 20-25, 2024. All faculty members are requested to submit their registrations by October 12.",
    category: "Faculty",
    priority: "Important",
    date: "2026-09-28",
    pdfFile: {
      name: "FDP_AI_Cloud_Brochure.pdf",
      size: "1.1 MB",
      url: "#",
    },
    isPinned: true,
  },
  {
    id: "3",
    title: "Mid-Term Academic Progress Review & HOD Meeting",
    content: "Director's office has scheduled a mandatory HOD progress review meeting in the Boardroom on Monday at 10:30 AM. Kindly present the monthly attendance and syllabus progress reports.",
    category: "HODs",
    priority: "Important",
    date: "2026-09-25",
    isPinned: false,
  },
  {
    id: "4",
    title: "Annual Sports & Cultural Fest 'Tarang 2024' Registration Open",
    content: "Students can register for various sports and cultural events through their respective department coordinators. Registration deadline is October 18, 2024.",
    category: "Students",
    priority: "General",
    date: "2026-09-20",
    pdfFile: {
      name: "Tarang_2024_Rulebook.pdf",
      size: "3.8 MB",
      url: "#",
    },
    isPinned: false,
  },
];

export default function DirectorAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [annType, setAnnType] = useState<"text" | "pdf">("text");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "All" as Announcement["category"],
    priority: "General" as Announcement["priority"],
    pdfName: "",
    pdfSize: "",
    pdfUrl: "",
    isPinned: false,
  });

  const filtered = announcements.filter((a) => {
    const q = search.toLowerCase();
    const matchCategory = categoryFilter === "All" || a.category === categoryFilter;
    const matchPriority = priorityFilter === "All" || a.priority === priorityFilter;
    const matchQuery =
      a.title.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      (a.pdfFile && a.pdfFile.name.toLowerCase().includes(q));
    return matchCategory && matchPriority && matchQuery;
  });

  const handleOpenAddModal = () => {
    setEditingId(null);
    setAnnType("text");
    setFormData({
      title: "",
      content: "",
      category: "All",
      priority: "General",
      pdfName: "",
      pdfSize: "",
      pdfUrl: "",
      isPinned: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (a: Announcement) => {
    setEditingId(a.id);
    setAnnType(a.pdfFile ? "pdf" : "text");
    setFormData({
      title: a.title,
      content: a.content,
      category: a.category,
      priority: a.priority,
      pdfName: a.pdfFile?.name || "",
      pdfSize: a.pdfFile?.size || "",
      pdfUrl: a.pdfFile?.url || "",
      isPinned: !!a.isPinned,
    });
    setIsModalOpen(true);
  };

  const handlePdfUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      setFormData((prev) => ({
        ...prev,
        pdfName: file.name,
        pdfSize: sizeMb,
        pdfUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().split("T")[0];

    const pdfData = formData.pdfName
      ? {
          name: formData.pdfName,
          size: formData.pdfSize || "1.5 MB",
          url: formData.pdfUrl || "#",
        }
      : undefined;

    if (editingId) {
      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: formData.title,
                content: formData.content,
                category: formData.category,
                priority: formData.priority,
                pdfFile: pdfData,
                isPinned: formData.isPinned,
              }
            : item
        )
      );
    } else {
      const newAnn: Announcement = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        category: formData.category,
        priority: formData.priority,
        date: todayStr,
        pdfFile: pdfData,
        isPinned: formData.isPinned,
      };
      setAnnouncements([newAnn, ...announcements]);
    }
    setIsModalOpen(false);
  };

  const togglePin = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Director Announcements & Notices</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Publish official circulars, PDF notices, and general announcements for campus stakeholders.
          </p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={handleOpenAddModal}
          className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
        >
          Publish Announcement
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Notices</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{announcements.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Urgent Circulars</p>
          <p className="text-2xl font-black text-red-600 mt-1">
            {announcements.filter((a) => a.priority === "Urgent").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">PDF Documents</p>
          <p className="text-2xl font-black text-[#8B2500] mt-1">
            {announcements.filter((a) => a.pdfFile).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Pinned Notices</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {announcements.filter((a) => a.isPinned).length}
          </p>
        </div>
      </div>

      {/* ── Search & Filters ── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2.5 items-center flex-1">
          <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mr-1">
            <Filter size={14} /> Target:
          </div>

          {/* Category Filter Pills */}
          {["All", "Faculty", "Students", "HODs"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                categoryFilter === cat
                  ? "bg-[#8B2500] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "All" ? "All Audience" : cat}
            </button>
          ))}

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700 ml-2"
          >
            <option value="All">All Priority</option>
            <option value="Urgent">Urgent</option>
            <option value="Important">Important</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices, PDFs..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/10 bg-white"
          />
        </div>
      </div>

      {/* ── Announcements Grid / Feed ── */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card>
            <div className="text-center py-12 text-slate-400">
              <Megaphone size={36} className="mx-auto text-slate-300 mb-3" />
              <p className="font-bold text-slate-600 text-base">No announcements found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
            </div>
          </Card>
        ) : (
          filtered.map((a) => (
            <div
              key={a.id}
              className={`bg-white rounded-2xl p-5 border transition-all duration-200 relative ${
                a.isPinned
                  ? "border-[#8B2500]/30 shadow-md ring-1 ring-[#8B2500]/15"
                  : "border-slate-100 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Top Meta Line */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Pin Badge */}
                  {a.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                      <Pin size={11} className="rotate-45" /> Pinned
                    </span>
                  )}

                  {/* Priority Badge */}
                  {a.priority === "Urgent" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                      <AlertTriangle size={11} /> Urgent Circular
                    </span>
                  ) : a.priority === "Important" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-[#8B2500] text-xs font-bold border border-orange-200">
                      <Info size={11} /> Important
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      General
                    </span>
                  )}

                  {/* Target Audience Badge */}
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                    Audience: {a.category}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar size={13} /> {a.date}
                  </span>

                  {/* Pin/Edit/Delete Controls */}
                  <div className="flex items-center gap-1 border-l border-slate-100 pl-2">
                    <button
                      onClick={() => togglePin(a.id)}
                      className={`p-1.5 rounded-lg transition ${
                        a.isPinned
                          ? "bg-amber-50 text-amber-600"
                          : "hover:bg-slate-100 text-slate-400"
                      }`}
                      title={a.isPinned ? "Unpin Notice" : "Pin Notice to Top"}
                    >
                      <Pin size={14} className={a.isPinned ? "rotate-45" : ""} />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(a)}
                      className="p-1.5 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-[#8B2500] transition"
                      title="Edit Notice"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                      title="Delete Notice"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Title & Body */}
              <h3 className="text-base font-bold text-slate-800 leading-snug mb-2">
                {a.title}
              </h3>
              {a.content && (
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-3">
                  {a.content}
                </p>
              )}

              {/* PDF Attachment Block */}
              {a.pdfFile && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 max-w-lg hover:border-[#8B2500]/40 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {a.pdfFile.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Official Circular Document • {a.pdfFile.size}
                      </p>
                    </div>
                  </div>
                  <a
                    href={a.pdfFile.url}
                    download={a.pdfFile.name}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B2500] hover:bg-[#6B1A00] text-white text-xs font-bold transition shrink-0 shadow-sm"
                  >
                    <Download size={13} />
                    Download
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Publish / Edit Announcement Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Announcement" : "Publish Official Announcement"}
      >
        <form onSubmit={handleSaveAnnouncement} className="space-y-4 pt-1">
          
          {/* Mode Tabs: Typing vs PDF Upload */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-2">
            <button
              type="button"
              onClick={() => setAnnType("text")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                annType === "text"
                  ? "bg-[#8B2500] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText size={15} /> Type Announcement Text
            </button>
            <button
              type="button"
              onClick={() => setAnnType("pdf")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                annType === "pdf"
                  ? "bg-[#8B2500] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Upload size={15} /> Attach PDF Notice
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Announcement / Notice Title *
              </label>
              <input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. End Semester Examination Schedule AY 2024-25"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15"
              />
            </div>

            {/* Target Audience & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Audience *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Announcement["category"] })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800 font-semibold"
                >
                  <option value="All">All Stakeholders (Campus Wide)</option>
                  <option value="Faculty">Faculty Members Only</option>
                  <option value="Students">Students Only</option>
                  <option value="HODs">HODs & Department Heads</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notice Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Announcement["priority"] })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800 font-semibold"
                >
                  <option value="General">General Notice</option>
                  <option value="Important">Important Announcement</option>
                  <option value="Urgent">Urgent / High Priority</option>
                </select>
              </div>
            </div>

            {/* Text Typing Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Announcement Content / Details
              </label>
              <textarea
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Type the announcement details, rules, or guidelines here..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15"
              />
            </div>

            {/* PDF File Drag & Drop / Upload */}
            {(annType === "pdf" || formData.pdfName) && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official PDF Circular Attachment
                </label>
                
                {formData.pdfName ? (
                  <div className="p-3 bg-red-50/60 border border-red-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Paperclip size={18} className="text-red-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{formData.pdfName}</p>
                        <p className="text-[10px] text-slate-500">{formData.pdfSize}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, pdfName: "", pdfSize: "", pdfUrl: "" })}
                      className="text-xs font-bold text-red-600 hover:underline shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="relative group border-2 border-dashed border-slate-300 hover:border-[#8B2500] rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfUploadMock}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload size={28} className="mx-auto text-slate-400 group-hover:text-[#8B2500] mb-2 transition" />
                    <p className="text-xs font-bold text-slate-700">Click to upload official PDF circular</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF documents up to 15MB</p>
                  </div>
                )}
              </div>
            )}

            {/* Pin Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pinCheckbox"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="w-4 h-4 text-[#8B2500] border-slate-300 rounded focus:ring-[#8B2500]"
              />
              <label htmlFor="pinCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Pin this announcement to top of feed
              </label>
            </div>

          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
            >
              {editingId ? "Save Changes" : "Publish Announcement"}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
