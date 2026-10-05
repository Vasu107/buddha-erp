"use client";

import { useState } from "react";
import {
  FileSpreadsheet, FileText, Upload, Save, CheckCircle2,
  Search, Filter, ArrowUpRight, Award, Plus, Trash2
} from "lucide-react";
import Card from "@/components/ui/Card";

interface StudentMark {
  rollNumber: string;
  name: string;
  internalMarks: number; // out of 30
  midTermMarks: number;  // out of 20
  assignmentMarks: number; // out of 10
  total: number; // out of 60
}

const initialMarks: StudentMark[] = [
  { rollNumber: "21001", name: "Aman Gupta", internalMarks: 27, midTermMarks: 18, assignmentMarks: 9, total: 54 },
  { rollNumber: "21002", name: "Priya Sharma", internalMarks: 29, midTermMarks: 19, assignmentMarks: 10, total: 58 },
  { rollNumber: "21003", name: "Rahul Verma", internalMarks: 22, midTermMarks: 14, assignmentMarks: 8, total: 44 },
  { rollNumber: "21004", name: "Sneha Patel", internalMarks: 29, midTermMarks: 19, assignmentMarks: 10, total: 58 },
  { rollNumber: "21005", name: "Vikas Kumar", internalMarks: 24, midTermMarks: 15, assignmentMarks: 8, total: 47 },
  { rollNumber: "21006", name: "Kavita Singh", internalMarks: 25, midTermMarks: 16, assignmentMarks: 9, total: 50 },
];

