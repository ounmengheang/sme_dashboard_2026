"use client";

import { AggregatedData } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

interface Props {
  aggregated: AggregatedData;
}

const COLORS = ["#2251f5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-0.5">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mb-3">{subtitle}</p>}
      {children}
    </div>
  );
}

export function Charts({ aggregated }: Props) {
  const topProvinces = Object.entries(aggregated.byProvince)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  const topIndustries = Object.entries(aggregated.byIndustry)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name: name || "N/A", value }));

  const genderData = Object.entries(aggregated.byGender).map(([name, value]) => ({ name, value }));
  const sizeData = Object.entries(aggregated.byEnterpriseSize).map(([name, value]) => ({ name, value }));
  const methodData = Object.entries(aggregated.byMethod).map(([name, value]) => ({ name: name || "N/A", value }));
  const statusData = Object.entries(aggregated.byStatus).map(([name, value]) => ({ name, value }));
  const nationalityData = Object.entries(aggregated.byNationality)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <ChartCard title="ការចុះបញ្ជីតាមខែ" subtitle="Registrations by Month">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={aggregated.byMonthDetail}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="count" stroke="#2251f5" strokeWidth={2} dot={{ fill: "#2251f5", r: 4 }} name="ចំនួន" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ការចែកចាយតាមខេត្ត (កំពូល 10)" subtitle="Province Distribution (Top 10)">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topProvinces} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#2251f5" radius={[0, 4, 4, 0]} name="ចំនួន" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ទំហំសហគ្រាស" subtitle="Enterprise Size">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={sizeData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
              {sizeData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ការចែកចាយភេទ" subtitle="Gender Distribution">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={genderData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
              {genderData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ជនជាតិ" subtitle="Nationality">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={nationalityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} name="ចំនួន" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="បែបបទស្នើសុំ" subtitle="Application Method">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={methodData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
              {methodData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ស្ថានភាពចុះបញ្ជី" subtitle="Registration Status">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={statusData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="ចំនួន" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ការចែកចាយដើមទុន" subtitle="Capital Distribution">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={aggregated.capitalDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="range" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="ចំនួន" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ឧស្សាហកម្ម ISIC (កំពូល 10)" subtitle="ISIC Industries (Top 10)">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topIndustries} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={50} tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} name="ចំនួន" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="ស្ថិតិពលកម្ម" subtitle="Worker Statistics">
        <div className="grid grid-cols-4 gap-3 pt-2">
          {[
            { label: "មធ្យម (Avg)", value: aggregated.workerStats.avg, color: "text-blue-600" },
            { label: "មធ្យមកណ្ដាល (Median)", value: aggregated.workerStats.median, color: "text-emerald-600" },
            { label: "តិចបំផុត (Min)", value: aggregated.workerStats.min, color: "text-amber-600" },
            { label: "ច្រើនបំផុត (Max)", value: aggregated.workerStats.max, color: "text-red-600" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
