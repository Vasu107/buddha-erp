import DashboardLayout from "@/components/layout/DashboardLayout";

export default function HodLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="hod">{children}</DashboardLayout>;
}
