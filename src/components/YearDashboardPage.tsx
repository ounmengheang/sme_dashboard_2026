import { Suspense } from "react";
import { fetchAllMonthsData, getUniqueValues, DashboardYear } from "@/lib/sheets";
import { DashboardClient } from "@/components/Dashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";

async function DashboardContent({ year }: { year: DashboardYear }) {
  const records = await fetchAllMonthsData(year);
  const uniqueValues = {
    gender: getUniqueValues(records, "gender"),
    nationality: getUniqueValues(records, "nationality"),
    enterpriseSize: getUniqueValues(records, "enterpriseSize"),
    status: getUniqueValues(records, "status"),
    applicationMethod: getUniqueValues(records, "applicationMethod"),
    province: getUniqueValues(records, "province"),
  };

  return <DashboardClient records={records} uniqueValues={uniqueValues} year={year} />;
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="skeleton h-10 w-64 mb-6" />
      <div className="skeleton h-12 w-full mb-8" />
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

export function YearDashboardPage({ year }: { year: DashboardYear }) {
  return (
    <ErrorBoundary fallback={
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to load data</h2>
        <p className="text-gray-600">Please check your internet connection and try refreshing the page.</p>
      </div>
    }>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent year={year} />
      </Suspense>
    </ErrorBoundary>
  );
}
