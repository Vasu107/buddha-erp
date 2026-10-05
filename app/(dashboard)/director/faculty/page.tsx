"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UserPlus, Search, Edit2, Trash2, Upload,
  CheckCircle2, Clock, Filter, RefreshCw,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { getInitials } from "@/lib/utils";
import { api } from "@/lib/api";

interface FacultyMember {
  id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  employeeId: string;
  status: string;
  experience: number;
  image: string;
}

const depts = [
  "All Departments",
  "Computer Science & Engineering (CSE)",
  "Electronics & Communication (ECE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Electrical Engineering (EE)",
  "Information Technology (IT)",
];

const desigs = [
  "All Designations",
  "HOD",
  "Professor",
  "Associate Professor",
  "Assistant Professor",
];

const defaultForm = {
  name: "",
  email: "",
  password: "faculty123",
  department: "Computer Science & Engineering (CSE)",
  designation: "Assistant Professor",
  status: "Active",
  experience: 2,
  image: "",
};

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [desigFilter, setDesigFilter] = useState("All Designations");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  // ── Fetch faculty from API ────────────────────────────────────
  const fetchFaculty = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.director.getFaculty({
        department: deptFilter !== "All Departments" ? deptFilter : undefined,
        designation: desigFilter !== "All Designations" ? desigFilter : undefined,
        status: statusFilter !== "All Status" ? statusFilter : undefined,
        search: search || undefined,
      });
      const list = (res as any).faculty ?? (res as any).data ?? [];
      setFaculty(list as FacultyMember[]);
    } catch (e: any) {
      setError(e.message ?? "Failed to load faculty");
    } finally {
      setLoading(false);
    }
  }, [deptFilter, desigFilter, statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(fetchFaculty, 300);
    return () => clearTimeout(t);
  }, [fetchFaculty]);

  // Auto-dismiss messages
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  // ── Open add modal ────────────────────────────────────────────
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setError(null);
    setIsModalOpen(true);
  };

  // ── Open edit modal ───────────────────────────────────────────
  const handleOpenEditModal = (member: FacultyMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      email: member.email,
      password: "",
      department: member.department,
      designation: member.designation,
      status: member.status,
      experience: member.experience,
      image: member.image,
    });
    setError(null);
    setIsModalOpen(true);
  };

  // ── Save (create or update) ───────────────────────────────────
  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        const payload: any = {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          designation: formData.designation,
          status: formData.status,
          experience: Number(formData.experience),
          image: formData.image,
        };
        await api.director.updateFaculty(editingId, payload);
        setSuccessMsg("Faculty member updated successfully!");
      } else {
        await api.director.createFaculty({
          ...formData,
          experience: Number(formData.experience),
        });
        setSuccessMsg("Faculty member added successfully!");
      }
      setIsModalOpen(false);
      fetchFaculty();
    } catch (e: any) {
      setError(e.message ?? "Failed to save faculty member");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle Active/Pending ─────────────────────────────────────
  const toggleStatus = async (member: FacultyMember) => {
    const newStatus = member.status === "Active" ? "Pending" : "Active";
    try {
      await api.director.updateFaculty(member.id, { status: newStatus });
      setFaculty((prev) =>
        prev.map((f) => (f.id === member.id ? { ...f, status: newStatus } : f))
      );
    } catch (e: any) {
      setError(e.message ?? "Failed to update status");
    }
  };

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this faculty member?")) return;
    try {
      await api.director.deleteFaculty(id);
      setFaculty((prev) => prev.filter((f) => f.id !== id));
      setSuccessMsg("Faculty member removed.");
    } catch (e: any) {
      setError(e.message ?? "Failed to delete faculty member");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Faculty Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Approve, manage and assign faculty members across all departments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchFaculty}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <Button
            icon={<UserPlus size={16} />}
            onClick={handleOpenAddModal}
            className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
          >
            Add Faculty Member
          </Button>
        </div>
      </div>

      {/* Toast messages */}
      {successMsg && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          ✓ {successMsg}
        </div>
      )}
      {error && !isModalOpen && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          ✗ {error}
        </div>
      )}

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Faculty</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{faculty.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Approved (Active)</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {faculty.filter((f) => f.status === "Active").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Pending Approval</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {faculty.filter((f) => f.status === "Pending").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Head of Dept (HOD)</p>
          <p className="text-2xl font-black text-[#8B2500] mt-1">
            {faculty.filter((f) => f.designation === "HOD").length}
          </p>
        </div>
      </div>

      {/* ── Faculty Table ── */}
      <Card noPad className="shadow-sm border-slate-200">
        {/* Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between bg-slate-50/50">
          <div className="flex flex-wrap gap-2.5 items-center flex-1">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mr-1">
              <Filter size={14} /> Filter:
            </div>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700 shadow-sm">
              {depts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={desigFilter} onChange={(e) => setDesigFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700 shadow-sm">
              {desigs.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700 shadow-sm">
              <option value="All Status">All Status</option>
              <option value="Active">Active (Approved)</option>
              <option value="Pending">Pending Approval</option>
            </select>
          </div>
          <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/10 bg-white" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["#", "Faculty Member", "Department", "Designation", "Approval Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400 text-sm">Loading faculty…</td></tr>
              ) : faculty.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400 text-sm">No faculty members found.</td></tr>
              ) : (
                faculty.map((f, i) => (
                  <tr key={f.id} className="hover:bg-[#FFF5F0]/40 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400 text-xs font-medium">{i + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {f.image ? (
                          <img src={f.image} alt={f.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 shadow-sm" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C13A00] to-[#8B2500] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                            {getInitials(f.name)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{f.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{f.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 inline-block max-w-xs truncate">
                        {f.department}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {f.designation === "HOD" ? (
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-200">HOD</span>
                      ) : f.designation === "Professor" ? (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">Professor</span>
                      ) : f.designation === "Associate Professor" ? (
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200">Associate Prof.</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-200">Assistant Prof.</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <button type="button" onClick={() => toggleStatus(f)}
                        title="Click to toggle status"
                        className="inline-flex items-center gap-1.5 cursor-pointer group">
                        {f.status === "Active" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold ring-1 ring-emerald-200 hover:bg-emerald-100 transition">
                            <CheckCircle2 size={13} className="text-emerald-600" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold ring-1 ring-amber-200 hover:bg-amber-100 transition">
                            <Clock size={13} className="text-amber-600" /> Pending
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleOpenEditModal(f)}
                          className="p-1.5 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-[#8B2500] transition" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(f.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition" title="Delete">
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

      {/* ── Add / Edit Faculty Modal ── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Faculty Details" : "Add New Faculty Member"}>
        <form onSubmit={handleSaveFaculty} className="space-y-4 pt-1">
          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
          )}

          {/* Profile Image */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer group-hover:border-[#8B2500] transition shadow-inner">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload size={18} className="text-slate-400 mb-1 group-hover:text-[#8B2500] transition" />
                    <span className="text-[10px] font-semibold text-slate-500">Upload Photo</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Optional portrait photo</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Rajesh Kumar"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email *</label>
              <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. rkumar@bit.ac.in"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15" />
            </div>

            {!editingId && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Default: faculty123"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15" />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Department / Branch *</label>
              <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800">
                {depts.filter((d) => d !== "All Departments").map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Designation *</label>
              <select value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800">
                <option value="HOD">HOD</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Approval Status *</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800 font-semibold">
                <option value="Active">Approved (Active)</option>
                <option value="Pending">Pending Approval</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Experience (years)</label>
              <input type="number" min={0} max={50} value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-6">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}
              className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20">
              {submitting ? "Saving…" : (editingId ? "Save Changes" : "Save Faculty")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
