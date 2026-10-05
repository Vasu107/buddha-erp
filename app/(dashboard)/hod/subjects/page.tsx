"use client";

import { useState } from "react";
import { BookOpen, Plus, Search, Edit2, Trash2, CheckCircle2 } from "lucide-react";

interface Subject {
  id: string;
  code: string;
  name: string;
  year: number;
  semester: number;
  credits: number;
  type: "Theory" | "Lab" | "Elective";
  assignedFaculty: string;
}

const initialSubjects: Subject[] = [
  { id: "1", code: "CS501", name: "Database Management Systems", year: 3, semester: 5, credits: 4, type: "Theory", assignedFaculty: "Dr. Anjali Verma" },
  { id: "2", code: "CS502", name: "Design & Analysis of Algorithms", year: 3, semester: 5, credits: 4, type: "Theory", assignedFaculty: "Dr. Anjali Verma" },
  { id: "3", code: "CS503", name: "Operating Systems", year: 3, semester: 5, credits: 4, type: "Theory", assignedFaculty: "Dr. Rajesh Sharma" },
  { id: "4", code: "CS504", name: "Computer Networks", year: 3, semester: 5, credits: 3, type: "Theory", assignedFaculty: "Prof. Suresh Vet" },
  { id: "5", code: "CS505", name: "DBMS Laboratory", year: 3, semester: 5, credits: 2, type: "Lab", assignedFaculty: "Prof. Suresh Vet" },
  { id: "6", code: "CS506", name: "Software Engineering", year: 3, semester: 5, credits: 3, type: "Theory", assignedFaculty: "Dr. Rajesh Sharma" },
];

const typeColors: Record<string, string> = {
  Theory: "bg-blue-50 text-blue-700 ring-blue-200",
  Lab: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Elective: "bg-purple-50 text-purple-700 ring-purple-200",
};

export default function HodSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", year: 3, semester: 5, credits: 3, type: "Theory" as Subject["type"], assignedFaculty: "" });

  const filtered = subjects.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.code || !form.name) return;
    setSubjects((p) => [...p, { id: Date.now().toString(), ...form }]);
    setShowAdd(false);
    setForm({ code: "", name: "", year: 3, semester: 5, credits: 3, type: "Theory", assignedFaculty: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = (id: string) => setSubjects((p) => p.filter((s) => s.id !== id));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Department Subjects</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage subjects assigned to your department.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C13A00] to-[#8B2500] text-white font-bold text-sm shadow-md hover:opacity-90 transition">
          <Plus size={16} /> Add Subject
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" /> Subject list updated!
        </div>
      )}

      {showAdd && (
        <div className="bg-white p-6 rounded-2xl border border-[#8B2500]/20 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800">Add New Subject</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[["Subject Code", "code", "e.g. CS507"], ["Subject Name", "name", "e.g. Compiler Design"], ["Assigned Faculty", "assignedFaculty", "Faculty name"]].map(([label, key, ph]) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
                <input type="text" placeholder={ph} value={(form as any)[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Year</label>
              <select value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: +e.target.value }))} className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white">
                {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Subject["type"] }))} className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white">
                {["Theory", "Lab", "Elective"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="px-5 py-2 rounded-xl bg-[#8B2500] text-white font-bold text-sm hover:bg-[#C13A00] transition">Add Subject</button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subjects..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["Code", "Subject Name", "Year", "Sem", "Credits", "Type", "Faculty", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#FFF5F0]/40 transition-colors">
                  <td className="px-4 py-3.5"><span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 rounded-md">{s.code}</span></td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">{s.name}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">Year {s.year}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">Sem {s.semester}</td>
                  <td className="px-4 py-3.5 font-bold text-[#8B2500]">{s.credits} Cr</td>
                  <td className="px-4 py-3.5"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ${typeColors[s.type]}`}>{s.type}</span></td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{s.assignedFaculty || "—"}</td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"><Trash2 size={14} /></button>
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
