"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, RefreshCcw } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = [
  "09:30 – 10:30",
  "10:30 – 11:30",
  "11:30 – 12:30",
  "12:30 – 01:30",
  "01:30 – 02:30",
  "02:30 – 03:30",
  "03:30 – 04:30",
];

const cellColors = [
  "bg-blue-50 border-blue-200 text-[#245DA8]",
  "bg-green-50 border-green-200 text-green-700",
  "bg-purple-50 border-purple-200 text-purple-700",
  "bg-orange-50 border-orange-200 text-orange-700",
  "bg-cyan-50 border-cyan-200 text-cyan-700",
  "bg-rose-50 border-rose-200 text-rose-700",
];

const schedule: Record<string, Record<string, { subject: string; faculty: string; room: string; colorIdx: number } | null>> = {
  "09:30 – 10:30": {
    Mon: { subject: "Data Structures", faculty: "Dr. R. Sharma", room: "Room 201", colorIdx: 0 },
    Tue: { subject: "Database Systems", faculty: "Prof. A. Rai", room: "Room 202", colorIdx: 2 },
    Wed: { subject: "Operating Sys.", faculty: "Dr. K. Tripathi", room: "Room 203", colorIdx: 4 },
    Thu: { subject: "Theory of Computation", faculty: "Prof. A. Verma", room: "Room 204", colorIdx: 1 },
    Fri: null,
    Sat: null,
  },
  "10:30 – 11:30": {
    Mon: { subject: "Discrete Math", faculty: "Prof. S. Mishra", room: "Room 201", colorIdx: 3 },
    Tue: { subject: "Data Structures", faculty: "Dr. R. Sharma", room: "Room 202", colorIdx: 0 },
    Wed: { subject: "Algorithms", faculty: "Dr. P. Yadav", room: "Room 205", colorIdx: 1 },
    Thu: null,
    Fri: { subject: "Computer Networks", faculty: "Prof. A. Rai", room: "Room 206", colorIdx: 4 },
    Sat: null,
  },
  "11:30 – 12:30": {
    Mon: null,
    Tue: { subject: "Software Eng.", faculty: "Dr. S. Vet", room: "Room 207", colorIdx: 5 },
    Wed: { subject: "Database Systems", faculty: "Prof. A. Rai", room: "Lab 1", colorIdx: 2 },
    Thu: { subject: "Algorithms", faculty: "Dr. P. Yadav", room: "Room 204", colorIdx: 1 },
    Fri: { subject: "Web Technologies", faculty: "Dr. R. Sharma", room: "Lab 2", colorIdx: 0 },
    Sat: null,
  },
  "12:30 – 01:30": {
    Mon: { subject: "— Lunch Break —", faculty: "", room: "", colorIdx: -1 },
    Tue: { subject: "— Lunch Break —", faculty: "", room: "", colorIdx: -1 },
    Wed: { subject: "— Lunch Break —", faculty: "", room: "", colorIdx: -1 },
    Thu: { subject: "— Lunch Break —", faculty: "", room: "", colorIdx: -1 },
    Fri: { subject: "— Lunch Break —", faculty: "", room: "", colorIdx: -1 },
    Sat: { subject: "— Lunch Break —", faculty: "", room: "", colorIdx: -1 },
  },
  "01:30 – 02:30": {
    Mon: { subject: "Professional Ethics", faculty: "Dr. A. Singh", room: "Room 208", colorIdx: 5 },
    Tue: null,
    Wed: { subject: "Data Structures", faculty: "Dr. R. Sharma", room: "Lab 3", colorIdx: 0 },
    Thu: { subject: "Web Technologies", faculty: "Prof. A. Verma", room: "Room 201", colorIdx: 3 },
    Fri: null,
    Sat: { subject: "Mentoring", faculty: "All Faculty", room: "Dept.", colorIdx: 4 },
  },
  "02:30 – 03:30": {
    Mon: null,
    Tue: { subject: "Software Eng.", faculty: "Dr. S. Vet", room: "Room 209", colorIdx: 5 },
    Wed: null,
    Thu: { subject: "Professional Ethics", faculty: "Dr. A. Singh", room: "Room 208", colorIdx: 5 },
    Fri: { subject: "Computer Networks", faculty: "Prof. A. Rai", room: "Lab 2", colorIdx: 4 },
    Sat: null,
  },
  "03:30 – 04:30": {
    Mon: null,
    Tue: null,
    Wed: null,
    Thu: null,
    Fri: null,
    Sat: null,
  },
};

