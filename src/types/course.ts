export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  teacher: string;
  teacherAvatar: string;
  progress: number;
  lessonCount: number;
  completedLessons: number;
  category: string;
  rating: number;
  duration: string;
  tokenPrice: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: number;
  completed: boolean;
}
