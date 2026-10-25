import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khushboo Punjani — Copywriter",
  description: "Portfolio of Khushboo Punjani, senior copywriter based in Mumbai.",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh antialiased">{children}</div>;
}
