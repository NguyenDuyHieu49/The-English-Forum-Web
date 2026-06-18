export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface WordLookupResult {
  word: string;
  definition: string;
  pronunciation: string;
  examples: string[];
  synonyms: string[];
  level: CefrLevel;
  translation?: string;
}
