"use client";

import { useState } from "react";
import {
  Award, Trophy, Medal, Download, Search, Filter,
  FileText, TrendingUp
} from "lucide-react";

interface StudentRank {
  rank: number;
  rollNumber: string;
  name: string;
  year: number;
  semester: number;
  dbms: number;
  daa: number;
  os: number;
  cn: number;
  se: number;
  totalMarks: number;
  totalMax: number;
  percentage: number;
  cgpa: number;
  grade: string;
}

const generateStudents = (): StudentRank[] => {
  const raw = [
    { rollNumber: "21004", name: "Sneha Patel", dbms: 58, daa: 55, os: 57, cn: 56, se: 54 },
    { rollNumber: "21001", name: "Aman Gupta", dbms: 54, daa: 57, os: 55, cn: 52, se: 56 },
    { rollNumber: "21002", name: "Priya Sharma", dbms: 58, daa: 50, os: 53, cn: 55, se: 51 },
    { rollNumber: "21006", name: "Kavita Singh", dbms: 50, daa: 48, os: 52, cn: 49, se: 47 },
    { rollNumber: "21005", name: "Vikas Kumar", dbms: 47, daa: 46, os: 48, cn: 45, se: 43 },
    { rollNumber: "21003", name: "Rahul Verma", dbms: 44, daa: 42, os: 45, cn: 40, se: 41 },
  ]
    .map((s) => {
      const total = s.dbms + s.daa + s.os + s.cn + s.se;
      const max = 300;
      const pct = parseFloat(((total / max) * 100).toFixed(2));
      const cgpa = parseFloat(((pct / 10) + 0.5).toFixed(2));
      const grade =
        cgpa >= 9.5 ? "O" :
        cgpa >= 9.0 ? "A+" :
        cgpa >= 8.0 ? "A" :
        cgpa >= 7.0 ? "B+" :
        cgpa >= 6.0 ? "B" : "C";
      return {
        ...s, year: 3, semester: 5,
        totalMarks: total, totalMax: max,
        percentage: pct, cgpa, grade,
        rank: 0,
      };
    })
    .sort((a, b) => b.cgpa - a.cgpa)
    .map((s, i) => ({ ...s, rank: i + 1 }));
  return raw;
};

const students = generateStudents();

const rankIcon = (rank: number) => {
  if (rank === 1) return <Trophy size={16} className="text-yellow-500" />;
  if (rank === 2) return <Medal size={16} className="text-slate-400" />;
  if (rank === 3) return <Medal size={16} className="text-amber-600" />;
  return <span className="text-slate-500 font-bold text-sm">#{rank}</span>;
};

