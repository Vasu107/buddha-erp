"use client";

import { useState } from "react";
import {
  Check, X, Clock, Search, Calendar, FileSpreadsheet, FileText,
  Download, Save, CheckCircle2, AlertCircle, Filter, RefreshCw
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface StudentAttendance {
  rollNo: string;
  name: string;
  section: string;
  overallPercent: number;
  status: "Present" | "Absent" | "Late";
}

const initialStudents: StudentAttendance[] = [
  { rollNo: "21001", name: "Aman Gupta", section: "Section A", overallPercent: 88, status: "Present" },
  { rollNo: "21002", name: "Priya Sharma", section: "Section A", overallPercent: 92, status: "Present" },
  { rollNo: "21003", name: "Rahul Verma", section: "Section A", overallPercent: 74, status: "Absent" },
  { rollNo: "21004", name: "Sneha Patel", section: "Batch A1", overallPercent: 96, status: "Present" },
  { rollNo: "21005", name: "Vikas Kumar", section: "Section A", overallPercent: 82, status: "Present" },
  { rollNo: "21006", name: "Kavita Singh", section: "Section A", overallPercent: 79, status: "Late" },
  { rollNo: "21007", name: "Rohit Verma", section: "Section A", overallPercent: 90, status: "Present" },
  { rollNo: "21008", name: "Sakshi Rani", section: "Section A", overallPercent: 68, status: "Absent" },
];

export default function FacultyAttendancePage() {
  const [students, setStudents] = useState<StudentAttendance[]>(initialStudents);
  const [selectedSubject, setSelectedSubject] = useState("CS501 - Database Management Systems");
  const [selectedDate, setSelectedDate] = useState("2026-10-02");
  const [selectedSlot, setSelectedSlot] = useState("Lecture 1 (09:30 AM – 10:30 AM)");
  const [search, setSearch] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const setStatus = (rollNo: string, newStatus: "Present" | "Absent" | "Late") => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNo === rollNo ? { ...s, status: newStatus } : s))
    );
    setIsSaved(false);
  };

  const markAll = (status: "Present" | "Absent") => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
    setIsSaved(false);
  };

  const presentCount = students.filter((s) => s.status === "Present").length;
  const absentCount = students.filter((s) => s.status === "Absent").length;
  const lateCount = students.filter((s) => s.status === "Late").length;
  const totalCount = students.length;

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.section.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveAttendance = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  /* ── Export to CSV / Excel ── */
  const exportToExcelCSV = () => {
    const headers = ["Roll Number,Student Name,Section,Subject,Date,Time Slot,Attendance Status,Overall Percentage\n"];
    const rows = students.map(
      (s) =>
        `"${s.rollNo}","${s.name}","${s.section}","${selectedSubject}","${selectedDate}","${selectedSlot}","${s.status}","${s.overallPercent}%"`
    );

    const csvContent = "data:text/csv;charset=utf-8," + headers.join("") + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_${selectedSubject.split(" ")[0]}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ── Export to PDF Report ── */
  const exportToPDF = () => {
    const printableWindow = window.open("", "_blank");
    if (!printableWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance Report - ${selectedSubject}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #111827; }
            .header { border-bottom: 2px solid #8B2500; padding-bottom: 12px; margin-bottom: 20px; }
            .title { font-size: 20px; font-weight: bold; color: #8B2500; margin: 0; }
            .subtitle { font-size: 13px; color: #6b7280; margin-top: 4px; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
            th { background: #8B2500; color: white; text-align: left; padding: 8px 12px; }
            td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
            .present { color: #16a34a; font-weight: bold; }
            .absent { color: #dc2626; font-weight: bold; }
            .late { color: #d97706; font-weight: bold; }
            .summary { margin-top: 20px; font-size: 13px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Buddha Institute of Technology — Attendance Report</h1>
            <p class="subtitle">${selectedSubject} | Date: ${selectedDate} | ${selectedSlot}</p>
          </div>
          <div class="summary">
            Total Students: ${totalCount} | Present: ${presentCount} | Absent: ${absentCount} | Late: ${lateCount}
          </div>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Section</th>
                <th>Status</th>
                <th>Overall %</th>
              </tr>
            </thead>
            <tbody>
              ${students
                .map(
                  (s) => `
                <tr>
                  <td>${s.rollNo}</td>
                  <td>${s.name}</td>
                  <td>${s.section}</td>
                  <td class="${s.status.toLowerCase()}">${s.status}</td>
                  <td>${s.overallPercent}%</td>
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

      {/* ── Page Header & Export Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Date-Wise Attendance Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Mark student attendance session-wise, view history, and export official reports to Excel or PDF.
          </p>
        </div>

        {/* Export Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportToExcelCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition shadow-xs"
            title="Download Excel CSV report"
          >
            <FileSpreadsheet size={15} className="text-emerald-700" />
            Export Excel / CSV
          </button>
          
          <button
            onClick={exportToPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition shadow-xs"
            title="Download/Print PDF Report"
          >
            <FileText size={15} className="text-[#8B2500]" />
            Export PDF Report
          </button>

          <Button
            icon={<Save size={15} />}
            onClick={handleSaveAttendance}
            className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
          >
            Submit Attendance
          </Button>
        </div>
      </div>

      {/* Save Toast Banner */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Attendance for {selectedSubject} on {selectedDate} saved successfully!
          </span>
        </div>
      )}

      {/* ── Summary Stats Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Present</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{presentCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Absent</p>
            <p className="text-2xl font-black text-red-600 mt-0.5">{absentCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            ✕
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Late</p>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{lateCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            ⏱
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Enrolled</p>
            <p className="text-2xl font-black text-[#8B2500] mt-0.5">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FFF5F0] text-[#8B2500] flex items-center justify-center font-bold">
            %
          </div>
        </div>
      </div>

      {/* ── Filters & Date Picker Bar ── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Assigned Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800 font-bold shadow-xs"
            >
              <option value="CS501 - Database Management Systems">CS501 - Database Management Systems</option>
              <option value="CS502 - Design & Analysis of Algorithms">CS502 - Design & Analysis of Algorithms</option>
              <option value="CS505 - DBMS Laboratory">CS505 - DBMS Laboratory</option>
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Attendance Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800 font-bold shadow-xs"
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Time Slot / Session</label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800 font-semibold shadow-xs"
            >
              <option>Lecture 1 (09:30 AM – 10:30 AM)</option>
              <option>Lecture 2 (11:30 AM – 12:30 PM)</option>
              <option>Lab Practical (01:30 PM – 03:30 PM)</option>
            </select>
          </div>
        </div>

        {/* Quick Bulk Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => markAll("Present")}
            className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition shadow-xs"
          >
            ✓ Mark All Present
          </button>
          <button
            onClick={() => markAll("Absent")}
            className="px-3 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition shadow-xs"
          >
            ✕ Mark All Absent
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <Card noPad className="shadow-sm border-slate-200">
        
        {/* Search */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roll no, student name..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
            />
          </div>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            Showing {filtered.length} of {totalCount} Students
          </p>
        </div>

        {/* Interactive Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["#", "Roll No", "Student Name", "Section", "Overall %", "Attendance Status Toggle"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((s, i) => (
                <tr
                  key={s.rollNo}
                  className={`transition-colors ${
                    s.status === "Present"
                      ? "bg-emerald-50/20 hover:bg-emerald-50/40"
                      : s.status === "Absent"
                      ? "bg-red-50/20 hover:bg-red-50/40"
                      : "bg-amber-50/20 hover:bg-amber-50/40"
                  }`}
                >
                  <td className="px-4 py-3.5 text-slate-400 text-xs font-medium">{i + 1}</td>
                  
                  {/* Roll No */}
                  <td className="px-4 py-3.5 font-bold text-slate-700 text-xs">
                    <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200 font-mono">
                      {s.rollNo}
                    </span>
                  </td>

                  {/* Student Name */}
                  <td className="px-4 py-3.5 font-bold text-slate-800">{s.name}</td>

                  {/* Section */}
                  <td className="px-4 py-3.5 text-xs text-slate-500 font-medium">{s.section}</td>

                  {/* Overall Percentage */}
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      s.overallPercent >= 85
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {s.overallPercent}%
                    </span>
                  </td>

                  {/* Interactive Status Toggle Buttons */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      
                      {/* Present Button */}
                      <button
                        type="button"
                        onClick={() => setStatus(s.rollNo, "Present")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          s.status === "Present"
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                            : "bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        <Check size={13} /> Present
                      </button>

                      {/* Absent Button */}
                      <button
                        type="button"
                        onClick={() => setStatus(s.rollNo, "Absent")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          s.status === "Absent"
                            ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                            : "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-700"
                        }`}
                      >
                        <X size={13} /> Absent
                      </button>

                      {/* Late Button */}
                      <button
                        type="button"
                        onClick={() => setStatus(s.rollNo, "Late")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          s.status === "Late"
                            ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                            : "bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                        }`}
                      >
                        <Clock size={13} /> Late
                      </button>

                    </div>
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
