import { SMERecord, AggregatedData, MonthComparison, MonthInfo } from "./types";
import { KHMER_MONTHS } from "./sheets";

export function filterRecords(records: SMERecord[], filters: {
  months?: number[];
  gender?: string[];
  nationality?: string[];
  enterpriseSize?: string[];
  status?: string[];
  applicationMethod?: string[];
  province?: string[];
}): SMERecord[] {
  return records.filter((r) => {
    if (filters.months?.length && !filters.months.includes(r.monthIndex)) return false;
    if (filters.gender?.length && !filters.gender.includes(r.gender)) return false;
    if (filters.nationality?.length && !filters.nationality.includes(r.nationality)) return false;
    if (filters.enterpriseSize?.length && !filters.enterpriseSize.includes(r.enterpriseSize)) return false;
    if (filters.status?.length && !filters.status.includes(r.status)) return false;
    if (filters.applicationMethod?.length && !filters.applicationMethod.includes(r.applicationMethod)) return false;
    if (filters.province?.length && !filters.province.includes(r.province)) return false;
    return true;
  });
}

export function aggregateData(records: SMERecord[]): AggregatedData {
  const byGender: Record<string, number> = {};
  const byEnterpriseSize: Record<string, number> = {};
  const byNationality: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byMethod: Record<string, number> = {};
  const byProvince: Record<string, number> = {};
  const byIndustry: Record<string, number> = {};
  const byMonth: Record<string, number> = {};
  const capitals: number[] = [];
  const workers: number[] = [];

  records.forEach((r) => {
    byGender[r.gender] = (byGender[r.gender] || 0) + 1;
    byEnterpriseSize[r.enterpriseSize] = (byEnterpriseSize[r.enterpriseSize] || 0) + 1;
    byNationality[r.nationality] = (byNationality[r.nationality] || 0) + 1;
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    byMethod[r.applicationMethod] = (byMethod[r.applicationMethod] || 0) + 1;
    byProvince[r.province] = (byProvince[r.province] || 0) + 1;
    byIndustry[r.isicCode] = (byIndustry[r.isicCode] || 0) + 1;
    const monthLabel = KHMER_MONTHS[r.monthIndex]?.english || r.month;
    byMonth[monthLabel] = (byMonth[monthLabel] || 0) + 1;
    if (r.capital > 0) capitals.push(r.capital);
    if (r.totalWorkers > 0) workers.push(r.totalWorkers);
  });

  const byMonthDetail = KHMER_MONTHS.map((m) => ({
    month: m.english,
    count: byMonth[m.english] || 0,
  }));

  const capitalRanges = [
    { range: "0-50K", min: 0, max: 50000 },
    { range: "50K-100K", min: 50000, max: 100000 },
    { range: "100K-250K", min: 100000, max: 250000 },
    { range: "250K-500K", min: 250000, max: 500000 },
    { range: "500K-1M", min: 500000, max: 1000000 },
    { range: "1M+", min: 1000000, max: Infinity },
  ];
  const capitalDistribution = capitalRanges.map((cr) => ({
    range: cr.range,
    count: capitals.filter((c) => c >= cr.min && c < cr.max).length,
  }));

  const sortedWorkers = [...workers].sort((a, b) => a - b);
  const workerStats = {
    avg: workers.length ? Math.round(workers.reduce((a, b) => a + b, 0) / workers.length) : 0,
    median: sortedWorkers.length ? sortedWorkers[Math.floor(sortedWorkers.length / 2)] : 0,
    min: sortedWorkers.length ? sortedWorkers[0] : 0,
    max: sortedWorkers.length ? sortedWorkers[sortedWorkers.length - 1] : 0,
  };

  return {
    totalRegistrations: records.length,
    byGender,
    byEnterpriseSize,
    byNationality,
    byStatus,
    byMethod,
    byProvince,
    byIndustry,
    byMonth,
    byMonthDetail,
    capitalDistribution,
    workerStats,
  };
}

export function compareMonths(
  records: SMERecord[],
  monthIndex1: number,
  monthIndex2: number
): MonthComparison {
  const m1 = records.filter((r) => r.monthIndex === monthIndex1);
  const m2 = records.filter((r) => r.monthIndex === monthIndex2);
  const change = m1.length > 0 ? Math.round(((m2.length - m1.length) / m1.length) * 100) : 0;
  return {
    month1: KHMER_MONTHS[monthIndex1],
    month2: KHMER_MONTHS[monthIndex2],
    month1Total: m1.length,
    month2Total: m2.length,
    change,
  };
}

export function getMonthInfo(index: number): MonthInfo {
  return KHMER_MONTHS[index] || { khmer: "", english: `Month ${index + 1}`, index };
}
