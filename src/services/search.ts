import type { SearchResult } from "@/types/mission";
import { MOCK_SEARCH_RESULTS } from "@/mock/search";
import { MOCK_COURSES } from "@/mock/courses";
import { MOCK_QUIZZES } from "@/mock/quizzes";

export function searchAll(query: string): SearchResult[] {
  if (!query.trim()) return MOCK_SEARCH_RESULTS;

  const lowerQuery = query.toLowerCase();

  const courseResults: SearchResult[] = MOCK_COURSES.filter(
    (c) =>
      c.title.toLowerCase().includes(lowerQuery) ||
      c.teacher.toLowerCase().includes(lowerQuery) ||
      c.category.toLowerCase().includes(lowerQuery)
  ).map((c) => ({
    id: c.id,
    type: "course" as const,
    title: c.title,
    subtitle: `${c.teacher} · ${c.category}`,
    image: c.image,
    href: "/courses",
  }));

  const quizResults: SearchResult[] = MOCK_QUIZZES.filter(
    (q) =>
      q.title.toLowerCase().includes(lowerQuery) ||
      q.category.toLowerCase().includes(lowerQuery)
  ).map((q) => ({
    id: q.id,
    type: "quiz" as const,
    title: q.title,
    subtitle: `${q.difficulty} · ${q.questionCount} questions`,
    href: `/quiz/${q.id}`,
  }));

  const defaultResults = MOCK_SEARCH_RESULTS.filter(
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
