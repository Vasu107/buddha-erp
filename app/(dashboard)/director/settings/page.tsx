"use client";

import { useState, useEffect } from "react";
import { Save, Bell, RefreshCcw, Shield, LogOut, User, Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { getInitials } from "@/lib/utils";

interface DirectorProfile {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  createdAt?: string;
  user?: { name: string; email: string; createdAt: string };
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintMode] = useState(false);

  // Profile state
  const [profile, setProfile] = useState<DirectorProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmployeeId, setFormEmployeeId] = useState("");

  // ── Load profile ──────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.director.getProfile();
        const p = (res.profile ?? res.data) as DirectorProfile;
        setProfile(p);
        setFormName(p?.user?.name ?? p?.name ?? "");
        setFormEmployeeId(p?.employeeId ?? "");
      } catch (e: any) {
        setProfileError("Could not load profile: " + (e.message ?? "Unknown error"));
      } finally {
        setProfileLoading(false);
      }
    };
    load();
  }, []);

  // Auto-dismiss success
  useEffect(() => {
    if (!profileSuccess) return;
    const t = setTimeout(() => setProfileSuccess(null), 3500);
    return () => clearTimeout(t);
  }, [profileSuccess]);

  // ── Save profile ──────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError(null);
    try {
      const res = await api.director.updateProfile({
        name: formName.trim() || undefined,
        employeeId: formEmployeeId.trim() || undefined,
      });
      const updated = (res.profile ?? res.data) as DirectorProfile;
      setProfile(updated);
      setProfileSuccess("Profile updated successfully!");
    } catch (e: any) {
      setProfileError(e.message ?? "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const displayName = profile?.user?.name ?? profile?.name ?? "Director";
  const displayEmail = profile?.user?.email ?? profile?.email ?? "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Settings & Profile</h1>
        <p className="text-slate-500 text-sm mt-0.5">Update your profile, system settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Director Profile Card ── */}
        <Card title="Director Profile" className="lg:col-span-2">
          {profileLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-slate-400" />
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Avatar + name display */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#245DA8] to-[#1a4580] flex items-center justify-center text-white text-xl font-black shadow-lg">
                  {getInitials(displayName)}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">{displayName}</p>
                  <p className="text-sm text-slate-500">{displayEmail}</p>
                  <span className="mt-1 inline-block px-2 py-0.5 bg-[#245DA8]/10 text-[#245DA8] text-xs font-bold rounded-md">
                    DIRECTOR
                  </span>
                </div>
              </div>

              {profileError && (
                <div className="px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  ✗ {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="px-3 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                  ✓ {profileSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                  <input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#245DA8] focus:ring-2 focus:ring-[#245DA8]/10 transition text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Employee ID</label>
                  <input
                    value={formEmployeeId}
                    onChange={(e) => setFormEmployeeId(e.target.value)}
                    placeholder="e.g. EMP001"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#245DA8] focus:ring-2 focus:ring-[#245DA8]/10 transition text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email (read-only)</label>
                  <input
                    value={displayEmail}
                    readOnly
                    className="w-full px-3 py-2.5 text-sm border border-slate-100 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>

                {profile?.createdAt || profile?.user?.createdAt ? (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Account Created</label>
                    <input
                      value={new Date(profile.user?.createdAt ?? profile.createdAt!).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                      readOnly
                      className="w-full px-3 py-2.5 text-sm border border-slate-100 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex justify-end">
                <Button icon={profileSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  type="submit" disabled={profileSaving}>
                  {profileSaving ? "Saving…" : "Save Profile"}
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* ── Right column ── */}
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
            </div>
          </Card>

          {/* System Preferences */}
          <Card title="System Preferences">
            <div className="space-y-4">
              {[
                { label: "Enable Notifications", sub: "Get system alerts", key: "notif", val: notifications, set: setNotifications },
                { label: "Auto Backup", sub: "Daily data backup", key: "backup", val: autoBackup, set: setAutoBackup },
                { label: "Maintenance Mode", sub: "Restrict student access", key: "maint", val: maintenanceMode, set: setMaintMode },
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
                { icon: User, label: "Change Password", color: "text-[#245DA8] bg-blue-50" },
                { icon: RefreshCcw, label: "Refresh Data", color: "text-green-600 bg-green-50", action: () => window.location.reload() },
                { icon: Shield, label: "System Logs", color: "text-purple-600 bg-purple-50" },
                { icon: LogOut, label: "Logout", color: "text-red-500 bg-red-50", action: () => { localStorage.removeItem("bit_token"); localStorage.removeItem("bit_user"); localStorage.removeItem("bit_profile"); document.cookie = "bit_token=; path=/; max-age=0"; window.location.href = "/login"; } },
              ].map(({ icon: Icon, label, color, action }) => (
                <button key={label} onClick={action}
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
