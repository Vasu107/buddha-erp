"use client";

import { useState } from "react";
import { RefreshCcw, Plus, CheckCircle2, Edit2, Trash2 } from "lucide-react";

interface AcademicYear {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  semester: string;
  status: "Active" | "Upcoming" | "Completed";
}

const initial: AcademicYear[] = [
  { id: "1", label: "2026-27", startDate: "2026-07-15", endDate: "2027-05-30", semester: "Odd Semester (5th)", status: "Active" },
  { id: "2", label: "2025-26", startDate: "2025-07-10", endDate: "2026-05-25", semester: "Even Semester (6th)", status: "Completed" },
  { id: "3", label: "2026-27", startDate: "2027-01-10", endDate: "2027-05-30", semester: "Even Semester (6th)", status: "Upcoming" },
];

const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Upcoming: "bg-blue-50 text-blue-700 ring-blue-200",
  Completed: "bg-slate-100 text-slate-500 ring-slate-200",
};

export default function HodAcademicYearPage() {
  const [years, setYears] = useState<AcademicYear[]>(initial);
  const [saved, setSaved] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ label: "", startDate: "", endDate: "", semester: "", status: "Upcoming" as AcademicYear["status"] });

  const handleAdd = () => {
    if (!form.label || !form.startDate) return;
    setYears((p) => [...p, { id: Date.now().toString(), ...form }]);
    setShowAdd(false);
    setForm({ label: "", startDate: "", endDate: "", semester: "", status: "Upcoming" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = (id: string) => setYears((p) => p.filter((y) => y.id !== id));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Academic Year Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track and manage department academic year and semester schedules.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C13A00] to-[#8B2500] text-white font-bold text-sm shadow-md hover:opacity-90 transition">
          <Plus size={16} /> Add Academic Year
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" /> Academic year saved!
        </div>
      )}

      {showAdd && (
        <div className="bg-white p-6 rounded-2xl border border-[#8B2500]/20 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800">Add New Academic Year</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Year Label (e.g. 2027-28)</label>
              <input type="text" placeholder="2027-28" value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Semester</label>
              <input type="text" placeholder="Odd Semester (5th)" value={form.semester} onChange={(e) => setForm((p) => ({ ...p, semester: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as AcademicYear["status"] }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white">
                <option>Upcoming</option>
                <option>Active</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="px-5 py-2 rounded-xl bg-[#8B2500] text-white font-bold text-sm hover:bg-[#C13A00] transition">Save</button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {years.map((y) => (
          <div key={y.id} className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center justify-between gap-4 ${y.status === "Active" ? "border-emerald-200" : "border-slate-100"}`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${y.status === "Active" ? "bg-emerald-100" : y.status === "Upcoming" ? "bg-blue-100" : "bg-slate-100"}`}>
                <RefreshCcw size={18} className={y.status === "Active" ? "text-emerald-600" : y.status === "Upcoming" ? "text-blue-600" : "text-slate-400"} />
              </div>
              <div>
                <p className="font-black text-slate-800 text-base">Academic Year {y.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{y.semester} &nbsp;·&nbsp; {y.startDate} — {y.endDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${statusColors[y.status]}`}>{y.status}</span>
              <button onClick={() => handleDelete(y.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
