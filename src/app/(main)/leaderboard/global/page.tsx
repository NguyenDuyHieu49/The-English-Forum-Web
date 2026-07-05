"use client";

import Link from "next/link";
import { Globe, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LeaderboardPanel } from "@/components/arena/leaderboard-panel";
import { useArenaStore } from "@/store/arena-store";
import { getLeaderboard } from "@/services/arena/leaderboard";

export default function GlobalLeaderboardPage() {
  const profile = useArenaStore((s) => s.gameProfile);
  const entries = getLeaderboard("global", {
    city: profile.city,
    country: profile.country,
    userXp: profile.arenaXp,
    userName: profile.displayName,
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/leaderboard"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-violet-500" />
            Global Leaderboard
          </h1>
          <p className="text-sm text-muted-foreground">All-time top learners worldwide</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-5">
          <LeaderboardPanel entries={entries} />
        </CardContent>
      </Card>
    </div>
  );
}
