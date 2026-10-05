"use client";

import { useState, useEffect, useCallback } from "react";
import { UserPlus, Search, Upload, Trash2, RefreshCw } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/Badge";
import { getInitials } from "@/lib/utils";
import { api } from "@/lib/api";

const courses = ["All Courses", "CSE", "ECE", "ME", "CE", "EE", "IT"];
const years = ["All Years", "1", "2", "3", "4"];

interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  course?: string;
  department?: string;
  branch?: string;
  year: number;
  section?: string;
  session?: string;
  attendance?: number;
  cgpa?: number;
  status?: string;
  image?: string;
}

const defaultForm = {
  name: "",
  email: "",
  rollNumber: "",
  course: "CSE",
  department: "CSE",
  branch: "CSE",
  year: 1,
  section: "",
  session: "",
  password: "student123",
  image: "",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [year, setYear] = useState("All Years");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);

  // ── Fetch students from API ─────────────────────────────────────
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.director.getStudents({
        department: course !== "All Courses" ? course : undefined,
        year: year !== "All Years" ? year : undefined,
        search: search || undefined,
      });
      setStudents((res.students as Student[]) ?? []);
    } catch (e: any) {
      setError(e.message ?? "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [course, year, search]);

  useEffect(() => {
    const t = setTimeout(fetchStudents, 300); // debounce search
    return () => clearTimeout(t);
  }, [fetchStudents]);

  // ── Add student via API ─────────────────────────────────────────
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.director.createStudent({
        ...formData,
        year: Number(formData.year),
      });
      setSuccessMsg("Student added successfully!");
      setIsModalOpen(false);
      setFormData(defaultForm);
      fetchStudents();
    } catch (e: any) {
      setError(e.message ?? "Failed to add student");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete student via API ──────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this student?")) return;
    try {
      await api.director.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setSuccessMsg("Student removed.");
    } catch (e: any) {
      setError(e.message ?? "Failed to delete student");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-dismiss success message
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Student Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage student records, admissions and academic progress.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStudents}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <Button icon={<UserPlus size={15} />} onClick={() => { setError(null); setIsModalOpen(true); }}>
            Add Student
          </Button>
        </div>
      </div>

      {/* Toast messages */}
      {successMsg && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          ✓ {successMsg}
        </div>
      )}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          ✗ {error}
        </div>
      )}

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total Students", value: students.length, color: "bg-blue-50 text-[#245DA8]" },
          { label: "Active", value: students.filter((s) => s.status === "Active" || !s.status).length, color: "bg-green-50 text-green-700" },
        ].map((c) => (
          <div key={c.label} className={`px-4 py-2 rounded-xl text-sm font-semibold ${c.color}`}>
            {c.label}: <span className="font-bold">{c.value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <Card noPad>
        {/* Filters */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">
          <select value={course} onChange={(e) => setCourse(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#245DA8] bg-white">
            {courses.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#245DA8] bg-white">
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#245DA8] w-56" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["#", "Roll No.", "Name", "Course", "Year", "Branch", "Attendance", "CGPA", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-slate-400 text-sm">Loading students…</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-slate-400 text-sm">No students found.</td>
                </tr>
              ) : (
                students.map((s, i) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3.5 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3.5 text-xs font-mono text-[#245DA8] font-medium">{s.rollNumber}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {s.image ? (
                          <img src={s.image} alt={s.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {getInitials(s.name)}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-slate-800">{s.name}</span>
                          <p className="text-xs text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md">
                        {s.course ?? s.department ?? s.branch ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">Year {s.year}</td>
                    <td className="px-4 py-3.5 text-slate-600">{s.branch ?? s.department ?? "—"}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[60px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${(s.attendance ?? 0) >= 75 ? "bg-green-500" : ((s.attendance ?? 0) === 0 ? "bg-slate-300" : "bg-red-500")}`}
                            style={{ width: `${s.attendance ?? 0}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${(s.attendance ?? 0) >= 75 ? "text-green-600" : ((s.attendance ?? 0) === 0 ? "text-slate-400" : "text-red-500")}`}>
                          {s.attendance ?? 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700">{(s.cgpa ?? 0).toFixed(1)}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={(s.status as "Active" | "Inactive") ?? "Active"} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                          title="Delete student"
                        >
                          <Trash2 size={14} />
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

      {/* Add Student Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Student">
        <form onSubmit={handleAddStudent} className="space-y-4">
          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
          )}
          {/* Profile image upload */}
          <div className="flex justify-center mb-2">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden cursor-pointer group-hover:border-[#245DA8] transition">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload size={18} className="text-slate-400 mb-1" />
                    <span className="text-[10px] text-slate-500">Upload Image</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
              <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#245DA8] focus:outline-none"
                placeholder="e.g. Aman Verma" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
              <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#245DA8] focus:outline-none"
                placeholder="e.g. aman@bit.ac.in" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Roll Number *</label>
              <input required value={formData.rollNumber} onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#245DA8] focus:outline-none"
                placeholder="e.g. BIT2024001" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Course / Department</label>
              <select value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value, department: e.target.value, branch: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#245DA8] focus:outline-none bg-white">
                {["CSE", "ECE", "ME", "CE", "EE", "IT"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Year</label>
              <select value={formData.year} onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#245DA8] focus:outline-none bg-white">
                {[1, 2, 3, 4].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Section</label>
              <input value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#245DA8] focus:outline-none"
                placeholder="e.g. A" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Session</label>
              <input value={formData.session} onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#245DA8] focus:outline-none"
                placeholder="e.g. 2024-28" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <input value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#245DA8] focus:outline-none"
                placeholder="Default: student123" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save Student"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
