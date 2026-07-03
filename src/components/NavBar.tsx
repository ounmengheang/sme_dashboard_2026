"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, GitCompare, Handshake } from "lucide-react";

const LINKS = [
  { href: "/", label: "2026", sub: "ឆ្នាំ 2026", icon: BarChart3 },
  { href: "/2025", label: "2025", sub: "ឆ្នាំ 2025", icon: BarChart3 },
  { href: "/compare", label: "Compare", sub: "ប្រៀបធៀប", icon: GitCompare },
  { href: "/matching", label: "Matching", sub: "ផ្គូផ្គង់អាជីវកម្ម", icon: Handshake },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 h-14">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
              <span className={active ? "text-primary/60" : "text-gray-400"}>· {link.sub}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
