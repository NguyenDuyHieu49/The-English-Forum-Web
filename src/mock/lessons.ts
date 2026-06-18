import type { Lesson } from "@/types/course";

export const MOCK_LESSONS: Lesson[] = [
  // IELTS Academic Preparation
  { id: "l1", courseId: "c1", title: "IELTS Overview & Band Descriptors", duration: 25, completed: true },
  { id: "l2", courseId: "c1", title: "Listening: Multiple Choice Strategies", duration: 30, completed: true },
  { id: "l3", courseId: "c1", title: "Reading: True/False/Not Given", duration: 35, completed: true },
  { id: "l4", courseId: "c1", title: "Writing Task 1: Describing Trends", duration: 40, completed: true },
  { id: "l5", courseId: "c1", title: "Writing Task 2: Opinion Essays", duration: 45, completed: false },
  { id: "l6", courseId: "c1", title: "Speaking Part 2: Cue Cards", duration: 30, completed: false },
  // TOEIC Listening & Reading
  { id: "l7", courseId: "c2", title: "TOEIC Format & Scoring", duration: 20, completed: true },
  { id: "l8", courseId: "c2", title: "Part 1: Photographs", duration: 25, completed: true },
  { id: "l9", courseId: "c2", title: "Part 5: Incomplete Sentences", duration: 30, completed: false },
  { id: "l10", courseId: "c2", title: "Part 7: Reading Comprehension", duration: 35, completed: false },
  // TOEFL iBT
  { id: "l11", courseId: "c3", title: "Integrated Writing Task", duration: 40, completed: true },
  { id: "l12", courseId: "c3", title: "Independent Speaking Task", duration: 30, completed: true },
  { id: "l13", courseId: "c3", title: "Academic Lecture Note-taking", duration: 35, completed: false },
  // Business English
  { id: "l14", courseId: "c4", title: "Professional Email Writing", duration: 25, completed: true },
  { id: "l15", courseId: "c4", title: "Leading a Team Meeting", duration: 30, completed: false },
  // Grammar
  { id: "l16", courseId: "c5", title: "Present Perfect vs Past Simple", duration: 30, completed: true },
  { id: "l17", courseId: "c5", title: "First & Second Conditionals", duration: 35, completed: false },
  // Speaking
  { id: "l18", courseId: "c6", title: "Connected Speech & Linking", duration: 25, completed: true },
  { id: "l19", courseId: "c6", title: "Small Talk at Work", duration: 20, completed: false },
];

/** Current lesson shown in Focus Mode on the dashboard */
export const MOCK_ACTIVE_LESSON = MOCK_LESSONS.find((l) => l.id === "l5")!;

export function getLessonsByCourse(courseId: string): Lesson[] {
  return MOCK_LESSONS.filter((l) => l.courseId === courseId);
}
