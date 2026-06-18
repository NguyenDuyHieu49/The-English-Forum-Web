import type { WordLookupResult } from "@/types/dictionary";
import { getWordLevel } from "@/services/word-level";

function collectSynonyms(entry: {
  meanings?: Array<{
    synonyms?: string[];
    definitions?: Array<{ synonyms?: string[] }>;
  }>;
}): string[] {
  const synonyms = new Set<string>();

  for (const meaning of entry.meanings ?? []) {
    for (const syn of meaning.synonyms ?? []) {
      if (syn) synonyms.add(syn);
    }
    for (const def of meaning.definitions ?? []) {
      for (const syn of def.synonyms ?? []) {
        if (syn) synonyms.add(syn);
      }
    }
  }

  return Array.from(synonyms).slice(0, 6);
}

export async function lookupWord(word: string): Promise<WordLookupResult> {
  const cleanWord = word.trim().toLowerCase().replace(/[^a-z'-]/gi, "");
  const level = getWordLevel(cleanWord);

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`
    );
    if (res.ok) {
      const data = await res.json();
      const entry = data[0];
      const meaning = entry.meanings?.[0];
      const definition = meaning?.definitions?.[0]?.definition ?? "Definition not found.";
      const example = meaning?.definitions?.[0]?.example;
      const phonetic = entry.phonetic ?? entry.phonetics?.[0]?.text ?? "";
      const synonyms = collectSynonyms(entry);

      return {
        word: entry.word,
        definition,
        pronunciation: phonetic,
        examples: example ? [example] : [`The word "${cleanWord}" is commonly used in academic contexts.`],
        synonyms,
        level,
      };
    }
  } catch {
    // fallback below
  }

  return {
    word: cleanWord,
    definition: `"${cleanWord}" — a term encountered in your learning materials.`,
    pronunciation: `/${cleanWord}/`,
    examples: [`Example: The concept of "${cleanWord}" is fundamental to this course.`],
    synonyms: [],
    level,
  };
}
