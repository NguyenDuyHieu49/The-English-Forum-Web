"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock, Focus, Sparkles, TrendingUp, Zap } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { Leaderboard } from "@/components/gamification/leaderboard";
import { MissionCard } from "@/components/missions/mission-card";
import { PetWidget } from "@/components/gamification/pet-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_COURSES } from "@/mock/courses";
import { MOCK_DAILY_MISSIONS } from "@/mock/missions";
import { MOCK_LEADERBOARD, MOCK_WEEKLY_PROGRESS, MOCK_USER_STATS } from "@/mock/user";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";

export default function HomePage() {
  const claimDailyCheckIn = useAppStore((s) => s.claimDailyCheckIn);
  const canCheckInToday = useAppStore((s) => s.canCheckInToday);
  const focusMode = useAppStore((s) => s.focusMode);
  const { t } = useTranslation();

  const statCards = [
    { label: t.home.learningHours, value: `${MOCK_USER_STATS.learningHours}h`, icon: Clock, color: "text-blue-500" },
    { label: t.home.focusScore, value: `${MOCK_USER_STATS.focusScore}%`, icon: Focus, color: "text-emerald-500" },
    { label: t.home.totalXp, value: MOCK_USER_STATS.xp.toLocaleString(), icon: Zap, color: "text-violet-500" },
    { label: t.common.tokens, value: MOCK_USER_STATS.tokens.toString(), icon: Sparkles, color: "text-amber-500" },
  ];

  const handleClaimReward = () => {
    claimDailyCheckIn();
  };

  if (focusMode) {
    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-3xl font-bold tracking-tight">{t.home.focusLessonTitle}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{t.home.focusLessonSubtitle}</p>
        </motion.div>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>{t.home.focusLessonParagraph1}</p>
          <p>{t.home.focusLessonParagraph2}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.home.welcome}</h1>
          <p className="mt-1 text-muted-foreground">
            {t.home.subtitle}{" "}
            <span className="font-semibold text-orange-500">
              {MOCK_USER_STATS.streak.daily} {t.home.streak}
            </span>
            !
          </p>
        </div>
        <Button onClick={handleClaimReward} variant="outline" disabled={!canCheckInToday()}>
          <Sparkles className="mr-2 h-4 w-4" />
          {canCheckInToday() ? t.home.claimReward : t.home.checkedInToday}
        </Button>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-xl bg-muted p-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t.nav.courses}</h2>
              <Button variant="ghost" size="sm" asChild>
                <a href="/courses">{t.common.viewAll}</a>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {MOCK_COURSES.slice(0, 4).map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-violet-500" />
                {t.home.weeklyProgress}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={MOCK_WEEKLY_PROGRESS}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#8b5cf6"
                    fill="url(#colorHours)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <PetWidget />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.home.dailyMissions}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {MOCK_DAILY_MISSIONS.slice(0, 3).map((m, i) => (
                <MissionCard key={m.id} mission={m} index={i} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.home.leaderboard}</CardTitle>
            </CardHeader>
            <CardContent>
              <Leaderboard entries={MOCK_LEADERBOARD} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
