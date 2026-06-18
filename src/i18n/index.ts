import type { Locale } from "@/constants/app";
import { vi } from "./vi";
import { en } from "./en";
import type { TranslationDictionary } from "./types";

const dictionaries: Record<Locale, TranslationDictionary> = { vi, en };

export function getDictionary(locale: Locale): TranslationDictionary {
  return dictionaries[locale] ?? dictionaries.vi;
}

export type { TranslationDictionary };