const gradeColor = (g: string) => {
  const map: Record<string, string> = {
    O: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "A+": "bg-blue-50 text-blue-700 ring-blue-200",
    A: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    "B+": "bg-purple-50 text-purple-700 ring-purple-200",
    B: "bg-amber-50 text-amber-700 ring-amber-200",
    C: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return map[g] || "bg-slate-100 text-slate-600 ring-slate-200";
};

export default function HodRanksheetPage() {
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("3");
  const [filterSem, setFilterSem] = useState("5");

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.includes(search)
  );

  const exportCSV = () => {
    const header = "Rank,Roll No,Name,DBMS(60),DAA(60),OS(60),CN(60),SE(60),Total(300),Percentage,CGPA,Grade\n";
    const rows = filtered.map((s) =>
      `${s.rank},${s.rollNumber},${s.name},${s.dbms},${s.daa},${s.os},${s.cn},${s.se},${s.totalMarks},${s.percentage}%,${s.cgpa},${s.grade}`
    ).join("\n");
    const csv = "data:text/csv;charset=utf-8," + header + rows;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `RankSheet_Year${filterYear}_Sem${filterSem}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Rank Sheet</title><style>
      body{font-family:Arial,sans-serif;padding:30px;color:#111}
      h1{color:#8B2500;border-bottom:2px solid #8B2500;padding-bottom:10px}
      table{width:100%;border-collapse:collapse;margin-top:15px;font-size:12px}
      th{background:#8B2500;color:#fff;padding:8px 10px;text-align:left}
      td{padding:8px 10px;border-bottom:1px solid #e5e7eb}
      .rank1{background:#FEF9C3} .rank2{background:#F1F5F9} .rank3{background:#FEF3C7}
    </style></head><body>
      <h1>Rank Sheet — Year ${filterYear}, Semester ${filterSem}</h1>
      <table><thead><tr>
        <th>Rank</th><th>Roll No</th><th>Name</th><th>DBMS</th><th>DAA</th><th>OS</th><th>CN</th><th>SE</th>
        <th>Total</th><th>%</th><th>CGPA</th><th>Grade</th>
      </tr></thead><tbody>
        ${filtered.map((s) => `<tr class="rank${s.rank}">
          <td>${s.rank}</td><td>${s.rollNumber}</td><td><b>${s.name}</b></td>
          <td>${s.dbms}</td><td>${s.daa}</td><td>${s.os}</td><td>${s.cn}</td><td>${s.se}</td>
          <td><b>${s.totalMarks}</b></td><td>${s.percentage}%</td><td><b>${s.cgpa}</b></td><td>${s.grade}</td>
        </tr>`).join("")}
      </tbody></table>
    </body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Rank Sheet & CGPA</h1>
          <p className="text-slate-500 text-sm mt-0.5">Department student rankings based on cumulative performance.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 hover:bg-emerald-100 transition">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF5F0] text-[#8B2500] font-bold text-xs border border-[#8B2500]/20 hover:bg-[#8B2500] hover:text-white transition">
            <FileText size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* Top 3 Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {filtered.slice(0, 3).map((s) => (
          <div
            key={s.rollNumber}
            className={`bg-white rounded-2xl border shadow-sm p-5 text-center flex flex-col items-center gap-2 ${s.rank === 1 ? "border-yellow-300 bg-yellow-50/30" : s.rank === 2 ? "border-slate-200" : "border-amber-200 bg-amber-50/20"}`}
          >
            <div className="text-2xl">{s.rank === 1 ? "🥇" : s.rank === 2 ? "🥈" : "🥉"}</div>
            <p className="font-black text-slate-800 text-base">{s.name}</p>
            <p className="text-xs text-slate-400">{s.rollNumber}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-black text-2xl text-[#8B2500]">{s.cgpa}</span>
              <span className="text-xs text-slate-400">CGPA</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ${gradeColor(s.grade)}`}>{s.grade}</span>
          </div>
        ))}
      </div>

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
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white">
          {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
        </select>
        <select value={filterSem} onChange={(e) => setFilterSem(e.target.value)} className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
        </select>
      </div>

      {/* Full Rank Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["Rank", "Roll No", "Student Name", "DBMS (60)", "DAA (60)", "OS (60)", "CN (60)", "SE (60)", "Total", "%", "CGPA", "Grade"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((s) => (
                <tr
                  key={s.rollNumber}
                  className={`transition-colors ${s.rank === 1 ? "bg-yellow-50/50" : s.rank === 2 ? "bg-slate-50/50" : s.rank === 3 ? "bg-amber-50/40" : "hover:bg-[#FFF5F0]/30"}`}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">{rankIcon(s.rank)}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 font-mono text-xs rounded-md">{s.rollNumber}</span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">{s.name}</td>
                  {[s.dbms, s.daa, s.os, s.cn, s.se].map((m, i) => (
                    <td key={i} className="px-4 py-3.5 font-semibold text-slate-700">{m}</td>
                  ))}
                  <td className="px-4 py-3.5 font-black text-[#8B2500]">{s.totalMarks}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-700">{s.percentage}%</td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 font-black text-[#8B2500] text-base">
                      <TrendingUp size={14} /> {s.cgpa}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ${gradeColor(s.grade)}`}>{s.grade}</span>
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
