"use client";

import { useState } from "react";
import { Save, Bell, RefreshCcw, Shield, LogOut, User, Globe } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoBackup,    setAutoBackup]    = useState(true);
  const [maintenanceMode, setMaintMode]   = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">System settings, users & permissions, backup.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {["System Settings", "Users & Permissions", "Backup"].map((t) => (
          <button key={t}
            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-slate-800 first:bg-white first:text-[#245DA8] first:shadow-sm transition-all">
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Institute Info */}
        <Card title="Institute Information" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Institute Name",    value: "Buddha Institute of Technology",    icon: "🏛️" },
              { label: "Academic Year",     value: "2024-25, Gorakhpur, Uttar Pradesh", icon: "📅" },
              { label: "Website",           value: "www.bit.ac.in",                     icon: "🌐" },
              { label: "Academic Size",     value: "Medium (1000+ students)",           icon: "📊" },
              { label: "Contact Email",     value: "admin@bit.ac.in",                   icon: "✉️" },
              { label: "Contact Phone",     value: "+91 123-4567890",                   icon: "📞" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">{f.icon} {f.label}</label>
                <input
                  defaultValue={f.value}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#245DA8] focus:ring-2 focus:ring-[#245DA8]/10 transition text-slate-700"
                />
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <Button icon={<Save size={14} />}>Save Changes</Button>
          </div>
        </Card>

        {/* Right column */}
        <div className="space-y-5">
          {/* Logo */}
          <Card title="Institute Logo">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#245DA8] to-[#1a4580] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">BIT</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">Buddha Institute of Technology</p>
                <p className="text-xs text-slate-500 mt-0.5">GIDA, Gorakhpur</p>
              </div>
              <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 hover:border-[#245DA8]/40 hover:bg-blue-50/30 transition">
                Upload New Logo
              </button>
            </div>
          </Card>

          {/* System Preferences */}
          <Card title="System Preferences">
            <div className="space-y-4">
              {[
                { label: "Enable Notifications", sub: "Get system alerts",       key: "notif",  val: notifications, set: setNotifications },
                { label: "Auto Backup",           sub: "Daily data backup",       key: "backup", val: autoBackup,    set: setAutoBackup    },
                { label: "Maintenance Mode",      sub: "Restrict student access", key: "maint",  val: maintenanceMode,set: setMaintMode     },
              ].map((p) => (
                <div key={p.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{p.label}</p>
                    <p className="text-xs text-slate-400">{p.sub}</p>
                  </div>
                  <button
                    onClick={() => p.set((v) => !v)}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${p.val ? "bg-[#245DA8]" : "bg-slate-200"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform duration-200 ${p.val ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-2">
              {[
                { icon: User,     label: "Change Password",  color: "text-[#245DA8] bg-blue-50" },
                { icon: RefreshCcw,label: "Update Profile",  color: "text-green-600 bg-green-50" },
                { icon: Shield,   label: "System Logs",      color: "text-purple-600 bg-purple-50" },
                { icon: LogOut,   label: "Logout",           color: "text-red-500 bg-red-50" },
              ].map(({ icon: Icon, label, color }) => (
                <button key={label}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition group text-left">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon size={15} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
