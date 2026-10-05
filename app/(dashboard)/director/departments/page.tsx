"use client";

import { useState } from "react";
import { Search, Edit2, Plus } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";

const courses = [
  { code: "CS6131", name: "Data Structures",             dept: "Computer Science", sem: 4, status: "Active" as const },
  { code: "CS6132", name: "Computer Networks",           dept: "Computer Science", sem: 4, status: "Active" as const },
  { code: "EL6101", name: "Digital Electronics",         dept: "Electronics & Comm", sem: 4, status: "Active" as const },
  { code: "ME311",  name: "Engineering Mechanics",       dept: "Mechanical", sem: 4, status: "Active" as const },
  { code: "CE183",  name: "Fluid Mechanics",             dept: "Civil", sem: 4, status: "Active" as const },
  { code: "BT181",  name: "Electrical Machines",         dept: "Electrical", sem: 4, status: "Active" as const },
];

const tabs = ["Courses", "Syllabus", "Curriculum", "Academic Calendar"];

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState("Courses");
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All Departments");

  const filtered = courses.filter(
    (c) =>
      (dept === "All Departments" || c.dept === dept) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Academic Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage courses, syllabus, curriculum and academic structure.</p>
        </div>
        <Button icon={<Plus size={15} />}>Add Course</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
              activeTab === t
                ? "bg-white text-[#245DA8] shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === "Courses" && (
        <Card noPad>
          {/* Filters */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">
            <div className="flex gap-3">
              <select value={dept} onChange={(e) => setDept(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#245DA8] bg-white">
                {["All Departments","Computer Science","Electronics & Comm","Mechanical","Civil","Electrical"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#245DA8] bg-white">
                {["2024 - 25","2023 - 24","2022 - 23"].map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="relative ml-auto">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#245DA8] w-52" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["#", "Course Code", "Course Name", "Department", "Semester", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((c, i) => (
                  <tr key={c.code} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3.5 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3.5 font-mono font-semibold text-[#245DA8] text-xs">{c.code}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{c.name}</td>
                    <td className="px-4 py-3.5 text-slate-600">{c.dept}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#245DA8] text-xs font-semibold rounded-md">Sem {c.sem}</span>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition"><Edit2 size={14} /></button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition text-xs px-2">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing 1–{filtered.length} of 49</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((p) => (
                <button key={p} className={`w-7 h-7 rounded-md text-xs font-medium transition ${p === 1 ? "bg-[#245DA8] text-white" : "hover:bg-slate-100 text-slate-600"}`}>{p}</button>
              ))}
              <button className="w-7 h-7 rounded-md hover:bg-slate-100 transition text-slate-400">›</button>
            </div>
          </div>
        </Card>
      )}

      {activeTab !== "Courses" && (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
              <span className="text-2xl">📄</span>
            </div>
            <p className="font-medium text-slate-600">{activeTab} — Coming Soon</p>
            <p className="text-sm mt-1">This section will be available shortly.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
