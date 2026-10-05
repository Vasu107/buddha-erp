"use client";

import { useState } from "react";
import { ClipboardCheck, Search, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface AttendanceRecord {
  id: string;
  name: string;
  rollNumber: string;
  year: number;
  section: string;
  subject: string;
  present: number;
  total: number;
  percentage: number;
  status: "Good" | "Warning" | "Critical";
}

const records: AttendanceRecord[] = [
  { id: "1", name: "Aman Gupta", rollNumber: "21001", year: 3, section: "A", subject: "CS501 - DBMS", present: 38, total: 40, percentage: 95, status: "Good" },
  { id: "2", name: "Priya Sharma", rollNumber: "21002", year: 3, section: "A", subject: "CS501 - DBMS", present: 36, total: 40, percentage: 90, status: "Good" },
  { id: "3", name: "Rahul Verma", rollNumber: "21003", year: 3, section: "B", subject: "CS502 - DAA", present: 28, total: 40, percentage: 70, status: "Warning" },
  { id: "4", name: "Sneha Patel", rollNumber: "21004", year: 3, section: "B", subject: "CS502 - DAA", present: 39, total: 40, percentage: 97, status: "Good" },
  { id: "5", name: "Vikas Kumar", rollNumber: "21005", year: 2, section: "A", subject: "CS503 - OS", present: 24, total: 40, percentage: 60, status: "Critical" },
  { id: "6", name: "Kavita Singh", rollNumber: "21006", year: 2, section: "A", subject: "CS503 - OS", present: 32, total: 40, percentage: 80, status: "Good" },
  { id: "7", name: "Deepak Nair", rollNumber: "21007", year: 1, section: "A", subject: "CS504 - CN", present: 22, total: 40, percentage: 55, status: "Critical" },
];

const statusConfig = {
  Good: { color: "bg-emerald-50 text-emerald-700 ring-emerald-200", bar: "bg-emerald-500", icon: TrendingUp },
  Warning: { color: "bg-amber-50 text-amber-700 ring-amber-200", bar: "bg-amber-500", icon: AlertTriangle },
  Critical: { color: "bg-red-50 text-red-700 ring-red-200", bar: "bg-red-500", icon: TrendingDown },
};

export default function HodAttendancePage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterYear, setFilterYear] = useState<number | "all">("all");

  const filtered = records.filter((r) => {
    const ms = r.name.toLowerCase().includes(search.toLowerCase()) || r.rollNumber.includes(search);
    const mst = filterStatus === "all" || r.status === filterStatus;
    const my = filterYear === "all" || r.year === filterYear;
    return ms && mst && my;
  });

  const critical = records.filter((r) => r.status === "Critical").length;
  const warning = records.filter((r) => r.status === "Warning").length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Attendance Oversight</h1>
          <p className="text-slate-500 text-sm mt-0.5">Monitor student attendance across all department subjects.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 font-bold text-xs border border-red-200">{critical} Critical</div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">{warning} Warning</div>
        </div>
      </div>

      {critical > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-600 shrink-0" />
          ⚠️ {critical} student(s) have critical attendance below 60%. Immediate action may be required.
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white">
          <option value="all">All Status</option>
          <option>Good</option>
          <option>Warning</option>
          <option>Critical</option>
        </select>
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value === "all" ? "all" : +e.target.value)}
          className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white">
          <option value="all">All Years</option>
          {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["Roll No", "Student Name", "Year/Sec", "Subject", "Attendance", "Percentage", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((r) => {
                const cfg = statusConfig[r.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr key={r.id} className={`transition-colors ${r.status === "Critical" ? "bg-red-50/30" : r.status === "Warning" ? "bg-amber-50/20" : "hover:bg-[#FFF5F0]/30"}`}>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 font-mono text-xs rounded-md">{r.rollNumber}</span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">{r.name}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">Y{r.year} / {r.section}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-[#8B2500]">{r.subject}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${r.percentage}%` }} />
                        </div>
                        <span className="text-xs text-slate-600 font-semibold">{r.present}/{r.total}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-black text-[#8B2500] text-base">{r.percentage}%</td>
                    <td className="px-4 py-3.5">
                      <span className={`flex items-center gap-1 w-fit px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ${cfg.color}`}>
                        <StatusIcon size={11} /> {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
