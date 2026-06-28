export interface Certificate {
  id: string;
  courseId: string;
  title: string;
  category: string;
  completedAt: string;
  certificateCode: string;
  score: string;
  image: string;
  teacher: string;
}

export interface CompletedCourseRecord {
  courseId: string;
  title: string;
  category: string;
  completedAt: string;
  progress: number;
  image: string;
  teacher: string;
  hasCertificate: boolean;
}
