"use client";

import { useState } from "react";
import { GraduationCap, Search, Filter, Mail, BookOpen, CheckCircle2, ShieldAlert } from "lucide-react";
import Card from "@/components/ui/Card";
import { getInitials } from "@/lib/utils";

interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  subjectCode: string;
  section: string;
  attendancePercent: number;
}

const initialStudents: Student[] = [
  { id: "1", rollNumber: "21001", name: "Aman Gupta", email: "student.cse@bit.ac.in", subjectCode: "CS501 - DBMS", section: "Section A", attendancePercent: 88 },
  { id: "2", rollNumber: "21002", name: "Priya Sharma", email: "psharma@bit.ac.in", subjectCode: "CS501 - DBMS", section: "Section A", attendancePercent: 92 },
  { id: "3", rollNumber: "21003", name: "Rahul Verma", email: "rverma@bit.ac.in", subjectCode: "CS502 - DAA", section: "Section A", attendancePercent: 74 },
  { id: "4", rollNumber: "21004", name: "Sneha Patel", email: "spatel@bit.ac.in", subjectCode: "CS505 - DBMS Lab", section: "Batch A1", attendancePercent: 96 },
  { id: "5", rollNumber: "21005", name: "Vikas Kumar", email: "vkumar@bit.ac.in", subjectCode: "CS501 - DBMS", section: "Section A", attendancePercent: 82 },
];

export default function FacultyStudentsPage() {
  const [students] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Authorized Subjects");

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSub = subjectFilter === "All Authorized Subjects" || s.subjectCode.includes(subjectFilter);
    const matchQuery =
      s.name.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q);
    return matchSub && matchQuery;
  });

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">My Enrolled Students</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Limited Authorized Scope
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Students currently enrolled in your assigned subjects and lab batches.
          </p>
        </div>
      </div>

      {/* ── Table Card ── */}
      <Card noPad className="shadow-sm border-slate-200">
        
        {/* Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700 shadow-sm"
            >
              <option value="All Authorized Subjects">All Authorized Subjects</option>
              <option value="CS501">CS501 - Database Management Systems</option>
              <option value="CS502">CS502 - Design & Analysis of Algorithms</option>
              <option value="CS505">CS505 - DBMS Laboratory</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roll no, student name..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["Roll No", "Student Name", "Authorized Subject", "Section", "Attendance %"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#FFF5F0]/40 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-700 text-xs">
                    <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200">
                      {s.rollNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C13A00] to-[#8B2500] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {getInitials(s.name)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 bg-[#FFF5F0] text-[#8B2500] font-bold text-xs rounded-lg border border-[#8B2500]/15">
                      {s.subjectCode}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                    {s.section}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      s.attendancePercent >= 85
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                    }`}>
                      {s.attendancePercent}% Attendance
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
