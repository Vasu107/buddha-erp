"use client";

import { useState } from "react";
import { BookOpen, Users, Clock, FileText, CheckCircle2, ChevronRight, BarChart3, Search } from "lucide-react";
import Card from "@/components/ui/Card";
import Link from "next/link";

interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  section: string;
  studentsCount: number;
  type: "Theory" | "Practical";
  assignedBy: string;
  syllabusProgress: number;
}

const initialSubjects: Subject[] = [
  { id: "1", code: "CS501", name: "Database Management Systems", department: "Computer Science & Engineering", semester: "Semester 5", section: "Section A", studentsCount: 48, type: "Theory", assignedBy: "Dr. Rajesh Sharma (HOD)", syllabusProgress: 65 },
  { id: "2", code: "CS502", name: "Design & Analysis of Algorithms", department: "Computer Science & Engineering", semester: "Semester 5", section: "Section A", studentsCount: 45, type: "Theory", assignedBy: "Dr. Rajesh Sharma (HOD)", syllabusProgress: 58 },
  { id: "3", code: "CS505", name: "DBMS Laboratory", department: "Computer Science & Engineering", semester: "Semester 5", section: "Batch A1", studentsCount: 24, type: "Practical", assignedBy: "Dr. Rajesh Sharma (HOD)", syllabusProgress: 70 },
  { id: "4", code: "CS701", name: "Cloud Computing & Distributed Systems", department: "Computer Science & Engineering", semester: "Semester 7", section: "Elective 1", studentsCount: 31, type: "Theory", assignedBy: "Dr. Rajesh Sharma (HOD)", syllabusProgress: 40 },
];

export default function FacultySubjectsPage() {
  const [subjects] = useState<Subject[]>(initialSubjects);
  const [search, setSearch] = useState("");

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.section.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Assigned Subjects</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Subjects and lab sessions officially assigned to you by the Head of Department (HOD).
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subject code, title..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
          />
        </div>
      </div>

      {/* ── Subjects Grid Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-[#8B2500]/30 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 bg-[#FFF5F0] text-[#8B2500] font-black text-xs rounded-lg border border-[#8B2500]/15">
                  {s.code}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  s.type === "Theory" ? "bg-orange-50 text-[#8B2500]" : "bg-emerald-50 text-emerald-700"
                }`}>
                  {s.type}
                </span>
              </div>

              {/* Subject Name & Details */}
              <h3 className="text-base font-bold text-slate-800 leading-snug mb-1">
                {s.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">
                {s.department} · {s.semester} ({s.section})
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Syllabus Completion</span>
                  <span className="font-bold text-[#8B2500]">{s.syllabusProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C13A00] to-[#8B2500] rounded-full transition-all"
                    style={{ width: `${s.syllabusProgress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1">
                  <Users size={14} className="text-[#8B2500]" /> {s.studentsCount} Students Enrolled
                </span>
                <span className="text-slate-400">Assigned by: {s.assignedBy}</span>
              </div>
            </div>

            {/* Quick Actions Links */}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100">
              <Link
                href="/faculty/attendance"
                className="py-2 px-1 text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
              >
                Attendance
              </Link>
              <Link
                href="/faculty/resources"
                className="py-2 px-1 text-center bg-orange-50 hover:bg-orange-100 text-[#8B2500] rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
              >
                Materials
              </Link>
              <Link
                href="/faculty/results"
                className="py-2 px-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
              >
                Enter Marks
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
