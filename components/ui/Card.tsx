import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  noPad?: boolean;
}

export default function Card({ children, className, title, subtitle, action, noPad }: CardProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-100 shadow-sm", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            {title && <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPad ? "" : "p-5"}>{children}</div>
    </div>
  );
}
