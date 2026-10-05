"use client";

import { useState } from "react";
import { Plus, Layers, Search, Filter, Edit2, Trash2, CheckCircle2, Award, Calendar, BookOpen } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface CurriculumPlan {
  id: string;
  schemeName: string;
  department: string;
  academicYear: string;
  totalCredits: number;
  semestersCount: number;
  regulations: string;
  status: "Active" | "Draft" | "Archived";
}

const initialCurriculums: CurriculumPlan[] = [
  { id: "1", schemeName: "B.Tech CSE — CBCS Curriculum 2024-28", department: "Computer Science & Engineering (CSE)", academicYear: "2024-25", totalCredits: 160, semestersCount: 8, regulations: "AKTU / AICTE 2024 Guidelines", status: "Active" },
  { id: "2", schemeName: "B.Tech ECE — Outcome Based Curriculum", department: "Electronics & Communication (ECE)", academicYear: "2024-25", totalCredits: 160, semestersCount: 8, regulations: "AKTU 2024 Scheme", status: "Active" },
  { id: "3", schemeName: "B.Tech ME — Advanced Manufacturing Scheme", department: "Mechanical Engineering (ME)", academicYear: "2024-25", totalCredits: 162, semestersCount: 8, regulations: "AKTU 2023 Scheme", status: "Active" },
  { id: "4", schemeName: "B.Tech CE — Infrastructure & Environmental", department: "Civil Engineering (CE)", academicYear: "2024-25", totalCredits: 158, semestersCount: 8, regulations: "AKTU 2024 Scheme", status: "Draft" },
];

const depts = [
  "All Departments",
  "Computer Science & Engineering (CSE)",
  "Electronics & Communication (ECE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Electrical Engineering (EE)",
  "Information Technology (IT)",
];

export default function DirectorCurriculumPage() {
  const [curriculums, setCurriculums] = useState<CurriculumPlan[]>(initialCurriculums);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    schemeName: "",
    department: "Computer Science & Engineering (CSE)",
    academicYear: "2024-25",
    totalCredits: 160,
    semestersCount: 8,
    regulations: "AKTU / AICTE Guidelines",
    status: "Active" as CurriculumPlan["status"],
  });

  const filtered = curriculums.filter((c) => {
    const q = search.toLowerCase();
    const matchDept = deptFilter === "All Departments" || c.department === deptFilter;
    const matchQuery =
      c.schemeName.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q) ||
      c.regulations.toLowerCase().includes(q);
    return matchDept && matchQuery;
  });

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      schemeName: "",
      department: "Computer Science & Engineering (CSE)",
      academicYear: "2024-25",
      totalCredits: 160,
      semestersCount: 8,
      regulations: "AKTU / AICTE Guidelines",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: CurriculumPlan) => {
    setEditingId(c.id);
    setFormData({
      schemeName: c.schemeName,
      department: c.department,
      academicYear: c.academicYear,
      totalCredits: c.totalCredits,
      semestersCount: c.semestersCount,
      regulations: c.regulations,
      status: c.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveCurriculum = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCurriculums((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item))
      );
    } else {
      const newCurriculum: CurriculumPlan = {
        id: Date.now().toString(),
        ...formData,
      };
      setCurriculums([newCurriculum, ...curriculums]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this curriculum scheme?")) {
      setCurriculums((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Curriculum & Regulations</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Configure program structure, credit requirements, and university regulation schemes.
          </p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={handleOpenAddModal}
          className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
        >
          Add Curriculum Scheme
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Schemes</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{curriculums.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Active Schemes</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {curriculums.filter((c) => c.status === "Active").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Standard Credits</p>
          <p className="text-2xl font-black text-[#8B2500] mt-1">160</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Academic Year</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">2024-25</p>
        </div>
      </div>

      {/* ── Table Card ── */}
      <Card noPad className="shadow-sm border-slate-200">
        
        {/* Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between bg-slate-50/50">
          <div className="flex flex-wrap gap-2.5 items-center flex-1">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mr-1">
              <Filter size={14} /> Filter:
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700 shadow-sm"
            >
              {depts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scheme, regulation..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/10 bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["Scheme Title", "Department", "AY", "Credits", "Semesters", "Regulations", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 text-sm">
                    No curriculum schemes found. Click &quot;Add Curriculum Scheme&quot; to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FFF5F0]/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <Layers size={16} className="text-[#8B2500]" />
                        <span>{c.schemeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 inline-block max-w-xs truncate">
                        {c.department}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700 text-xs">
                      {c.academicYear}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#8B2500]">
                      {c.totalCredits} Cr
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium text-xs">
                      {c.semestersCount} Semesters
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs font-medium">
                      {c.regulations}
                    </td>
                    <td className="px-4 py-3.5">
                      {c.status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold ring-1 ring-emerald-200">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold ring-1 ring-slate-200">
                          {c.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className="p-1.5 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-[#8B2500] transition"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Add / Edit Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Curriculum Scheme" : "Add New Curriculum Scheme"}
      >
        <form onSubmit={handleSaveCurriculum} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Scheme Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Scheme / Program Title *
              </label>
              <input
                required
                value={formData.schemeName}
                onChange={(e) => setFormData({ ...formData, schemeName: e.target.value })}
                placeholder="e.g. B.Tech CSE — CBCS Curriculum 2024-28"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15"
              />
            </div>

            {/* Department */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800"
              >
                {depts.filter((d) => d !== "All Departments").map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academic Year *
              </label>
              <input
                required
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="e.g. 2024-25"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15"
              />
            </div>

            {/* Total Credits */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Required Credits *
              </label>
              <input
                required
                type="number"
                min={100}
                max={240}
                value={formData.totalCredits}
                onChange={(e) => setFormData({ ...formData, totalCredits: parseInt(e.target.value) || 160 })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15"
              />
            </div>

            {/* Regulations */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                University Regulations / AICTE Scheme *
              </label>
              <input
                required
                value={formData.regulations}
                onChange={(e) => setFormData({ ...formData, regulations: e.target.value })}
                placeholder="e.g. AKTU / AICTE 2024 Guidelines"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15"
              />
            </div>

            {/* Status */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Curriculum Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CurriculumPlan["status"] })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800 font-semibold"
              >
                <option value="Active">Active (Approved)</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
            >
              {editingId ? "Save Changes" : "Save Scheme"}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
