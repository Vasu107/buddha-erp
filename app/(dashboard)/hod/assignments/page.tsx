"use client";

import { useState } from "react";
import { ClipboardList, Search, Eye, Clock, CheckCircle2 } from "lucide-react";

const assignments = [
  { id: "1", title: "ER Diagram Design Assignment", subject: "CS501 - DBMS", faculty: "Dr. Anjali Verma", dueDate: "2026-10-10", submissions: 42, total: 60, status: "Active" },
  { id: "2", title: "Sorting Algorithm Analysis Report", subject: "CS502 - DAA", faculty: "Dr. Anjali Verma", dueDate: "2026-10-12", submissions: 38, total: 60, status: "Active" },
  { id: "3", title: "Process Scheduling Simulation", subject: "CS503 - OS", faculty: "Dr. Rajesh Sharma", dueDate: "2026-10-05", submissions: 60, total: 60, status: "Closed" },
  { id: "4", title: "OSI Model Presentation", subject: "CS504 - CN", faculty: "Prof. Suresh Vet", dueDate: "2026-10-15", submissions: 25, total: 60, status: "Active" },
  { id: "5", title: "Software Requirements Document", subject: "CS506 - SE", faculty: "Dr. Rajesh Sharma", dueDate: "2026-10-20", submissions: 10, total: 60, status: "Active" },
];

const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Closed: "bg-slate-100 text-slate-500 ring-slate-200",
  Graded: "bg-blue-50 text-blue-700 ring-blue-200",
};

export default function HodAssignmentsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = assignments.filter(
    (a) =>
      (filterStatus === "all" || a.status === filterStatus) &&
      (a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.subject.toLowerCase().includes(search.toLowerCase()) ||
        a.faculty.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Assignments Oversight</h1>
          <p className="text-slate-500 text-sm mt-0.5">Monitor all assignments created by department faculty.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-200">
            {assignments.filter((a) => a.status === "Active").length} Active
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm border border-slate-200">
            {assignments.filter((a) => a.status === "Closed").length} Closed
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assignments..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white">
          <option value="all">All Status</option>
          <option>Active</option>
          <option>Closed</option>
          <option>Graded</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["Assignment Title", "Subject", "Faculty", "Due Date", "Submissions", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((a) => {
                const submissionPct = Math.round((a.submissions / a.total) * 100);
                return (
                  <tr key={a.id} className="hover:bg-[#FFF5F0]/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-800 max-w-xs">{a.title}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-[#8B2500]">{a.subject}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">{a.faculty}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 flex items-center gap-1.5">
                      <Clock size={12} className="text-slate-400" /> {a.dueDate}
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-700">{a.submissions}/{a.total}</span>
                          <span className="text-slate-400">{submissionPct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                          <div className="h-full bg-[#8B2500] rounded-full" style={{ width: `${submissionPct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ${statusColors[a.status]}`}>{a.status}</span>
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
