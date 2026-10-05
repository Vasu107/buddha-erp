import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:   "bg-[#8B2500] text-white hover:bg-[#6B1A00] shadow-sm shadow-orange-900/20",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  outline:   "border border-slate-200 text-slate-700 hover:bg-slate-50",
  ghost:     "text-slate-600 hover:bg-slate-100",
  danger:    "bg-red-500 text-white hover:bg-red-600 shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-sm gap-2",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  icon,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2500] disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
      {iconRight}
    </button>
  );
}
