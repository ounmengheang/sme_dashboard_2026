import type { Metadata } from "next";
import { Noto_Sans_Khmer } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SME Dashboard Survey 2026",
  description: "SME registration dashboard with live data from Google Sheets",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="km">
      <body className={`${notoSansKhmer.className} bg-gray-50 text-gray-900 min-h-screen`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
