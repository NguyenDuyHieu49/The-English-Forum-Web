"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { MissionCard } from "@/components/missions/mission-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_DAILY_MISSIONS } from "@/mock/missions";
import { useAppStore } from "@/store/app-store";

export default function MissionsPage() {
  const streak = useAppStore((s) => s.userStats.streak);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">Daily Missions</h1>
        <p className="mt-1 text-muted-foreground">
          Complete missions to earn tokens and XP
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Daily Streak", value: streak.daily, unit: "days" },
          { label: "Weekly Streak", value: streak.weekly, unit: "weeks" },
          { label: "Monthly Streak", value: streak.monthly, unit: "months" },
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
                  {s.label} ({s.unit})
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
            Today&apos;s Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_DAILY_MISSIONS.map((m, i) => (
            <MissionCard key={m.id} mission={m} index={i} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
