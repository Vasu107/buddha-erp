"use client";

import { useState } from "react";
import { Megaphone, Plus, Search, FileText, Upload, Download, Trash2, Edit2, Calendar, CheckCircle2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface FacultyNotice {
  id: string;
  title: string;
  content: string;
  subjectCode: string;
  date: string;
  pdfName?: string;
}

const initialNotices: FacultyNotice[] = [
  { id: "1", title: "DBMS Lab Practical Test Schedule", content: "The Batch A1 practical test will be held on Thursday at 01:30 PM in Lab 3. Bring your signed lab manuals.", subjectCode: "CS505", date: "2026-10-01", pdfName: "DBMS_Lab_Test_Instructions.pdf" },
  { id: "2", title: "Assignment 2 Submission Extension", content: "Due to server maintenance, Assignment 2 submission deadline has been extended to Monday 5:00 PM.", subjectCode: "CS501", date: "2026-09-28" },
];

export default function FacultyAnnouncementsPage() {
  const [notices, setNotices] = useState<FacultyNotice[]>(initialNotices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subjectCode: "CS501 - Database Management Systems",
    pdfName: "",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: FacultyNotice = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      subjectCode: formData.subjectCode,
      date: new Date().toISOString().split("T")[0],
      pdfName: formData.pdfName || undefined,
    };
    setNotices([newNotice, ...notices]);
    setIsModalOpen(false);
    setFormData({ title: "", content: "", subjectCode: "CS501 - Database Management Systems", pdfName: "" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this notice?")) {
      setNotices((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Faculty Announcements to Students</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Publish course notices, assignment instructions, and lab updates to your enrolled students.
          </p>
        </div>
        <Button
          icon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
          className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
        >
          Publish Class Notice
        </Button>
      </div>

      {/* ── Notices Feed ── */}
      <div className="space-y-4">
        {notices.map((n) => (
          <div key={n.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-1 bg-[#FFF5F0] text-[#8B2500] font-bold text-xs rounded-lg border border-[#8B2500]/15">
                {n.subjectCode}
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Calendar size={13} /> {n.date}</span>
                <button onClick={() => handleDelete(n.id)} className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">{n.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">{n.content}</p>
            {n.pdfName && (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                <FileText size={15} className="text-[#8B2500]" />
                <span>{n.pdfName}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish Class Notice">
        <form onSubmit={handleSave} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Subject *</label>
            <select
              value={formData.subjectCode}
              onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white text-slate-800"
            >
              <option value="CS501">CS501 - Database Management Systems</option>
              <option value="CS502">CS502 - Design & Analysis of Algorithms</option>
              <option value="CS505">CS505 - DBMS Laboratory</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Quiz 1 Announcement"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Message Content *</label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write message details for students..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#8B2500] hover:bg-[#6B1A00] text-white">Publish Notice</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
