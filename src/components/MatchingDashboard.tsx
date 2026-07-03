"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { SMERecord } from "@/lib/types";
import { SupplierBuyerMatch } from "@/lib/csic";
import { Handshake, Building2, Factory, Search, ArrowRight } from "lucide-react";

interface Props {
  matches: SupplierBuyerMatch[];
  industryBreakdown: { division: string; name: string; count: number }[];
  totalRecords: number;
}

function ChartsSkeleton() {
  return <div className="skeleton h-80 mb-6" />;
}

const MatchingCharts = dynamic(() => import("./MatchingCharts").then((mod) => mod.MatchingCharts), {
  ssr: false,
  loading: ChartsSkeleton,
});

function businessLabel(r: SMERecord): string {
  return r.companyName || r.enterpriseName || r.ownerName || "N/A";
}

function matchText(m: SupplierBuyerMatch): string {
  return [
    businessLabel(m.supplier), m.supplier.productName, m.supplier.province,
    businessLabel(m.buyer), m.buyer.productName, m.buyer.province,
    ...m.matchedKeywords,
  ].join(" ").toLowerCase();
}

export function MatchingDashboard({ matches, industryBreakdown, totalRecords }: Props) {
  const [query, setQuery] = useState("");

  const businessesInvolved = useMemo(() => {
    const names = new Set<string>();
    matches.forEach((m) => {
      names.add(businessLabel(m.supplier) + "|" + m.supplier.province);
      names.add(businessLabel(m.buyer) + "|" + m.buyer.province);
    });
    return names.size;
  }, [matches]);

  const filteredMatches = useMemo(() => {
    if (!query.trim()) return matches;
    const q = query.trim().toLowerCase();
    return matches.filter((m) => matchText(m).includes(q));
  }, [matches, query]);

  const stats = [
    {
      key: "matches",
      label: "សំណើផ្គូផ្គង់",
      sub: "Suggested Matches",
      icon: Handshake,
      color: "text-blue-600",
      bg: "bg-blue-50",
      value: matches.length,
    },
    {
      key: "businesses",
      label: "អាជីវកម្មពាក់ព័ន្ធ",
      sub: "Businesses Involved",
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      value: businessesInvolved,
    },
    {
      key: "industries",
      label: "ឧស្សាហកម្មតំណាង",
      sub: "Industries Represented",
      icon: Factory,
      color: "text-purple-600",
      bg: "bg-purple-50",
      value: industryBreakdown.length,
    },
    {
      key: "total",
      label: "អាជីវកម្មសរុប (2025+2026)",
      sub: "Total Businesses Analyzed",
      icon: Building2,
      color: "text-amber-600",
      bg: "bg-amber-50",
      value: totalRecords,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">ផ្គូផ្គង់អាជីវកម្ម SME</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          សំណើភ្ជាប់ទំនាក់ទំនងអ្នកផ្គត់ផ្គង់ និងអ្នកទិញ ដោយផ្អែកលើប្រភេទឧស្សាហកម្ម (CSIC) និងឈ្មោះផលិតផល
        </p>
        <p className="text-gray-400 mt-0.5 text-xs sm:text-sm">
          Suggested supplier ↔ buyer relationships, inferred from CSIC industry codes and product-name overlap — not confirmed business relationships.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.key} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${s.bg}`}>
                <Icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-2xl font-bold leading-tight ${s.color}`}>{s.value.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-700 truncate">{s.label}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <MatchingCharts industryBreakdown={industryBreakdown} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-1 gap-3 flex-wrap">
          <div>
            <h3 className="text-base font-semibold text-gray-800">សំណើផ្គូផ្គង់អ្នកផ្គត់ផ្គង់ ↔ អ្នកទិញ</h3>
            <p className="text-xs text-gray-400">Supplier ↔ Buyer Match Suggestions</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ស្វែងរកក្រុមហ៊ុន ឬផលិតផល... (Search company or product)"
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-72 max-w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {filteredMatches.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">
            {matches.length === 0 ? "គ្មានសំណើផ្គូផ្គង់រកឃើញទេ (No matches found)" : "គ្មានលទ្ធផលត្រូវនឹងការស្វែងរក (No results for this search)"}
          </p>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="py-2 pr-3 font-medium">អ្នកផ្គត់ផ្គង់ (Supplier)</th>
                  <th className="py-2 px-3 font-medium"></th>
                  <th className="py-2 px-3 font-medium">អ្នកទិញ (Buyer)</th>
                  <th className="py-2 px-3 font-medium">ពាក្យគន្លឹះដូចគ្នា (Shared Keywords)</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.slice(0, 100).map((m, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="py-3 pr-3 align-top">
                      <p className="font-medium text-gray-800">{businessLabel(m.supplier)}</p>
                      <p className="text-xs text-gray-500">{m.supplier.productName}</p>
                      <p className="text-xs text-gray-400">{m.supplier.province} • {m.supplier.year}</p>
                    </td>
                    <td className="py-3 px-3 align-top text-center text-primary">
                      <ArrowRight className="w-4 h-4 inline" />
                    </td>
                    <td className="py-3 px-3 align-top">
                      <p className="font-medium text-gray-800">{businessLabel(m.buyer)}</p>
                      <p className="text-xs text-gray-500">{m.buyer.productName}</p>
                      <p className="text-xs text-gray-400">{m.buyer.province} • {m.buyer.year}</p>
                    </td>
                    <td className="py-3 px-3 align-top">
                      <div className="flex flex-wrap gap-1">
                        {m.matchedKeywords.map((k) => (
                          <span key={k} className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                            {k}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMatches.length > 100 && (
              <p className="text-xs text-gray-400 text-center mt-3">
                បង្ហាញ 100 ក្នុងចំណោម {filteredMatches.length} • Showing 100 of {filteredMatches.length} matches — refine your search to narrow results
              </p>
            )}
          </div>
        )}
      </div>

      <footer className="mt-8 text-center text-sm text-gray-400 border-t pt-4">
        <p>ទិន្នន័យផ្ទាល់ពី Google Sheets • ធ្វើបច្ចុប្បន្នភាពរៀងរាល់ 1 ម៉ោង</p>
        <p className="mt-1">Data from Google Sheets — refreshes every hour</p>
      </footer>
    </div>
  );
}
