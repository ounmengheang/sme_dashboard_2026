"use client";

import { AggregatedData } from "@/lib/types";
import { KHMER_MONTHS } from "@/lib/sheets";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from "recharts";

interface Props {
  aggregated2025: AggregatedData;
  aggregated2026: AggregatedData;
}

const COLOR_2025 = "#94a3b8";
const COLOR_2026 = "#2251f5";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-3 text-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value?.toLocaleString?.() || p.value}</span>
        </p>
      ))}
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-base font-semibold text-gray-800 mb-0.5">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mb-3">{subtitle}</p>}
      {children}
    </div>
  );
}

function mergeByCategory(
  map2025: Record<string, number>,
  map2026: Record<string, number>,
  limit?: number
) {
  const names = new Set([...Object.keys(map2025), ...Object.keys(map2026)]);
  const rows = Array.from(names)
    .map((name) => ({
      name: name || "N/A",
      "2025": map2025[name] || 0,
      "2026": map2026[name] || 0,
    }))
    .sort((a, b) => b["2025"] + b["2026"] - (a["2025"] + a["2026"]));
  return limit ? rows.slice(0, limit) : rows;
}

export function CompareCharts({ aggregated2025, aggregated2026 }: Props) {
  const monthlyData = KHMER_MONTHS.map((m) => ({
    month: m.english,
    "2025": aggregated2025.byMonth[m.english] || 0,
    "2026": aggregated2026.byMonth[m.english] || 0,
  }));

  const sizeData = mergeByCategory(aggregated2025.byEnterpriseSize, aggregated2026.byEnterpriseSize);
  const genderData = mergeByCategory(aggregated2025.byGender, aggregated2026.byGender);
  const provinceData = mergeByCategory(aggregated2025.byProvince, aggregated2026.byProvince, 8);
  const methodData = mergeByCategory(aggregated2025.byMethod, aggregated2026.byMethod);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <ChartCard title="និន្នាការចុះបញ្ជីតាមខែ" subtitle="Monthly Registrations — 2025 vs 2026">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="2025" stroke={COLOR_2025} strokeWidth={2} dot={{ fill: COLOR_2025, r: 3 }} />
            <Line type="monotone" dataKey="2026" stroke={COLOR_2026} strokeWidth={2.5} dot={{ fill: COLOR_2026, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ខេត្តកំពូល" subtitle="Top Provinces — 2025 vs 2026">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={provinceData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="2025" fill={COLOR_2025} radius={[0, 4, 4, 0]} />
            <Bar dataKey="2026" fill={COLOR_2026} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ទំហំសហគ្រាស" subtitle="Enterprise Size — 2025 vs 2026">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={sizeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="2025" fill={COLOR_2025} radius={[4, 4, 0, 0]} />
            <Bar dataKey="2026" fill={COLOR_2026} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ការចែកចាយភេទ" subtitle="Gender Distribution — 2025 vs 2026">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={genderData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="2025" fill={COLOR_2025} radius={[4, 4, 0, 0]} />
            <Bar dataKey="2026" fill={COLOR_2026} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="បែបបទស្នើសុំ" subtitle="Application Method — 2025 vs 2026">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={methodData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="2025" fill={COLOR_2025} radius={[4, 4, 0, 0]} />
            <Bar dataKey="2026" fill={COLOR_2026} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
