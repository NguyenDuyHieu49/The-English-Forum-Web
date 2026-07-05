"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/app-store";
import {
  getLocalizedAchievements,
  getLocalizedCertificates,
  getLocalizedClassroom,
  getLocalizedConversations,
  getLocalizedCourses,
  getLocalizedLeaderboard,
  getLocalizedLearningHistory,
  getLocalizedLessonsByCourse,
  getLocalizedMissions,
  getLocalizedPosts,
  getLocalizedQuizzes,
  getLocalizedSearchDefaults,
  getLocalizedWeeklyProgress,
} from "@/i18n/content";

export function useLocalizedContent() {
  const locale = useAppStore((s) => s.locale);

  return useMemo(
    () => ({
      courses: getLocalizedCourses(locale),
      missions: getLocalizedMissions(locale),
      quizzes: getLocalizedQuizzes(locale),
      certificates: getLocalizedCertificates(locale),
      achievements: getLocalizedAchievements(locale),
      leaderboard: getLocalizedLeaderboard(locale),
      weeklyProgress: getLocalizedWeeklyProgress(locale),
      learningHistory: getLocalizedLearningHistory(locale),
      posts: getLocalizedPosts(locale),
      classroom: getLocalizedClassroom(locale),
      conversations: getLocalizedConversations(locale),
      searchDefaults: getLocalizedSearchDefaults(locale),
      getLessonsByCourse: (courseId: string) => getLocalizedLessonsByCourse(locale, courseId),
    }),
    [locale]
  );
}
