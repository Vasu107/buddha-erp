"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periods = ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 1:00", "1:00 - 2:00 (Lunch)", "2:00 - 3:00", "3:00 - 4:00", "4:00 - 5:00"];

const timetable: Record<string, Record<string, { subject: string; faculty: string; room: string } | null>> = {
  Monday:    { "9:00 - 10:00": { subject: "CS501 - DBMS", faculty: "Dr. Anjali Verma", room: "Room 201" }, "10:00 - 11:00": { subject: "CS503 - OS", faculty: "Dr. Rajesh Sharma", room: "Room 202" }, "11:00 - 12:00": { subject: "CS502 - DAA", faculty: "Dr. Anjali Verma", room: "Room 201" }, "12:00 - 1:00": { subject: "CS506 - SE", faculty: "Dr. Rajesh Sharma", room: "Room 203" }, "1:00 - 2:00 (Lunch)": null, "2:00 - 3:00": { subject: "CS504 - CN", faculty: "Prof. Suresh Vet", room: "Room 204" }, "3:00 - 4:00": { subject: "CS505 - DBMS Lab", faculty: "Prof. Suresh Vet", room: "Lab-3" }, "4:00 - 5:00": { subject: "CS505 - DBMS Lab", faculty: "Prof. Suresh Vet", room: "Lab-3" } },
  Tuesday:   { "9:00 - 10:00": { subject: "CS502 - DAA", faculty: "Dr. Anjali Verma", room: "Room 201" }, "10:00 - 11:00": { subject: "CS504 - CN", faculty: "Prof. Suresh Vet", room: "Room 204" }, "11:00 - 12:00": { subject: "CS503 - OS", faculty: "Dr. Rajesh Sharma", room: "Room 202" }, "12:00 - 1:00": { subject: "CS501 - DBMS", faculty: "Dr. Anjali Verma", room: "Room 201" }, "1:00 - 2:00 (Lunch)": null, "2:00 - 3:00": { subject: "CS506 - SE", faculty: "Dr. Rajesh Sharma", room: "Room 203" }, "3:00 - 4:00": null, "4:00 - 5:00": null },
  Wednesday: { "9:00 - 10:00": { subject: "CS503 - OS", faculty: "Dr. Rajesh Sharma", room: "Room 202" }, "10:00 - 11:00": { subject: "CS501 - DBMS", faculty: "Dr. Anjali Verma", room: "Room 201" }, "11:00 - 12:00": { subject: "CS504 - CN", faculty: "Prof. Suresh Vet", room: "Room 204" }, "12:00 - 1:00": { subject: "CS502 - DAA", faculty: "Dr. Anjali Verma", room: "Room 201" }, "1:00 - 2:00 (Lunch)": null, "2:00 - 3:00": null, "3:00 - 4:00": { subject: "CS506 - SE", faculty: "Dr. Rajesh Sharma", room: "Room 203" }, "4:00 - 5:00": null },
  Thursday:  { "9:00 - 10:00": { subject: "CS506 - SE", faculty: "Dr. Rajesh Sharma", room: "Room 203" }, "10:00 - 11:00": { subject: "CS502 - DAA", faculty: "Dr. Anjali Verma", room: "Room 201" }, "11:00 - 12:00": null, "12:00 - 1:00": { subject: "CS503 - OS", faculty: "Dr. Rajesh Sharma", room: "Room 202" }, "1:00 - 2:00 (Lunch)": null, "2:00 - 3:00": { subject: "CS501 - DBMS", faculty: "Dr. Anjali Verma", room: "Room 201" }, "3:00 - 4:00": { subject: "CS504 - CN", faculty: "Prof. Suresh Vet", room: "Room 204" }, "4:00 - 5:00": null },
  Friday:    { "9:00 - 10:00": { subject: "CS504 - CN", faculty: "Prof. Suresh Vet", room: "Room 204" }, "10:00 - 11:00": { subject: "CS503 - OS", faculty: "Dr. Rajesh Sharma", room: "Room 202" }, "11:00 - 12:00": { subject: "CS501 - DBMS", faculty: "Dr. Anjali Verma", room: "Room 201" }, "12:00 - 1:00": { subject: "CS502 - DAA", faculty: "Dr. Anjali Verma", room: "Room 201" }, "1:00 - 2:00 (Lunch)": null, "2:00 - 3:00": { subject: "CS506 - SE", faculty: "Dr. Rajesh Sharma", room: "Room 203" }, "3:00 - 4:00": null, "4:00 - 5:00": null },
};