export default function FacultyResultsPage() {
  const [marks, setMarks] = useState<StudentMark[]>(initialMarks);
  const [selectedSubject, setSelectedSubject] = useState("CS501 - Database Management Systems");
  const [examType, setExamType] = useState("Internal Assessment & Mid-Term");
  const [search, setSearch] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleMarkChange = (rollNumber: string, field: keyof StudentMark, val: number) => {
    setMarks((prev) =>
      prev.map((m) => {
        if (m.rollNumber === rollNumber) {
          const updated = { ...m, [field]: val };
          updated.total = (updated.internalMarks || 0) + (updated.midTermMarks || 0) + (updated.assignmentMarks || 0);
          return updated;
        }
        return m;
      })
    );
    setIsSaved(false);
  };

  const handleSaveMarks = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  /* ── Interactive CSV/Excel File Upload Handler ── */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
          if (lines.length > 1) {
            const parsedMarks: StudentMark[] = [];
            // Parse CSV lines: RollNo, Name, Internal, MidTerm, Assignment
            for (let i = 1; i < lines.length; i++) {
              const parts = lines[i].split(",");
              if (parts.length >= 3) {
                const rNo = parts[0].replace(/"/g, "").trim();
                const name = parts[1].replace(/"/g, "").trim();
                const internal = parseInt(parts[2]) || 20;
                const mid = parseInt(parts[3]) || 15;
                const assign = parseInt(parts[4]) || 8;
                parsedMarks.push({
                  rollNumber: rNo,
                  name: name || `Student ${rNo}`,
                  internalMarks: internal,
                  midTermMarks: mid,
                  assignmentMarks: assign,
                  total: internal + mid + assign,
                });
              }
            }

            if (parsedMarks.length > 0) {
              setMarks(parsedMarks);
              setUploadSuccess(`Successfully loaded ${parsedMarks.length} student marks from ${file.name}`);
              setTimeout(() => setUploadSuccess(null), 4000);
            }
          }
        }
      };
      reader.readAsText(file);
    }
  };

  /* ── Export to CSV / Excel ── */
  const exportToExcelCSV = () => {
    const headers = ["Roll Number,Student Name,Subject,Internal Marks (30),Mid-Term Marks (20),Assignment Marks (10),Total Marks (60),Grade\n"];
    const rows = marks.map(
      (m) =>
        `"${m.rollNumber}","${m.name}","${selectedSubject}","${m.internalMarks}","${m.midTermMarks}","${m.assignmentMarks}","${m.total}","${m.total >= 50 ? "A+" : m.total >= 40 ? "A" : "B"}"`
    );

    const csvContent = "data:text/csv;charset=utf-8," + headers.join("") + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MarksSheet_${selectedSubject.split(" ")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ── Export to PDF Report ── */
  const exportToPDF = () => {
    const printableWindow = window.open("", "_blank");
    if (!printableWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Marks Report - ${selectedSubject}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #111827; }
            .header { border-bottom: 2px solid #8B2500; padding-bottom: 12px; margin-bottom: 20px; }
            .title { font-size: 20px; font-weight: bold; color: #8B2500; margin: 0; }
            .subtitle { font-size: 13px; color: #6b7280; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
            th { background: #8B2500; color: white; text-align: left; padding: 8px 12px; }
            td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
            .total { font-weight: bold; color: #8B2500; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Buddha Institute of Technology — Official Marks Sheet</h1>
            <p class="subtitle">${selectedSubject} | Evaluation: ${examType}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Internal (30)</th>
                <th>Mid-Term (20)</th>
                <th>Assignments (10)</th>
                <th>Total (60)</th>
              </tr>
            </thead>
            <tbody>
              ${marks
                .map(
                  (m) => `
                <tr>
                  <td>${m.rollNumber}</td>
                  <td>${m.name}</td>
                  <td>${m.internalMarks}</td>
                  <td>${m.midTermMarks}</td>
                  <td>${m.assignmentMarks}</td>
                  <td class="total">${m.total} / 60</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printableWindow.document.write(htmlContent);
    printableWindow.document.close();
    printableWindow.print();
  };

  const filtered = marks.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* ── Page Header & Interactive Action Buttons (Matching Reference Design) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Student Results & Marks Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Enter marks, upload bulk Excel/CSV mark sheets, or download formatted PDF reports.
          </p>
        </div>

        {/* Action Buttons matching Reference UI Pill Design */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Upload Excel / CSV */}
          <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#059669] font-bold text-xs border border-[#10B981]/30 transition shadow-xs cursor-pointer">
            <Upload size={15} className="text-[#059669]" />
            <span>Upload Excel / CSV</span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Export Excel / CSV */}
          <button
            onClick={exportToExcelCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ECFDF5] hover:bg-emerald-100 text-[#059669] font-bold text-xs border border-[#10B981]/30 transition shadow-xs cursor-pointer"
          >
            <FileSpreadsheet size={15} className="text-[#059669]" />
            <span>Export Excel / CSV</span>
          </button>

          {/* Export PDF Report */}
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F4F8] hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition shadow-xs cursor-pointer"
          >
            <FileText size={15} className="text-[#8B2500]" />
            <span>Export PDF Report</span>
          </button>

          {/* Save All Marks Primary Button */}
          <button
            onClick={handleSaveMarks}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#C13A00] to-[#8B2500] hover:from-[#a33100] hover:to-[#6B1A00] text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <Save size={15} />
            <span>Save All Marks</span>
          </button>

        </div>
      </div>

      {/* Upload Success Banner */}
      {uploadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            {uploadSuccess}
          </span>
        </div>
      )}

      {/* Save Toast Banner */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Marks for {selectedSubject} saved and submitted to academic portal successfully!
          </span>
        </div>
      )}

      {/* ── Controls Row ── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800 font-bold"
            >
              <option value="CS501 - Database Management Systems">CS501 - Database Management Systems</option>
              <option value="CS502 - Design & Analysis of Algorithms">CS502 - Design & Analysis of Algorithms</option>
              <option value="CS505 - DBMS Laboratory">CS505 - DBMS Laboratory</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Evaluation Scheme</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800 font-semibold"
            >
              <option>Internal Assessment & Mid-Term</option>
              <option>Mid-Term Examination (Out of 20)</option>
              <option>Assignment / Project Marks (Out of 10)</option>
              <option>Practical Lab Evaluation (Out of 30)</option>
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roll no, student name..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
          />
        </div>
      </div>

      {/* ── Interactive Marks Table ── */}
      <Card noPad className="shadow-sm border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-left">
                {["#", "Roll No", "Student Name", "Internal (30)", "Mid-Term (20)", "Assignments (10)", "Total (60)", "Grade"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((m, i) => (
                <tr key={m.rollNumber} className="hover:bg-[#FFF5F0]/40 transition-colors">
                  <td className="px-4 py-3.5 text-slate-400 text-xs font-medium">{i + 1}</td>
                  
                  <td className="px-4 py-3.5 font-bold text-slate-700 text-xs">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200 font-mono">
                      {m.rollNumber}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3.5 font-bold text-slate-800">{m.name}</td>
                  
                  {/* Internal Marks */}
                  <td className="px-4 py-3.5">
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={m.internalMarks}
                      onChange={(e) => handleMarkChange(m.rollNumber, "internalMarks", parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#8B2500] text-center bg-slate-50/50"
                    />
                  </td>

                  {/* Mid Term Marks */}
                  <td className="px-4 py-3.5">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={m.midTermMarks}
                      onChange={(e) => handleMarkChange(m.rollNumber, "midTermMarks", parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#8B2500] text-center bg-slate-50/50"
                    />
                  </td>

                  {/* Assignment Marks */}
                  <td className="px-4 py-3.5">
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={m.assignmentMarks}
                      onChange={(e) => handleMarkChange(m.rollNumber, "assignmentMarks", parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#8B2500] text-center bg-slate-50/50"
                    />
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3.5 font-black text-[#8B2500] text-base">
                    {m.total} / 60
                  </td>

                  {/* Grade Badge */}
                  <td className="px-4 py-3.5">
                    {m.total >= 54 ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold ring-1 ring-emerald-200">
                        O (Outstanding)
                      </span>
                    ) : m.total >= 48 ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold ring-1 ring-blue-200">
                        A+ (Excellent)
                      </span>
                    ) : m.total >= 40 ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold ring-1 ring-slate-200">
                        A (Very Good)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold ring-1 ring-amber-200">
                        B (Good)
                      </span>
                    )}
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
