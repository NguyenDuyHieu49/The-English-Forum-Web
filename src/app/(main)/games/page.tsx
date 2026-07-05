"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, MapPin, Trophy, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameCard, ArenaStatsBar } from "@/components/arena/game-card";
import { ArenaXpBar } from "@/components/arena/arena-xp-bar";
import { LeaderboardPanel } from "@/components/arena/leaderboard-panel";
import { LevelUpModal } from "@/components/arena/game-result-modal";
import { ConfettiEffect } from "@/components/arena/confetti-effect";
import { useArenaStore } from "@/store/arena-store";
import { getLeaderboard } from "@/services/arena/leaderboard";
import { DAILY_REWARDS, STAGES_BEFORE_BOSS, VIETNAM_CITIES } from "@/constants/arena";

const GAME_IDS = [
  "word-hunter",
  "sentence-builder",
  "grammar-challenge",
  "listening-quest",
  "boss-battle",
] as const;

export default function GamesHubPage() {
  const initArena = useArenaStore((s) => s.initArena);
  const profile = useArenaStore((s) => s.gameProfile);
  const friends = useArenaStore((s) => s.friends);
  const friendActivity = useArenaStore((s) => s.friendActivity);
  const activeEvent = useArenaStore((s) => s.activeEvent);
  const gamesSinceBoss = useArenaStore((s) => s.gamesSinceBoss);
  const showLevelUp = useArenaStore((s) => s.showLevelUp);
  const dismissLevelUp = useArenaStore((s) => s.dismissLevelUp);
  const claimDailyReward = useArenaStore((s) => s.claimDailyReward);
  const canClaimDailyReward = useArenaStore((s) => s.canClaimDailyReward);
  const setCity = useArenaStore((s) => s.setCity);
  const lastDailyRewardDay = profile.lastDailyRewardDay;

  useEffect(() => {
    initArena();
  }, [initArena]);

  const cityBoard = getLeaderboard("city", {
    city: profile.city,
    userXp: profile.arenaXp,
    userName: profile.displayName,
  }).slice(0, 5);

  const bossLocked = gamesSinceBoss < STAGES_BEFORE_BOSS && profile.bossStagesCleared === 0
    ? gamesSinceBoss < STAGES_BEFORE_BOSS
    : gamesSinceBoss < STAGES_BEFORE_BOSS;

  return (
    <div className="space-y-8">
      <ConfettiEffect active={showLevelUp} />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-black text-transparent">
              English Adventure Arena
            </h1>
            <p className="mt-1 text-muted-foreground">
              Learn English through addictive mini-games. Compete in your city!
            </p>
          </div>
          <ArenaStatsBar
            coins={profile.coins}
            streak={profile.dailyRewardStreak}
            level={profile.arenaLevel}
          />
        </div>
      </motion.div>

      <Card className="overflow-hidden border-violet-500/20">
        <CardContent className="p-5">
          <ArenaXpBar xp={profile.arenaXp} level={profile.arenaLevel} />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-violet-500" />
              <select
                value={profile.city}
                onChange={(e) => setCity(e.target.value)}
                className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
              >
                {VIETNAM_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/leaderboard/city">
                <Trophy className="mr-1.5 h-4 w-4" />
                {profile.city} Leaderboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeEvent?.active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white"
        >
          <p className="font-bold">🎉 {activeEvent.title}</p>
          <p className="text-sm opacity-90">{activeEvent.description}</p>
        </motion.div>
      )}

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Zap className="h-5 w-5 text-violet-500" />
          Mini Games
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAME_IDS.map((id, i) => (
            <GameCard
              key={id}
              gameId={id}
              index={i}
              locked={id === "boss-battle" && bossLocked}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gift className="h-5 w-5 text-amber-500" />
              Daily Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {DAILY_REWARDS.map((r) => (
                <div
                  key={r.day}
                  className={`flex flex-col items-center rounded-xl p-2 text-center text-xs ${
                    r.day <= lastDailyRewardDay
                      ? "bg-emerald-500/10 text-emerald-600"
                      : r.day === lastDailyRewardDay + 1
                        ? "bg-violet-500/10 ring-2 ring-violet-500"
                        : "bg-muted/50"
                  }`}
                >
                  <span className="text-lg">{r.emoji}</span>
                  <span className="mt-1 font-medium">D{r.day}</span>
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              disabled={!canClaimDailyReward()}
              onClick={() => claimDailyReward()}
            >
              {canClaimDailyReward() ? "Claim Today's Reward" : "Claimed Today ✓"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {profile.city} Top Learners
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/leaderboard">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <LeaderboardPanel entries={cityBoard} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-blue-500" />
            Friend Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {friendActivity.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-3 text-sm">
              <span>
                <strong>{a.friendName}</strong> {a.message}
              </span>
              <span className="text-xs text-muted-foreground">{a.timestamp}</span>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-2">
            {friends.map((f) => (
              <div key={f.id} className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs">
                <span>{f.name}</span>
                <span className="text-orange-500">🔥{f.streak}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <LevelUpModal
        open={showLevelUp}
        level={profile.arenaLevel}
        onClose={dismissLevelUp}
      />
    </div>
  );
}
