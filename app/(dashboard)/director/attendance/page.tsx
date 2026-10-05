"use client";

import { useState, useEffect } from "react";
import {
  Search, Filter, Calendar, Users, AlertTriangle, FileSpreadsheet,
  FileText, CheckCircle2, XCircle, RefreshCw, Loader2, ArrowUpRight, BarChart3
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getInitials } from "@/lib/utils";
import { api } from "@/lib/api";

interface AttendanceRecord {
  id: string;
  date: string;
  timeSlot?: string;
  status: "PRESENT" | "ABSENT";
  branch?: string;
  department?: string;
  section?: string;
  student: {
    id: string;
    name: string;
    rollNumber: string;
    email: string;
    year: number;
    section?: string;
    branch?: string;
    department?: string;
  };
  subject?: {
    code: string;
    name: string;
  };
  faculty?: {
    name: string;
    employeeId: string;
  };
}

interface StudentSummary {
  studentId: string;
  name: string;
  rollNumber: string;
  year: number;
  branch: string | null;
  department: string | null;
  section: string | null;
  total: number;
  present: number;
  absent: number;
  attendancePercent: number;
  isAtRisk: boolean;
}

export default function DirectorAttendancePage() {
  const [activeTab, setActiveTab] = useState<"records" | "summary">("records");
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Data State
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<StudentSummary[]>([]);
  const [totals, setTotals] = useState({
    totalRecords: 0,
    totalPresent: 0,
    totalAbsent: 0,
    studentsAtRisk: 0,
  });

  useEffect(() => {
    fetchDirectorAttendance();
  }, [selectedDept, selectedBranch, selectedSection, selectedYear, selectedDate, selectedStatus]);

  const fetchDirectorAttendance = async () => {
    try {
      setLoading(true);

      const params: any = {};
      if (selectedDept !== "All") params.department = selectedDept;
      if (selectedBranch !== "All") params.branch = selectedBranch;
      if (selectedSection !== "All") params.section = selectedSection;
      if (selectedYear !== "All Years") params.year = selectedYear.replace("Year ", "");
      if (selectedDate) params.date = selectedDate;
      if (selectedStatus !== "All") params.status = selectedStatus;

      // 1. Fetch detailed attendance
      const recordsRes = await api.director.getAttendance(params).catch(() => null);
      if (recordsRes?.attendance) {
        setRecords(recordsRes.attendance);
      } else {
        setRecords([]);
      }

      // 2. Fetch attendance summary stats
      const summaryRes = await api.director.getAttendanceSummary(params).catch(() => null);
      if (summaryRes?.summary) {
        setSummary(summaryRes.summary);
      } else {
        setSummary([]);
      }

      if (summaryRes?.totals) {
        setTotals(summaryRes.totals);
      } else if (recordsRes?.attendance) {
        const recs: AttendanceRecord[] = recordsRes.attendance;
        const present = recs.filter((r) => r.status === "PRESENT").length;
        const absent = recs.filter((r) => r.status === "ABSENT").length;
        setTotals({
          totalRecords: recs.length,
          totalPresent: present,
          totalAbsent: absent,
          studentsAtRisk: 0,
        });
      }
    } catch (err) {
      console.error("Failed to load director attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedDept("All");
    setSelectedBranch("All");
    setSelectedSection("All");
    setSelectedYear("All Years");
    setSelectedDate("");
    setSelectedStatus("All");
    setSearchQuery("");
  };

  // Filtered records in memory by search query
  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.student.name.toLowerCase().includes(q) ||
      r.student.rollNumber.toLowerCase().includes(q) ||
      (r.subject?.name && r.subject.name.toLowerCase().includes(q)) ||
      (r.subject?.code && r.subject.code.toLowerCase().includes(q)) ||
      (r.faculty?.name && r.faculty.name.toLowerCase().includes(q))
    );
  });

  const filteredSummary = summary.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      (s.department && s.department.toLowerCase().includes(q)) ||
      (s.section && s.section.toLowerCase().includes(q))
    );
  });

  /* ── Export CSV ── */
  const exportToCSV = () => {
    let csvContent = "";
    if (activeTab === "records") {
      const headers = ["Roll No,Student Name,Department,Branch,Section,Year,Subject,Faculty,Date,Time Slot,Status\n"];
      const rows = filteredRecords.map(
        (r) =>
          `"${r.student.rollNumber}","${r.student.name}","${r.department || r.student.department || ""}","${r.branch || r.student.branch || ""}","${r.section || r.student.section || ""}","Y${r.student.year}","${r.subject ? `${r.subject.code} - ${r.subject.name}` : ""}","${r.faculty?.name || ""}","${new Date(r.date).toLocaleDateString("en-IN")}","${r.timeSlot || ""}","${r.status}"`
      );
      csvContent = "data:text/csv;charset=utf-8," + headers.join("") + rows.join("\n");
    } else {
      const headers = ["Roll No,Student Name,Department,Branch,Section,Year,Total Sessions,Present,Absent,Attendance %\n"];
      const rows = filteredSummary.map(
        (s) =>
          `"${s.rollNumber}","${s.name}","${s.department || ""}","${s.branch || ""}","${s.section || ""}","Y${s.year}","${s.total}","${s.present}","${s.absent}","${s.attendancePercent}%"`
      );
      csvContent = "data:text/csv;charset=utf-8," + headers.join("") + rows.join("\n");
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Director_Attendance_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ── Export Printable PDF Report ── */
  const exportToPDF = () => {
    const printableWindow = window.open("", "_blank");
    if (!printableWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Director Institutional Attendance Report</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #111827; }
            .header { border-bottom: 3px solid #8B2500; padding-bottom: 12px; margin-bottom: 20px; }
            .title { font-size: 22px; font-weight: bold; color: #8B2500; margin: 0; }
            .subtitle { font-size: 13px; color: #6b7280; margin-top: 4px; }
            .summary-box { background: #FFF5F0; border: 1px solid #8B2500; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; display: flex; justify-content: space-around; font-size: 13px; font-weight: bold; color: #8B2500; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th { background: #8B2500; color: white; text-align: left; padding: 8px 10px; }
            td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
            .present { color: #16a34a; font-weight: bold; }
            .absent { color: #dc2626; font-weight: bold; }
            .at-risk { background-color: #fef2f2; color: #dc2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Buddha Institute of Technology — Director Oversight Attendance Report</h1>
            <p class="subtitle">Filters Applied: Dept: ${selectedDept} | Branch: ${selectedBranch} | Sec: ${selectedSection} | Year: ${selectedYear} | Date: ${selectedDate || "All Dates"}</p>
          </div>
          <div class="summary-box">
            <span>Total Records: ${totals.totalRecords || filteredRecords.length}</span>
            <span>Total Present: ${totals.totalPresent}</span>
            <span>Total Absent: ${totals.totalAbsent}</span>
            <span>At-Risk Students (&lt;75%): ${totals.studentsAtRisk}</span>
          </div>
          <table>
            <thead>
              ${
                activeTab === "records"
                  ? `
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Dept/Branch</th>
                  <th>Sec</th>
                  <th>Subject</th>
                  <th>Faculty</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              `
                  : `
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Dept/Branch</th>
                  <th>Sec</th>
                  <th>Year</th>
                  <th>Total</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Attendance %</th>
                </tr>
              `
              }
            </thead>
            <tbody>
              ${
                activeTab === "records"
                  ? filteredRecords
                      .map(
                        (r) => `
                    <tr>
                      <td>${r.student.rollNumber}</td>
                      <td>${r.student.name}</td>
                      <td>${r.department || r.student.department || r.branch || ""}</td>
                      <td>${r.section || r.student.section || ""}</td>
                      <td>${r.subject ? `${r.subject.code}` : "N/A"}</td>
                      <td>${r.faculty?.name || "N/A"}</td>
                      <td>${new Date(r.date).toLocaleDateString("en-IN")}</td>
                      <td class="${r.status.toLowerCase()}">${r.status}</td>
                    </tr>
                  `
                      )
                      .join("")
                  : filteredSummary
                      .map(
                        (s) => `
                    <tr class="${s.isAtRisk ? "at-risk" : ""}">
                      <td>${s.rollNumber}</td>
                      <td>${s.name}</td>
                      <td>${s.department || s.branch || "N/A"}</td>
                      <td>${s.section || "N/A"}</td>
                      <td>Y${s.year}</td>
                      <td>${s.total}</td>
                      <td class="present">${s.present}</td>
                      <td class="absent">${s.absent}</td>
                      <td><strong>${s.attendancePercent}%</strong> ${s.isAtRisk ? "(At Risk)" : ""}</td>
                    </tr>
                  `
                      )
                      .join("")
              }
            </tbody>
          </table>
        </body>
      </html>
    `;

    printableWindow.document.write(htmlContent);
    printableWindow.document.close();
    printableWindow.print();
  };

  const presentPercentage =
    totals.totalRecords > 0
      ? Math.round((totals.totalPresent / totals.totalRecords) * 100)
      : 0;

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">Director Attendance Oversight</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFF5F0] text-[#8B2500] text-xs font-bold border border-[#8B2500]/20">
              Institutional Scope
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Monitor, filter, and audit student attendance records across all departments, branches, sections, and years.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition shadow-xs"
          >
            <FileSpreadsheet size={15} className="text-emerald-700" />
            Export CSV
          </button>
          
          <button
            onClick={exportToPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition shadow-xs"
          >
            <FileText size={15} className="text-[#8B2500]" />
            Print PDF Report
          </button>
        </div>
      </div>

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Logged Records</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{totals.totalRecords}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <Users size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Present Count</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{totals.totalPresent}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Absent Count</p>
            <p className="text-2xl font-black text-red-600 mt-0.5">{totals.totalAbsent}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <XCircle size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">At-Risk Students (&lt;75%)</p>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{totals.studentsAtRisk}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle size={18} />
          </div>
        </div>
      </div>

      {/* ── Multi-Filter Control Panel ── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#8B2500]" />
            <h3 className="font-bold text-slate-800 text-sm">Attendance Filter Controls</h3>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-[#8B2500] font-semibold flex items-center gap-1 transition"
          >
            <RefreshCw size={13} /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white font-medium text-slate-700"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="EE">EE</option>
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white font-medium text-slate-700"
            >
              <option value="All">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="EE">EE</option>
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white font-medium text-slate-700"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          {/* Academic Year Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white font-medium text-slate-700"
            >
              <option value="All Years">All Years</option>
              <option value="Year 1">Year 1</option>
              <option value="Year 2">Year 2</option>
              <option value="Year 3">Year 3</option>
              <option value="Year 4">Year 4</option>
            </select>
          </div>

          {/* Date Picker Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white font-medium text-slate-700"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── Tab Switcher & Search Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Navigation Tabs */}
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 self-start">
          <button
            onClick={() => setActiveTab("records")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "records"
                ? "bg-[#8B2500] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Session Attendance Records ({filteredRecords.length})
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "summary"
                ? "bg-[#8B2500] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Student Attendance Summaries ({filteredSummary.length})
          </button>
        </div>

        {/* Live Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, roll no, subject, faculty..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white shadow-xs"
          />
        </div>
      </div>

      {/* ── Main Data View ── */}
      <Card noPad className="shadow-sm border-slate-200">
        
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#8B2500]" />
            <p className="text-xs font-semibold">Fetching institutional attendance records from backend...</p>
          </div>
        ) : activeTab === "records" ? (
          
          /* ── 1. SESSION-WISE RECORDS TABLE ── */
          filteredRecords.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs font-semibold">
              No submitted attendance records found matching current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                    {["Roll No", "Student Name", "Dept / Branch", "Sec / Year", "Subject", "Marked By", "Date & Slot", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-[#FFF5F0]/30 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-700 text-xs">
                        <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200 font-mono">
                          {r.student.rollNumber}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-bold text-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-[#8B2500] font-bold text-xs flex items-center justify-center shrink-0">
                            {getInitials(r.student.name)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xs leading-tight">{r.student.name}</p>
                            <p className="text-[10px] text-slate-400">{r.student.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-xs text-slate-600 font-semibold">
                        {r.department || r.student.department || r.branch || r.student.branch || "CSE"}
                      </td>

                      <td className="px-4 py-3 text-xs text-slate-600 font-medium">
                        {r.section || r.student.section || "A"} / Y{r.student.year || 3}
                      </td>

                      <td className="px-4 py-3 text-xs">
                        <span className="font-bold text-[#8B2500]">
                          {r.subject ? `${r.subject.code}` : "CS501"}
                        </span>
                        {r.subject?.name && (
                          <p className="text-[11px] text-slate-500 truncate max-w-[160px]">{r.subject.name}</p>
                        )}
                      </td>

                      <td className="px-4 py-3 text-xs text-slate-600">
                        <p className="font-semibold text-slate-700">{r.faculty?.name || "Faculty"}</p>
                        {r.faculty?.employeeId && (
                          <p className="text-[10px] text-slate-400 font-mono">{r.faculty.employeeId}</p>
                        )}
                      </td>

                      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                        <p className="font-bold text-slate-700">
                          {new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-[10px] text-slate-400">{r.timeSlot || "Lecture 1"}</p>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                          r.status === "PRESENT"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-red-50 text-red-700 ring-1 ring-red-200"
                        }`}>
                          {r.status === "PRESENT" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )

        ) : (

          /* ── 2. STUDENT ATTENDANCE SUMMARY TABLE ── */
          filteredSummary.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs font-semibold">
              No aggregated student attendance summary data available for selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                    {["Roll No", "Student Name", "Dept / Branch", "Year / Sec", "Total Sessions", "Present", "Absent", "Attendance %", "Risk Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredSummary.map((s) => (
                    <tr
                      key={s.studentId}
                      className={`transition-colors ${
                        s.isAtRisk ? "bg-red-50/20 hover:bg-red-50/40" : "hover:bg-[#FFF5F0]/30"
                      }`}
                    >
                      <td className="px-4 py-3.5 font-bold text-slate-700 text-xs">
                        <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200 font-mono">
                          {s.rollNumber}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-bold text-slate-800">{s.name}</td>

                      <td className="px-4 py-3.5 text-xs text-slate-600 font-semibold">
                        {s.department || s.branch || "CSE"}
                      </td>

                      <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                        Y{s.year} / {s.section || "A"}
                      </td>

                      <td className="px-4 py-3.5 font-bold text-slate-700 text-xs">{s.total}</td>

                      <td className="px-4 py-3.5 font-bold text-emerald-600 text-xs">{s.present}</td>

                      <td className="px-4 py-3.5 font-bold text-red-600 text-xs">{s.absent}</td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                s.attendancePercent >= 75 ? "bg-emerald-500" : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(s.attendancePercent, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${
                            s.attendancePercent >= 75 ? "text-emerald-700" : "text-red-700"
                          }`}>
                            {s.attendancePercent}%
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {s.isAtRisk ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1 w-fit">
                            <AlertTriangle size={12} /> At Risk (&lt;75%)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                            <CheckCircle2 size={12} /> Satisfactory
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )

        )}

      </Card>

    </div>
  );
}
