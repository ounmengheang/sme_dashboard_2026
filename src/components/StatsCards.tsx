"use client";

import { AggregatedData } from "@/lib/types";
import { Users, Briefcase, Building2, DollarSign } from "lucide-react";

interface Props {
  aggregated: AggregatedData;
}

const cards = [
  {
    key: "total",
    label: "សរុប (Total)",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
    getValue: (d: AggregatedData) => d.totalRegistrations.toLocaleString(),
    getSub: (d: AggregatedData) => `${Object.keys(d.byMonth).length} ខែ (months)`,
  },
  {
    key: "gender",
    label: "ប្រុស/ស្រី (Male/Female)",
    icon: Users,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    getValue: (d: AggregatedData) => `${d.byGender["ប្រុស"] || 0} / ${d.byGender["ស្រី"] || 0}`,
    getSub: () => "ភេទ (Gender)",
  },
  {
    key: "size",
    label: "តូច/មធ្យម (Small/Medium)",
    icon: Building2,
    color: "text-purple-600",
    bg: "bg-purple-50",
    getValue: (d: AggregatedData) => `${d.byEnterpriseSize["តូច"] || 0} / ${d.byEnterpriseSize["មធ្យម"] || 0}`,
    getSub: () => "ទំហំសហគ្រាស",
  },
  {
    key: "capital",
    label: "ដើមទុនមធ្យម (Avg Capital)",
    icon: DollarSign,
    color: "text-amber-600",
    bg: "bg-amber-50",
    getValue: (d: AggregatedData) => {
      const records = Object.values(d.byGender).reduce((a, b) => a + b, 0);
      return `$${(records > 0 ? 0 : 0).toLocaleString()}`;
    },
    getSub: () => "មធ្យមភាគ (Average)",
  },
];

export function StatsCards({ aggregated }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {card.label}
                </p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                  {card.getValue(aggregated)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{card.getSub(aggregated)}</p>
              </div>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
