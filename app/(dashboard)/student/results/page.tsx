import Card from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { FileText, Download } from "lucide-react";

const results = [
  { sem: 5, subjects: [
    { name: "Data Structures",       credits: 4, internal: 38, external: 74, total: 112, grade: "A",  points: 9 },
    { name: "Computer Networks",     credits: 4, internal: 35, external: 68, total: 103, grade: "B+", points: 8 },
    { name: "Operating Systems",     credits: 3, internal: 32, external: 60, total: 92,  grade: "B",  points: 7 },
    { name: "Database Systems",      credits: 3, internal: 40, external: 78, total: 118, grade: "A+", points: 10},
    { name: "Algorithms",            credits: 4, internal: 36, external: 70, total: 106, grade: "A",  points: 9 },
    { name: "Theory of Computation", credits: 3, internal: 33, external: 65, total: 98,  grade: "B+", points: 8 },
  ]},
];

const gradeColor: Record<string, string> = {
  "A+": "bg-green-50 text-green-700",
  "A":  "bg-blue-50 text-[#245DA8]",
  "B+": "bg-purple-50 text-purple-700",
  "B":  "bg-orange-50 text-orange-600",
  "C":  "bg-yellow-50 text-yellow-700",
  "F":  "bg-red-50 text-red-600",
};

export default function StudentResultsPage() {
  const sem = results[0];
  const sgpa = (
    sem.subjects.reduce((a, s) => a + s.points * s.credits, 0) /
    sem.subjects.reduce((a, s) => a + s.credits, 0)
  ).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Results</h1>
          <p className="text-slate-500 text-sm mt-0.5">Academic performance & grade report</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#245DA8] border border-[#245DA8]/20 rounded-xl hover:bg-blue-50 transition">
          <Download size={14} /> Download Marksheet
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "SGPA (Sem 5)", value: sgpa,   color: "text-[#245DA8] bg-blue-50"    },
          { label: "Overall CGPA", value: "8.4",  color: "text-purple-600 bg-purple-50" },
          { label: "Credits",      value: sem.subjects.reduce((a, s) => a + s.credits, 0), color: "text-green-600 bg-green-50" },
          { label: "Result",       value: "Pass",  color: "text-green-700 bg-green-50"  },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      <Card title="Semester 5 Results" subtitle="B.Tech CSE · 2024–25" noPad>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Subject", "Credits", "Internal (40)", "External (100)", "Total (140)", "Grade", "Points"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sem.subjects.map((s) => (
                <tr key={s.name} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3.5 font-medium text-slate-800">{s.name}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-center">{s.credits}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-center">{s.internal}</td>
                  <td className="px-4 py-3.5 text-slate-600 text-center">{s.external}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800 text-center">{s.total}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${gradeColor[s.grade] ?? ""}`}>{s.grade}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 font-medium text-center">{s.points}</td>
                </tr>
              ))}
              <tr className="bg-blue-50/30 font-semibold">
                <td className="px-4 py-3 text-[#245DA8]">SGPA</td>
                <td className="px-4 py-3 text-center text-slate-700">
                  {sem.subjects.reduce((a, s) => a + s.credits, 0)}
                </td>
                <td colSpan={4} />
                <td className="px-4 py-3 text-center text-[#245DA8] text-base font-bold">{sgpa}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
