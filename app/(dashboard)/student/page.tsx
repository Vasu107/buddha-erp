import {
  BookOpen, ClipboardCheck, CalendarDays, ClipboardList,
  FileText, TrendingUp, Award,
} from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import Card from "@/components/ui/Card";

const stats = [
  { title: "My Subjects",    value: 6,    change: "This semester",  changeType: "neutral" as const, icon: BookOpen,      color: "blue"   as const },
  { title: "Attendance",     value: "85%",change: "Above 75%",      changeType: "up"      as const, icon: ClipboardCheck,color: "green"  as const },
  { title: "Pending Tasks",  value: 3,    change: "2 assignments",  changeType: "down"    as const, icon: ClipboardList, color: "orange" as const },
  { title: "CGPA",           value: "8.4",change: "Excellent",      changeType: "up"      as const, icon: Award,         color: "purple" as const },
];

const subjects = [
  { code: "CS401", name: "Data Structures",       faculty: "Dr. R. Sharma",   credits: 4, attendance: 88 },
  { code: "CS402", name: "Computer Networks",     faculty: "Prof. A. Rai",    credits: 4, attendance: 82 },
  { code: "CS403", name: "Operating Systems",     faculty: "Dr. K. Tripathi", credits: 3, attendance: 76 },
  { code: "CS404", name: "Database Systems",      faculty: "Prof. S. Mishra", credits: 3, attendance: 91 },
  { code: "CS405", name: "Algorithms",            faculty: "Dr. P. Yadav",    credits: 4, attendance: 80 },
  { code: "CS406", name: "Theory of Computation", faculty: "Prof. A. Verma",  credits: 3, attendance: 85 },
];

const upcoming = [
  { title: "Data Structures Assignment",    due: "3 Oct 2024",  type: "Assignment", subject: "CS401" },
  { title: "Mid Semester Exam — Networks", due: "8 Oct 2024",  type: "Exam",       subject: "CS402" },
  { title: "OS Lab File Submission",        due: "10 Oct 2024", type: "Practical",  subject: "CS403" },
];

const typeColor: Record<string, string> = {
  Assignment: "bg-blue-50 text-[#245DA8]",
  Exam:       "bg-red-50 text-red-600",
  Practical:  "bg-green-50 text-green-700",
};

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Welcome, Rahul Kumar</h1>
        <p className="text-slate-500 text-sm mt-0.5">B.Tech CSE · Year 3 · Semester 5 · 2024–25</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* My Subjects */}
        <Card title="My Subjects" subtitle="Current semester">
          <div className="space-y-3">
            {subjects.map((s) => (
              <div key={s.code} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#245DA8]/20 hover:bg-blue-50/20 transition cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-[#245DA8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.faculty} · {s.credits} Credits</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full">
                    <div
                      className={`h-full rounded-full ${s.attendance >= 75 ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${s.attendance}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${s.attendance >= 75 ? "text-green-600" : "text-red-500"}`}>
                    {s.attendance}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming */}
        <div className="space-y-5">
          <Card title="Upcoming" subtitle="Deadlines & exams">
            <div className="space-y-3">
              {upcoming.map((u, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/60 transition">
                  <div className={`px-2 py-0.5 text-xs font-semibold rounded-full ${typeColor[u.type]} shrink-0`}>{u.type}</div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{u.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Due: {u.due} · {u.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Quick Access">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Timetable",  icon: CalendarDays,  color: "bg-blue-50 text-[#245DA8]",    href: "/student/timetable"  },
                { label: "Attendance", icon: ClipboardCheck,color: "bg-green-50 text-green-600",  href: "/student/attendance" },
                { label: "Results",    icon: TrendingUp,    color: "bg-purple-50 text-purple-600",href: "/student/results"    },
                { label: "Assignments",icon: ClipboardList, color: "bg-orange-50 text-orange-500",href: "/student/assignments"},
                { label: "Resources",  icon: FileText,      color: "bg-cyan-50 text-cyan-600",    href: "/student/resources"  },
                { label: "Grades",     icon: Award,         color: "bg-rose-50 text-rose-500",    href: "/student/results"    },
              ].map(({ label, icon: Icon, color, href }) => (
                <a key={label} href={href} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition group text-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} group-hover:scale-105 transition-transform`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-medium text-slate-600">{label}</span>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
