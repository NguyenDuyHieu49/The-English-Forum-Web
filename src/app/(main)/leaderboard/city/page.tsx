"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LeaderboardPanel } from "@/components/arena/leaderboard-panel";
import { useArenaStore } from "@/store/arena-store";
import { getLeaderboard, getLeaderboardRewards } from "@/services/arena/leaderboard";

export default function CityLeaderboardPage() {
  const profile = useArenaStore((s) => s.gameProfile);
  const entries = getLeaderboard("city", {
    city: profile.city,
    userXp: profile.arenaXp,
    userName: profile.displayName,
  });

  const userRank = entries.find((e) => e.isCurrentUser)?.rank ?? 0;
  const rewards = getLeaderboardRewards(userRank);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/leaderboard"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-violet-500" />
            {profile.city} Top Learners
          </h1>
          <p className="text-sm text-muted-foreground">Compete with learners in your city</p>
        </div>
      </div>

      {userRank > 0 && userRank <= 10 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-4 text-sm"
        >
          🎁 Your rank #{userRank} earns you exclusive rewards!
          {rewards.titleId && " Legendary title unlocked at #1."}
          {rewards.frameId && " Special frame for top 3."}
          {rewards.badgeId && " City badge for top 10."}
        </motion.div>
      )}

      <Card>
        <CardContent className="p-5">
          <LeaderboardPanel entries={entries} />
        </CardContent>
      </Card>
    </div>
  );
}
