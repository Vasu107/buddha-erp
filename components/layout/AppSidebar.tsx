"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, BookOpen, Users, GraduationCap, Building2,
  ClipboardList, CalendarDays, ClipboardCheck, BarChart3, Settings,
  FileText, UserCog, Layers, ChevronRight, BookMarked, RefreshCcw,
  LogOut, ChevronLeft, Megaphone, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, BookOpen, Users, GraduationCap, Building2,
  ClipboardList, CalendarDays, ClipboardCheck, BarChart3, Settings,
  FileText, UserCog, Layers, BookMarked, RefreshCcw, Megaphone, Award,
};

interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
}

interface AppSidebarProps {
  items: NavItem[];
  role: string;
  userName: string;
  userEmail: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

function NavLink({
  item,
  collapsed,
  depth = 0,
}: {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
}) {
  const pathname = usePathname();
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasChildren && item.children!.some(
    (c) => pathname === c.href || (c.href !== "/" && pathname.startsWith(c.href))
  );
  const [open, setOpen] = useState(isChildActive);
  const Icon = iconMap[item.icon] ?? LayoutDashboard;
  const isActive =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href)) ||
    isChildActive;

  const baseClass = cn(
    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group relative text-sm font-medium",
    collapsed ? "justify-center px-2" : "",
    isActive
      ? "bg-[#8B2500]/10 text-[#8B2500] font-semibold"
      : "text-slate-600 hover:bg-[#8B2500]/8 hover:text-[#8B2500]"
  );

  if (hasChildren && !collapsed) {
    return (
      <div>
        <button
          onClick={() => setOpen((p) => !p)}
          className={baseClass}
        >
          <Icon size={17} className="shrink-0" />
          <span className="flex-1 truncate">{item.label}</span>
          <ChevronRight
            size={13}
            className={cn("transition-transform duration-200 text-slate-400", open && "rotate-90")}
          />
        </button>
        {open && (
          <div className="mt-0.5 ml-4 pl-3 border-l-2 border-[#8B2500]/15 space-y-0.5">
            {item.children!.map((child) => (
              <NavLink key={child.href} item={child} collapsed={false} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={baseClass}
    >
      <Icon size={17} className="shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {/* Active indicator */}
      {isActive && !collapsed && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#8B2500]" />
      )}
      {/* Tooltip on collapse */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
          {item.label}
        </div>
      )}
    </Link>
  );
}

export default function AppSidebar({
  items,
  role,
  userName,
  userEmail,
  collapsed = false,
  onToggle,
}: AppSidebarProps) {
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      style={{ width: collapsed ? 70 : 260 }}
      className="h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shrink-0 relative shadow-sm"
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-2.5 px-4 py-4 border-b border-slate-100",
          collapsed && "justify-center px-2"
        )}
      >
        <Image
          src="/logo.png"
          alt="BIT Logo"
          width={100}
          height={100}
          className="w-20 h-20 object-contain shrink-0 drop-shadow-sm"
        />
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[#8B2500] font-black text-base leading-tight tracking-tight">
              Buddha ERP
            </p>
            <p className="text-slate-400 text-[10px] leading-tight font-medium uppercase tracking-widest">
              {role} Portal
            </p>
          </div>
        )}
      </div>

      {/* User Profile */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C13A00] to-[#8B2500] flex items-center justify-center text-white font-bold text-xs shadow shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-800 font-semibold text-sm leading-tight truncate">{userName}</p>
              <p className="text-slate-400 text-xs truncate">{userEmail}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-thin">
        {items.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Sign Out */}
      <div className="px-2 py-3 border-t border-slate-100 space-y-1">
        <button
          onClick={async () => {
            try { await fetch("http://localhost:5000/api/auth/logout", { method: "POST" }); } catch (e) {}
            localStorage.removeItem("bit_user");
            localStorage.removeItem("bit_profile");
            localStorage.removeItem("bit_token");
            window.location.href = "/login";
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut size={17} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-100 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <ChevronLeft
            size={15}
            className={cn("transition-transform duration-300", collapsed && "rotate-180")}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
