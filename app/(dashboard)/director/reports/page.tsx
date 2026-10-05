"use client";

import { Download, TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";

const enrollmentData = [
  { month: "Jun", students: 120, target: 150 },
  { month: "Jul", students: 180, target: 150 },
  { month: "Aug", students: 220, target: 200 },
  { month: "Sep", students: 310, target: 280 },
  { month: "Oct", students: 280, target: 300 },
  { month: "Nov", students: 350, target: 320 },
];

const deptData = [
  { name: "CSE",  students: 480, fill: "#245DA8" },
  { name: "ECE",  students: 360, fill: "#7c3aed" },
  { name: "ME",   students: 420, fill: "#16a34a" },
  { name: "CE",   students: 320, fill: "#d97706" },
  { name: "EE",   students: 360, fill: "#0891b2" },
  { name: "IT",   students: 240, fill: "#dc2626" },
];

const PASS_DATA = [
  { name: "Pass", value: 86, fill: "#16a34a" },
  { name: "Fail", value: 14, fill: "#fee2e2" },
];

const topCourses = [
  { rank: 1, name: "Data Structures",       dept: "CSE", enrolled: 148 },
  { rank: 2, name: "Computer Networks",     dept: "CSE", enrolled: 132 },
  { rank: 3, name: "Web Technologies",      dept: "CSE", enrolled: 128 },
  { rank: 4, name: "Digital Electronics",   dept: "ECE", enrolled: 104 },
  { rank: 5, name: "Engineering Mechanics", dept: "ME",  enrolled: 98  },
];

const recentReports = [
  { name: "Student Enrollment Report",      date: "13 Apr 2024" },
  { name: "Faculty Workload Summary",        date: "10 Apr 2024" },
  { name: "Attendance Analytics",           date: "09 Apr 2024" },
  { name: "Department Performance",         date: "07 Apr 2024" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">Institution-wide insights, enrollment tracking and academic analytics.</p>
        </div>
        <Button icon={<Download size={15} />}>Export Report</Button>
      </div>

      {/* Top charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Student Enrollment */}
        <Card title="Student Enrollment" subtitle="Monthly enrollment vs target" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={enrollmentData} barSize={10} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }} />
              <Bar dataKey="students" fill="#245DA8" radius={[4,4,0,0]} name="Enrolled" />
              <Bar dataKey="target"   fill="#dbeafe" radius={[4,4,0,0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Dept-wise */}
        <Card title="Dept-wise Students" subtitle="Distribution across departments" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData} layout="vertical" barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={32} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }} />
              {deptData.map((d) => (
                <Bar key={d.name} dataKey="students" fill={d.fill} radius={[0,4,4,0]}>
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              )).slice(0, 1)}
              <Bar dataKey="students" radius={[0,4,4,0]}>
                {deptData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pass Percentage */}
        <Card title="Pass Percentage" subtitle="Overall exam result analysis" className="lg:col-span-1">
          <div className="flex items-center justify-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={PASS_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                  dataKey="value" startAngle={90} endAngle={-270}>
                  {PASS_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-slate-800">86%</p>
                <p className="text-xs text-slate-500">Pass Rate</p>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "CSE", pct: 92, color: "bg-[#245DA8]" },
                  { label: "ECE", pct: 88, color: "bg-purple-500" },
                  { label: "ME",  pct: 82, color: "bg-green-500"  },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-8">{r.label}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                      <div className={`${r.color} h-full rounded-full`} style={{ width: `${r.pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top courses */}
        <Card title="Top 5 Courses by Enrollment"
          action={<span className="text-xs text-[#245DA8] font-medium cursor-pointer hover:underline">View All →</span>}>
          <div className="space-y-3">
            {topCourses.map((c) => (
              <div key={c.rank} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#245DA8] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {c.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.dept}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full">
                    <div className="h-full bg-[#245DA8] rounded-full" style={{ width: `${(c.enrolled / 160) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-8 text-right">{c.enrolled}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Reports */}
        <Card title="Recent Reports"
          action={<span className="text-xs text-[#245DA8] font-medium cursor-pointer hover:underline">View All Reports →</span>}>
          <div className="space-y-3">
            {recentReports.map((r) => (
              <div key={r.name} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#245DA8]/20 hover:bg-blue-50/30 transition cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-[#245DA8]/10 transition">
                  <TrendingUp size={16} className="text-[#245DA8]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.date}</p>
                </div>
                <Download size={14} className="text-slate-300 group-hover:text-[#245DA8] transition" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
