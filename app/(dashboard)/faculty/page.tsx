"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, Users, ClipboardCheck, ClipboardList,
  CalendarDays, Bell, Upload, TrendingUp, GraduationCap,
  FileText, Megaphone, BarChart3, UserCog, CheckCircle2, ArrowRight
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/ui/StatsCard";

const todayClasses = [
  { subject: "Database Management Systems (CS501)", time: "09:30 AM – 10:30 AM", room: "LT-201", students: 48, type: "Theory" },
  { subject: "Design & Analysis of Algorithms (CS502)", time: "11:30 AM – 12:30 PM", room: "LT-203", students: 45, type: "Theory" },
  { subject: "DBMS Lab Session (CS505)", time: "01:30 PM – 03:30 PM", room: "Lab 3", students: 24, type: "Practical" },
];

export default function FacultyDashboard() {
  const [userName, setUserName] = useState("Dr. Anjali Verma");
  const [department, setDepartment] = useState("Computer Science & Engineering");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bit_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setUserName(u.name);
      }
    } catch (e) {}
  }, []);

  return (
    <div className="space-y-6">

      {/* ── Welcome Header ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Welcome back, {userName}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Department of {department} — Teaching summary & today&apos;s schedule.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF5F0] border border-[#8B2500]/20 rounded-xl text-xs font-bold text-[#8B2500]">
          <span className="w-2 h-2 rounded-full bg-[#8B2500] animate-pulse" />
          Faculty Access Authorized
        </div>
      </div>

      {/* ── Stats Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Assigned Subjects"
          value={4}
          subtitle="This semester"
          icon={BookOpen}
          color="brown"
        />
        <StatsCard
          title="Authorized Students"
          value={148}
          subtitle="4 active sections"
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Classes Today"
          value={3}
          subtitle="1 lab + 2 theory"
          icon={CalendarDays}
          color="orange"
        />
        <StatsCard
          title="Pending Attendance"
          value={1}
          subtitle="CS501 Today 09:30 AM"
          icon={ClipboardCheck}
          color="red"
        />
      </div>

      {/* ── Main Dashboard Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Today's Teaching Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Today&apos;s Teaching Schedule</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <Link
                href="/faculty/timetable"
                className="text-xs text-[#8B2500] font-semibold hover:underline flex items-center gap-1"
              >
                Full Timetable <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-3">
              {todayClasses.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#8B2500]/30 hover:bg-[#FFF5F0]/40 transition duration-150 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FFF5F0] text-[#8B2500] flex items-center justify-center font-black shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{c.subject}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {c.time} · {c.room} · {c.students} Students
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                      c.type === "Theory" ? "bg-orange-50 text-[#8B2500]" : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {c.type}
                    </span>
                    <Link
                      href="/faculty/attendance"
                      className="px-3 py-1.5 rounded-lg bg-[#8B2500] hover:bg-[#6B1A00] text-white text-xs font-bold transition shadow-xs hidden sm:inline-flex items-center gap-1"
                    >
                      <ClipboardCheck size={13} /> Mark Attendance
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Authorized Module Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-base mb-4 pb-3 border-b border-slate-100">
              Authorized Faculty Modules
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "My Subjects",     icon: BookOpen,      href: "/faculty/subjects",     bg: "bg-orange-50 text-[#8B2500]" },
                { label: "Attendance",      icon: ClipboardCheck, href: "/faculty/attendance",   bg: "bg-emerald-50 text-emerald-700" },
                { label: "My Students",     icon: GraduationCap,  href: "/faculty/students",     bg: "bg-blue-50 text-blue-700" },
                { label: "Study Notes",     icon: FileText,       href: "/faculty/resources",    bg: "bg-purple-50 text-purple-700" },
                { label: "Assignments",     icon: ClipboardList,  href: "/faculty/assignments",  bg: "bg-amber-50 text-amber-700" },
                { label: "Announce",        icon: Megaphone,      href: "/faculty/announcements", bg: "bg-rose-50 text-rose-700" },
                { label: "Results / Marks", icon: BarChart3,      href: "/faculty/results",      bg: "bg-teal-50 text-teal-700" },
                { label: "My Profile",      icon: UserCog,        href: "/faculty/profile",      bg: "bg-slate-100 text-slate-700" },
              ].map(({ label, icon: Icon, href, bg }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-[#8B2500]/30 hover:bg-[#FFF5F0]/50 transition text-center group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} group-hover:scale-110 transition-transform shadow-xs`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
