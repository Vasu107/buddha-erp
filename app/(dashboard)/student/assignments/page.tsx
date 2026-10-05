import Card from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { FileText, Calendar, Upload } from "lucide-react";

const assignments = [
  { id: 1, title: "Linked List Implementation",      subject: "Data Structures", due: "3 Oct 2024", status: "Pending"   as const, marks: null, maxMarks: 20 },
  { id: 2, title: "Socket Programming Lab",           subject: "Computer Networks",due: "6 Oct 2024",status: "Pending"   as const, marks: null, maxMarks: 15 },
  { id: 3, title: "Process Scheduling Simulation",   subject: "Operating Systems",due: "1 Oct 2024", status: "Completed" as const, marks: 18, maxMarks: 20 },
  { id: 4, title: "ER Diagram — Library System",     subject: "Database Systems", due: "28 Sep 2024",status: "Completed" as const, marks: 14, maxMarks: 15 },
  { id: 5, title: "Sorting Algorithms Analysis",     subject: "Algorithms",       due: "10 Oct 2024",status: "Pending"   as const, marks: null, maxMarks: 25 },
];

const statusMap: Record<string, "success" | "warning"> = {
  Completed: "success",
  Pending:   "warning",
};

export default function StudentAssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Assignments</h1>
        <p className="text-slate-500 text-sm mt-0.5">All assignments for the current semester</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: assignments.length, color: "text-[#245DA8] bg-blue-50" },
          { label: "Completed", value: assignments.filter((a) => a.status === "Completed").length, color: "text-green-600 bg-green-50" },
          { label: "Pending",   value: assignments.filter((a) => a.status === "Pending").length,   color: "text-orange-600 bg-orange-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm font-medium mt-0.5 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {assignments.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-[#245DA8]" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{a.subject}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar size={12} />
                    Due: {a.due}
                  </div>
                  {a.marks !== null && (
                    <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Marks: {a.marks}/{a.maxMarks}
                    </div>
                  )}
                  {a.status === "Pending" && (
                    <button className="flex items-center gap-1.5 text-xs text-[#245DA8] border border-[#245DA8]/20 px-3 py-1 rounded-lg hover:bg-blue-50 transition ml-auto">
                      <Upload size={12} /> Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
