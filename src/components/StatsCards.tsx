"use client";

import { AggregatedData } from "@/lib/types";
import { Users, MapPin, Banknote, Building2 } from "lucide-react";

interface Props {
  aggregated: AggregatedData;
}

const cards = [
  {
    key: "total",
    label: "ចំនួនចុះបញ្ជីសរុប",
    sub: "Total Registrations",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    getValue: (d: AggregatedData) => d.totalRegistrations.toLocaleString(),
  },
  {
    key: "workers",
    label: "ចំនួនកម្មករជាមធ្យម",
    sub: "Avg. Workers per Business",
    icon: Users,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    getValue: (d: AggregatedData) => d.workerStats.avg.toLocaleString(),
  },
  {
    key: "capital",
    label: "ដើមទុនជាមធ្យម",
    sub: "Average Capital",
    icon: Banknote,
    color: "text-amber-600",
    bg: "bg-amber-50",
    getValue: (d: AggregatedData) => (d.avgCapital > 0 ? `$${d.avgCapital.toLocaleString()}` : "—"),
  },
  {
    key: "province",
    label: "ខេត្តមានចំនួនច្រើនជាងគេ",
    sub: "Top Province",
    icon: MapPin,
    color: "text-purple-600",
    bg: "bg-purple-50",
    getValue: (d: AggregatedData) => (d.topProvince ? d.topProvince.name : "—"),
  },
];

export function StatsCards({ aggregated }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl shrink-0 ${card.bg}`}>
              <Icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-2xl font-bold leading-tight ${card.color}`}>
                {card.getValue(aggregated)}
              </p>
              <p className="text-sm font-medium text-gray-700 truncate">{card.label}</p>
              <p className="text-xs text-gray-400">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
