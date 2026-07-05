import type { Locale } from "@/constants/app";
import type { SearchResult } from "@/types/mission";
import { getLocalizedCourses, getLocalizedQuizzes, getLocalizedSearchDefaults, localizeDifficulty } from "@/i18n/content";
import { getDictionary } from "@/i18n";

export function searchAll(query: string, locale: Locale = "en"): SearchResult[] {
  const t = getDictionary(locale);
  if (!query.trim()) return getLocalizedSearchDefaults(locale);

  const lowerQuery = query.toLowerCase();
  const courses = getLocalizedCourses(locale);
  const quizzes = getLocalizedQuizzes(locale);

  const courseResults: SearchResult[] = courses
    .filter(
      (c) =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.teacher.toLowerCase().includes(lowerQuery) ||
        c.category.toLowerCase().includes(lowerQuery)
    )
    .map((c) => ({
      id: c.id,
      type: "course" as const,
      title: c.title,
      subtitle: `${c.teacher} · ${c.category}`,
      image: c.image,
      href: "/courses",
    }));

  const quizResults: SearchResult[] = quizzes
    .filter(
      (q) =>
        q.title.toLowerCase().includes(lowerQuery) ||
        q.category.toLowerCase().includes(lowerQuery)
    )
    .map((q) => ({
      id: q.id,
      type: "quiz" as const,
      title: q.title,
      subtitle: `${localizeDifficulty(locale, q.difficulty)} · ${q.questionCount} ${t.common.questions}`,
      href: `/quiz/${q.id}`,
    }));

  const defaultResults = getLocalizedSearchDefaults(locale).filter(
    (r) =>
      r.title.toLowerCase().includes(lowerQuery) ||
      r.subtitle.toLowerCase().includes(lowerQuery)
  );

  return [...courseResults, ...quizResults, ...defaultResults].slice(0, 10);
}

export async function translateText(text: string, targetLang = "vi"): Promise<string> {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    if (res.ok) {
      const data = await res.json();
      return data.responseData?.translatedText ?? text;
    }
  } catch {
    // fallback
  }
  return `[Translation] ${text}`;
}
