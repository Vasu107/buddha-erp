"use client";

import { useState } from "react";
import { Users, Plus, Search, BookOpen, Trash2, Edit2, CheckCircle2, UserCheck, ShieldCheck } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface FacultyAssignment {
  id: string;
  facultyName: string;
  email: string;
  designation: string;
  assignedSubject: string;
  section: string;
  hoursPerWeek: number;
}

const initialAssignments: FacultyAssignment[] = [
  { id: "1", facultyName: "Dr. Anjali Verma", email: "faculty.cse@bit.ac.in", designation: "Assistant Professor", assignedSubject: "CS501 - Database Management Systems", section: "Section A", hoursPerWeek: 4 },
  { id: "2", facultyName: "Dr. Anjali Verma", email: "faculty.cse@bit.ac.in", designation: "Assistant Professor", assignedSubject: "CS505 - DBMS Laboratory", section: "Batch A1", hoursPerWeek: 2 },
  { id: "3", facultyName: "Prof. Suresh Vet", email: "svet@bit.ac.in", designation: "Associate Professor", assignedSubject: "CS502 - Design & Analysis of Algorithms", section: "Section A", hoursPerWeek: 4 },
  { id: "4", facultyName: "Dr. Vikram Kumar", email: "vkumar@bit.ac.in", designation: "Assistant Professor", assignedSubject: "CS701 - Cloud Computing", section: "Elective 1", hoursPerWeek: 3 },
];

export default function HodFacultyPage() {
  const [assignments, setAssignments] = useState<FacultyAssignment[]>(initialAssignments);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    facultyName: "Dr. Anjali Verma",
    email: "faculty.cse@bit.ac.in",
    designation: "Assistant Professor",
    assignedSubject: "CS501 - Database Management Systems",
    section: "Section A",
    hoursPerWeek: 4,
  });

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    const newAss: FacultyAssignment = {
      id: Date.now().toString(),
      ...formData,
    };
    setAssignments([newAss, ...assignments]);
    setIsModalOpen(false);
  };

  const handleRemove = (id: string) => {
    if (confirm("Remove subject assignment from this faculty member?")) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filtered = assignments.filter(
    (a) =>
      a.facultyName.toLowerCase().includes(search.toLowerCase()) ||
      a.assignedSubject.toLowerCase().includes(search.toLowerCase()) ||
      a.section.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Department Faculty & Subject Allocation</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Assign and manage subject teaching responsibilities for department faculty members.
          </p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
          className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
        >
          Assign Subject to Faculty
        </Button>
      </div>

      {/* ── Table Card ── */}
      <Card noPad className="shadow-sm border-slate-200">
        
        {/* Search */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty, subject..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["Faculty Member", "Designation", "Assigned Department Subject", "Section", "Weekly Hours", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-[#FFF5F0]/40 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-800">
                    <div>
                      <p className="font-bold text-slate-800">{a.facultyName}</p>
                      <p className="text-xs text-slate-400">{a.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">{a.designation}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 bg-[#FFF5F0] text-[#8B2500] font-bold text-xs rounded-lg border border-[#8B2500]/15">
                      {a.assignedSubject}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-700 font-medium">{a.section}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-800">{a.hoursPerWeek} hrs/week</td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleRemove(a.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                      title="Remove Assignment"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Subject to Faculty">
        <form onSubmit={handleAssign} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Faculty Member *</label>
            <select
              value={formData.facultyName}
              onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800"
            >
              <option value="Dr. Anjali Verma">Dr. Anjali Verma (Assistant Professor)</option>
              <option value="Prof. Suresh Vet">Prof. Suresh Vet (Associate Professor)</option>
              <option value="Dr. Vikram Kumar">Dr. Vikram Kumar (Assistant Professor)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Department Subject *</label>
            <select
              value={formData.assignedSubject}
              onChange={(e) => setFormData({ ...formData, assignedSubject: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800 font-semibold"
            >
              <option>CS501 - Database Management Systems</option>
              <option>CS502 - Design & Analysis of Algorithms</option>
              <option>CS505 - DBMS Laboratory</option>
              <option>CS701 - Cloud Computing</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section / Batch *</label>
              <input
                required
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                placeholder="e.g. Section A"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hours / Week *</label>
              <input
                required
                type="number"
                min={1}
                max={15}
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) || 4 })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-6">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#8B2500] hover:bg-[#6B1A00] text-white">Save Assignment</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
