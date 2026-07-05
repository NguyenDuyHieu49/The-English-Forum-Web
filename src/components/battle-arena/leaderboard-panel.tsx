"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RankBadge } from "@/components/battle-arena";
import { useBattleArenaStore } from "@/store/battle-arena-store";
import { getBattleLeaderboard } from "@/services/battle-arena/leaderboard";
import type { BattleLeaderboardScope } from "@/types/battle-arena";
import { HEROES } from "@/constants/battle-arena";

const SCOPES: { id: BattleLeaderboardScope; label: string; href: string }[] = [
  { id: "global", label: "Global", href: "/games/battle-arena/leaderboard" },
  { id: "country", label: "Country", href: "/games/battle-arena/leaderboard/country" },
  { id: "city", label: "City", href: "/games/battle-arena/leaderboard/city" },
  { id: "hero", label: "Hero", href: "/games/battle-arena/leaderboard/hero" },
  { id: "season", label: "Season", href: "/games/battle-arena/leaderboard/season" },
];

interface BattleLeaderboardPanelProps {
  scope: BattleLeaderboardScope;
}

export function BattleLeaderboardPanel({ scope }: BattleLeaderboardPanelProps) {
  const initBattleArena = useBattleArenaStore((s) => s.initBattleArena);
  const profile = useBattleArenaStore((s) => s.rankedProfile);
  const equipped = useBattleArenaStore((s) => s.equipped);

  useEffect(() => {
    initBattleArena();
  }, [initBattleArena]);

  const entries = getBattleLeaderboard(
    scope,
    {
      name: profile.displayName,
      rankPoints: profile.rankPoints,
      wins: profile.wins,
      losses: profile.losses,
      heroId: equipped.heroId,
      country: profile.country,
      city: profile.city,
    },
    scope === "country" ? { country: profile.country }
      : scope === "city" ? { city: profile.city }
      : scope === "hero" ? { heroId: equipped.heroId }
      : undefined
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/games/battle-arena"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black">Battle Leaderboard</h1>
          <p className="text-sm capitalize text-muted-foreground">{scope} rankings</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SCOPES.map((s) => (
          <Button key={s.id} variant={scope === s.id ? "default" : "outline"} size="sm" asChild>
            <Link href={s.href}>{s.label}</Link>
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        {entries.slice(0, 20).map((entry) => {
          const hero = HEROES.find((h) => h.id === entry.heroId);
          return (
            <Card
              key={entry.userId}
              className={entry.isCurrentUser ? "border-violet-500/50 bg-violet-500/5" : ""}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <span className="w-8 text-center text-lg font-black text-muted-foreground">
                  #{entry.rank}
                </span>
                <span className="text-2xl">{hero?.emoji ?? entry.avatar}</span>
                <div className="flex-1">
                  <p className="font-bold">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.city}, {entry.country}</p>
                </div>
                <RankBadge tier={entry.rankTier} size="sm" />
                <div className="text-right text-sm">
                  <p className="font-bold">{entry.rankPoints} RP</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.wins}W · {entry.winRate}% · 🔥{entry.winStreak}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
