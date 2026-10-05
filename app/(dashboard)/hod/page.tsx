"use client";

import { useState, useEffect } from "react";
import {
  Users, GraduationCap, BookOpen, CalendarDays,
  ClipboardCheck, BarChart3, TrendingUp, Building2,
  FileText, Layers, Award, UserCog, Megaphone, ArrowRight, BookMarked
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/ui/StatsCard";

const workloadSummary = [
  { name: "Dr. Anjali Verma", designation: "Assistant Professor", subjects: 3, hours: 14, status: "Active" },
  { name: "Dr. Rajesh Sharma", designation: "Professor & HOD", subjects: 2, hours: 10, status: "Active" },
  { name: "Prof. Suresh Vet", designation: "Associate Professor", subjects: 3, hours: 12, status: "Active" },
  { name: "Dr. Vikram Kumar", designation: "Assistant Professor", subjects: 2, hours: 8, status: "Active" },
];

export default function HodDashboard() {
  const [departmentName, setDepartmentName] = useState("Computer Science & Engineering (CSE)");
  const [hodName, setHodName] = useState("Prof. Rajesh Sharma");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bit_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setHodName(u.name);
      }
    } catch (e) {}
  }, []);

  return (
    <div className="space-y-6">

      {/* ── Welcome Header ── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            HOD Department Portal — {departmentName}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Welcome, {hodName}! Department oversight, faculty workload, and academic management.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF5F0] border border-[#8B2500]/20 rounded-xl text-xs font-bold text-[#8B2500]">
          <Building2 size={15} /> Head of Department (HOD)
        </div>
      </div>

      {/* ── Department Metric Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Department Students"
          value={480}
          subtitle="Across 4 academic years"
          icon={GraduationCap}
          color="brown"
        />
        <StatsCard
          title="Department Faculty"
          value={24}
          subtitle="Full-time faculty"
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Active Subjects"
          value={18}
          subtitle="This semester"
          icon={BookOpen}
          color="orange"
        />
        <StatsCard
          title="Avg Attendance Rate"
          value="87.4%"
          subtitle="Department average"
          icon={ClipboardCheck}
          color="blue"
        />
      </div>

      {/* ── Main Grid Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Faculty Workload Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Faculty Workload Overview</h3>
                <p className="text-xs text-slate-400 mt-0.5">Subject assignments & teaching hours per week</p>
              </div>
              <Link
                href="/hod/workload"
                className="text-xs text-[#8B2500] font-semibold hover:underline flex items-center gap-1"
              >
                Manage Workload <ArrowRight size={13} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                    {["Faculty Member", "Designation", "Assigned Subjects", "Teaching Hours", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {workloadSummary.map((w) => (
                    <tr key={w.name} className="hover:bg-[#FFF5F0]/40 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-800">{w.name}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">{w.designation}</td>
                      <td className="px-4 py-3.5 font-bold text-[#8B2500]">{w.subjects} Subjects</td>
                      <td className="px-4 py-3.5 text-xs text-slate-700 font-semibold">{w.hours} hrs/week</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold ring-1 ring-emerald-200">
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: HOD Role Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-base mb-4 pb-3 border-b border-slate-100">
              Department Management Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Faculty Dept",   icon: Users,          href: "/hod/faculty",      bg: "bg-orange-50 text-[#8B2500]" },
                { label: "Workload",       icon: UserCog,        href: "/hod/workload",     bg: "bg-[#FFF5F0] text-[#8B2500]" },
                { label: "CR Assign",      icon: Award,          href: "/hod/cr-assignment", bg: "bg-amber-50 text-amber-700" },
                { label: "Dept Subjects",  icon: BookOpen,       href: "/hod/subjects",     bg: "bg-emerald-50 text-emerald-700" },
                { label: "Master Syllabus", icon: FileText,       href: "/hod/syllabus",     bg: "bg-purple-50 text-purple-700" },
                { label: "Curriculum",     icon: Layers,         href: "/hod/curriculum",   bg: "bg-blue-50 text-blue-700" },
                { label: "Dept Timetable", icon: CalendarDays,   href: "/hod/timetable",    bg: "bg-indigo-50 text-indigo-700" },
                { label: "Rank & CGPA",    icon: Award,          href: "/hod/ranksheet",    bg: "bg-rose-50 text-rose-700" },
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
