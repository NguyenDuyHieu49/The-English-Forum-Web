"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { MissionCard } from "@/components/missions/mission-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import type { DailyMission } from "@/types/mission";

export default function MissionsPage() {
  const streak = useAppStore((s) => s.userStats.streak);
  const addReward = useAppStore((s) => s.addReward);
  const addInventoryItem = useAppStore((s) => s.addInventoryItem);
  const { t, locale } = useTranslation();
  const { missions: localizedMissions } = useLocalizedContent();
  const [missions, setMissions] = useState<DailyMission[]>(localizedMissions);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setMissions((prev) =>
      localizedMissions.map((m) => {
        const existing = prev.find((p) => p.id === m.id);
        return existing
          ? { ...m, completed: existing.completed, progress: existing.progress, submittedFile: existing.submittedFile }
          : m;
      })
    );
  }, [localizedMissions]);

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

    const rewardLabels = t.gamification.rewards;
    addReward({
      id: `mission-${missionId}`,
      type: "tokens",
      amount: mission.tokenReward,
      label: `${mission.tokenReward} ${rewardLabels.tokens}`,
      rarity: "common",
    });
    addReward({
      id: `mission-xp-${missionId}`,
      type: "xp",
      amount: mission.xpReward,
      label: `${mission.xpReward} ${rewardLabels.xp}`,
      rarity: "common",
    });
    addInventoryItem("lucky_box", "mission");

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
