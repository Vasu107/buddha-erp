import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "warning" | "danger" | "info" | "purple" | "outline";

const variants: Record<Variant, string> = {
  default:  "bg-slate-100 text-slate-600",
  success:  "bg-green-50 text-green-700 ring-1 ring-green-200",
  warning:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  danger:   "bg-red-50 text-red-700 ring-1 ring-red-200",
  info:     "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  purple:   "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  outline:  "border border-slate-200 text-slate-600 bg-transparent",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  dot?: boolean;
}

export default function Badge({ children, variant = "default", className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "success" && "bg-green-500",
            variant === "warning" && "bg-amber-500",
            variant === "danger"  && "bg-red-500",
            variant === "info"    && "bg-blue-500",
            variant === "purple"  && "bg-purple-500",
            variant === "default" && "bg-slate-400",
          )}
        />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, Variant> = {
    Active:    "success",
    Inactive:  "danger",
    "On Leave":"warning",
    Detained:  "danger",
    Scheduled: "info",
    Completed: "success",
    Cancelled: "danger",
    Pending:   "warning",
  };
  return <Badge variant={map[status] ?? "default"} dot>{status}</Badge>;
}
