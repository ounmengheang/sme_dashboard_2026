import fs from "fs";
import path from "path";
import { SMERecord } from "./types";

export interface CSICClassInfo {
  code: string;
  description: string;
  group: string;
  groupDescription: string;
}

interface DivisionInfo {
  km: string;
  en: string;
}

// Manufacturing divisions (Section C, 10-33) actually seen in the SME registration data,
// plus their upstream raw-material sections (01-03, 05-09) for completeness of labels.
const DIVISION_NAMES: Record<string, DivisionInfo> = {
  "01": { km: "កសិកម្ម", en: "Agriculture" },
  "02": { km: "ព្រៃឈើ", en: "Forestry & Logging" },
  "03": { km: "នេសាទ និងវារីវប្បកម្ម", en: "Fishing & Aquaculture" },
  "10": { km: "កែច្នៃចំណីអាហារ", en: "Food Processing" },
  "11": { km: "ភេសជ្ជៈ", en: "Beverages" },
  "12": { km: "ថ្នាំជក់", en: "Tobacco Products" },
  "13": { km: "វាយនភ័ណ្ឌ", en: "Textiles" },
  "14": { km: "សម្លៀកបំពាក់", en: "Apparel" },
  "15": { km: "ស្បែក និងស្បែកជើង", en: "Leather & Footwear" },
  "16": { km: "កែច្នៃឈើ", en: "Wood Processing" },
  "17": { km: "ក្រដាស", en: "Paper Products" },
  "18": { km: "បោះពុម្ព", en: "Printing" },
  "19": { km: "ប្រេងកាត និងធ្យូង", en: "Coke & Refined Petroleum" },
  "20": { km: "គីមី", en: "Chemicals" },
  "21": { km: "ឱសថ", en: "Pharmaceuticals" },
  "22": { km: "កៅស៊ូ និងប្លាស្ទិក", en: "Rubber & Plastics" },
  "23": { km: "រ៉ែមិនមែនលោហៈ", en: "Non-metallic Minerals (Cement, Glass)" },
  "24": { km: "លោហៈមូលដ្ឋាន", en: "Basic Metals" },
  "25": { km: "ផលិតផលលោហៈ", en: "Fabricated Metal Products" },
  "26": { km: "កុំព្យូទ័រ អេឡិចត្រូនិក", en: "Computer & Electronics" },
  "27": { km: "បរិក្ខារអគ្គិសនី", en: "Electrical Equipment" },
  "28": { km: "គ្រឿងម៉ាស៊ីន", en: "Machinery & Equipment" },
  "29": { km: "យានយន្ត", en: "Motor Vehicles" },
  "30": { km: "មធ្យោបាយដឹកជញ្ជូនផ្សេងទៀត", en: "Other Transport Equipment" },
  "31": { km: "គ្រឿងសង្ហារិម", en: "Furniture" },
  "32": { km: "ផលិតកម្មផ្សេងទៀត", en: "Other Manufacturing" },
  "33": { km: "ជួសជុល និងតំឡើងម៉ាស៊ីន", en: "Repair & Installation of Machinery" },
};

// Known upstream -> downstream relationships within manufacturing (which division's
// output typically becomes another division's input). Not exhaustive — scoped to
// plausible, well-known manufacturing value chains.
const SUPPLIES_TO: Record<string, string[]> = {
  "01": ["10", "13", "16"],
  "02": ["16", "17"],
  "03": ["10"],
  "10": ["11"],
  "13": ["14", "15"],
  "16": ["17", "31"],
  "17": ["18"],
  "20": ["21", "22", "23"],
  "22": ["27", "28", "31"],
  "24": ["25"],
  "25": ["26", "27", "28", "31"],
  "26": ["27"],
  "27": ["28"],
};

const STOPWORDS = new Set([
  "ផលិត", "ផលិតផល", "ផលិតកម្ម", "កែច្នៃ", "ការ", "និង", "ការធ្វើ", "ធ្វើ",
  "សម្រាប់", "គ្រប់ប្រភេទ", "ដទៃ", "ទៀត", "ដទៃទៀត", "ផ្សេង", "ផ្សេងទៀត",
  "ដែល", "នៃ", "ជា", "កម្មន្តសាល", "ដើម", "ចាក់",
]);

let classMap: Map<string, CSICClassInfo> | null = null;

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

function loadClassMap(): Map<string, CSICClassInfo> {
  if (classMap) return classMap;
  const filePath = path.join(process.cwd(), "src/data/csic-codes.csv");
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^﻿/, "");
  const lines = raw.replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim());

  const map = new Map<string, CSICClassInfo>();
  let currentGroup = "";
  let currentGroupDescription = "";

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const [groupCol, levelCol, , description] = cols;

    if (groupCol && groupCol.trim()) {
      currentGroup = groupCol.trim();
      currentGroupDescription = description || "";
      continue;
    }

    if (levelCol && levelCol.trim()) {
      const code = levelCol.trim().replace(/\(.*\)$/, "").trim();
      if (/^\d{4}$/.test(code)) {
        map.set(code, {
          code,
          description: description || "",
          group: currentGroup,
          groupDescription: currentGroupDescription,
        });
      }
    }
  }

  classMap = map;
  return map;
}

