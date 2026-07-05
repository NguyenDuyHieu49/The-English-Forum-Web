"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Coins, Flame, Lock, Swords } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GAME_META, STAGES_BEFORE_BOSS } from "@/constants/arena";
import type { GameId } from "@/types/arena";
import { cn } from "@/lib/utils";

interface GameCardProps {
  gameId: GameId;
  locked?: boolean;
  index?: number;
}

export function GameCard({ gameId, locked = false, index = 0 }: GameCardProps) {
  const meta = GAME_META[gameId];
  const href = `/games/${gameId}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={locked ? {} : { y: -6, scale: 1.02 }}
    >
      <Card
        className={cn(
          "group overflow-hidden transition-shadow",
          locked ? "opacity-60" : "hover:shadow-xl hover:shadow-violet-500/15 cursor-pointer"
        )}
      >
        <div className={cn("bg-gradient-to-br p-6 text-white", meta.color)}>
          <span className="text-4xl">{meta.emoji}</span>
          <h3 className="mt-3 text-lg font-bold">{meta.title}</h3>
          <p className="mt-1 text-sm text-white/80">
            +{meta.baseXp} XP · +{meta.baseCoins} coins
          </p>
        </div>
        <CardContent className="p-4">
          {locked ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              Complete {STAGES_BEFORE_BOSS} games to unlock
            </div>
          ) : (
            <Button className="w-full" asChild>
              <Link href={href}>
                <Swords className="mr-2 h-4 w-4" />
                Play Now
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ArenaStatsBar({
  coins,
  streak,
  level,
}: {
  coins: number;
  streak: number;
  level: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-600">
        <Coins className="h-4 w-4" />
        {coins}
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5 text-sm font-semibold text-orange-600">
        <Flame className="h-4 w-4" />
        {streak}
      </div>
      <div className="rounded-full bg-violet-500/10 px-3 py-1.5 text-sm font-semibold text-violet-600">
        Lv.{level}
      </div>
    </div>
  );
}
