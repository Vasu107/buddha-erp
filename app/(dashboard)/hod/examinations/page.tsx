"use client";

import { useState } from "react";
import { 
  FileText, 
  Calendar, 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Search, 
  Filter,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface ExamSchedule {
  id: string;
  code: string;
  title: string;
  type: "Mid-Term" | "End-Term" | "Practical Lab";
  date: string;
  time: string;
  venue: string;
  invigilator: string;
  status: "Paper Approved" | "Paper Pending" | "Completed";
  enrolledStudents: number;
}

const initialExams: ExamSchedule[] = [
  {
    id: "1",
    code: "CS501",
    title: "Database Management Systems",
    type: "Mid-Term",
    date: "2026-10-15",
    time: "10:00 AM - 12:00 PM",
    venue: "Hall A-101",
    invigilator: "Dr. Anjali Verma",
    status: "Paper Approved",
    enrolledStudents: 68
  },
  {
    id: "2",
    code: "CS502",
    title: "Design & Analysis of Algorithms",
    type: "Mid-Term",
    date: "2026-10-17",
    time: "02:00 PM - 04:00 PM",
    venue: "Hall B-204",
    invigilator: "Prof. Suresh Vet",
    status: "Paper Pending",
    enrolledStudents: 65
  },
  {
    id: "3",
    code: "CS505",
    title: "DBMS Laboratory Exam",
    type: "Practical Lab",
    date: "2026-10-19",
    time: "09:00 AM - 01:00 PM",
    venue: "CSE Lab 3",
    invigilator: "Dr. Vikram Kumar",
    status: "Paper Approved",
    enrolledStudents: 34
  },
  {
    id: "4",
    code: "CS701",
    title: "Cloud Computing",
    type: "End-Term",
    date: "2026-11-05",
    time: "10:00 AM - 01:00 PM",
    venue: "Main Auditorium",
    invigilator: "Dr. Anjali Verma",
    status: "Paper Pending",
    enrolledStudents: 52
  }
];

export default function HodExaminationsPage() {
  const [exams, setExams] = useState<ExamSchedule[]>(initialExams);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    type: "Mid-Term" as "Mid-Term" | "End-Term" | "Practical Lab",
    date: "",
    time: "",
    venue: "",
    invigilator: "Dr. Anjali Verma",
    enrolledStudents: 60
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newExam: ExamSchedule = {
      id: Date.now().toString(),
      ...formData,
      status: "Paper Pending"
    };
    setExams([newExam, ...exams]);
    setIsModalOpen(false);
    setFormData({
      code: "",
      title: "",
      type: "Mid-Term",
      date: "",
      time: "",
      venue: "",
      invigilator: "Dr. Anjali Verma",
      enrolledStudents: 60
    });
  };

  const toggleApproval = (id: string) => {
    setExams(prev =>
      prev.map(e => {
        if (e.id === id) {
          const nextStatus = e.status === "Paper Approved" ? "Paper Pending" : "Paper Approved";
          return { ...e, status: nextStatus };
        }
        return e;
      })
    );
  };

  const filteredExams = exams.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.code.toLowerCase().includes(search.toLowerCase()) || e.invigilator.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "ALL" || e.type === filterType;
    return matchesSearch && matchesType;
  });

  const approvedCount = exams.filter(e => e.status === "Paper Approved").length;
  const pendingCount = exams.filter(e => e.status === "Paper Pending").length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Department Examinations & Invigilation</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Oversee examination timetables, invigilation duties, and question paper approvals.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<Download size={15} />}
            onClick={() => alert("Exporting Examination Schedule PDF...")}
          >
            Export Schedule
          </Button>
          <Button
            icon={<Plus size={16} />}
            onClick={() => setIsModalOpen(true)}
            className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
          >
            Schedule Exam
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 bg-red-50 text-[#8B2500] rounded-xl">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Scheduled</p>
            <p className="text-2xl font-bold text-slate-800">{exams.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Papers Approved</p>
            <p className="text-2xl font-bold text-emerald-700">{approvedCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Approval Pending</p>
            <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Invigilators Assigned</p>
            <p className="text-2xl font-bold text-blue-700">4 Faculty</p>
          </div>
        </Card>
      </div>

      {/* Table & Controls */}
      <Card noPad className="shadow-sm border-slate-200">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search subject, invigilator..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={15} className="text-slate-400" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-700"
            >
              <option value="ALL">All Exam Types</option>
              <option value="Mid-Term">Mid-Term</option>
              <option value="End-Term">End-Term</option>
              <option value="Practical Lab">Practical Lab</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Subject</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Venue</th>
                <th className="p-4">Invigilator</th>
                <th className="p-4">Q-Paper HOD Signoff</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExams.map(exam => (
                <tr key={exam.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                        {exam.code}
                      </span>
                      <span>{exam.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      exam.type === 'Mid-Term' ? 'bg-amber-100 text-amber-800' :
                      exam.type === 'End-Term' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {exam.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div className="font-medium text-slate-800">{exam.date}</div>
                    <div className="text-xs text-slate-400">{exam.time}</div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{exam.venue}</td>
                  <td className="p-4 text-slate-800 font-medium flex items-center gap-1.5">
                    <UserCheck size={14} className="text-[#8B2500]" />
                    {exam.invigilator}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleApproval(exam.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        exam.status === "Paper Approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      {exam.status === "Paper Approved" ? (
                        <>
                          <CheckCircle2 size={13} /> HOD Approved
                        </>
                      ) : (
                        <>
                          <Clock size={13} /> Pending HOD Approval
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleApproval(exam.id)}
                      className="text-xs"
                    >
                      Toggle Status
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Department Examination">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Subject Code</label>
              <input
                required
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. CS503"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Exam Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              >
                <option value="Mid-Term">Mid-Term</option>
                <option value="End-Term">End-Term</option>
                <option value="Practical Lab">Practical Lab</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Subject Title</label>
            <input
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Software Engineering"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Time Range</label>
              <input
                required
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                placeholder="10:00 AM - 01:00 PM"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Venue / Exam Room</label>
              <input
                required
                value={formData.venue}
                onChange={e => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Hall B-102"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Invigilator</label>
              <select
                value={formData.invigilator}
                onChange={e => setFormData({ ...formData, invigilator: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              >
                <option value="Dr. Anjali Verma">Dr. Anjali Verma</option>
                <option value="Prof. Suresh Vet">Prof. Suresh Vet</option>
                <option value="Dr. Vikram Kumar">Dr. Vikram Kumar</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#8B2500] hover:bg-[#6B1A00] text-white">
              Schedule Exam
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
