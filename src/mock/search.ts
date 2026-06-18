import type { SearchResult } from "@/types/mission";

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  { id: "sr1", type: "course", title: "IELTS Academic Preparation", subtitle: "Emily Walsh · IELTS", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&h=60&fit=crop", href: "/courses" },
  { id: "sr2", type: "teacher", title: "James Park", subtitle: "TOEIC · 4.7 rating", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", href: "/profile" },
  { id: "sr3", type: "quiz", title: "IELTS Vocabulary & Grammar", subtitle: "Medium · 5 questions", href: "/quiz/q1" },
  { id: "sr4", type: "post", title: "New IELTS Writing Task 2 module published", subtitle: "Emily Walsh · 2h ago", href: "/social" },
  { id: "sr5", type: "course", title: "TOEIC Listening & Reading", subtitle: "James Park · TOEIC", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=60&fit=crop", href: "/courses" },
  { id: "sr6", type: "quiz", title: "TOEIC Part 5 Grammar", subtitle: "Hard · 3 questions", href: "/quiz/q2" },
];
