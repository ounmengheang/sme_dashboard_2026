import { SMERecord, MonthInfo } from "./types";

const SHEET_ID = "1n1lKfUryI2saaYbgbET2MU-z1ax6tp4CIM8uFYxquEU";

export const KHMER_MONTHS: MonthInfo[] = [
  { khmer: "មករា", english: "January", index: 0 },
  { khmer: "កុម្ភៈ", english: "February", index: 1 },
  { khmer: "មីនា", english: "March", index: 2 },
  { khmer: "មេសា", english: "April", index: 3 },
  { khmer: "ឧសភា", english: "May", index: 4 },
  { khmer: "មិថុនា", english: "June", index: 5 },
  { khmer: "កក្កដា", english: "July", index: 6 },
  { khmer: "សីហា", english: "August", index: 7 },
  { khmer: "កញ្ញា", english: "September", index: 8 },
  { khmer: "តុលា", english: "October", index: 9 },
  { khmer: "វិច្ឆិកា", english: "November", index: 10 },
  { khmer: "ធ្នូ", english: "December", index: 11 },
];

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCapital(val: string | undefined): number {
  if (!val) return 0;
  const cleaned = val.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseWorkers(val: string | undefined): number {
  if (!val) return 0;
  const cleaned = val.replace(/[^0-9]/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

function isHeaderRow(cols: string[]): boolean {
  const joined = cols.join(",");
  if (cols[0] && cols[0].includes("ល.រ") && cols[1] && cols[1].includes("ឈ្មោះម្ចាស់")) return true;
  if (joined.includes("ភេទ") && joined.includes("ជនជាតិ")) return true;
  if (cols[0] && cols[0].includes("ទិន្នន័យចុះបញ្ជី") && cols.slice(1).every(c => !c)) return true;
  return false;
}

function parseSheetCSV(csvText: string, month: string, monthIndex: number): SMERecord[] {
  const lines = csvText.replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  const parsed = lines.map(parseCSVLine);
  let dataStart = 0;
  while (dataStart < parsed.length && isHeaderRow(parsed[dataStart])) {
    dataStart++;
  }
  if (dataStart >= parsed.length) return [];

  const records: SMERecord[] = [];
  for (let i = dataStart; i < parsed.length; i++) {
    const cols = parsed[i];
    if (isHeaderRow(cols)) continue;
    const nonEmpty = cols.filter((c) => c && c.trim().length > 0).length;
    if (nonEmpty < 2) continue;
    records.push({
      id: cols[0] || "",
      ownerName: cols[1] || "",
      gender: cols[2] || "",
      nationality: cols[3] || "",
      companyName: cols[4] || "",
      enterpriseName: cols[5] || "",
      phone: cols[6] || "",
      province: cols[7] || "",
      district: cols[8] || "",
      commune: cols[9] || "",
      businessType: cols[10] || "",
      isicCode: cols[11] || "",
      productName: cols[12] || "",
      applicationMethod: cols[13] || "",
      enterpriseSize: cols[14] || "",
      status: cols[15] || "",
      declarationNo: cols[16] || "",
      certNo: cols[17] || "",
      certLsNo: cols[18] || "",
      certValidity: cols[19] || "",
      currentProductivity: cols[20] || "",
      femaleWorkers: parseWorkers(cols[21]),
      totalWorkers: parseWorkers(cols[22]),
      capital: parseCapital(cols[23]),
      rawMaterials: cols[24] || "",
      other: cols[25] || "",
      month,
      monthIndex,
    });
  }
  return records;
}

async function fetchSheetTab(sheetName: string, monthIndex: number): Promise<SMERecord[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const text = await res.text();
  return parseSheetCSV(text, sheetName, monthIndex);
}

export async function fetchAllMonthsData(): Promise<SMERecord[]> {
  const results = await Promise.all(
    KHMER_MONTHS.map((m) => fetchSheetTab(m.khmer, m.index))
  );
  return results.flat();
}

export function getUniqueValues(records: SMERecord[], field: keyof SMERecord): string[] {
  const values = new Set<string>();
  records.forEach((r) => {
    const v = r[field];
    if (typeof v === "string" && v.trim()) values.add(v.trim());
  });
  return Array.from(values).sort();
}
