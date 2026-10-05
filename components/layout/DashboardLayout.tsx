"use client";

import { useState, useEffect } from "react";
import AppSidebar from "./AppSidebar";
import TopNavbar from "./TopNavbar";
import { directorNav, hodNav, facultyNav, studentNav } from "@/config/navigation";

type Role = "director" | "hod" | "faculty" | "student";

const navMap: Record<Role, typeof directorNav> = {
  director: directorNav,
  hod: hodNav,
  faculty: facultyNav,
  student: studentNav,
};

const defaultUserMap: Record<Role, { name: string; designation: string; email: string }> = {
  director: { name: "Dr. A. Verma", designation: "Director", email: "director@bit.ac.in" },
  hod:      { name: "Dr. R. Sharma", designation: "Head of Department", email: "hod@bit.ac.in" },
  faculty:  { name: "Prof. S. Gupta", designation: "Assistant Professor", email: "faculty@bit.ac.in" },
  student:  { name: "Rahul Kumar", designation: "B.Tech — CSE, Sem 3", email: "student@bit.ac.in" },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: Role;
}

export default function DashboardLayout({
  children,
  role = "director",
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(defaultUserMap[role]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bit_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          setUser({
            name: parsed.name,
            designation: parsed.role || defaultUserMap[role].designation,
            email: parsed.email || defaultUserMap[role].email,
          });
        }
      }
    } catch (e) {
      // fallback to defaults
    }
  }, [role]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5]">
      <AppSidebar
        items={navMap[role]}
        role={role}
        userName={user.name}
        userEmail={user.email}
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar
          userName={user.name}
          userRole={role}
          userDesignation={user.designation}
        />
        <main className="flex-1 overflow-y-auto bg-[#f5f5f5]">
          <div className="p-6 max-w-[1600px] mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
