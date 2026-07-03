"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { SMERecord } from "@/lib/types";
import { aggregateData } from "@/lib/analytics";
import { CompareStats } from "./CompareStats";

interface Props {
  records2025: SMERecord[];
  records2026: SMERecord[];
}

function CompareChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton h-72" />
      ))}
    </div>
  );
}

// Recharts' ResponsiveContainer measures a 0x0 container during server rendering, which
// permanently breaks Pie chart sector generation on hydration. Loading charts client-only
// avoids that mismatch.
const CompareCharts = dynamic(() => import("./CompareCharts").then((mod) => mod.CompareCharts), {
  ssr: false,
  loading: CompareChartsSkeleton,
});

export function CompareDashboard({ records2025, records2026 }: Props) {
  const aggregated2025 = useMemo(() => aggregateData(records2025), [records2025]);
  const aggregated2026 = useMemo(() => aggregateData(records2026), [records2026]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          ប្រៀបធៀបការចុះបញ្ជី SME ២០២៥ និង ២០២៦
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          ប្រៀបធៀបនិន្នាការចុះបញ្ជីអាជីវកម្មរវាងឆ្នាំ 2025 និង 2026
        </p>
        <p className="text-gray-400 mt-0.5 text-xs sm:text-sm">
          Compare SME registration trends between 2025 and 2026
        </p>
      </header>

      <CompareStats aggregated2025={aggregated2025} aggregated2026={aggregated2026} />

      <CompareCharts aggregated2025={aggregated2025} aggregated2026={aggregated2026} />

      <footer className="mt-8 text-center text-sm text-gray-400 border-t pt-4">
        <p>
          ទិន្នន័យផ្ទាល់ពី Google Sheets • {records2025.length} កំណត់ត្រា (2025) • {records2026.length} កំណត់ត្រា (2026) • ធ្វើបច្ចុប្បន្នភាពរៀងរាល់ 1 ម៉ោង
        </p>
        <p className="mt-1">Data from Google Sheets — refreshes every hour</p>
      </footer>
    </div>
  );
}
