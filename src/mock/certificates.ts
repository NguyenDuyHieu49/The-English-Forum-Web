import type { Certificate } from "@/types/certificate";
import { MOCK_COURSES } from "@/mock/courses";

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    courseId: "c3",
    title: "TOEFL iBT Complete Guide",
    category: "TOEFL",
    completedAt: "2026-03-15",
    certificateCode: "TEF-TOEFL-2026-A7K2",
    score: "92%",
    image: MOCK_COURSES.find((c) => c.id === "c3")!.image,
    teacher: "Sarah Mitchell",
  },
  {
    id: "cert-2",
    courseId: "c1-partial",
    title: "IELTS Writing Task 2 Mastery",
    category: "IELTS",
    completedAt: "2026-05-20",
    certificateCode: "TEF-IELTS-W2-2026-M9P1",
    score: "Band 7.0",
    image: MOCK_COURSES.find((c) => c.id === "c1")!.image,
    teacher: "Emily Walsh",
  },
];

export function getCertificateByCourseId(courseId: string): Certificate | undefined {
  return MOCK_CERTIFICATES.find((c) => c.courseId === courseId);
}
