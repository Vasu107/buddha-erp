"use client";

import { useState, useEffect } from "react";
import { Search, TrendingUp, TrendingDown, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

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

const statusConfig = {
  Good: { color: "bg-emerald-50 text-emerald-700 ring-emerald-200", bar: "bg-emerald-500", icon: TrendingUp },
  Warning: { color: "bg-amber-50 text-amber-700 ring-amber-200", bar: "bg-amber-500", icon: AlertTriangle },
  Critical: { color: "bg-red-50 text-red-700 ring-red-200", bar: "bg-red-500", icon: TrendingDown },
};

export default function HodAttendancePage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [filterSection, setFilterSection] = useState("all");

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deptName, setDeptName] = useState("Department");
  const [criticalCount, setCriticalCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);

  useEffect(() => {
    fetchHodAttendance();
  }, [filterStatus, filterYear, filterSection]);

  const fetchHodAttendance = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterStatus !== "all") params.status = filterStatus;
      if (filterYear !== "all") params.year = filterYear.toString();
      if (filterSection !== "all") params.section = filterSection;

      const res = await api.hods.getAttendanceSummary(params).catch(() => null);
      if (res?.summary) {
        setRecords(res.summary);
        if (res.department) setDeptName(res.department);
        if (typeof res.criticalCount === "number") setCriticalCount(res.criticalCount);
        if (typeof res.warningCount === "number") setWarningCount(res.warningCount);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.error("Failed to load HOD attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = records.filter((r) => {
    const ms = r.name.toLowerCase().includes(search.toLowerCase()) || r.rollNumber.toLowerCase().includes(search.toLowerCase());
    return ms;
  });

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">Department Attendance Oversight</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFF5F0] text-[#8B2500] text-xs font-bold border border-[#8B2500]/20">
              {deptName} Department
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Monitor student attendance across all {deptName} subjects and batches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 font-bold text-xs border border-red-200">
            {criticalCount} Critical (&lt;60%)
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
            {warningCount} Warning (60-74%)
          </div>
        </div>
      </div>

      {/* ── Critical Attendance Alert Banner ── */}
      {criticalCount > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-600 shrink-0" />
            ⚠️ {criticalCount} student(s) in {deptName} have critical attendance below 60%. Immediate action required.
          </span>
          <button
            onClick={() => setFilterStatus("Critical")}
            className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[11px] font-bold hover:bg-red-700 transition"
          >
            Filter Critical
          </button>
        </div>
      )}

      {/* ── Filter Bar (Section, Year, Status, Search - Department removed) ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by roll no or name..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
          />
        </div>

        {/* Section Filter */}
        <select
          value={filterSection}
          onChange={(e) => setFilterSection(e.target.value)}
          className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700 font-medium"
        >
          <option value="all">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700 font-medium"
        >
          <option value="all">All Statuses</option>
          <option value="Good">Good (&ge;85%)</option>
          <option value="Warning">Warning (60-84%)</option>
          <option value="Critical">Critical (&lt;60%)</option>
        </select>

        {/* Year Filter */}
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value === "all" ? "all" : +e.target.value)}
          className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700 font-medium"
        >
          <option value="all">All Years</option>
          {[1, 2, 3, 4].map((y) => (
            <option key={y} value={y}>
              Year {y}
            </option>
          ))}
        </select>

        <button
          onClick={fetchHodAttendance}
          className="p-2 text-slate-500 hover:text-[#8B2500] hover:bg-slate-100 rounded-xl transition"
          title="Refresh Data"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#8B2500]" />
              <p className="text-xs font-semibold">Loading department attendance records...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs font-semibold">
              No student attendance records found for current filters.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                  {["Roll No", "Student Name", "Year/Sec", "Subject", "Attendance", "Percentage", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map((r) => {
                  const cfg = statusConfig[r.status] || statusConfig.Good;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr
                      key={r.id}
                      className={`transition-colors ${
                        r.status === "Critical"
                          ? "bg-red-50/30 hover:bg-red-50/50"
                          : r.status === "Warning"
                          ? "bg-amber-50/20 hover:bg-amber-50/40"
                          : "hover:bg-[#FFF5F0]/30"
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 font-mono text-xs rounded-md">
                          {r.rollNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-800">{r.name}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                        Y{r.year} / {r.section || "A"}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-[#8B2500]">
                        {r.subject}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${r.percentage}%` }} />
                          </div>
                          <span className="text-xs text-slate-600 font-semibold">
                            {r.present}/{r.total}
                          </span>
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
          )}
        </div>
      </div>
    </div>
  );
}
