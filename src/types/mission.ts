export interface DailyMission {
  id: string;
  title: string;
  description: string;
  type: "learning" | "quiz" | "focus" | "speaking" | "social";
  target: number;
  progress: number;
  unit: string;
  tokenReward: number;
  xpReward: number;
  completed: boolean;
}

export interface SearchResult {
  id: string;
  type: "course" | "teacher" | "post" | "quiz";
  title: string;
  subtitle: string;
  image?: string;
  href: string;
}
