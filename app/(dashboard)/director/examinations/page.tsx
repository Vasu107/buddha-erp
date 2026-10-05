"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";

const exams = [
  { name: "Mid Term 1",  course: "Data Structures",       date: "21 Nov 2024", time: "10:00 AM", room: "Hall A — CSE", dept: "CSE", status: "Completed" as const },
  { name: "End Sem",     course: "Computer Networks",     date: "25 Nov 2024", time: "02:00 PM", room: "Hall B",       dept: "CSE", status: "Completed" as const },
  { name: "Mid Term 1",  course: "Capital Machinery",     date: "23 Nov 2024", time: "10:00 AM", room: "Hall B",       dept: "ME",  status: "Completed" as const },
  { name: "End Sem",     course: "Engineering Mechanics", date: "29 Nov 2024", time: "02:00 PM", room: "Hall C",       dept: "ME",  status: "Scheduled" as const },
  { name: "Practical",   course: "Lab — CSE",             date: "29 Nov 2024", time: "02:00 PM", room: "Lab 1",        dept: "CSE", status: "Scheduled" as const },
];

const tabs = ["Exam Name", "Department", "Question Bank"];

export default function ExaminationsPage() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All Departments");
  const [session, setSession] = useState("2024 - 25");
  const [activeTab, setActiveTab] = useState("Exam Name");

  const filtered = exams.filter(
    (e) =>
      (dept === "All Departments" || e.dept === dept) &&
      (e.name.toLowerCase().includes(search.toLowerCase()) || e.course.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Examinations</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage exam schedules, results and evaluation.</p>
        </div>
        <Button icon={<Plus size={15} />}>Create Exam</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === t ? "bg-white text-[#245DA8] shadow-sm" : "text-slate-600 hover:text-slate-800"
            }`}>{t}</button>
        ))}
      </div>

      <Card noPad>
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">
          <select value={dept} onChange={(e) => setDept(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#245DA8] bg-white">
            {["All Departments","CSE","ECE","ME","CE","EE"].map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={session} onChange={(e) => setSession(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#245DA8] bg-white">
            {["2024 - 25","2023 - 24"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#245DA8] bg-white">
            {["Manager","Professor"].map((r) => <option key={r}>{r}</option>)}
          </select>
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exams..."
              className="pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#245DA8] w-52" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["#", "Exam Name", "Course", "Date", "Time", "Room", "Department", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((e, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3.5 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{e.name}</td>
                  <td className="px-4 py-3.5 text-slate-600">{e.course}</td>
                  <td className="px-4 py-3.5 text-slate-600">{e.date}</td>
                  <td className="px-4 py-3.5 text-slate-600">{e.time}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-xs">{e.room}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 bg-blue-50 text-[#245DA8] text-xs font-semibold rounded-md">{e.dept}</span>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1–{filtered.length} of 12</span>
          <div className="flex gap-1">
            {[1,2].map((p) => (
              <button key={p} className={`w-7 h-7 rounded-md text-xs font-medium transition ${p === 1 ? "bg-[#245DA8] text-white" : "hover:bg-slate-100 text-slate-600"}`}>{p}</button>
            ))}
            <button className="w-7 h-7 rounded-md hover:bg-slate-100 transition text-slate-400">›</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
