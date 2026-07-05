"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Swords, Trophy, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RankBadge } from "@/components/battle-arena/rank-badge";
import { useBattleArenaStore } from "@/store/battle-arena-store";
import { useTranslation } from "@/hooks/use-translation";
import { HEROES } from "@/constants/battle-arena";

export function PvpArenaBanner() {
  const { t } = useTranslation();
  const profile = useBattleArenaStore((s) => s.rankedProfile);
  const equipped = useBattleArenaStore((s) => s.equipped);
  const hero = HEROES.find((h) => h.id === equipped.heroId);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      <Card className="overflow-hidden border-red-500/30 shadow-lg shadow-red-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-orange-500/5 to-violet-600/10" />
        <CardContent className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${hero?.color ?? "from-red-600 to-orange-700"} text-4xl shadow-xl`}
              >
                {hero?.emoji ?? "⚔️"}
              </motion.div>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-red-500">
                    {t.battleArena.pvpBadge}
                  </span>
                  <RankBadge tier={profile.rankTier} size="sm" />
                </div>
                <h2 className="text-2xl font-black sm:text-3xl">
                  {t.battleArena.title}
                </h2>
                <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                  {t.battleArena.subtitle}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>🏆 {profile.wins}W · {profile.losses}L</span>
                  <span>🔥 {t.battleArena.streak}: {profile.winStreak}</span>
                  <span>⚔️ {profile.battlePoints} BP</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button
                size="lg"
                asChild
                className="h-14 bg-gradient-to-r from-red-600 to-orange-600 px-8 text-base font-black shadow-lg shadow-red-500/25"
              >
                <Link href="/games/battle-arena">
                  <Swords className="mr-2 h-5 w-5" />
                  {t.battleArena.findMatch}
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/games/battle-arena/heroes">
                    <Shield className="mr-1.5 h-4 w-4" />
                    {t.battleArena.heroes}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/games/battle-arena/leaderboard">
                    <Trophy className="mr-1.5 h-4 w-4" />
                    {t.battleArena.ranks}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-muted/40 px-4 py-2.5 text-sm">
            <Users className="h-4 w-4 text-emerald-500" />
            <span className="text-muted-foreground">{t.battleArena.onlineHint}</span>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
