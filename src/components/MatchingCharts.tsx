"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface Props {
  industryBreakdown: { division: string; name: string; count: number }[];
}

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

export function MatchingCharts({ industryBreakdown }: Props) {
  const data = industryBreakdown.map((d) => ({ name: d.name, count: d.count }));
  const height = Math.max(280, data.length * 32);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
      <h3 className="text-base font-semibold text-gray-800 mb-0.5">ឧស្សាហកម្មតាមចំនួនអាជីវកម្ម</h3>
      <p className="text-xs text-gray-400 mb-3">Businesses by Manufacturing Industry (2025 + 2026)</p>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={170} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#2251f5" radius={[0, 4, 4, 0]} name="ចំនួនអាជីវកម្ម" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
