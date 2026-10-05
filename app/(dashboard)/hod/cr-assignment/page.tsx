"use client";

import { useState } from "react";
import {
  Award, Search, CheckCircle2, X, User, BookOpen, GraduationCap
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  year: number;
  section: string;
  cgpa: number;
  isCR: boolean;
}

const initialStudents: Student[] = [
  { id: "1", name: "Aman Gupta", rollNumber: "21001", year: 3, section: "A", cgpa: 8.9, isCR: true },
  { id: "2", name: "Priya Sharma", rollNumber: "21002", year: 3, section: "A", cgpa: 8.7, isCR: false },
  { id: "3", name: "Rahul Verma", rollNumber: "21003", year: 3, section: "B", cgpa: 8.1, isCR: true },
  { id: "4", name: "Sneha Patel", rollNumber: "21004", year: 3, section: "B", cgpa: 9.2, isCR: false },
  { id: "5", name: "Vikas Kumar", rollNumber: "21005", year: 2, section: "A", cgpa: 8.4, isCR: false },
  { id: "6", name: "Kavita Singh", rollNumber: "21006", year: 2, section: "A", cgpa: 7.9, isCR: true },
  { id: "7", name: "Deepak Nair", rollNumber: "21007", year: 1, section: "A", cgpa: 8.0, isCR: false },
  { id: "8", name: "Sunita Rao", rollNumber: "21008", year: 1, section: "B", cgpa: 8.6, isCR: true },
];

export default function HodCRAssignmentPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [filterSection, setFilterSection] = useState<string | "all">("all");
  const [saved, setSaved] = useState(false);

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.includes(search);
    const matchYear = filterYear === "all" || s.year === filterYear;
    const matchSection = filterSection === "all" || s.section === filterSection;
    return matchSearch && matchYear && matchSection;
  });

  const toggleCR = (id: string) => {
    const student = students.find((s) => s.id === id)!;
    // Only one CR per year + section
    setStudents((prev) =>
      prev.map((s) => {
        if (s.year === student.year && s.section === student.section && s.id !== id) {
          return { ...s, isCR: false };
        }
        if (s.id === id) return { ...s, isCR: !s.isCR };
        return s;
      })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const crList = students.filter((s) => s.isCR);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">CR Assignment</h1>
          <p className="text-slate-500 text-sm mt-0.5">Assign Class Representatives for each class section.</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-[#FFF5F0] text-[#8B2500] font-bold text-sm border border-[#8B2500]/15">
          <Award size={14} className="inline mr-1.5 mb-0.5" />
          {crList.length} CRs Assigned
        </div>
      </div>

      {/* Toast */}
      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" /> CR assignment updated successfully!
        </div>
      )}

      {/* Current CRs */}
      {crList.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <Award size={16} className="text-[#8B2500]" /> Current Class Representatives
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {crList.map((cr) => (
              <div key={cr.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#FFF5F0] border border-[#8B2500]/15">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C13A00] to-[#8B2500] flex items-center justify-center text-white font-bold text-xs shadow shrink-0">
                  {cr.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">{cr.name}</p>
                  <p className="text-[10px] text-slate-500">Year {cr.year} — Sec {cr.section}</p>
                </div>
                <span className="ml-auto text-[10px] font-bold text-[#8B2500]">CR</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
          />
        </div>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value === "all" ? "all" : parseInt(e.target.value))}
          className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
        >
          <option value="all">All Years</option>
          {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
        </select>
        <select
          value={filterSection}
          onChange={(e) => setFilterSection(e.target.value)}
          className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
        >
          <option value="all">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
        </select>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["#", "Roll No", "Student Name", "Year", "Section", "CGPA", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((s, i) => (
                <tr key={s.id} className="hover:bg-[#FFF5F0]/40 transition-colors">
                  <td className="px-4 py-3.5 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 font-mono text-xs rounded-md">{s.rollNumber}</span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">{s.name}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">Year {s.year}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">Sec {s.section}</td>
                  <td className="px-4 py-3.5 font-bold text-[#8B2500]">{s.cgpa}</td>
                  <td className="px-4 py-3.5">
                    {s.isCR ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold ring-1 ring-amber-200">
                        Class Representative
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
                        Student
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleCR(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${s.isCR
                        ? "bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-red-200"
                        : "bg-[#FFF5F0] text-[#8B2500] hover:bg-[#8B2500] hover:text-white ring-1 ring-[#8B2500]/20"}`}
                    >
                      {s.isCR ? "Remove CR" : "Assign CR"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
