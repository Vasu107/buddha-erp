"use client";

import { useState } from "react";
import { 
  Building2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Bell, 
  Save, 
  Check, 
  User, 
  FileText,
  Sliders
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function HodSettingsPage() {
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    deptName: "Computer Science & Engineering",
    deptCode: "CSE",
    hodName: "Prof. Rajesh Sharma",
    hodEmail: "hod.cse@bit.ac.in",
    hodPhone: "+91 98765 43210",
    officeRoom: "Block B, Room 302",
    attendanceThreshold: 75,
    gradingScheme: "Absolute (70% Final, 30% Internal)",
    autoNotifyLowAttendance: true,
    enableFacultyAssignmentAlerts: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Department Settings & Controls</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Configure department parameters, notification rules, attendance thresholds, and HOD contact details.
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-xl border border-emerald-200">
            <Check size={16} /> Changes saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Department Info */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Building2 size={18} className="text-[#8B2500]" />
            <h3 className="font-bold text-slate-800 text-base">General Department Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Department Full Name</label>
              <input
                value={formData.deptName}
                onChange={e => setFormData({ ...formData, deptName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Department Code</label>
              <input
                disabled
                value={formData.deptCode}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Head of Department (HOD)</label>
              <input
                value={formData.hodName}
                onChange={e => setFormData({ ...formData, hodName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">HOD Email Address</label>
              <input
                type="email"
                value={formData.hodEmail}
                onChange={e => setFormData({ ...formData, hodEmail: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Office Phone Number</label>
              <input
                value={formData.hodPhone}
                onChange={e => setFormData({ ...formData, hodPhone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">HOD Cabin / Office Room</label>
              <input
                value={formData.officeRoom}
                onChange={e => setFormData({ ...formData, officeRoom: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
            </div>
          </div>
        </Card>

        {/* Academic Rules */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Sliders size={18} className="text-[#8B2500]" />
            <h3 className="font-bold text-slate-800 text-base">Academic Thresholds & Rules</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Minimum Attendance Warning Threshold (%)
              </label>
              <input
                type="number"
                value={formData.attendanceThreshold}
                onChange={e => setFormData({ ...formData, attendanceThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500]"
              />
              <p className="text-[11px] text-slate-400 mt-1">Students below this percentage trigger automatic warning flags.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Default Grading Policy</label>
              <select
                value={formData.gradingScheme}
                onChange={e => setFormData({ ...formData, gradingScheme: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] bg-white"
              >
                <option value="Absolute (70% Final, 30% Internal)">Absolute (70% Final, 30% Internal)</option>
                <option value="Relative Grading (Normal Curve)">Relative Grading (Normal Curve)</option>
                <option value="Continuous Assessment (50-50)">Continuous Assessment (50-50)</option>
              </select>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="mt-6 space-y-4 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">Auto-Alert Low Attendance</p>
                <p className="text-xs text-slate-500">Automatically send email notices to students failing attendance cutoff.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.autoNotifyLowAttendance}
                onChange={e => setFormData({ ...formData, autoNotifyLowAttendance: e.target.checked })}
                className="h-5 w-5 accent-[#8B2500] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">Faculty Assignment Notifications</p>
                <p className="text-xs text-slate-500">Notify faculty immediately when HOD allocates or edits subject workload.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.enableFacultyAssignmentAlerts}
                onChange={e => setFormData({ ...formData, enableFacultyAssignmentAlerts: e.target.checked })}
                className="h-5 w-5 accent-[#8B2500] rounded cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            icon={<Save size={16} />}
            className="bg-[#8B2500] hover:bg-[#6B1A00] text-white px-8 py-2.5 shadow-md shadow-[#8B2500]/20"
          >
            Save Department Settings
          </Button>
        </div>

      </form>

    </div>
  );
}
