"use client";

import { useState } from "react";
import {
  Award, Trophy, Medal, Search, Filter, FileSpreadsheet, FileText,
  Download, ArrowUpRight, CheckCircle2, GraduationCap, Star
} from "lucide-react";
import Card from "@/components/ui/Card";

interface StudentRank {
  rank: number;
  rollNumber: string;
  name: string;
  department: string;
  semester: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  cgpa: number;
  grade: "O" | "A+" | "A" | "B+" | "B";
}

const initialRankings: StudentRank[] = [
  { rank: 1, rollNumber: "21004", name: "Sneha Patel", department: "Computer Science & Engineering", semester: "Semester 5", totalMarks: 582, maxMarks: 600, percentage: 97.0, cgpa: 9.70, grade: "O" },
  { rank: 2, rollNumber: "21002", name: "Priya Sharma", department: "Computer Science & Engineering", semester: "Semester 5", totalMarks: 576, maxMarks: 600, percentage: 96.0, cgpa: 9.60, grade: "O" },
  { rank: 3, rollNumber: "21001", name: "Aman Gupta", department: "Computer Science & Engineering", semester: "Semester 5", totalMarks: 552, maxMarks: 600, percentage: 92.0, cgpa: 9.20, grade: "A+" },
  { rank: 4, rollNumber: "21006", name: "Kavita Singh", department: "Computer Science & Engineering", semester: "Semester 5", totalMarks: 528, maxMarks: 600, percentage: 88.0, cgpa: 8.80, grade: "A+" },
  { rank: 5, rollNumber: "21005", name: "Vikas Kumar", department: "Computer Science & Engineering", semester: "Semester 5", totalMarks: 498, maxMarks: 600, percentage: 83.0, cgpa: 8.30, grade: "A" },
  { rank: 6, rollNumber: "21003", name: "Rahul Verma", department: "Computer Science & Engineering", semester: "Semester 5", totalMarks: 468, maxMarks: 600, percentage: 78.0, cgpa: 7.80, grade: "B+" },
];

const depts = [
  "All Departments",
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
];

const semesters = [
  "All Semesters",
  "Semester 1", "Semester 2", "Semester 3", "Semester 4",
  "Semester 5", "Semester 6", "Semester 7", "Semester 8",
];

