import Card from "@/components/ui/Card";
import { Clock } from "lucide-react";

export default function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        {description && <p className="text-slate-500 text-sm mt-0.5">{description}</p>}
      </div>
      <Card>
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
            <Clock size={28} className="text-[#8B2500]" />
          </div>
          <p className="font-semibold text-slate-600 text-lg">Coming Soon</p>
          <p className="text-sm mt-1 text-center max-w-sm">
            This module is currently under development. It will be available in the next phase of the ERP rollout.
          </p>
        </div>
      </Card>
    </div>
  );
}
