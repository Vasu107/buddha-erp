"use client";

import { useState } from "react";
import { CalendarDays, Clock, MapPin, BookOpen, Users, CheckCircle2 } from "lucide-react";
import Card from "@/components/ui/Card";

interface Slot {
  day: string;
  time: string;
  subject: string;
  code: string;
  room: string;
  type: "Theory" | "Practical";
  section: string;
}

const schedule: Slot[] = [
  { day: "Monday", time: "09:30 AM – 10:30 AM", subject: "Database Management Systems", code: "CS501", room: "LT-201", type: "Theory", section: "Section A" },
  { day: "Monday", time: "11:30 AM – 12:30 PM", subject: "Design & Analysis of Algorithms", code: "CS502", room: "LT-203", type: "Theory", section: "Section A" },
  { day: "Monday", time: "01:30 PM – 03:30 PM", subject: "DBMS Laboratory", code: "CS505", room: "Lab 3", type: "Practical", section: "Batch A1" },
  
  { day: "Tuesday", time: "10:30 AM – 11:30 AM", subject: "Cloud Computing & Distributed Systems", code: "CS701", room: "LT-302", type: "Theory", section: "Elective 1" },
  { day: "Tuesday", time: "02:30 PM – 03:30 PM", subject: "Database Management Systems", code: "CS501", room: "LT-201", type: "Theory", section: "Section A" },
  
  { day: "Wednesday", time: "09:30 AM – 10:30 AM", subject: "Design & Analysis of Algorithms", code: "CS502", room: "LT-203", type: "Theory", section: "Section A" },
  { day: "Wednesday", time: "11:30 AM – 01:30 PM", subject: "DBMS Laboratory", code: "CS505", room: "Lab 3", type: "Practical", section: "Batch A2" },
  
  { day: "Thursday", time: "10:30 AM – 11:30 AM", subject: "Database Management Systems", code: "CS501", room: "LT-201", type: "Theory", section: "Section A" },
  { day: "Thursday", time: "01:30 PM – 02:30 PM", subject: "Cloud Computing & Distributed Systems", code: "CS701", room: "LT-302", type: "Theory", section: "Elective 1" },
  
  { day: "Friday", time: "09:30 AM – 10:30 AM", subject: "Design & Analysis of Algorithms", code: "CS502", room: "LT-203", type: "Theory", section: "Section A" },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function FacultyTimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const daySlots = schedule.filter((s) => s.day === selectedDay);

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Assigned Teaching Timetable</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Official weekly teaching schedule assigned by the HOD / Timetable Coordinator.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF5F0] border border-[#8B2500]/20 rounded-xl text-xs font-bold text-[#8B2500]">
          <CalendarDays size={14} /> Weekly View Active
        </div>
      </div>

      {/* ── Day Selector Tabs ── */}
      <div className="flex rounded-2xl bg-white p-1.5 border border-slate-100 shadow-sm overflow-x-auto">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              selectedDay === d
                ? "bg-[#8B2500] text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* ── Schedule Slots Grid ── */}
      <div className="space-y-4">
        {daySlots.length === 0 ? (
          <Card>
            <div className="text-center py-10 text-slate-400">
              <Clock size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-slate-600">No teaching classes scheduled on {selectedDay}</p>
            </div>
          </Card>
        ) : (
          daySlots.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#8B2500]/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] text-[#8B2500] flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                  {s.code}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{s.subject}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock size={13} className="text-[#8B2500]" /> {s.time}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" /> {s.room}
                    </span>
                    <span>·</span>
                    <span className="font-medium">{s.section}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  s.type === "Theory" ? "bg-orange-50 text-[#8B2500]" : "bg-emerald-50 text-emerald-700"
                }`}>
                  {s.type} Session
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
