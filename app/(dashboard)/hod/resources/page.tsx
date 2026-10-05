"use client";

import { useState } from "react";
import { BookMarked, Search, Eye, FileText, BookOpen, Download } from "lucide-react";

const materials = [
  { id: "1", title: "DBMS Unit 1 - Introduction Notes", subject: "CS501 - DBMS", type: "PDF", uploadedBy: "Dr. Anjali Verma", date: "2026-09-15", size: "2.4 MB", year: 3 },
  { id: "2", title: "DAA Lecture Slides - Divide & Conquer", subject: "CS502 - DAA", type: "PPT", uploadedBy: "Dr. Anjali Verma", date: "2026-09-18", size: "5.1 MB", year: 3 },
  { id: "3", title: "OS Concepts - Process Scheduling", subject: "CS503 - OS", type: "PDF", uploadedBy: "Dr. Rajesh Sharma", date: "2026-09-20", size: "3.2 MB", year: 3 },
  { id: "4", title: "Computer Networks - TCP/IP Model", subject: "CS504 - CN", type: "PDF", uploadedBy: "Prof. Suresh Vet", date: "2026-09-22", size: "1.8 MB", year: 3 },
  { id: "5", title: "SE Design Patterns Reference", subject: "CS506 - SE", type: "PDF", uploadedBy: "Dr. Rajesh Sharma", date: "2026-09-25", size: "4.0 MB", year: 3 },
];

const typeColors: Record<string, string> = {
  PDF: "bg-red-50 text-red-700 ring-red-200",
  PPT: "bg-orange-50 text-orange-700 ring-orange-200",
  DOC: "bg-blue-50 text-blue-700 ring-blue-200",
};

export default function HodResourcesPage() {
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const subjects = ["all", ...Array.from(new Set(materials.map((m) => m.subject)))];
  const filtered = materials.filter(
    (m) =>
      (filterSubject === "all" || m.subject === filterSubject) &&
      (m.title.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Study Materials Oversight</h1>
          <p className="text-slate-500 text-sm mt-0.5">Monitor all study materials uploaded by department faculty.</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-[#FFF5F0] text-[#8B2500] font-bold text-sm border border-[#8B2500]/15">
          <BookMarked size={14} className="inline mr-1.5 mb-0.5" />
          {materials.length} Resources Uploaded
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search materials..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white" />
        </div>
        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}
          className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white">
          {subjects.map((s) => <option key={s} value={s}>{s === "all" ? "All Subjects" : s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:border-[#8B2500]/20 transition">
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C13A00] to-[#8B2500] flex items-center justify-center shadow shrink-0">
                <FileText size={18} className="text-white" />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ring-1 ${typeColors[m.type] || "bg-slate-100 text-slate-600 ring-slate-200"}`}>
                {m.type}
              </span>
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-snug">{m.title}</p>
              <p className="text-xs text-[#8B2500] font-semibold mt-1">{m.subject}</p>
              <p className="text-xs text-slate-400 mt-0.5">by {m.uploadedBy} · {m.date} · {m.size}</p>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition">
                <Eye size={12} /> Preview
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF5F0] border border-[#8B2500]/15 text-[#8B2500] text-xs font-bold hover:bg-[#8B2500] hover:text-white transition">
                <Download size={12} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <BookOpen size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No materials found</p>
        </div>
      )}
    </div>
  );
}
