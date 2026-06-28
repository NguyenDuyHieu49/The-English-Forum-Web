"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { MissionCard } from "@/components/missions/mission-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_DAILY_MISSIONS } from "@/mock/missions";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import type { DailyMission } from "@/types/mission";

export default function MissionsPage() {
  const streak = useAppStore((s) => s.userStats.streak);
  const addReward = useAppStore((s) => s.addReward);
  const { t } = useTranslation();
  const [missions, setMissions] = useState<DailyMission[]>(MOCK_DAILY_MISSIONS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmitFile = (missionId: string, file: File) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission || mission.completed) return;

    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId
          ? {
              ...m,
              completed: true,
              progress: m.target,
              submittedFile: file.name,
            }
          : m
      )
    );

    addReward({
      id: `mission-${missionId}`,
      type: "tokens",
      amount: mission.tokenReward,
      label: `${mission.tokenReward} Tokens`,
      rarity: "common",
    });
    addReward({
      id: `mission-xp-${missionId}`,
      type: "xp",
      amount: mission.xpReward,
      label: `${mission.xpReward} XP`,
      rarity: "common",
    });

    setFeedback(t.missions.submitSuccess);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">{t.nav.missions}</h1>
        <p className="mt-1 text-muted-foreground">{t.missions.subtitle}</p>
      </motion.div>

      {feedback && (
        <p className="rounded-xl bg-emerald-500/10 px-4 py-2 text-center text-sm text-emerald-600 dark:text-emerald-400">
          {feedback}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: t.missions.dailyStreak, value: streak.daily, unit: t.gamification.dayStreak },
          { label: t.missions.weeklyStreak, value: streak.weekly, unit: t.missions.weeks },
          { label: t.missions.monthlyStreak, value: streak.monthly, unit: t.missions.months },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-orange-500">{s.value}</p>
                <p className="text-xs text-muted-foreground">
                  {s.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-violet-500" />
            {t.missions.todayGoals}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {missions.map((m, i) => (
            <MissionCard
              key={m.id}
              mission={m}
              index={i}
              onSubmitFile={handleSubmitFile}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
