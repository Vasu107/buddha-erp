import Card from "@/components/ui/Card";

export default function StudentAttendancePage() {
  const subjects = [
    { code: "CS401", name: "Data Structures",       attended: 22, total: 25, pct: 88 },
    { code: "CS402", name: "Computer Networks",     attended: 20, total: 24, pct: 83 },
    { code: "CS403", name: "Operating Systems",     attended: 19, total: 25, pct: 76 },
    { code: "CS404", name: "Database Systems",      attended: 24, total: 26, pct: 92 },
    { code: "CS405", name: "Algorithms",            attended: 18, total: 23, pct: 78 },
    { code: "CS406", name: "Theory of Computation", attended: 21, total: 25, pct: 84 },
  ];

  const overall = Math.round(subjects.reduce((a, s) => a + s.pct, 0) / subjects.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Attendance</h1>
        <p className="text-slate-500 text-sm mt-0.5">Semester 5 · B.Tech CSE · 2024–25</p>
      </div>

      {/* Overall */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Overall Attendance", value: `${overall}%`, color: overall >= 75 ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50" },
          { label: "Total Classes",      value: subjects.reduce((a, s) => a + s.total, 0).toString(), color: "text-[#245DA8] bg-blue-50" },
          { label: "Classes Attended",   value: subjects.reduce((a, s) => a + s.attended, 0).toString(), color: "text-purple-600 bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-5 text-center ${s.color}`}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm font-medium mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Subject-wise */}
      <Card title="Subject-wise Attendance" subtitle="This semester attendance breakdown">
        <div className="space-y-4">
          {subjects.map((s) => (
            <div key={s.code}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-xs font-mono text-[#245DA8] font-medium">{s.code}</span>
                  <span className="text-sm font-medium text-slate-700 ml-2">{s.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{s.attended}/{s.total} classes</span>
                  <span className={`text-sm font-bold ${s.pct >= 75 ? "text-green-600" : "text-red-500"}`}>{s.pct}%</span>
                </div>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${s.pct >= 75 ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gradient-to-r from-red-400 to-red-500"}`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
              {s.pct < 75 && (
                <p className="text-xs text-red-500 mt-1">
                  ⚠️ Need {Math.ceil((0.75 * s.total - s.attended) / 0.25)} more classes to reach 75%
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
