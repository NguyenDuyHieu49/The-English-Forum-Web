"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
  const { t } = useTranslation();
  const { courses, certificates: localizedCerts } = useLocalizedContent();
  const enrolledCourseIds = useAppStore((s) => s.enrolledCourseIds);

  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));
  const completedCourses = enrolledCourses.filter((c) => c.progress >= 100);
  const inProgressCourses = enrolledCourses.filter((c) => c.progress > 0 && c.progress < 100);
  const certificates = localizedCerts.filter((cert) => {
    const baseCourseId = cert.courseId.replace("-partial", "");
    return enrolledCourseIds.includes(baseCourseId);
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">{t.achievements.title}</h1>
        <p className="mt-1 text-muted-foreground">{t.achievements.subtitle}</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: t.achievements.certificatesEarned,
            value: certificates.length,
            icon: Award,
            color: "text-amber-500",
          },
          {
            label: t.achievements.coursesCompleted,
            value: completedCourses.length,
            icon: GraduationCap,
            color: "text-emerald-500",
          },
          {
            label: t.achievements.inProgress,
            value: inProgressCourses.length,
            icon: BookOpen,
            color: "text-violet-500",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={cn("rounded-xl bg-muted p-3", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Award className="h-5 w-5 text-amber-500" />
          {t.achievements.myCertificates}
        </h2>
        {certificates.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              {t.achievements.noCertificates}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {certificates.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                  <div className="relative h-28">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className="object-cover opacity-60"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <Award className="h-6 w-6 text-amber-500" />
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                        {cert.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="space-y-3 p-5">
                    <div>
                      <h3 className="font-semibold leading-snug">{cert.title}</h3>
                      <p className="text-xs text-muted-foreground">{cert.teacher}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {cert.completedAt}
                      </span>
                      <span>{t.achievements.score}: {cert.score}</span>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {cert.certificateCode}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      {t.achievements.downloadCertificate}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          {t.achievements.completedCourses}
        </h2>
        {completedCourses.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              {t.achievements.noCompletedCourses}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {completedCourses.map((course) => (
              <Card key={course.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image src={course.image} alt={course.title} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.category} · {course.teacher}
                    </p>
                    <Progress value={100} className="mt-2 h-1.5" />
                  </div>
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <BookOpen className="h-5 w-5 text-violet-500" />
          {t.achievements.coursesInProgress}
        </h2>
        {inProgressCourses.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              {t.achievements.noInProgress}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {inProgressCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>{course.title}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {course.progress}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={course.progress} />
                    <p className="text-xs text-muted-foreground">
                      {course.completedLessons}/{course.lessonCount} {t.courses.lessons}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/courses/${course.id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t.achievements.continueCourse}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
