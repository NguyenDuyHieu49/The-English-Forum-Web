export type QuizDifficulty = "easy" | "medium" | "hard";

export interface QuizChoice {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  choices: QuizChoice[];
  correctChoiceId: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: QuizDifficulty;
  category: string;
  questionCount: number;
  timeLimit: number;
  questions: QuizQuestion[];
  image?: string;
  author: string;
  plays: number;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: { questionId: string; selectedChoiceId: string; isCorrect: boolean }[];
}
