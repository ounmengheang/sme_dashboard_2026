"use client";

import { useState, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { SMERecord } from "@/lib/types";
import { filterRecords, aggregateData } from "@/lib/analytics";
import { KHMER_MONTHS } from "@/lib/sheets";
import { StatsCards } from "./StatsCards";
import { Filters } from "./Filters";

interface Props {
  records: SMERecord[];
  uniqueValues: Record<string, string[]>;
}

function FilterSkeleton() {
  return <div className="skeleton h-12 w-full mb-8" />;
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton h-24" />
      ))}
    </div>
  );
}

function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton h-72" />
      ))}
    </div>
  );
}

// Recharts' ResponsiveContainer measures a 0x0 container during server rendering, which
// permanently breaks Pie chart sector generation on hydration. Loading charts client-only
// avoids that mismatch.
const Charts = dynamic(() => import("./Charts").then((mod) => mod.Charts), {
  ssr: false,
  loading: ChartsSkeleton,
});

export function DashboardClient({ records, uniqueValues }: Props) {
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const handleFilterChange = (key: string, values: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
  };

  const filteredRecords = useMemo(() => {
    let result = records;
    if (selectedMonths.length > 0) {
      result = result.filter((r) => selectedMonths.includes(r.monthIndex));
    }
    const filterKeys = Object.keys(filters) as (keyof typeof filters)[];
    for (const key of filterKeys) {
      const vals = filters[key];
      if (vals.length > 0) {
        result = result.filter((r) => vals.includes(String(r[key as keyof SMERecord])));
      }
    }
    return result;
  }, [records, selectedMonths, filters]);

  const aggregated = useMemo(() => aggregateData(filteredRecords), [filteredRecords]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          ការចុះបញ្ជី SME ឆ្នាំ 2026
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          តាមដានចំនួនអាជីវកម្មខ្នាតតូច និងមធ្យមដែលបានចុះបញ្ជីជារៀងរាល់ខែ
        </p>
        <p className="text-gray-400 mt-0.5 text-xs sm:text-sm">
          Track monthly SME registrations across Cambodia
        </p>
      </header>

      <Suspense fallback={<FilterSkeleton />}>
        <Filters
          uniqueValues={uniqueValues}
          selectedMonths={selectedMonths}
          onMonthChange={setSelectedMonths}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards aggregated={aggregated} />
      </Suspense>

      <Suspense fallback={<ChartsSkeleton />}>
        <Charts aggregated={aggregated} />
      </Suspense>

      <footer className="mt-8 text-center text-sm text-gray-400 border-t pt-4">
        <p>ទិន្នន័យផ្ទាល់ពី Google Sheets • {records.length} កំណត់ត្រាសរុប • ធ្វើបច្ចុប្បន្នភាពរៀងរាល់ 5 នាទីម្តង</p>
        <p className="mt-1">Data streamed from Google Sheets — Last updated in real-time</p>
      </footer>
    </div>
  );
}
