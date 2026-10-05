"use client";

import { useState } from "react";
import {
  FileText, Plus, Search, Edit2, Trash2, CheckCircle2, BookOpen,
  ChevronDown, Download, Eye
} from "lucide-react";

interface SyllabusUnit {
  unit: number;
  title: string;
  topics: string;
  hours: number;
}

interface SyllabusEntry {
  id: string;
  subjectCode: string;
  subjectName: string;
  year: number;
  semester: number;
  credits: number;
  units: SyllabusUnit[];
  lastUpdated: string;
  status: "Draft" | "Published";
}

const initialSyllabus: SyllabusEntry[] = [
  {
    id: "1",
    subjectCode: "CS501",
    subjectName: "Database Management Systems",
    year: 3,
    semester: 5,
    credits: 4,
    units: [
      { unit: 1, title: "Introduction to Databases", topics: "DBMS concepts, ER Model, Schema", hours: 8 },
      { unit: 2, title: "Relational Model & SQL", topics: "Relational algebra, SQL DDL/DML, joins", hours: 10 },
      { unit: 3, title: "Normalization", topics: "1NF, 2NF, 3NF, BCNF, 4NF", hours: 8 },
      { unit: 4, title: "Transaction Management", topics: "ACID properties, concurrency control, locking", hours: 8 },
      { unit: 5, title: "Storage & Indexing", topics: "File structures, B-trees, hashing", hours: 6 },
    ],
    lastUpdated: "2026-08-15",
    status: "Published",
  },
  {
    id: "2",
    subjectCode: "CS502",
    subjectName: "Design & Analysis of Algorithms",
    year: 3,
    semester: 5,
    credits: 4,
    units: [
      { unit: 1, title: "Introduction", topics: "Algorithm complexity, Big-O notation, sorting", hours: 8 },
      { unit: 2, title: "Divide & Conquer", topics: "Merge sort, Quick sort, Binary search", hours: 8 },
      { unit: 3, title: "Greedy Algorithms", topics: "Dijkstra, Prim, Kruskal, Huffman coding", hours: 8 },
      { unit: 4, title: "Dynamic Programming", topics: "Memoization, Knapsack, LCS, Matrix chain", hours: 10 },
      { unit: 5, title: "NP-Completeness", topics: "P vs NP, NP-hard, Reductions", hours: 6 },
    ],
    lastUpdated: "2026-08-10",
    status: "Published",
  },
];

export default function HodSyllabusPage() {
  const [syllabus, setSyllabus] = useState<SyllabusEntry[]>(initialSyllabus);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>("1");
  const [showAdd, setShowAdd] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSubject, setNewSubject] = useState({
    subjectCode: "",
    subjectName: "",
    year: 3,
    semester: 5,
    credits: 4,
  });

  const filtered = syllabus.filter(
    (s) =>
      s.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      s.subjectCode.toLowerCase().includes(search.toLowerCase())
  );

  const handlePublish = (id: string) => {
    setSyllabus((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Published" } : s))
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAdd = () => {
    if (!newSubject.subjectCode || !newSubject.subjectName) return;
    const entry: SyllabusEntry = {
      id: Date.now().toString(),
      ...newSubject,
      units: [
        { unit: 1, title: "Unit 1", topics: "Topics to be filled", hours: 8 },
        { unit: 2, title: "Unit 2", topics: "Topics to be filled", hours: 8 },
        { unit: 3, title: "Unit 3", topics: "Topics to be filled", hours: 8 },
        { unit: 4, title: "Unit 4", topics: "Topics to be filled", hours: 8 },
        { unit: 5, title: "Unit 5", topics: "Topics to be filled", hours: 8 },
      ],
      lastUpdated: new Date().toISOString().split("T")[0],
      status: "Draft",
    };
    setSyllabus((prev) => [...prev, entry]);
    setShowAdd(false);
    setNewSubject({ subjectCode: "", subjectName: "", year: 3, semester: 5, credits: 4 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Master Syllabus Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Create, update, and publish department subject syllabi.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C13A00] to-[#8B2500] text-white font-bold text-sm shadow-md hover:opacity-90 transition"
        >
          <Plus size={16} /> Add Subject Syllabus
        </button>
      </div>

      {/* Save Toast */}
      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" /> Syllabus published successfully!
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white p-6 rounded-2xl border border-[#8B2500]/20 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Add New Subject Syllabus</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Subject Code", key: "subjectCode", type: "text", placeholder: "e.g. CS503" },
              { label: "Subject Name", key: "subjectName", type: "text", placeholder: "e.g. Computer Networks" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={(newSubject as any)[key]}
                  onChange={(e) => setNewSubject((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Year</label>
              <select
                value={newSubject.year}
                onChange={(e) => setNewSubject((p) => ({ ...p, year: parseInt(e.target.value) }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
              >
                {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Semester</label>
              <select
                value={newSubject.semester}
                onChange={(e) => setNewSubject((p) => ({ ...p, semester: parseInt(e.target.value) }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Credits</label>
              <select
                value={newSubject.credits}
                onChange={(e) => setNewSubject((p) => ({ ...p, credits: parseInt(e.target.value) }))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
              >
                {[1, 2, 3, 4, 5].map((c) => <option key={c} value={c}>{c} Credits</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="px-5 py-2 rounded-xl bg-[#8B2500] text-white font-bold text-sm hover:bg-[#C13A00] transition">
              Create Syllabus
            </button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by subject name or code..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
        />
      </div>

      {/* Syllabus Accordion */}
      <div className="space-y-3">
        {filtered.map((entry) => (
          <div key={entry.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C13A00] to-[#8B2500] flex items-center justify-center shadow">
                  <BookOpen size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800">{entry.subjectCode} — {entry.subjectName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Year {entry.year} | Sem {entry.semester} | {entry.credits} Credits | Last updated: {entry.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ${entry.status === "Published" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-amber-200"}`}>
                  {entry.status}
                </span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${expanded === entry.id ? "rotate-180" : ""}`} />
              </div>
            </button>

            {expanded === entry.id && (
              <div className="border-t border-slate-100 px-5 py-4 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                        {["Unit", "Title", "Topics Covered", "Hours"].map((h) => (
                          <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {entry.units.map((unit) => (
                        <tr key={unit.unit} className="hover:bg-[#FFF5F0]/40 transition-colors">
                          <td className="px-4 py-3.5">
                            <span className="px-2.5 py-1 bg-[#FFF5F0] text-[#8B2500] font-bold text-xs rounded-lg">{unit.unit}</span>
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-800">{unit.title}</td>
                          <td className="px-4 py-3.5 text-slate-500 text-xs max-w-xs">{unit.topics}</td>
                          <td className="px-4 py-3.5 font-bold text-[#8B2500]">{unit.hours} hrs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-3 pt-2">
                  {entry.status === "Draft" && (
                    <button onClick={() => handlePublish(entry.id)} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1.5">
                      <CheckCircle2 size={13} /> Publish Syllabus
                    </button>
                  )}
                  <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition flex items-center gap-1.5">
                    <Edit2 size={13} /> Edit Units
                  </button>
                  <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition flex items-center gap-1.5">
                    <Download size={13} /> Export PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
