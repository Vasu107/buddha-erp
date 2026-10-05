"use client";

import { useState } from "react";
import { Plus, BookOpen, Search, Filter, Edit2, Trash2, CheckCircle2, Clock, Layers, BookMarked } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  credits: number;
  type: "Core" | "Elective" | "Lab" | "Project";
  status: "Active" | "Inactive";
}

const initialCourses: Course[] = [
  { id: "1", code: "CS501", name: "Database Management Systems", department: "Computer Science & Engineering (CSE)", semester: "Semester 5", credits: 4, type: "Core", status: "Active" },
  { id: "2", code: "CS502", name: "Design & Analysis of Algorithms", department: "Computer Science & Engineering (CSE)", semester: "Semester 5", credits: 4, type: "Core", status: "Active" },
  { id: "3", code: "CS505", name: "DBMS Laboratory", department: "Computer Science & Engineering (CSE)", semester: "Semester 5", credits: 2, type: "Lab", status: "Active" },
  { id: "4", code: "EC301", name: "Digital Electronics", department: "Electronics & Communication (ECE)", semester: "Semester 3", credits: 4, type: "Core", status: "Active" },
  { id: "5", code: "ME401", name: "Thermodynamics", department: "Mechanical Engineering (ME)", semester: "Semester 4", credits: 3, type: "Core", status: "Active" },
  { id: "6", code: "CS701", name: "Cloud Computing & AI", department: "Computer Science & Engineering (CSE)", semester: "Semester 7", credits: 3, type: "Elective", status: "Active" },
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

export default function DirectorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [semFilter, setSemFilter] = useState("All Semesters");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    department: "Computer Science & Engineering (CSE)",
    semester: "Semester 5",
    credits: 4,
    type: "Core" as Course["type"],
    status: "Active" as Course["status"],
  });

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    const matchDept = deptFilter === "All Departments" || c.department === deptFilter;
    const matchSem = semFilter === "All Semesters" || c.semester === semFilter;
    const matchQuery =
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q);
    return matchDept && matchSem && matchQuery;
  });

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      code: "",
      name: "",
      department: "Computer Science & Engineering (CSE)",
      semester: "Semester 5",
      credits: 4,
      type: "Core",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: Course) => {
    setEditingId(c.id);
    setFormData({
      code: c.code,
      name: c.name,
      department: c.department,
      semester: c.semester,
      credits: c.credits,
      type: c.type,
      status: c.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCourses((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item))
      );
    } else {
      const newCourse: Course = {
        id: Date.now().toString(),
        ...formData,
      };
      setCourses([newCourse, ...courses]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Course Curriculum Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Add, configure and approve courses for all academic programs and departments.
          </p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={handleOpenAddModal}
          className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
        >
          Add New Course
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Courses</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{courses.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Core Subjects</p>
          <p className="text-2xl font-black text-[#8B2500] mt-1">
            {courses.filter((c) => c.type === "Core").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Electives & Labs</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {courses.filter((c) => c.type !== "Core").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Active Status</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {courses.filter((c) => c.status === "Active").length}
          </p>
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
              placeholder="Search code, course name..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/10 bg-white"
            />
          </div>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["Code", "Course Name", "Department", "Semester", "Credits", "Type", "Status", "Actions"].map((h) => (
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
                    No courses found. Click &quot;Add New Course&quot; to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FFF5F0]/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 bg-[#FFF5F0] text-[#8B2500] font-black text-xs rounded-lg border border-[#8B2500]/15">
                        {c.code}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      {c.name}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 inline-block max-w-xs truncate">
                        {c.department}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium text-xs">
                      {c.semester}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      {c.credits} Credits
                    </td>
                    <td className="px-4 py-3.5">
                      {c.type === "Core" ? (
                        <span className="px-2.5 py-0.5 bg-orange-50 text-[#8B2500] text-xs font-bold rounded-md border border-orange-200">
                          Core
                        </span>
                      ) : c.type === "Lab" ? (
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-200">
                          Lab
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-md border border-purple-200">
                          {c.type}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold ring-1 ring-emerald-200">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        {c.status}
                      </span>
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

      {/* ── Add / Edit Course Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Course Details" : "Add New Academic Course"}
      >
        <form onSubmit={handleSaveCourse} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Course Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course Code *
              </label>
              <input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. CS501"
                className="w-full px-3.5 py-2.5 text-sm uppercase font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15"
              />
            </div>

            {/* Credits */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academic Credits *
              </label>
              <input
                required
                type="number"
                min={1}
                max={10}
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15"
              />
            </div>

            {/* Course Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course / Subject Title *
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

            {/* Course Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Course["type"] })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800 font-semibold"
              >
                <option value="Core">Core Subject</option>
                <option value="Elective">Elective Subject</option>
                <option value="Lab">Practical Lab</option>
                <option value="Project">Project / Seminar</option>
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
              {editingId ? "Save Changes" : "Save Course"}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
