"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useArenaStore } from "@/store/arena-store";

export default function ProfileAchievementsPage() {
  const achievements = useArenaStore((s) => s.achievements);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-500" />
            Arena Achievements
          </h1>
          <p className="text-sm text-muted-foreground">Unlock badges, titles, and coins</p>
        </div>
      </div>

      <div className="space-y-3">
        {achievements.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={a.unlocked ? "border-emerald-500/30 bg-emerald-500/5" : ""}>
              <CardContent className="flex items-center gap-4 p-4">
                <span className="text-3xl">{a.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                  {!a.unlocked && (
                    <Progress value={(a.progress / a.target) * 100} className="mt-2 h-1.5" />
                  )}
                  <p className="mt-1 text-xs text-amber-600">+{a.rewardCoins} coins</p>
                </div>
                {a.unlocked && (
                  <span className="text-xs font-medium text-emerald-600">Unlocked ✓</span>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
