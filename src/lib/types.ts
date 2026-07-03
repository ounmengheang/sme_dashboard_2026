export interface SMERecord {
  id: string;
  ownerName: string;
  gender: string;
  nationality: string;
  companyName: string;
  enterpriseName: string;
  phone: string;
  province: string;
  district: string;
  commune: string;
  businessType: string;
  isicCode: string;
  productName: string;
  applicationMethod: string;
  enterpriseSize: string;
  status: string;
  declarationNo: string;
  certNo: string;
  certLsNo: string;
  certValidity: string;
  currentProductivity: string;
  femaleWorkers: number;
  totalWorkers: number;
  capital: number;
  rawMaterials: string;
  other: string;
  month: string;
  monthIndex: number;
  year: number;
}

export interface MonthInfo {
  khmer: string;
  english: string;
  index: number;
}

export interface DashboardFilters {
  months: number[];
  gender: string[];
  nationality: string[];
  enterpriseSize: string[];
  status: string[];
  applicationMethod: string[];
  province: string[];
}

export interface MonthComparison {
  month1: MonthInfo;
  month2: MonthInfo;
  month1Total: number;
  month2Total: number;
  change: number;
}

export interface AggregatedData {
  totalRegistrations: number;
  byGender: Record<string, number>;
  byEnterpriseSize: Record<string, number>;
  byNationality: Record<string, number>;
  byStatus: Record<string, number>;
  byMethod: Record<string, number>;
  byProvince: Record<string, number>;
  byIndustry: Record<string, number>;
  byMonth: Record<string, number>;
  byMonthDetail: { month: string; count: number }[];
  capitalDistribution: { range: string; count: number }[];
  workerStats: { avg: number; median: number; min: number; max: number };
  avgCapital: number;
  topProvince: { name: string; count: number } | null;
}
