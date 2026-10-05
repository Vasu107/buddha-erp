"use client";

import { useState } from "react";
import { Layers, Plus, CheckCircle2, ChevronDown, BookOpen, Download } from "lucide-react";

interface CurriculumEntry {
  id: string;
  year: number;
  semester: number;
  totalCredits: number;
  subjects: {
    code: string;
    name: string;
    type: "Core" | "Elective" | "Lab" | "Project";
    credits: number;
  }[];
  status: "Draft" | "Approved";
}

const initialCurriculum: CurriculumEntry[] = [
  {
    id: "1",
    year: 3,
    semester: 5,
    totalCredits: 20,
    status: "Approved",
    subjects: [
      { code: "CS501", name: "Database Management Systems", type: "Core", credits: 4 },
      { code: "CS502", name: "Design & Analysis of Algorithms", type: "Core", credits: 4 },
      { code: "CS503", name: "Operating Systems", type: "Core", credits: 4 },
      { code: "CS504", name: "Computer Networks", type: "Core", credits: 3 },
      { code: "CS505", name: "DBMS Laboratory", type: "Lab", credits: 2 },
      { code: "CS506", name: "Software Engineering", type: "Core", credits: 3 },
    ],
  },
  {
    id: "2",
    year: 3,
    semester: 6,
    totalCredits: 20,
    status: "Draft",
    subjects: [
      { code: "CS601", name: "Compiler Design", type: "Core", credits: 4 },
      { code: "CS602", name: "Machine Learning", type: "Core", credits: 4 },
      { code: "CS603", name: "Information Security", type: "Elective", credits: 3 },
      { code: "CS604", name: "Cloud Computing", type: "Elective", credits: 3 },
      { code: "CS605", name: "ML Laboratory", type: "Lab", credits: 2 },
      { code: "CS606", name: "Mini Project", type: "Project", credits: 4 },
    ],
  },
];

const typeColors: Record<string, string> = {
  Core: "bg-blue-50 text-blue-700 ring-blue-200",
  Elective: "bg-purple-50 text-purple-700 ring-purple-200",
  Lab: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Project: "bg-amber-50 text-amber-700 ring-amber-200",
};

export default function HodCurriculumPage() {
  const [curriculum, setCurriculum] = useState<CurriculumEntry[]>(initialCurriculum);
  const [expanded, setExpanded] = useState<string | null>("1");
  const [saved, setSaved] = useState(false);

  const handleApprove = (id: string) => {
    setCurriculum((p) => p.map((c) => (c.id === id ? { ...c, status: "Approved" } : c)));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Curriculum & Credits Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Review and approve department curriculum semester-wise.</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-[#FFF5F0] text-[#8B2500] font-bold text-sm border border-[#8B2500]/15">
          <Layers size={14} className="inline mr-1.5 mb-0.5" />
          {curriculum.length} Semesters
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" /> Curriculum approved!
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Semesters", value: curriculum.length, color: "text-[#8B2500]" },
          { label: "Total Subjects", value: curriculum.reduce((s, c) => s + c.subjects.length, 0), color: "text-blue-700" },
          { label: "Total Credits", value: curriculum.reduce((s, c) => s + c.totalCredits, 0), color: "text-emerald-700" },
          { label: "Approved", value: curriculum.filter((c) => c.status === "Approved").length, color: "text-purple-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {curriculum.map((entry) => (
          <div key={entry.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C13A00] to-[#8B2500] flex items-center justify-center shadow">
                  <Layers size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800">Year {entry.year} — Semester {entry.semester}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{entry.subjects.length} Subjects · {entry.totalCredits} Total Credits</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ${entry.status === "Approved" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-amber-200"}`}>
                  {entry.status}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${expanded === entry.id ? "rotate-180" : ""}`} />
              </div>
            </button>

            {expanded === entry.id && (
              <div className="border-t border-slate-100 px-5 py-4 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                        {["Code", "Subject Name", "Type", "Credits"].map((h) => (
                          <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {entry.subjects.map((s) => (
                        <tr key={s.code} className="hover:bg-[#FFF5F0]/40 transition-colors">
                          <td className="px-4 py-3"><span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 rounded-md">{s.code}</span></td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{s.name}</td>
                          <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ${typeColors[s.type]}`}>{s.type}</span></td>
                          <td className="px-4 py-3 font-black text-[#8B2500]">{s.credits} Cr</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={3} className="px-4 py-3 text-right text-sm text-slate-700">Total Credits</td>
                        <td className="px-4 py-3 text-[#8B2500] text-base font-black">{entry.totalCredits} Cr</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-3 pt-1">
                  {entry.status === "Draft" && (
                    <button onClick={() => handleApprove(entry.id)} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1.5">
                      <CheckCircle2 size={13} /> Approve Curriculum
                    </button>
                  )}
                  <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition flex items-center gap-1.5">
                    <Download size={13} /> Export PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