export default function TimetablePage() {
  const [view, setView] = useState<"week" | "day">("week");
  const [dept, setDept] = useState("CSE");
  const [year, setYear] = useState("A");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Timetable</h1>
          <p className="text-slate-500 text-sm mt-0.5">View and manage class timetable for all departments.</p>
        </div>
        <Button icon={<Plus size={15} />}>Add Slot</Button>
      </div>

      {/* Controls */}
      <Card noPad>
        <div className="px-5 py-3.5 flex flex-wrap items-center gap-3 border-b border-slate-100">
          {/* Department */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Department</span>
            <select value={dept} onChange={(e) => setDept(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#245DA8] bg-white">
              {["CSE","ECE","ME","CE","EE"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Year</span>
            <select value={year} onChange={(e) => setYear(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#245DA8] bg-white">
              {["A","B","C","D"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              <ChevronLeft size={14} /> Today
            </button>

            {/* View toggle */}
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              {(["week","day"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition ${
                    view === v ? "bg-white text-[#245DA8] shadow-sm" : "text-slate-600 hover:text-slate-800"
                  }`}>
                  {v === "week" ? "Week View" : "Day View"}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              <RefreshCcw size={13} /> Refresh
            </button>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[900px]">
            <thead>
              <tr>
                <th className="w-28 px-4 py-3 text-left text-xs font-semibold text-slate-500 border-b border-r border-slate-100 bg-slate-50">
                  Time / Day
                </th>
                {days.map((d) => (
                  <th key={d} className="px-3 py-3 text-center text-xs font-semibold text-slate-600 border-b border-r border-slate-100 bg-slate-50 last:border-r-0">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 text-xs text-slate-500 font-medium border-r border-b border-slate-100 whitespace-nowrap bg-slate-50/50">
                    {slot}
                  </td>
                  {days.map((day) => {
                    const cell = schedule[slot]?.[day];
                    if (!cell) {
                      return (
                        <td key={day} className="px-2 py-2 border-r border-b border-slate-100 last:border-r-0 min-w-[120px]">
                          <div className="h-14 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-[#245DA8]/30 hover:bg-blue-50/30 transition cursor-pointer group">
                            <Plus size={14} className="group-hover:text-[#245DA8]" />
                          </div>
                        </td>
                      );
                    }
                    if (cell.colorIdx === -1) {
                      return (
                        <td key={day} className="px-2 py-2 border-r border-b border-slate-100 last:border-r-0">
                          <div className="h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-medium text-xs">
                            🍽️ Lunch
                          </div>
                        </td>
                      );
                    }
                    const color = cellColors[cell.colorIdx];
                    return (
                      <td key={day} className="px-2 py-2 border-r border-b border-slate-100 last:border-r-0 min-w-[120px]">
                        <div className={`h-14 rounded-lg border px-2.5 py-2 cursor-pointer hover:shadow-sm transition ${color}`}>
                          <p className="font-semibold leading-tight truncate">{cell.subject}</p>
                          {cell.faculty && <p className="text-[10px] opacity-70 mt-0.5 truncate">{cell.faculty}</p>}
                          {cell.room && <p className="text-[10px] opacity-60 truncate">{cell.room}</p>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap gap-4">
          {[
            { label: "Data Structures", color: "bg-blue-200" },
            { label: "Database Systems", color: "bg-purple-200" },
            { label: "Algorithms", color: "bg-green-200" },
            { label: "Theory", color: "bg-orange-200" },
            { label: "Networks", color: "bg-cyan-200" },
            { label: "Ethics / Elective", color: "bg-rose-200" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5 text-xs text-slate-600">
              <div className={`w-3 h-3 rounded-sm ${l.color}`} />
              {l.label}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
