"use client";

import {
  Users, GraduationCap, Building2, BookOpen,
  ClipboardList, UserPlus, FolderPlus,
  FileBarChart, CalendarDays, Globe,
  Calendar, Download, HeadphonesIcon, ChevronRight,
  TrendingUp, BarChart3, Award,
} from "lucide-react";
import Link from "next/link";

/* ─── Stat Cards ─────────────────────────────────── */
const stats = [
  { label: "TOTAL STUDENTS",       value: "2,486", sub: "All enrolled students",   icon: GraduationCap, color: "#8B2500", bg: "#FFF5F0" },
  { label: "TOTAL FACULTY",        value: "186",   sub: "All listed faculty",       icon: Users,         color: "#0369a1", bg: "#F0F9FF" },
  { label: "DEPARTMENTS",          value: "12",    sub: "Active departments",        icon: Building2,     color: "#7c3aed", bg: "#F5F3FF" },
  { label: "TOTAL COURSES",        value: "48",    sub: "Across all departments",   icon: BookOpen,      color: "#059669", bg: "#ECFDF5" },
  { label: "PENDING APPROVALS",    value: "18",    sub: "Requires attention ↗",     icon: ClipboardList, color: "#d97706", bg: "#FFFBEB" },
  { label: "ATTENDANCE RATE",      value: "87%",   sub: "This semester avg.",       icon: Award,         color: "#0891b2", bg: "#F0FDFF" },
  { label: "HOD / STAFF",          value: "14",    sub: "Across all branches",      icon: UserPlus,      color: "#16a34a", bg: "#F0FDF4" },
];

/* ─── Quick Actions ──────────────────────────────── */
const quickActions = [
  { label: "Add Faculty",       icon: UserPlus,    href: "/director/faculty",      color: "#8B2500",  bg: "#FFF5F0" },
  { label: "Add Student",       icon: GraduationCap, href: "/director/students",   color: "#059669",  bg: "#ECFDF5" },
  { label: "Departments",       icon: FolderPlus,  href: "/director/departments",  color: "#7c3aed",  bg: "#F5F3FF" },
  { label: "Reports",           icon: FileBarChart, href: "/director/reports",     color: "#d97706",  bg: "#FFFBEB" },
  { label: "Timetable",         icon: CalendarDays, href: "/timetable",            color: "#0369a1",  bg: "#F0F9FF" },
  { label: "Analytics",         icon: BarChart3,   href: "/director/reports",      color: "#0891b2",  bg: "#F0FDFF" },
];

/* ─── Recent Activities ──────────────────────────── */
const recentActivities = [
  { text: "New faculty member added",          time: "Today, 10:52 AM", type: "faculty"   },
  { text: "Student application approved",       time: "Today, 10:25 AM", type: "student"   },
  { text: "Timetable updated for CSE Sem 5",   time: "11h ago",          type: "timetable" },
  { text: "Leave request approved — Dr. Singh", time: "Yesterday",        type: "leave"     },
  { text: "New course added: Data Science",    time: "2 days ago",       type: "course"    },
];

const activityColor: Record<string, { bg: string; text: string }> = {
  faculty:   { bg: "#FFF5F0", text: "#8B2500" },
  student:   { bg: "#ECFDF5", text: "#059669" },
  timetable: { bg: "#F5F3FF", text: "#7c3aed" },
  leave:     { bg: "#FFFBEB", text: "#d97706" },
  course:    { bg: "#F0F9FF", text: "#0369a1" },
};

/* ─── Departments ────────────────────────────────── */
const departments = [
  { dept: "Computer Science & Engineering", code: "CSE", hod: "Dr. R. Sharma",  faculty: 24, students: 480, courses: 10 },
  { dept: "Electronics & Communication",    code: "ECE", hod: "Dr. P. Singh",   faculty: 18, students: 360, courses: 9  },
  { dept: "Mechanical Engineering",         code: "ME",  hod: "Dr. A. Kumar",   faculty: 20, students: 420, courses: 10 },
  { dept: "Civil Engineering",              code: "CE",  hod: "Dr. S. Verma",   faculty: 16, students: 320, courses: 8  },
  { dept: "Electrical Engineering",         code: "EE",  hod: "Dr. M. Gupta",   faculty: 18, students: 360, courses: 9  },
];

