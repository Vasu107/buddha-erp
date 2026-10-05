"use client";

import { useState } from "react";
import { UserPlus, Search, Upload } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/Badge";
import { getInitials } from "@/lib/utils";

const initialStudents = [
  { rollNo: "BIT2021001", name: "Rahul Kumar",    course: "CSE",  year: 3, branch: "CSE", status: "Active"  as const, attendance: 85, cgpa: 8.2, image: "" },
  { rollNo: "BIT2021002", name: "Priya Sharma",   course: "ECE",  year: 3, branch: "ECE", status: "Active"  as const, attendance: 92, cgpa: 9.1, image: "" },
  { rollNo: "BIT2021003", name: "Ankit Yadav",    course: "ME",   year: 3, branch: "ME",  status: "Active"  as const, attendance: 78, cgpa: 7.5, image: "" },
  { rollNo: "BIT2021004", name: "Nisha Gupta",    course: "ECE",  year: 2, branch: "ECE", status: "Active"  as const, attendance: 88, cgpa: 8.7, image: "" },
];

const courses = ["All Courses", "CSE", "ECE", "ME", "CE", "EE"];
const years   = ["All Years", "1", "2", "3", "4"];

export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [year,   setYear]   = useState("All Years");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    course: "CSE",
    branch: "CSE",
    year: 1,
    image: "",
  });

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      (course === "All Courses" || s.course === course) &&
      (year   === "All Years"   || String(s.year) === year) &&
      (s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q))
    );
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent = {
      ...formData,
      status: "Active" as const,
      attendance: 0,
      cgpa: 0,
    };
    setStudents([newStudent, ...students]);
    setIsModalOpen(false);
    setFormData({ name: "", rollNo: "", course: "CSE", branch: "CSE", year: 1, image: "" });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Student Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage student records, admissions and academic progress.</p>
        </div>
        <Button icon={<UserPlus size={15} />} onClick={() => setIsModalOpen(true)}>Add Student</Button>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total Students", value: students.length, color: "bg-blue-50 text-[#245DA8]" },
          { label: "Active",         value: students.filter((s) => s.status === "Active").length, color: "bg-green-50 text-green-700" },
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
              {filtered.map((s, i) => (
                <tr key={s.rollNo} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3.5 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3.5 text-xs font-mono text-[#245DA8] font-medium">{s.rollNo}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {s.image ? (
                        <img src={s.image} alt={s.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {getInitials(s.name)}
                        </div>
                      )}
                      <span className="font-semibold text-slate-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md">{s.course}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">Year {s.year}</td>
                  <td className="px-4 py-3.5 text-slate-600">{s.branch}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[60px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.attendance >= 75 ? "bg-green-500" : (s.attendance === 0 ? "bg-slate-300" : "bg-red-500")}`}
                          style={{ width: `${s.attendance}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${s.attendance >= 75 ? "text-green-600" : (s.attendance === 0 ? "text-slate-400" : "text-red-500")}`}>
                        {s.attendance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-700">{s.cgpa.toFixed(1)}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="px-2.5 py-1 text-xs text-[#245DA8] border border-[#245DA8]/20 rounded-lg hover:bg-blue-50 transition">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Student">
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div className="flex justify-center mb-6">
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
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#245DA8] focus:outline-none" placeholder="e.g. Aman Verma" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Roll Number</label>
              <input required value={formData.rollNo} onChange={(e) => setFormData({...formData, rollNo: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#245DA8] focus:outline-none" placeholder="e.g. BIT2024001" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Course</label>
              <select value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#245DA8] focus:outline-none bg-white">
                <option>CSE</option><option>ECE</option><option>ME</option><option>CE</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Year</label>
              <select value={formData.year} onChange={(e) => setFormData({...formData, year: Number(e.target.value)})} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-[#245DA8] focus:outline-none bg-white">
                <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Student</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
