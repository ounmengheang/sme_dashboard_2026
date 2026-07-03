import { Suspense } from "react";
import { fetchAllMonthsData } from "@/lib/sheets";
import { CompareDashboard } from "@/components/CompareDashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const dynamic = "force-dynamic";

async function CompareContent() {
  const [records2026, records2025] = await Promise.all([
    fetchAllMonthsData(2026),
    fetchAllMonthsData(2025),
  ]);

  return <CompareDashboard records2026={records2026} records2025={records2025} />;
}

function CompareSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="skeleton h-10 w-80 mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-72" />
        ))}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <ErrorBoundary fallback={
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to load data</h2>
        <p className="text-gray-600">Please check your internet connection and try refreshing the page.</p>
      </div>
    }>
      <Suspense fallback={<CompareSkeleton />}>
        <CompareContent />
      </Suspense>
    </ErrorBoundary>
  );
}
