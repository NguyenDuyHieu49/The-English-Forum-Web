"use client";

import { useAppStore } from "@/store/app-store";
import { getDictionary } from "@/i18n";

export function useTranslation() {
  const locale = useAppStore((s) => s.locale);
  const t = getDictionary(locale);
  return { t, locale };
}
