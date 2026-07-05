"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  Play,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { getLocalizedLessonsByCourse } from "@/i18n/content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getInitials, cn } from "@/lib/utils";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = use(params);
  const { t, locale } = useTranslation();
  const { courses } = useLocalizedContent();
  const course = courses.find((c) => c.id === id);
  const tokens = useAppStore((s) => s.userStats.tokens);
  const isEnrolled = useAppStore((s) => s.isCourseEnrolled(id));
  const purchaseCourse = useAppStore((s) => s.purchaseCourse);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!course) notFound();

  const lessons = getLocalizedLessonsByCourse(locale, course.id);
  const selectedLesson =
    lessons.find((l) => l.id === selectedLessonId) ?? lessons.find((l) => !l.completed) ?? lessons[0];

  const handlePurchase = () => {
    const result = purchaseCourse(course.id, course.tokenPrice);
    if (result === "success") setFeedback(t.courses.purchaseSuccess);
    else if (result === "insufficient_tokens") setFeedback(t.courses.notEnoughTokens);
    else setFeedback(t.courses.alreadyOwned);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-sm text-muted-foreground">{course.category} · {course.duration}</p>
        </div>
      </div>

      <div className="relative h-48 overflow-hidden rounded-2xl">
        <Image src={course.image} alt={course.title} fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="mb-2 flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-white/30">
              <AvatarImage src={course.teacherAvatar} alt={course.teacher} />
              <AvatarFallback>{getInitials(course.teacher)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{course.teacher}</span>
          </div>
          <p className="text-sm text-white/90 line-clamp-2">{course.description}</p>
        </div>
      </div>

      {!isEnrolled ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <Lock className="h-10 w-10 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold">{t.courses.locked}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
            </div>
            <p className="text-sm font-medium">
              {course.tokenPrice} {t.common.tokens}
            </p>
            {feedback && <p className="text-sm text-violet-600 dark:text-violet-400">{feedback}</p>}
            <Button disabled={tokens < course.tokenPrice} onClick={handlePurchase}>
              <Sparkles className="mr-2 h-4 w-4" />
              {t.courses.buyWithTokens} ({course.tokenPrice})
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-5">
              <div className="mb-2 flex justify-between text-sm">
                <span>{t.courses.courseProgress}</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} />
              <p className="mt-2 text-xs text-muted-foreground">
                {course.completedLessons}/{course.lessonCount} {t.courses.lessons}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4 text-violet-500" />
                  {t.courses.lessonList}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lessons.map((lesson, i) => (
                  <motion.button
                    key={lesson.id}
                    type="button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                      selectedLesson?.id === lesson.id
                        ? "border-violet-500/40 bg-violet-500/5"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug">{lesson.title}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {lesson.duration} {t.common.min}
                      </p>
                    </div>
                    <Play className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </motion.button>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-base">{selectedLesson?.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{selectedLesson?.description}</p>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p>{selectedLesson?.content}</p>
                </div>
                <Button className="mt-6" size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  {t.courses.startLesson}
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
