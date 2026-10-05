// This layout intentionally passes through — each role sub-folder has its own layout
export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
