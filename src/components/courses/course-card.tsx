"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Play, Sparkles, Star } from "lucide-react";
import type { Course } from "@/types/course";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  index?: number;
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const { t } = useTranslation();
  const tokens = useAppStore((s) => s.userStats.tokens);
  const isEnrolled = useAppStore((s) => s.isCourseEnrolled(course.id));
  const purchaseCourse = useAppStore((s) => s.purchaseCourse);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handlePurchase = () => {
    const result = purchaseCourse(course.id, course.tokenPrice);
    if (result === "success") setFeedback(t.courses.purchaseSuccess);
    else if (result === "insufficient_tokens") setFeedback(t.courses.notEnoughTokens);
    else setFeedback(t.courses.alreadyOwned);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg hover:shadow-violet-500/10">
        <div className="relative h-40 overflow-hidden">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {course.category}
          </span>
          {!isEnrolled && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              <Lock className="h-3 w-3" />
              {course.tokenPrice} {t.common.tokens}
            </span>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="mb-1 line-clamp-2 font-semibold leading-snug">
            {course.title}
          </h3>
          <div className="mb-3 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={course.teacherAvatar} alt={course.teacher} />
              <AvatarFallback className="text-[10px]">
                {getInitials(course.teacher)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{course.teacher}</span>
            <div className="ml-auto flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{course.rating}</span>
            </div>
          </div>

          {isEnrolled ? (
            <div className="mb-3 space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {course.completedLessons}/{course.lessonCount} lessons
                </span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} />
            </div>
          ) : (
            <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
              {course.description}
            </p>
          )}

          {feedback && (
            <p className="mb-2 text-center text-xs text-violet-600 dark:text-violet-400">
              {feedback}
            </p>
          )}

          {isEnrolled ? (
            <Button className="w-full" size="sm" asChild>
              <Link href={`/courses/${course.id}`}>
                <Play className="mr-1.5 h-3.5 w-3.5" />
                {t.home.continueLearning}
              </Link>
            </Button>
          ) : (
            <Button
              className="w-full"
              size="sm"
              disabled={tokens < course.tokenPrice}
              onClick={handlePurchase}
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {t.courses.buyWithTokens} ({course.tokenPrice})
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
