"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { MOCK_COURSES } from "@/mock/courses";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";

export default function CoursesPage() {
  const tokens = useAppStore((s) => s.userStats.tokens);
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">{t.nav.courses}</h1>
          <p className="mt-1 text-muted-foreground">{t.courses.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-600 dark:text-amber-400">
          <Sparkles className="h-4 w-4" />
          {t.courses.yourTokens}: {tokens}
        </div>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_COURSES.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
        ))}
      </div>
    </div>
  );
}
