"use client";

import { useState } from "react";
import { Plus, FileText, Search, Filter, Edit2, Trash2, Download, CheckCircle2, Upload, BookOpen } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface Syllabus {
  id: string;
  code: string;
  subject: string;
  department: string;
  semester: string;
  units: number;
  totalHours: number;
  docUrl?: string;
  status: "Active" | "Under Review";
}

const initialSyllabus: Syllabus[] = [
  { id: "1", code: "CS501", subject: "Database Management Systems", department: "Computer Science & Engineering (CSE)", semester: "Semester 5", units: 5, totalHours: 45, status: "Active" },
  { id: "2", code: "CS502", subject: "Design & Analysis of Algorithms", department: "Computer Science & Engineering (CSE)", semester: "Semester 5", units: 5, totalHours: 42, status: "Active" },
  { id: "3", code: "EC301", subject: "Digital Electronics", department: "Electronics & Communication (ECE)", semester: "Semester 3", units: 4, totalHours: 40, status: "Active" },
  { id: "4", code: "ME401", subject: "Thermodynamics", department: "Mechanical Engineering (ME)", semester: "Semester 4", units: 4, totalHours: 38, status: "Under Review" },
  { id: "5", code: "CE503", subject: "Structural Analysis", department: "Civil Engineering (CE)", semester: "Semester 5", units: 5, totalHours: 45, status: "Active" },
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

const semesters = [
  "All Semesters",
  "Semester 1", "Semester 2", "Semester 3", "Semester 4",
  "Semester 5", "Semester 6", "Semester 7", "Semester 8",
];

export default function DirectorSyllabusPage() {
  const [syllabusList, setSyllabusList] = useState<Syllabus[]>(initialSyllabus);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [semFilter, setSemFilter] = useState("All Semesters");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    subject: "",
    department: "Computer Science & Engineering (CSE)",
    semester: "Semester 5",
    units: 5,
    totalHours: 45,
    status: "Active" as Syllabus["status"],
  });

  const filtered = syllabusList.filter((s) => {
    const q = search.toLowerCase();
    const matchDept = deptFilter === "All Departments" || s.department === deptFilter;
    const matchSem = semFilter === "All Semesters" || s.semester === semFilter;
    const matchQuery =
      s.code.toLowerCase().includes(q) ||
      s.subject.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q);
    return matchDept && matchSem && matchQuery;
  });

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      code: "",
      subject: "",
      department: "Computer Science & Engineering (CSE)",
      semester: "Semester 5",
      units: 5,
      totalHours: 45,
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s: Syllabus) => {
    setEditingId(s.id);
    setFormData({
      code: s.code,
      subject: s.subject,
      department: s.department,
      semester: s.semester,
      units: s.units,
      totalHours: s.totalHours,
      status: s.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSyllabusList((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item))
      );
    } else {
      const newSyllabus: Syllabus = {
        id: Date.now().toString(),
        ...formData,
      };
      setSyllabusList([newSyllabus, ...syllabusList]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this syllabus entry?")) {
      setSyllabusList((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Academic Syllabus Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage course syllabi, unit breakdowns, and official teaching hour distributions.
          </p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={handleOpenAddModal}
          className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
        >
          Add New Syllabus
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Syllabi</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{syllabusList.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Approved Active</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {syllabusList.filter((s) => s.status === "Active").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Under Review</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {syllabusList.filter((s) => s.status === "Under Review").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Avg Teaching Hours</p>
          <p className="text-2xl font-black text-[#8B2500] mt-1">42 hrs</p>
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

            <select
              value={semFilter}
              onChange={(e) => setSemFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700 shadow-sm"
            >
              {semesters.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code, subject..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/10 bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["Code", "Subject Title", "Department", "Semester", "Units", "Teaching Hours", "Status", "Actions"].map((h) => (
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
                    No syllabus entries found. Click &quot;Add New Syllabus&quot; to add one.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[#FFF5F0]/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 bg-[#FFF5F0] text-[#8B2500] font-black text-xs rounded-lg border border-[#8B2500]/15">
                        {s.code}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <FileText size={15} className="text-[#8B2500]" />
                        <span>{s.subject}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 inline-block max-w-xs truncate">
                        {s.department}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium text-xs">
                      {s.semester}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      {s.units} Units
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700">
                      {s.totalHours} Hours
                    </td>
                    <td className="px-4 py-3.5">
                      {s.status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold ring-1 ring-emerald-200">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold ring-1 ring-amber-200">
                          Under Review
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => alert(`Downloading official syllabus document for ${s.code}`)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                          title="Download Syllabus PDF"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(s)}
                          className="p-1.5 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-[#8B2500] transition"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
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
        title={editingId ? "Edit Syllabus Details" : "Add New Syllabus"}
      >
        <form onSubmit={handleSaveSyllabus} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Subject Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject Code *
              </label>
              <input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. CS501"
                className="w-full px-3.5 py-2.5 text-sm uppercase font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15"
              />
            </div>

            {/* Total Units */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Modules / Units *
              </label>
              <input
                required
                type="number"
                min={1}
                max={10}
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15"
              />
            </div>

            {/* Subject Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject Name *
              </label>
              <input
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Database Management Systems"
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

            {/* Semester */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Semester *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800"
              >
                {semesters.filter((s) => s !== "All Semesters").map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Total Hours */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teaching Hours *
              </label>
              <input
                required
                type="number"
                min={10}
                max={120}
                value={formData.totalHours}
                onChange={(e) => setFormData({ ...formData, totalHours: parseInt(e.target.value) || 40 })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15"
              />
            </div>

            {/* Status */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Approval Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Syllabus["status"] })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800 font-semibold"
              >
                <option value="Active">Approved & Active</option>
                <option value="Under Review">Under Review</option>
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
              {editingId ? "Save Changes" : "Save Syllabus"}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
