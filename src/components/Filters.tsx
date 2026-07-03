"use client";

import React, { useState } from "react";
import { KHMER_MONTHS } from "@/lib/sheets";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

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
  const [showMore, setShowMore] = useState(false);

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

  const activeChips = Object.entries(filters).flatMap(([key, values]) =>
    values.map((value) => ({ key, value }))
  );
  const hasActiveFilters = selectedMonths.length > 0 || activeChips.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-gray-700">
          <SlidersHorizontal className="w-4 h-4" />
          <h2 className="text-sm font-semibold">តម្រងទិន្នន័យ (Filters)</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMore((s) => !s)}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {showMore ? "លាក់តម្រងបន្ថែម (Hide extra filters)" : "តម្រងបន្ថែម (More filters)"}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMore ? "rotate-180" : ""}`} />
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium">
              សម្អាតទាំងអស់ (Clear all)
            </button>
          )}
        </div>
      </div>

      <div>
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

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400 mr-1">កំពុងអនុវត្ត (Active):</span>
          {activeChips.map((chip) => (
            <button
              key={`${chip.key}-${chip.value}`}
              onClick={() => toggleFilter(chip.key, chip.value)}
              className="flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
            >
              {chip.value}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {showMore && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-3 pt-3 border-t border-gray-100">
          {Object.entries(FILTER_LABELS).map(([key, label]) => {
            const values = uniqueValues[key] || [];
            const selected = filters[key] || [];
            if (values.length === 0) return null;
            return (
              <div key={key}>
                <p className="text-xs font-medium text-gray-500 mb-1.5 truncate">
                  {label}
                  {selected.length > 0 && <span className="text-primary"> ({selected.length})</span>}
                </p>
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                  {values.map((v) => {
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