export function getCSICInfo(code: string): CSICClassInfo | null {
  if (!code) return null;
  const normalized = code.trim();
  if (!/^\d{3,4}$/.test(normalized)) return null;
  return loadClassMap().get(normalized.padStart(4, "0")) || null;
}

export function getDivision(isicCode: string): string | null {
  const normalized = (isicCode || "").trim();
  if (!/^\d{3,4}$/.test(normalized)) return null;
  return normalized.padStart(4, "0").slice(0, 2);
}

export function getDivisionName(division: string): DivisionInfo {
  return DIVISION_NAMES[division] || { km: `ក្រុមឧស្សាហកម្ម ${division}`, en: `Division ${division}` };
}

function tokenize(text: string): string[] {
  if (!text) return [];
  return Array.from(
    new Set(
      text
        .replace(/[（）()、,./\\]/g, " ")
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length >= 3 && !STOPWORDS.has(t))
    )
  );
}

function overlappingTokens(a: string[], b: string[]): string[] {
  const matches = new Set<string>();
  for (const ta of a) {
    for (const tb of b) {
      if (ta === tb || ta.includes(tb) || tb.includes(ta)) {
        matches.add(ta.length <= tb.length ? ta : tb);
      }
    }
  }
  return Array.from(matches);
}

export interface SupplierBuyerMatch {
  supplier: SMERecord;
  buyer: SMERecord;
  supplierDivision: string;
  buyerDivision: string;
  matchedKeywords: string[];
  score: number;
}

function businessIdentity(r: SMERecord): string {
  return (r.companyName || r.enterpriseName || r.ownerName || "").trim().toLowerCase();
}

function levenshtein(a: string, b: string): number {
  const dp: number[] = Array(b.length + 1)
    .fill(0)
    .map((_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = temp;
    }
  }
  return dp[b.length];
}

// The same business is often re-typed slightly differently across monthly submissions
// (e.g. "CAMBODIAN" vs "CAMBODAIN"). Treat near-identical names as the same business so
// it never gets suggested as its own supplier or buyer.
function isSameBusiness(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  if (Math.min(a.length, b.length) < 6) return false;
  return levenshtein(a, b) <= 2;
}

export function findSupplierBuyerMatches(records: SMERecord[]): SupplierBuyerMatch[] {
  const candidates = records
    .filter((r) => r.isicCode && r.productName)
    .map((r) => {
      const division = getDivision(r.isicCode);
      return division ? { record: r, division, tokens: tokenize(r.productName), identity: businessIdentity(r) } : null;
    })
    .filter((c): c is { record: SMERecord; division: string; tokens: string[]; identity: string } => c !== null && c.tokens.length > 0);

  const matches: SupplierBuyerMatch[] = [];

  for (const supplier of candidates) {
    const downstream = SUPPLIES_TO[supplier.division];
    if (!downstream || downstream.length === 0) continue;

    for (const buyer of candidates) {
      if (supplier.record === buyer.record) continue;
      if (!downstream.includes(buyer.division)) continue;
      if (isSameBusiness(supplier.identity, buyer.identity)) continue;

      const matchedKeywords = overlappingTokens(supplier.tokens, buyer.tokens);
      if (matchedKeywords.length === 0) continue;

      matches.push({
        supplier: supplier.record,
        buyer: buyer.record,
        supplierDivision: supplier.division,
        buyerDivision: buyer.division,
        matchedKeywords,
        score: matchedKeywords.length,
      });
    }
  }

  // The same business often re-registers across multiple months/years, which would
  // otherwise repeat the identical supplier-buyer pair many times in the results.
  const bestByPair = new Map<string, SupplierBuyerMatch>();
  for (const m of matches) {
    const key = `${businessIdentity(m.supplier)}=>${businessIdentity(m.buyer)}`;
    const existing = bestByPair.get(key);
    if (!existing || m.score > existing.score) {
      bestByPair.set(key, m);
    }
  }

  return Array.from(bestByPair.values()).sort((a, b) => b.score - a.score);
}

export function getIndustryBreakdown(records: SMERecord[]): { division: string; name: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const r of records) {
    const division = getDivision(r.isicCode);
    if (!division) continue;
    counts[division] = (counts[division] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([division, count]) => ({ division, name: getDivisionName(division).km, count }))
    .sort((a, b) => b.count - a.count);
}
