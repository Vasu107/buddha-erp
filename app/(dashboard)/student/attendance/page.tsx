"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import { api } from "@/lib/api";

interface SubjectAttendance {
  code: string;
  name: string;
  attended: number;
  total: number;
  pct: number;
}

interface StudentInfo {
  name: string;
  rollNumber: string;
  department: string;
  year: number;
  section: string | null;
}

export default function StudentAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectAttendance[]>([]);
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [overall, setOverall] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalAttended, setTotalAttended] = useState(0);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.studentRole.getAttendanceSummary().catch(() => null);

      if (res?.subjects && Array.isArray(res.subjects)) {
        setSubjects(res.subjects);
        setOverall(res.overall ?? 0);
        setTotalClasses(res.totalClasses ?? 0);
        setTotalAttended(res.totalAttended ?? 0);
        if (res.student) setStudent(res.student);
      } else {
        // Fallback: use placeholder data if no records yet
        setSubjects([]);
        setOverall(0);
        setTotalClasses(0);
        setTotalAttended(0);
      }
    } catch (err) {
      console.error("Failed to load student attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B2500]" />
        <p className="text-xs font-semibold">Loading your attendance records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Attendance</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {student
            ? `${student.name} · ${student.rollNumber} · ${student.department} · Year ${student.year}${student.section ? ` · Section ${student.section}` : ""}`
            : "Your subject-wise attendance for the current semester"}
        </p>
      </div>

      {/* ── Overall Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Overall Attendance",
            value: `${overall}%`,
            color: overall >= 75 ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50",
          },
          {
            label: "Total Classes",
            value: totalClasses.toString(),
            color: "text-[#245DA8] bg-blue-50",
          },
          {
            label: "Classes Attended",
            value: totalAttended.toString(),
            color: "text-purple-600 bg-purple-50",
          },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-5 text-center ${s.color}`}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm font-medium mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Shortage Warning ── */}
      {overall > 0 && overall < 75 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-bold">
          ⚠️ Your overall attendance is below 75%. You may not be eligible to appear in examinations. Please attend classes regularly.
        </div>
      )}

      {/* ── Subject-wise Breakdown ── */}
      <Card title="Subject-wise Attendance" subtitle="Session-level attendance breakdown per subject">
        {subjects.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs font-semibold">
            No submitted attendance records found yet. Records will appear once your faculty submits attendance.
          </div>
        ) : (
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
                    <span className={`text-sm font-bold ${s.pct >= 75 ? "text-green-600" : "text-red-500"}`}>
                      {s.pct}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      s.pct >= 75
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : "bg-gradient-to-r from-red-400 to-red-500"
                    }`}
                    style={{ width: `${Math.min(s.pct, 100)}%` }}
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
        )}
      </Card>
    </div>
  );
}
