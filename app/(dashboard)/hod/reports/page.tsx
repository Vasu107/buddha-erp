"use client";

import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  FileSpreadsheet, 
  Download, 
  Users, 
  GraduationCap, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  PieChart 
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface DepartmentMetric {
  year: string;
  totalStudents: number;
  avgCgpa: number;
  passPercentage: number;
  topSubject: string;
}

const semesterMetrics: DepartmentMetric[] = [
  { year: "1st Year (Sem 1 & 2)", totalStudents: 120, avgCgpa: 8.12, passPercentage: 94.2, topSubject: "CS101 Programming fundamentals" },
  { year: "2nd Year (Sem 3 & 4)", totalStudents: 115, avgCgpa: 7.95, passPercentage: 91.8, topSubject: "CS301 Data Structures" },
  { year: "3rd Year (Sem 5 & 6)", totalStudents: 108, avgCgpa: 8.41, passPercentage: 96.5, topSubject: "CS501 Database Management Systems" },
  { year: "4th Year (Sem 7 & 8)", totalStudents: 102, avgCgpa: 8.65, passPercentage: 98.0, topSubject: "CS701 Cloud Computing" }
];

export default function HodReportsPage() {
  const [selectedSemester, setSelectedSemester] = useState<string>("ALL");

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Department Performance & Academic Reports</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Consolidated departmental analytics, pass percentages, CGPA distribution, and accredited exports.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<FileSpreadsheet size={15} />}
            onClick={() => alert("Downloading Departmental Summary Excel (.xlsx)...")}
          >
            Export Excel
          </Button>
          <Button
            icon={<Download size={15} />}
            onClick={() => alert("Downloading Complete NAAC / NBA Academic Report (PDF)...")}
            className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
          >
            Generate NAAC Report
          </Button>
        </div>
      </div>

      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-[#8B2500]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Department Avg CGPA</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">8.28 / 10</p>
            </div>
            <div className="p-3 bg-red-50 text-[#8B2500] rounded-xl">
              <Award size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium gap-1">
            <TrendingUp size={13} /> +0.24 from previous year
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Overall Pass Rate</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">95.1%</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">
            423 of 445 students passed
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Enrolled Students</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">445</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <GraduationCap size={22} />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">
            Across 4 Academic Batches
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Active Subjects</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">24</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <BookOpen size={22} />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">
            18 Theory + 6 Laboratories
          </div>
        </Card>
      </div>

      {/* Breakdown Table */}
      <Card noPad className="shadow-sm border-slate-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[#8B2500]" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Year-Wise Academic Breakdown</h3>
          </div>
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
            className="px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
          >
            <option value="ALL">All Academic Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Academic Batch</th>
                <th className="p-4 text-center">Enrolled Students</th>
                <th className="p-4 text-center">Batch Avg CGPA</th>
                <th className="p-4 text-center">Pass Percentage</th>
                <th className="p-4">Highest Scoring Subject</th>
                <th className="p-4 text-right">Download Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {semesterMetrics.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{item.year}</td>
                  <td className="p-4 text-center font-semibold text-slate-700">{item.totalStudents}</td>
                  <td className="p-4 text-center font-bold text-[#8B2500]">{item.avgCgpa}</td>
                  <td className="p-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      {item.passPercentage}%
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 text-xs font-medium">{item.topSubject}</td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Download size={13} />}
                      onClick={() => alert(`Downloading report for ${item.year}...`)}
                      className="text-xs"
                    >
                      Export PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <PieChart size={18} className="text-[#8B2500]" />
            <h4 className="font-bold text-slate-800 text-sm">CGPA Distribution (Department)</h4>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700 font-semibold">9.0 - 10.0 (Outstanding / Distinction)</span>
                <span className="text-emerald-600 font-bold">18% (80 Students)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "18%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700 font-semibold">8.0 - 8.9 (First Class with Distinction)</span>
                <span className="text-blue-600 font-bold">45% (200 Students)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700 font-semibold">7.0 - 7.9 (First Class)</span>
                <span className="text-amber-600 font-bold">28% (125 Students)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "28%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700 font-semibold">Below 7.0 (Second Class / At Risk)</span>
                <span className="text-red-600 font-bold">9% (40 Students)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: "9%" }}></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Users size={18} className="text-[#8B2500]" />
            <h4 className="font-bold text-slate-800 text-sm">Faculty Feedback & Teaching Index</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="font-semibold text-slate-800 text-xs">Dr. Anjali Verma</p>
                <p className="text-[11px] text-slate-500">DBMS & Data Structures</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">
                4.8 / 5.0 ⭐
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="font-semibold text-slate-800 text-xs">Prof. Suresh Vet</p>
                <p className="text-[11px] text-slate-500">Algorithms & Automata</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">
                4.6 / 5.0 ⭐
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="font-semibold text-slate-800 text-xs">Dr. Vikram Kumar</p>
                <p className="text-[11px] text-slate-500">Cloud Computing & OS</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">
                4.7 / 5.0 ⭐
              </span>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
