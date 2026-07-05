export interface CourseContent {
  title: string;
  description: string;
  category: string;
  duration: string;
}

export interface MissionContent {
  title: string;
  description: string;
  unit: string;
}

export interface LessonContent {
  title: string;
  description: string;
  content: string;
}

export interface CertificateContent {
  title: string;
  category: string;
  score: string;
}

export interface AchievementContent {
  title: string;
  description: string;
}

export interface LearningHistoryContent {
  course: string;
  date: string;
  duration: string;
}

export interface QuizChoiceContent {
  text: string;
}

export interface QuizQuestionContent {
  text: string;
  choices: Record<string, string>;
  explanation?: string;
}

export interface QuizContent {
  title: string;
  description: string;
  category: string;
  questions: Record<string, QuizQuestionContent>;
}

export interface ClassroomContent {
  title: string;
  slideLabel: string;
  teacherScreenShare: string;
  members: string;
  chat: string;
  messagePlaceholder: string;
  files: string;
  chatMessages: Array<{ sender: string; text: string }>;
  fileNames: string[];
  roles: { teacher: string; student: string };
}

export interface SocialPostContent {
  content: string;
  role: string;
  createdAt: string;
}

export interface MessageContent {
  lastMessage: string;
  messages: Array<{ text: string; timestamp: string }>;
}

export interface LocaleContent {
  courses: Record<string, CourseContent>;
  missions: Record<string, MissionContent>;
  lessons: Record<string, LessonContent>;
  certificates: Record<string, CertificateContent>;
  achievements: Record<string, AchievementContent>;
  learningHistory: LearningHistoryContent[];
  weekDays: string[];
  leaderboardYou: string;
  socialYou: string;
  studentRole: string;
  quizzes: Record<string, QuizContent>;
  classroom: ClassroomContent;
  socialPosts: Record<string, SocialPostContent>;
  socialStories: Record<string, string>;
  messages: Record<string, MessageContent>;
  searchDefaults: Array<{ title: string; subtitle: string }>;
}
