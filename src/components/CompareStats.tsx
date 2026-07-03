"use client";

import { AggregatedData } from "@/lib/types";
import { ArrowUp, ArrowDown, Minus, Building2, Users, Banknote, MapPin } from "lucide-react";

interface Props {
  aggregated2025: AggregatedData;
  aggregated2026: AggregatedData;
}

function pctChange(from: number, to: number): number | null {
  if (from === 0) return null;
  return Math.round(((to - from) / from) * 100);
}

function DeltaBadge({ change }: { change: number | null }) {
  if (change === null) {
    return <span className="text-xs text-gray-400">—</span>;
  }
  if (change === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-gray-400">
        <Minus className="w-3 h-3" /> 0%
      </span>
    );
  }
  const up = change > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(change)}%
    </span>
  );
}

export function CompareStats({ aggregated2025, aggregated2026 }: Props) {
  const provincesCovered = (a: AggregatedData) => Object.keys(a.byProvince).filter((p) => p).length;

  const cards = [
    {
      key: "total",
      label: "ចំនួនចុះបញ្ជីសរុប",
      sub: "Total Registrations",
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50",
      v2025: aggregated2025.totalRegistrations,
      v2026: aggregated2026.totalRegistrations,
    },
    {
      key: "workers",
      label: "កម្មករជាមធ្យម",
      sub: "Avg. Workers per Business",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      v2025: aggregated2025.workerStats.avg,
      v2026: aggregated2026.workerStats.avg,
    },
    {
      key: "capital",
      label: "ដើមទុនជាមធ្យម",
      sub: "Average Capital",
      icon: Banknote,
      color: "text-amber-600",
      bg: "bg-amber-50",
      v2025: aggregated2025.avgCapital,
      v2026: aggregated2026.avgCapital,
      format: (v: number) => (v > 0 ? `$${v.toLocaleString()}` : "—"),
    },
    {
      key: "provinces",
      label: "ខេត្តគ្របដណ្តប់",
      sub: "Provinces Covered",
      icon: MapPin,
      color: "text-purple-600",
      bg: "bg-purple-50",
      v2025: provincesCovered(aggregated2025),
      v2026: provincesCovered(aggregated2026),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        const format = card.format || ((v: number) => v.toLocaleString());
        const change = pctChange(card.v2025, card.v2026);
        return (
          <div key={card.key} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${card.bg}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{card.label}</p>
                <p className="text-xs text-gray-400">{card.sub}</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-gray-400">{format(card.v2025)}</span>
                <span className="text-gray-300">→</span>
                <span className={`text-xl font-bold ${card.color}`}>{format(card.v2026)}</span>
              </div>
              <DeltaBadge change={change} />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">2025 → 2026</p>
          </div>
        );
      })}
    </div>
  );
}
