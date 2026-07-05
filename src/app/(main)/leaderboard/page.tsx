"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, MapPin, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LeaderboardPanel } from "@/components/arena/leaderboard-panel";
import { useArenaStore } from "@/store/arena-store";
import { getLeaderboard } from "@/services/arena/leaderboard";

const SCOPES = [
  { href: "/leaderboard/global", label: "Global", icon: Globe, scope: "global" as const },
  { href: "/leaderboard/city", label: "City", icon: MapPin, scope: "city" as const },
];

export default function LeaderboardPage() {
  const profile = useArenaStore((s) => s.gameProfile);

  const weekly = getLeaderboard("weekly", {
    city: profile.city,
    userXp: profile.arenaXp,
    userName: profile.displayName,
  }).slice(0, 10);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">Leaderboards</h1>
        <p className="mt-1 text-muted-foreground">
          Compete with learners worldwide and in your city
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SCOPES.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="transition-all hover:shadow-lg hover:ring-1 hover:ring-violet-500/20">
              <CardContent className="flex items-center gap-4 p-6">
                <s.icon className="h-8 w-8 text-violet-500" />
                <div>
                  <p className="font-semibold">{s.label} Leaderboard</p>
                  <p className="text-sm text-muted-foreground">View rankings</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <Trophy className="h-5 w-5 text-amber-500" />
            Weekly Top 10
          </h2>
          <LeaderboardPanel entries={weekly} />
        </CardContent>
      </Card>
    </div>
  );
}