export default function RankSheetPage() {
  const [rankings] = useState<StudentRank[]>(initialRankings);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [semFilter, setSemFilter] = useState("All Semesters");

  const filtered = rankings.filter((r) => {
    const q = search.toLowerCase();
    const matchDept = deptFilter === "All Departments" || r.department === deptFilter;
    const matchSem = semFilter === "All Semesters" || r.semester === semFilter;
    const matchQuery =
      r.name.toLowerCase().includes(q) ||
      r.rollNumber.toLowerCase().includes(q);
    return matchDept && matchSem && matchQuery;
  });

  /* ── Export CSV ── */
  const exportToExcelCSV = () => {
    const headers = ["Rank,Roll Number,Student Name,Department,Semester,Total Marks,Max Marks,Percentage,CGPA,Grade\n"];
    const rows = filtered.map(
      (r) =>
        `"${r.rank}","${r.rollNumber}","${r.name}","${r.department}","${r.semester}","${r.totalMarks}","${r.maxMarks}","${r.percentage}%","${r.cgpa}","${r.grade}"`
    );

    const csvContent = "data:text/csv;charset=utf-8," + headers.join("") + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RankSheet_CGPA_${deptFilter.split(" ")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ── Export PDF ── */
  const exportToPDF = () => {
    const printableWindow = window.open("", "_blank");
    if (!printableWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Rank Sheet & CGPA Report</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #111827; }
            .header { border-bottom: 2px solid #8B2500; padding-bottom: 12px; margin-bottom: 20px; }
            .title { font-size: 20px; font-weight: bold; color: #8B2500; margin: 0; }
            .subtitle { font-size: 13px; color: #6b7280; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
            th { background: #8B2500; color: white; text-align: left; padding: 8px 12px; }
            td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
            .rank1 { color: #d97706; font-weight: bold; }
            .cgpa { font-weight: bold; color: #8B2500; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Buddha Institute of Technology — Academic Rank Sheet & CGPA</h1>
            <p class="subtitle">Official Academic Performance Standings & CGPA Merit List</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Department</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>CGPA</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              ${filtered
                .map(
                  (r) => `
                <tr>
                  <td class="${r.rank === 1 ? "rank1" : ""}">#${r.rank}</td>
                  <td>${r.rollNumber}</td>
                  <td>${r.name}</td>
                  <td>${r.department}</td>
                  <td>${r.totalMarks} / ${r.maxMarks}</td>
                  <td>${r.percentage}%</td>
                  <td class="cgpa">${r.cgpa.toFixed(2)} CGPA</td>
                  <td>${r.grade}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printableWindow.document.write(htmlContent);
    printableWindow.document.close();
    printableWindow.print();
  };

  return (
    <div className="space-y-6">

      {/* ── Page Header & Pill Export Action Buttons ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">Student Rank Sheet & CGPA Standing</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 flex items-center gap-1">
              <Trophy size={13} className="text-amber-600" /> Merit Rank Engine
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Academic merit standings calculated automatically based on result marks & CGPA scores.
          </p>
        </div>

        {/* Reference Image Style Pill Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Export Excel / CSV Pill Button */}
          <button
            onClick={exportToExcelCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ECFDF5] hover:bg-emerald-100 text-[#059669] font-bold text-xs border border-[#10B981]/30 transition shadow-xs cursor-pointer"
          >
            <FileSpreadsheet size={15} className="text-[#059669]" />
            <span>Export Excel / CSV</span>
          </button>

          {/* Export PDF Report Pill Button */}
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F4F8] hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition shadow-xs cursor-pointer"
          >
            <FileText size={15} className="text-[#8B2500]" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* ── Top 3 Performers Showcase ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.slice(0, 3).map((r) => (
          <div
            key={r.rollNumber}
            className={`rounded-2xl p-5 border relative overflow-hidden transition-all shadow-sm ${
              r.rank === 1
                ? "bg-gradient-to-br from-amber-50/90 via-white to-amber-100/40 border-amber-300 ring-2 ring-amber-400/20"
                : r.rank === 2
                ? "bg-gradient-to-br from-slate-50/90 via-white to-slate-100/60 border-slate-300"
                : "bg-gradient-to-br from-orange-50/60 via-white to-orange-100/30 border-orange-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                r.rank === 1
                  ? "bg-amber-400 text-slate-900"
                  : r.rank === 2
                  ? "bg-slate-300 text-slate-800"
                  : "bg-amber-600 text-white"
              }`}>
                #{r.rank}
              </span>
              <span className="text-xs font-bold text-[#8B2500] px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">
                {r.cgpa.toFixed(2)} CGPA
              </span>
            </div>

            <h3 className="font-extrabold text-slate-900 text-base mb-0.5">{r.name}</h3>
            <p className="text-xs text-slate-500 font-medium">Roll No: {r.rollNumber} · {r.department.split(" ")[0]}</p>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Total Marks: <strong className="text-slate-800">{r.totalMarks}/{r.maxMarks}</strong></span>
              <span className="font-extrabold text-emerald-700">{r.percentage}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter & Search Bar ── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mr-1">
            <Filter size={14} /> Filter:
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700 shadow-xs font-medium"
          >
            {depts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={semFilter}
            onChange={(e) => setSemFilter(e.target.value)}
            className="px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700 shadow-xs font-medium"
          >
            {semesters.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
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

      {/* ── Complete Rank Sheet Table ── */}
      <Card noPad className="shadow-sm border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["Rank", "Roll No", "Student Name", "Department", "Semester", "Total Marks", "Percentage", "CGPA Score", "Grade"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((r) => (
                <tr key={r.rollNumber} className="hover:bg-[#FFF5F0]/40 transition-colors">
                  
                  {/* Rank Position */}
                  <td className="px-4 py-3.5">
                    {r.rank === 1 ? (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs rounded-lg inline-flex items-center gap-1 shadow-xs">
                        <Trophy size={13} className="text-amber-600" /> Rank #1
                      </span>
                    ) : r.rank === 2 ? (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-lg inline-flex items-center gap-1">
                        <Medal size={13} className="text-slate-500" /> Rank #2
                      </span>
                    ) : r.rank === 3 ? (
                      <span className="px-2.5 py-1 bg-orange-100 text-orange-900 border border-orange-300 font-bold text-xs rounded-lg inline-flex items-center gap-1">
                        <Award size={13} className="text-amber-700" /> Rank #3
                      </span>
                    ) : (
                      <span className="font-bold text-slate-500 text-xs px-2 py-0.5 bg-slate-50 rounded-md">
                        #{r.rank}
                      </span>
                    )}
                  </td>

                  {/* Roll No */}
                  <td className="px-4 py-3.5 font-bold text-slate-700 text-xs">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200 font-mono">
                      {r.rollNumber}
                    </span>
                  </td>

                  {/* Student Name */}
                  <td className="px-4 py-3.5 font-bold text-slate-800">{r.name}</td>

                  {/* Department */}
                  <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                    {r.department}
                  </td>

                  {/* Semester */}
                  <td className="px-4 py-3.5 text-xs text-slate-500 font-medium">
                    {r.semester}
                  </td>

                  {/* Total Marks */}
                  <td className="px-4 py-3.5 font-bold text-slate-800 text-xs">
                    {r.totalMarks} / {r.maxMarks}
                  </td>

                  {/* Percentage */}
                  <td className="px-4 py-3.5 font-bold text-emerald-700 text-xs">
                    {r.percentage.toFixed(1)}%
                  </td>

                  {/* CGPA Score */}
                  <td className="px-4 py-3.5">
                    <span className="px-3 py-1 bg-[#FFF5F0] text-[#8B2500] font-black text-sm rounded-lg border border-[#8B2500]/15 shadow-2xs">
                      {r.cgpa.toFixed(2)} CGPA
                    </span>
                  </td>

                  {/* Grade */}
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                      Grade {r.grade}
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
