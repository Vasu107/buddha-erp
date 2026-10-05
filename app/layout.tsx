import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BIT ERP — Buddha Institute of Technology",
  description:
    "Enterprise Resource Planning System for Buddha Institute of Technology, GIDA, Gorakhpur.",
  keywords: ["BIT ERP", "Buddha Institute of Technology", "GIDA", "Gorakhpur", "ERP"],
  authors: [{ name: "Buddha Institute of Technology" }],
  openGraph: {
    title: "BIT ERP — Buddha Institute of Technology",
    description: "Enterprise Resource Planning System for Buddha Institute of Technology",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
