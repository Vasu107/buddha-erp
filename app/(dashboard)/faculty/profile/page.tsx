"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Building2, Award, Save, CheckCircle2, ShieldCheck } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function FacultyProfilePage() {
  const [profile, setProfile] = useState({
    name: "Dr. Anjali Verma",
    employeeId: "FAC001",
    email: "faculty.cse@bit.ac.in",
    phone: "+91 98765 43210",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    qualification: "Ph.D. in Computer Science & Engineering",
    specialization: "Database Systems, Machine Learning & Cloud",
    experienceYears: "8 Years",
    cabinRoom: "Faculty Block B, Cabin 204",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bit_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setProfile((prev) => ({ ...prev, name: u.name, email: u.email || prev.email }));
      }
    } catch (e) {}
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Faculty Personal Profile</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            View and manage permitted personal contact details, cabin location, and research specializations.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
          <ShieldCheck size={14} /> Authorized Access
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" /> Profile information updated successfully!
        </div>
      )}

      {/* ── Profile Form Card ── */}
      <Card className="shadow-sm border-slate-200">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C13A00] to-[#8B2500] text-white flex items-center justify-center font-black text-xl shadow-md">
              AV
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{profile.name}</h2>
              <p className="text-xs text-[#8B2500] font-semibold">{profile.designation} · {profile.department}</p>
              <p className="text-xs text-slate-400 mt-0.5">Employee ID: {profile.employeeId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
              <input
                disabled
                value={profile.email}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 bg-slate-50 text-slate-500 rounded-xl cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Office / Cabin Room Location</label>
              <input
                value={profile.cabinRoom}
                onChange={(e) => setProfile({ ...profile, cabinRoom: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Highest Qualification</label>
              <input
                value={profile.qualification}
                onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Research Specializations</label>
              <input
                value={profile.specialization}
                onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              icon={<Save size={15} />}
              className="bg-[#8B2500] hover:bg-[#6B1A00] text-white shadow-md shadow-[#8B2500]/20"
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

    </div>
  );
}
