export interface SpeakingFeedback {
  pronunciation: number;
  grammar: number;
  fluency: number;
  overall: number;
  suggestions: string[];
  transcript: string;
}

export interface TeacherApplication {
  experience: string;
  education: string;
  certificates: string[];
  portfolio: string;
  cvFileName?: string;
}
