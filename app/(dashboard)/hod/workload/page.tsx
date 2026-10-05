"use client";

import { useState } from "react";
import {
  UserCog, Search, ChevronDown, Plus, BookOpen, BarChart3,
  CheckCircle2, Trash2, User
} from "lucide-react";

interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  employeeId: string;
  subjects: string[];
  weeklyHours: number;
  maxHours: number;
}

const initialFaculty: FacultyMember[] = [
  {
    id: "1",
    name: "Dr. Anjali Verma",
    designation: "Assistant Professor",
    employeeId: "FAC001",
    subjects: ["CS501 - DBMS", "CS502 - DAA"],
    weeklyHours: 14,
    maxHours: 18,
  },
  {
    id: "2",
    name: "Dr. Rajesh Sharma",
    designation: "Professor",
    employeeId: "FAC002",
    subjects: ["CS503 - OS", "CS506 - SE"],
    weeklyHours: 10,
    maxHours: 16,
  },
  {
    id: "3",
    name: "Prof. Suresh Vet",
    designation: "Associate Professor",
    employeeId: "FAC003",
    subjects: ["CS501 - DBMS", "CS504 - CN", "CS507 - DC"],
    weeklyHours: 15,
    maxHours: 18,
  },
  {
    id: "4",
    name: "Dr. Vikram Kumar",
    designation: "Assistant Professor",
    employeeId: "FAC004",
    subjects: ["CS502 - DAA"],
    weeklyHours: 6,
    maxHours: 18,
  },
];

const allSubjects = [
  "CS501 - DBMS",
  "CS502 - DAA",
  "CS503 - OS",
  "CS504 - CN",
  "CS505 - DBMS Lab",
  "CS506 - SE",
  "CS507 - DC",
  "CS508 - Compiler Design",
];

export default function HodFacultyWorkloadPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>(initialFaculty);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const filtered = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const assignSubject = (facultyId: string, subject: string) => {
    setFaculty((prev) =>
      prev.map((f) => {
        if (f.id !== facultyId || f.subjects.includes(subject)) return f;
        const hrs = f.weeklyHours + 4;
        return { ...f, subjects: [...f.subjects, subject], weeklyHours: hrs };
      })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const removeSubject = (facultyId: string, subject: string) => {
    setFaculty((prev) =>
      prev.map((f) => {
        if (f.id !== facultyId) return f;
        const hrs = Math.max(0, f.weeklyHours - 4);
        return { ...f, subjects: f.subjects.filter((s) => s !== subject), weeklyHours: hrs };
      })
    );
  };

  const workloadPercent = (f: FacultyMember) =>
    Math.min(100, Math.round((f.weeklyHours / f.maxHours) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Faculty Workload Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Assign and manage subject workload for department faculty.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#FFF5F0] text-[#8B2500] font-bold text-sm border border-[#8B2500]/15">
            <BarChart3 size={14} className="inline mr-1.5 mb-0.5" />
            {faculty.length} Faculty | {faculty.reduce((s, f) => s + f.subjects.length, 0)} Assignments
          </div>
        </div>
      </div>

      {/* Save Toast */}
      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" /> Workload assignment updated!
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search faculty by name or employee ID..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
        />
      </div>

      {/* Faculty Cards */}
      <div className="space-y-4">
        {filtered.map((f) => {
          const pct = workloadPercent(f);
          const overloaded = pct > 85;
          const unassigned = allSubjects.filter((s) => !f.subjects.includes(s));

          return (
            <div key={f.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === f.id ? null : f.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C13A00] to-[#8B2500] flex items-center justify-center text-white font-bold text-sm shadow">
                    {f.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800">{f.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{f.designation} · {f.employeeId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Workload Bar */}
                  <div className="hidden sm:block w-36">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className={overloaded ? "text-red-600" : "text-slate-600"}>
                        {f.weeklyHours} / {f.maxHours} hrs
                      </span>
                      <span className={overloaded ? "text-red-500" : "text-emerald-600"}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${overloaded ? "bg-red-500" : "bg-emerald-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ${f.subjects.length === 0 ? "bg-slate-100 text-slate-500 ring-slate-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200"}`}>
                    {f.subjects.length} Subjects
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${expanded === f.id ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {expanded === f.id && (
                <div className="border-t border-slate-100 p-5 space-y-4">
                  {/* Assigned Subjects */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Subjects</p>
                    <div className="flex flex-wrap gap-2">
                      {f.subjects.length > 0 ? f.subjects.map((s) => (
                        <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF5F0] text-[#8B2500] text-xs font-bold rounded-xl ring-1 ring-[#8B2500]/15">
                          <BookOpen size={11} />
                          {s}
                          <button onClick={() => removeSubject(f.id, s)} className="ml-1 hover:text-red-600 transition">
                            <Trash2 size={11} />
                          </button>
                        </span>
                      )) : (
                        <span className="text-xs text-slate-400">No subjects assigned yet.</span>
                      )}
                    </div>
                  </div>

                  {/* Assign New Subject */}
                  {unassigned.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assign Additional Subject</p>
                      <div className="flex flex-wrap gap-2">
                        {unassigned.map((s) => (
                          <button
                            key={s}
                            onClick={() => assignSubject(f.id, s)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 text-slate-500 text-xs font-semibold rounded-xl hover:border-[#8B2500]/40 hover:text-[#8B2500] hover:bg-[#FFF5F0]/50 transition"
                          >
                            <Plus size={11} /> {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {overloaded && (
                    <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 font-bold">
                      ⚠️ Faculty workload exceeds 85% — consider redistributing subjects.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