/* ─── Quick Links ────────────────────────────────── */
const quickLinks = [
  { label: "University Website", icon: Globe,         href: "https://bit.ac.in" },
  { label: "Academic Calendar",  icon: Calendar,       href: "#" },
  { label: "Exam Schedule",      icon: ClipboardList,  href: "#" },
  { label: "Downloads",          icon: Download,       href: "#" },
  { label: "Help & Support",     icon: HeadphonesIcon, href: "#" },
];

/* ─── Card Wrapper ───────────────────────────────── */
function Card({
  title, subtitle, action, children, className = "", noPad = false,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPad?: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="font-bold text-slate-800 text-sm">{title}</p>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={noPad ? "" : "p-5"}>{children}</div>
    </div>
  );
}

export default function DirectorDashboard() {
  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Welcome back! Here&apos;s what&apos;s happening at Buddha Institute of Technology.
          </p>
        </div>
        {/* Quote chip */}
        <div className="hidden lg:flex items-center gap-2.5 px-4 py-2.5 bg-[#FFF5F0] border border-[#8B2500]/15 rounded-xl max-w-xs">
          <TrendingUp size={16} className="text-[#8B2500] shrink-0" />
          <p className="text-xs text-[#8B2500] leading-relaxed font-medium">
            &quot;Education is the most powerful weapon.&quot;
            <span className="block opacity-70">— Dr. A.P.J. Abdul Kalam</span>
          </p>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{s.label}</p>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: s.bg }}
                >
                  <Icon size={15} style={{ color: s.color }} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800 leading-none">{s.value}</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-tight">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Middle Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Quick Actions */}
        <Card title="Quick Actions" subtitle="Director shortcuts" className="lg:col-span-1">
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map(({ label, icon: Icon, color, bg, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition group text-center"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: bg }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="text-[11px] font-semibold text-slate-600 leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card
          title="Recent Activities"
          action={
            <Link href="#" className="text-xs text-[#8B2500] font-semibold hover:underline">
              View All →
            </Link>
          }
          className="lg:col-span-1"
        >
          <div className="space-y-3">
            {recentActivities.map((a, i) => {
              const ac = activityColor[a.type] || { bg: "#f8fafc", text: "#64748b" };
              return (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: ac.bg, color: ac.text }}
                  >
                    {a.text[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 font-medium leading-tight">{a.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Links */}
        <Card title="Quick Links" className="lg:col-span-1">
          <div className="space-y-1">
            {quickLinks.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFF5F0] transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#8B2500]/10 transition">
                  <Icon size={14} className="text-slate-500 group-hover:text-[#8B2500] transition" />
                </div>
                <span className="text-sm text-slate-700 flex-1 group-hover:text-[#8B2500] transition">{label}</span>
                <ChevronRight size={13} className="text-slate-300 group-hover:text-[#8B2500] transition" />
              </a>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Department Table ── */}
      <Card
        title="Department Overview"
        subtitle="Faculty and student distribution across departments"
        action={
          <Link href="/director/departments" className="text-xs text-[#8B2500] font-semibold hover:underline">
            View All →
          </Link>
        }
        noPad
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["#", "Department", "Code", "HOD", "Faculty", "Students", "Courses", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {departments.map((row, i) => (
                <tr key={i} className="hover:bg-[#FFF5F0]/60 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs font-medium">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{row.dept}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-[#FFF5F0] text-[#8B2500] text-xs font-bold rounded-md border border-[#8B2500]/15">
                      {row.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{row.hod}</td>
                  <td className="px-4 py-3 text-slate-700 font-semibold">{row.faculty}</td>
                  <td className="px-4 py-3 text-slate-700 font-semibold">{row.students}</td>
                  <td className="px-4 py-3 text-slate-600">{row.courses}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold ring-1 ring-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
