import type { CefrLevel } from "@/types/dictionary";

/** Subset of common ESL / exam vocabulary mapped to CEFR levels */
const CEFR_WORD_MAP: Record<string, CefrLevel> = {
  // A1
  hello: "A1", world: "A1", book: "A1", learn: "A1", speak: "A1", read: "A1",
  write: "A1", good: "A1", bad: "A1", happy: "A1", school: "A1", teacher: "A1",
  student: "A1", friend: "A1", family: "A1", food: "A1", water: "A1", house: "A1",
  work: "A1", time: "A1", day: "A1", year: "A1", big: "A1", small: "A1",
  // A2
  improve: "A2", practice: "A2", vocabulary: "A2", grammar: "A2", lesson: "A2",
  exam: "A2", score: "A2", answer: "A2", question: "A2", explain: "A2",
  understand: "A2", difficult: "A2", easy: "A2", important: "A2", different: "A2",
  // B1
  opinion: "B1", argument: "B1", discuss: "B1", environment: "B1", society: "B1",
  government: "B1", education: "B1", technology: "B1", culture: "B1", economy: "B1",
  develop: "B1", increase: "B1", decrease: "B1", influence: "B1", benefit: "B1",
  // B2
  furthermore: "B2", however: "B2", therefore: "B2", significant: "B2",
  substantial: "B2", analyze: "B2", evaluate: "B2", implement: "B2",
  consequence: "B2", phenomenon: "B2", perspective: "B2", acknowledge: "B2",
  // C1
  ubiquitous: "C1", paradigm: "C1", mitigate: "C1", exacerbate: "C1",
  juxtapose: "C1", corroborate: "C1", quintessential: "C1", ambivalent: "C1",
  // C2
  obfuscate: "C2", perspicacious: "C2", recalcitrant: "C2", ineffable: "C2",
  serendipity: "C2", vicissitude: "C2",
};

const ACADEMIC_SUFFIXES = [
  "tion", "sion", "ment", "ance", "ence", "ology", "ical", "ious", "eous",
];

export function getWordLevel(word: string): CefrLevel {
  const normalized = word.toLowerCase().trim().replace(/[^a-z'-]/g, "");
  if (!normalized) return "B1";

  const mapped = CEFR_WORD_MAP[normalized];
  if (mapped) return mapped;

  const len = normalized.length;
  if (len <= 4) return "A1";
  if (len <= 6) return "A2";
  if (ACADEMIC_SUFFIXES.some((s) => normalized.endsWith(s))) {
    return len > 10 ? "C1" : "B2";
  }
  if (len <= 8) return "B1";
  if (len <= 10) return "B2";
  return "C1";
}

export const CEFR_LEVEL_COLORS: Record<CefrLevel, string> = {
  A1: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  A2: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  B1: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  B2: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  C1: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  C2: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};
