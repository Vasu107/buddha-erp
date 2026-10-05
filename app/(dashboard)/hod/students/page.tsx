"use client";

import { useState } from "react";
import { GraduationCap, Search, Eye, Mail, Phone } from "lucide-react";

const students = [
  { id: "1", name: "Aman Gupta", rollNumber: "21001", year: 3, section: "A", cgpa: 8.9, email: "aman@bit.edu", phone: "9876543210", status: "Active" },
  { id: "2", name: "Priya Sharma", rollNumber: "21002", year: 3, section: "A", cgpa: 8.7, email: "priya@bit.edu", phone: "9876543211", status: "Active" },
  { id: "3", name: "Rahul Verma", rollNumber: "21003", year: 3, section: "B", cgpa: 8.1, email: "rahul@bit.edu", phone: "9876543212", status: "Active" },
  { id: "4", name: "Sneha Patel", rollNumber: "21004", year: 3, section: "B", cgpa: 9.2, email: "sneha@bit.edu", phone: "9876543213", status: "Active" },
  { id: "5", name: "Vikas Kumar", rollNumber: "21005", year: 2, section: "A", cgpa: 8.4, email: "vikas@bit.edu", phone: "9876543214", status: "Active" },
  { id: "6", name: "Kavita Singh", rollNumber: "21006", year: 2, section: "A", cgpa: 7.9, email: "kavita@bit.edu", phone: "9876543215", status: "Active" },
  { id: "7", name: "Deepak Nair", rollNumber: "21007", year: 1, section: "A", cgpa: 8.0, email: "deepak@bit.edu", phone: "9876543216", status: "Active" },
  { id: "8", name: "Sunita Rao", rollNumber: "21008", year: 1, section: "B", cgpa: 8.6, email: "sunita@bit.edu", phone: "9876543217", status: "Active" },
];

export default function HodStudentsPage() {
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState<number | "all">("all");
  const [filterSection, setFilterSection] = useState<string | "all">("all");

  const filtered = students.filter((s) => {
    const ms = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.includes(search);
    const my = filterYear === "all" || s.year === filterYear;
    const msec = filterSection === "all" || s.section === filterSection;
    return ms && my && msec;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Student Directory</h1>
          <p className="text-slate-500 text-sm mt-0.5">View and manage department students across all years.</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-[#FFF5F0] text-[#8B2500] font-bold text-sm border border-[#8B2500]/15">
          <GraduationCap size={14} className="inline mr-1.5 mb-0.5" />
          {students.length} Total Students
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((year) => {
          const count = students.filter((s) => s.year === year).length;
          return (
            <div key={year} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-black text-[#8B2500]">{count}</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Year {year} Students</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student or roll number..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white" />
        </div>
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value === "all" ? "all" : +e.target.value)}
          className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white">
          <option value="all">All Years</option>
          {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
        </select>
        <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)}
          className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white">
          <option value="all">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["#", "Roll No", "Name", "Year", "Sec", "CGPA", "Email", "Phone", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((s, i) => (
                <tr key={s.id} className="hover:bg-[#FFF5F0]/40 transition-colors">
                  <td className="px-4 py-3.5 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3.5"><span className="px-2 py-1 bg-slate-100 text-slate-700 font-mono text-xs rounded-md">{s.rollNumber}</span></td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">{s.name}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">Year {s.year}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{s.section}</td>
                  <td className="px-4 py-3.5 font-black text-[#8B2500]">{s.cgpa}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{s.email}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{s.phone}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold ring-1 ring-emerald-200">{s.status}</span>
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
