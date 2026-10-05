"use client";

import { Bell, Search, ChevronDown, User, Settings, Calendar, CircleCheckBig } from "lucide-react";
import { useState } from "react";
import { getInitials } from "@/lib/utils";

interface TopNavbarProps {
  userName: string;
  userRole: string;
  userDesignation?: string;
}

export default function TopNavbar({ userName, userRole, userDesignation }: TopNavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: "New faculty added", time: "10:52 AM", unread: true },
    { id: 2, text: "Student application approval", time: "10:25 AM", unread: true },
    { id: 3, text: "Timetable updated", time: "11h Ago", unread: false },
    { id: 4, text: "Leave request approved", time: "Yesterday", unread: false },
  ];
  const unreadCount = notifications.filter((n) => n.unread).length;
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0 relative z-30">
      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search students, faculty, courses…"
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/10 transition placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Date Range chip (DL08 style) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer hover:border-[#8B2500]/40 transition">
          <Calendar size={13} className="text-slate-400" />
          <span className="font-medium text-slate-600">{today}</span>
        </div>

        {/* Academic Year */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer hover:border-[#8B2500]/40 transition">
          <span className="text-slate-500 font-medium">AY</span>
          <span className="font-bold text-slate-700">2024–25</span>
          <ChevronDown size={12} className="text-slate-400" />
        </div>

        {/* Director Portal pill (like "Sold Vehicles" in reference) */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#059669]/8 border border-[#059669]/20 rounded-lg text-xs font-semibold text-[#059669] cursor-pointer hover:bg-[#059669]/15 transition capitalize">
          <CircleCheckBig size={14} className="text-[#059669]" />
          {userRole} Portal
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition text-slate-500"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C13A00] rounded-full ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="font-semibold text-slate-800 text-sm">Notifications</p>
                <span className="text-xs text-[#8B2500] font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-slate-50 transition ${n.unread ? "bg-orange-50/40" : ""}`}
                  >
                    {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#8B2500] mt-2 shrink-0" />}
                    <div className={n.unread ? "" : "ml-3.5"}>
                      <p className="text-sm text-slate-700">{n.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <span className="text-xs text-[#8B2500] font-medium cursor-pointer hover:underline">View All →</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C13A00] to-[#8B2500] flex items-center justify-center text-white font-bold text-xs shadow">
              {getInitials(userName)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{userName}</p>
              <p className="text-[11px] text-slate-400 leading-tight capitalize">{userDesignation || userRole}</p>
            </div>
            <ChevronDown size={13} className="text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-fade-in overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="font-semibold text-slate-800 text-sm">{userName}</p>
                <p className="text-xs text-slate-500 capitalize">{userRole}</p>
              </div>
              <div className="py-1">
                {[
                  { icon: User, label: "My Profile" },
                  { icon: Settings, label: "Settings" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-[#8B2500]/8 hover:text-[#8B2500] transition"
                  >
                    <Icon size={15} className="text-slate-400" />
                    {label}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-100 py-1">
                <button
                  onClick={async () => {
                    try { await fetch("http://localhost:5000/api/auth/logout", { method: "POST" }); } catch (e) {}
                    localStorage.removeItem("bit_user");
                    localStorage.removeItem("bit_profile");
                    localStorage.removeItem("bit_token");
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click-away */}
      {(profileOpen || notifOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setProfileOpen(false); setNotifOpen(false); }} />
      )}
    </header>
  );
}