const subjectColors: Record<string, string> = {
  "CS501 - DBMS": "bg-blue-50 border-blue-200 text-blue-800",
  "CS502 - DAA": "bg-emerald-50 border-emerald-200 text-emerald-800",
  "CS503 - OS": "bg-purple-50 border-purple-200 text-purple-800",
  "CS504 - CN": "bg-amber-50 border-amber-200 text-amber-800",
  "CS505 - DBMS Lab": "bg-rose-50 border-rose-200 text-rose-800",
  "CS506 - SE": "bg-indigo-50 border-indigo-200 text-indigo-800",
};

export default function HodTimetablePage() {
  const [view, setView] = useState<"grid" | "day">("grid");
  const [selectedDay, setSelectedDay] = useState("Monday");

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Department Timetable</h1>
          <p className="text-slate-500 text-sm mt-0.5">Weekly schedule for CSE department — 3rd Year, Sem 5.</p>
        </div>
        <div className="flex items-center gap-2">
          {["grid", "day"].map((v) => (
            <button key={v} onClick={() => setView(v as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition capitalize ${view === v ? "bg-[#8B2500] text-white border-[#8B2500]" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {v === "grid" ? "📊 Grid View" : "📅 Day View"}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase w-32">Time</th>
                  {days.map((d) => (
                    <th key={d} className="px-3 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {periods.map((period) => (
                  <tr key={period} className={period.includes("Lunch") ? "bg-slate-50" : "hover:bg-slate-50/50"}>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-500 w-32 whitespace-nowrap">{period}</td>
                    {days.map((day) => {
                      const cell = timetable[day]?.[period];
                      if (period.includes("Lunch"))
                        return <td key={day} colSpan={5} className="px-3 py-3 text-center text-xs text-slate-400 font-bold italic" style={{ display: day === "Monday" ? "table-cell" : "none" }}>— Lunch Break —</td>;
                      return (
                        <td key={day} className="px-3 py-2">
                          {cell ? (
                            <div className={`p-2 rounded-xl border ${subjectColors[cell.subject] || "bg-slate-50 border-slate-200 text-slate-700"}`}>
                              <p className="font-bold text-[11px] leading-tight">{cell.subject}</p>
                              <p className="text-[10px] opacity-70 mt-0.5">{cell.faculty}</p>
                              <p className="text-[10px] opacity-60">{cell.room}</p>
                            </div>
                          ) : (
                            <div className="p-2 rounded-xl border border-dashed border-slate-200 text-slate-300 text-center text-[10px]">—</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {days.map((d) => (
              <button key={d} onClick={() => setSelectedDay(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${selectedDay === d ? "bg-[#8B2500] text-white border-[#8B2500]" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {periods.map((period) => {
              const cell = timetable[selectedDay]?.[period];
              return (
                <div key={period} className="bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 p-4">
                  <div className="text-xs font-semibold text-slate-500 w-36 shrink-0">{period}</div>
                  {cell ? (
                    <div className={`flex-1 p-3 rounded-xl border ${subjectColors[cell.subject] || "bg-slate-50 border-slate-200"}`}>
                      <p className="font-bold text-sm">{cell.subject}</p>
                      <p className="text-xs opacity-70">{cell.faculty} · {cell.room}</p>
                    </div>
                  ) : period.includes("Lunch") ? (
                    <div className="flex-1 p-3 rounded-xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-400 font-bold">Lunch Break</div>
                  ) : (
                    <div className="flex-1 p-3 rounded-xl border border-dashed border-slate-200 text-slate-300 text-center text-xs">Free Period</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
