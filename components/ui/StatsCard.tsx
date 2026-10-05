import { cn } from "@/lib/utils";
import {
  Users, GraduationCap, Building2, BookOpen,
  TrendingUp, TrendingDown, Minus,
} from "lucide-react";

const colorMap = {
  blue:   { bg: "bg-orange-50", icon: "text-[#8B2500]", ring: "ring-orange-100" },
  brown:  { bg: "bg-orange-50", icon: "text-[#8B2500]", ring: "ring-orange-100" },
  green:  { bg: "bg-green-50",  icon: "text-green-600",  ring: "ring-green-100" },
  orange: { bg: "bg-orange-50", icon: "text-[#C13A00]", ring: "ring-orange-100"},
  purple: { bg: "bg-purple-50", icon: "text-purple-600", ring: "ring-purple-100"},
  red:    { bg: "bg-red-50",    icon: "text-red-500",    ring: "ring-red-100"   },
  cyan:   { bg: "bg-cyan-50",   icon: "text-cyan-600",   ring: "ring-cyan-100"  },
};

const iconComp: Record<string, React.ElementType> = {
  Users, GraduationCap, Building2, BookOpen,
};

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color?: keyof typeof colorMap;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  className?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  change,
  changeType = "neutral",
  className,
}: StatsCardProps) {
  const c = colorMap[color];

  return (
    <div
      className={cn(
        "bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 group",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-800 mb-1">
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          </p>
          {(change || subtitle) && (
            <div className="flex items-center gap-1.5 mt-1">
              {changeType === "up" && (
                <TrendingUp size={13} className="text-green-500" />
              )}
              {changeType === "down" && (
                <TrendingDown size={13} className="text-red-500" />
              )}
              {changeType === "neutral" && change && (
                <Minus size={13} className="text-slate-400" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  changeType === "up" && "text-green-600",
                  changeType === "down" && "text-red-500",
                  changeType === "neutral" && "text-slate-500"
                )}
              >
                {change || subtitle}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center ring-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
            c.bg,
            c.ring
          )}
        >
          <Icon size={22} className={c.icon} />
        </div>
      </div>
    </div>
  );
}
