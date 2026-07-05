"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Flame, Gamepad2, Package, Sparkles, Swords, Trophy, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PetWidget } from "@/components/gamification/pet-widget";
import { useAppStore } from "@/store/app-store";
import { xpToNextLevel } from "@/services/gamification";
import { useTranslation } from "@/hooks/use-translation";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { useArenaStore } from "@/store/arena-store";
import { ArenaXpBar } from "@/components/arena/arena-xp-bar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { t } = useTranslation();
  const stats = useAppStore((s) => s.userStats);
  const { achievements, learningHistory } = useLocalizedContent();
  const arenaProfile = useArenaStore((s) => s.gameProfile);
  const equippedTitle = useArenaStore((s) => s.getEquippedTitle());
  const xpRemaining = xpToNextLevel(stats.xp);

  const displayAchievements = achievements.map((a) => {
    const stored = stats.achievements.find((s) => s.id === a.id);
    return stored
      ? { ...a, progress: stored.progress, unlocked: stored.unlocked, unlockedAt: stored.unlockedAt }
      : a;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6"
      >
        <Avatar className="h-24 w-24 ring-4 ring-violet-500/20">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt={t.common.you} />
          <AvatarFallback>{t.common.you[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{t.profile.title}</h1>
          <p className="text-muted-foreground">
            {t.gamification.level} {stats.level} {t.profile.learnerLevel}
            {equippedTitle && (
              <span className="ml-2 text-violet-600">· {equippedTitle}</span>
            )}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>
              {stats.streak.daily} {t.gamification.dayStreak}
            </span>
          </div>
        </div>
      </motion.div>

      <Card className="border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-indigo-500/5">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-violet-500" />
                English Adventure Arena
              </p>
              <p className="text-sm text-muted-foreground">
                Lv.{arenaProfile.arenaLevel} · {arenaProfile.coins} coins · {arenaProfile.city}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/inventory"><Package className="mr-1 h-4 w-4" />Inventory</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="border-red-500/30 text-red-600 hover:bg-red-500/5">
                <Link href="/games/battle-arena"><Swords className="mr-1 h-4 w-4" />PvP Battle</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/games">Play</Link>
              </Button>
            </div>
          </div>
          <ArenaXpBar xp={arenaProfile.arenaXp} level={arenaProfile.arenaLevel} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t.profile.learningHours, value: `${stats.learningHours}h`, icon: Clock },
          { label: t.profile.totalXp, value: stats.xp.toLocaleString(), icon: Zap },
          { label: t.common.tokens, value: stats.tokens.toString(), icon: Sparkles },
          { label: t.profile.focusScore, value: `${stats.focusScore}%`, icon: Trophy },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <s.icon className="h-5 w-5 text-violet-500" />
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-2 flex justify-between text-sm">
            <span>
              {t.gamification.level} {stats.level}
            </span>
            <span className="text-muted-foreground">
              {xpRemaining} {t.profile.xpToNext}
            </span>
          </div>
          <Progress value={((stats.xp % 1000) / 1000) * 100} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <PetWidget />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.profile.achievements}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {displayAchievements.map((a) => (
              <div
                key={a.id}
                className={`flex items-center gap-3 rounded-xl p-3 ${
                  a.unlocked ? "bg-emerald-500/5" : "bg-muted/50"
                }`}
              >
                <span className="text-2xl">{a.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                  {!a.unlocked && (
                    <Progress value={(a.progress / a.target) * 100} className="mt-2 h-1" />
                  )}
                </div>
                {a.unlocked && (
                  <span className="text-xs font-medium text-emerald-500">{t.common.unlocked}</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.profile.learningHistory}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {learningHistory.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-muted/30 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{h.course}</p>
                  <p className="text-xs text-muted-foreground">{h.date}</p>
                </div>
                <span className="text-sm text-muted-foreground">{h.duration}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
