import type { Locale } from "@/constants/app";
import { MOCK_CERTIFICATES } from "@/mock/certificates";
import { MOCK_CLASSROOM } from "@/mock/classroom";
import { MOCK_CONVERSATIONS } from "@/mock/messages";
import { MOCK_COURSES } from "@/mock/courses";
import { MOCK_DAILY_MISSIONS } from "@/mock/missions";
import { MOCK_POSTS } from "@/mock/social";
import { MOCK_QUIZZES } from "@/mock/quizzes";
import { MOCK_SEARCH_RESULTS } from "@/mock/search";
import { MOCK_LEADERBOARD, MOCK_USER_STATS, MOCK_WEEKLY_PROGRESS } from "@/mock/user";
import type { Course } from "@/types/course";
import type { DailyMission } from "@/types/mission";
import type { Quiz } from "@/types/quiz";
import type { Post } from "@/types/social";
import type { Conversation } from "@/types/message";
import type { Certificate } from "@/types/certificate";
import type { ClassroomSession } from "@/types/classroom";
import type { SearchResult } from "@/types/mission";
import type { Achievement } from "@/types/gamification";
import { getLessonsByCourse as getBaseLessonsByCourse } from "@/mock/lessons";
import type { Lesson } from "@/types/course";
import { viContent } from "./vi";
import type { LocaleContent } from "./types";

function contentFor(locale: Locale): LocaleContent | null {
  return locale === "vi" ? viContent : null;
}

export function getLocalizedCourses(locale: Locale): Course[] {
  const c = contentFor(locale);
  if (!c) return MOCK_COURSES;
  return MOCK_COURSES.map((course) => {
    const loc = c.courses[course.id];
    if (!loc) return course;
    return { ...course, ...loc };
  });
}

export function getLocalizedMissions(locale: Locale): DailyMission[] {
  const c = contentFor(locale);
  if (!c) return MOCK_DAILY_MISSIONS;
  return MOCK_DAILY_MISSIONS.map((mission) => {
    const loc = c.missions[mission.id];
    if (!loc) return mission;
    return { ...mission, title: loc.title, description: loc.description, unit: loc.unit };
  });
}

export function getLocalizedQuizzes(locale: Locale): Quiz[] {
  const c = contentFor(locale);
  if (!c) return MOCK_QUIZZES;
  return MOCK_QUIZZES.map((quiz) => {
    const loc = c.quizzes[quiz.id];
    if (!loc) return quiz;
    return {
      ...quiz,
      title: loc.title,
      description: loc.description,
      category: loc.category,
      questions: quiz.questions.map((q) => {
        const qLoc = loc.questions[q.id];
        if (!qLoc) return q;
        return {
          ...q,
          text: qLoc.text,
          explanation: qLoc.explanation ?? q.explanation,
          choices: q.choices.map((choice) => ({
            ...choice,
            text: qLoc.choices[choice.id] ?? choice.text,
          })),
        };
      }),
    };
  });
}

export function getLocalizedCertificates(locale: Locale): Certificate[] {
  const c = contentFor(locale);
  if (!c) return MOCK_CERTIFICATES;
  return MOCK_CERTIFICATES.map((cert) => {
    const loc = c.certificates[cert.id];
    if (!loc) return cert;
    return { ...cert, title: loc.title, category: loc.category, score: loc.score };
  });
}

export function getLocalizedAchievements(locale: Locale): Achievement[] {
  const c = contentFor(locale);
  if (!c) return MOCK_USER_STATS.achievements;
  return MOCK_USER_STATS.achievements.map((a) => {
    const loc = c.achievements[a.id];
    if (!loc) return a;
    return { ...a, title: loc.title, description: loc.description };
  });
}

export function getLocalizedLeaderboard(locale: Locale) {
  const c = contentFor(locale);
  if (!c) return MOCK_LEADERBOARD;
  return MOCK_LEADERBOARD.map((entry) =>
    entry.isCurrentUser ? { ...entry, name: c.leaderboardYou } : entry
  );
}

export function getLocalizedWeeklyProgress(locale: Locale) {
  const c = contentFor(locale);
  if (!c) return MOCK_WEEKLY_PROGRESS;
  return MOCK_WEEKLY_PROGRESS.map((day, i) => ({
    ...day,
    day: c.weekDays[i] ?? day.day,
  }));
}

export function getLocalizedLearningHistory(locale: Locale) {
  const c = contentFor(locale);
  if (!c) return [];
  return c.learningHistory;
}

export function getLocalizedPosts(locale: Locale): Post[] {
  const c = contentFor(locale);
  if (!c) return MOCK_POSTS;
  return MOCK_POSTS.map((post) => {
    const loc = c.socialPosts[post.id];
    if (!loc) return post;
    return {
      ...post,
      content: loc.content,
      createdAt: loc.createdAt,
      user: { ...post.user, role: loc.role },
    };
  });
}

export function getLocalizedClassroom(locale: Locale): ClassroomSession {
  const c = contentFor(locale);
  if (!c) return MOCK_CLASSROOM;
  const loc = c.classroom;
  return {
    ...MOCK_CLASSROOM,
    title: loc.title,
    members: MOCK_CLASSROOM.members.map((m) => ({
      ...m,
      name: m.name === "You" ? c.leaderboardYou : m.name,
      role: m.role === "teacher" ? "teacher" : "student",
    })),
    chat: MOCK_CLASSROOM.chat.map((msg, i) => ({
      ...msg,
      sender: loc.chatMessages[i]?.sender ?? msg.sender,
      text: loc.chatMessages[i]?.text ?? msg.text,
    })),
    files: MOCK_CLASSROOM.files.map((file, i) => ({
      ...file,
      name: loc.fileNames[i] ?? file.name,
    })),
  };
}

export function getLocalizedConversations(locale: Locale): Conversation[] {
  const c = contentFor(locale);
  if (!c) return MOCK_CONVERSATIONS;
  return MOCK_CONVERSATIONS.map((conv) => {
    const loc = c.messages[conv.id];
    if (!loc) return conv;
    return {
      ...conv,
      lastMessage: loc.lastMessage,
      messages: conv.messages.map((msg, i) => ({
        ...msg,
        text: loc.messages[i]?.text ?? msg.text,
        timestamp: loc.messages[i]?.timestamp ?? msg.timestamp,
      })),
    };
  });
}

export function getLocalizedSearchDefaults(locale: Locale): SearchResult[] {
  const c = contentFor(locale);
  if (!c) return MOCK_SEARCH_RESULTS;
  return MOCK_SEARCH_RESULTS.map((result, i) => {
    const loc = c.searchDefaults[i];
    if (!loc) return result;
    return { ...result, title: loc.title, subtitle: loc.subtitle };
  });
}

export function getLocalizedLessonsByCourse(locale: Locale, courseId: string): Lesson[] {
  const lessons = getBaseLessonsByCourse(courseId);
  const c = contentFor(locale);
  if (!c) return lessons;
  return lessons.map((lesson) => {
    const loc = c.lessons[lesson.id];
    if (!loc) return lesson;
    return { ...lesson, title: loc.title, description: loc.description, content: loc.content };
  });
}

export function localizeDifficulty(
  locale: Locale,
  difficulty: string
): string {
  if (locale !== "vi") return difficulty;
  const map: Record<string, string> = {
    easy: "Dễ",
    medium: "Trung bình",
    hard: "Khó",
  };
  return map[difficulty] ?? difficulty;
}
