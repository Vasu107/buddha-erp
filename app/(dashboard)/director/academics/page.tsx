"use client";

import Link from "next/link";
import { BookMarked, FileText, Layers, ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";

export default function AcademicManagementIndex() {
  const categories = [
    {
      title: "Courses & Subjects",
      description: "Manage core, elective, lab and project courses across all departments.",
      icon: BookMarked,
      href: "/director/academics/courses",
      stats: "48 Courses Configured",
    },
    {
      title: "Syllabus Breakdown",
      description: "Manage detailed unit breakdowns, syllabus documents and teaching hours.",
      icon: FileText,
      href: "/director/academics/syllabus",
      stats: "5 Syllabi Active",
    },
    {
      title: "Curriculum & Regulations",
      description: "Configure academic credit structures, CBCS schemes, and AKTU/AICTE regulations.",
      icon: Layers,
      href: "/director/academics/curriculum",
      stats: "4 Academic Schemes",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Academic Management</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Select an academic section to manage courses, syllabus breakdown, or curriculum regulations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.title} href={c.href} className="group">
              <Card className="h-full hover:shadow-md hover:border-[#8B2500]/30 transition-all cursor-pointer">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF5F0] flex items-center justify-center text-[#8B2500] group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base group-hover:text-[#8B2500] transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <span className="font-bold text-[#8B2500]">{c.stats}</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-400 group-hover:text-[#8B2500] transition-colors">
                      Manage <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
