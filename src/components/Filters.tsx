"use client";

import React, { useState } from "react";
import { KHMER_MONTHS } from "@/lib/sheets";

interface Props {
  uniqueValues: Record<string, string[]>;
  selectedMonths: number[];
  onMonthChange: (months: number[]) => void;
  filters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
}

const FILTER_LABELS: Record<string, string> = {
  gender: "ភេទ (Gender)",
  nationality: "ជនជាតិ (Nationality)",
  enterpriseSize: "ទំហំសហគ្រាស (Size)",
  status: "ស្ថានភាព (Status)",
  applicationMethod: "បែបបទស្នើសុំ (Method)",
  province: "ខេត្ត/ក្រុង (Province)",
};

export function Filters({ uniqueValues, selectedMonths, onMonthChange, filters, onFilterChange }: Props) {
  const toggleMonth = (idx: number) => {
    const next = selectedMonths.includes(idx)
      ? selectedMonths.filter((m) => m !== idx)
      : [...selectedMonths, idx];
    onMonthChange(next.length === KHMER_MONTHS.length ? [] : next);
  };

  const toggleFilter = (key: string, value: string) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange(key, next);
  };

  const clearFilters = () => {
    onMonthChange([]);
    Object.keys(filters).forEach((key) => onFilterChange(key, []));
  };

  const hasActiveFilters = selectedMonths.length > 0 || Object.values(filters).some((v) => v.length > 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          តម្រង (Filters)
        </h2>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium">
            សម្អាតទាំងអស់ (Clear All)
          </button>
        )}
      </div>

      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 mb-1.5">ខែ (Month)</p>
        <div className="flex flex-wrap gap-1.5">
          {KHMER_MONTHS.map((m) => {
            const active = selectedMonths.includes(m.index);
            return (
              <button
                key={m.index}
                onClick={() => toggleMonth(m.index)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {m.khmer}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(FILTER_LABELS).map(([key, label]) => {
          const values = uniqueValues[key] || [];
          const selected = filters[key] || [];
          if (values.length === 0) return null;
          return (
            <div key={key}>
              <p className="text-xs font-medium text-gray-500 mb-1 truncate">{label}</p>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {values.slice(0, 5).map((v) => {
                  const active = selected.includes(v);
                  return (
                    <button
                      key={v}
                      onClick={() => toggleFilter(key, v)}
                      className={`px-2 py-0.5 rounded text-xs transition-colors ${
                        active
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
                {values.length > 5 && <span className="text-xs text-gray-400">+{values.length - 5}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
