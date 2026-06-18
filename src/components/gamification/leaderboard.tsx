"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatNumber } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.rank}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className={cn(
            "flex items-center gap-3 rounded-xl p-3 transition-colors",
            entry.isCurrentUser
              ? "bg-violet-500/10 ring-1 ring-violet-500/20"
              : "hover:bg-accent/50"
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
              entry.rank === 1 && "bg-yellow-500/20 text-yellow-600",
              entry.rank === 2 && "bg-zinc-400/20 text-zinc-500",
              entry.rank === 3 && "bg-orange-500/20 text-orange-600",
              entry.rank > 3 && "bg-muted text-muted-foreground"
            )}
          >
            {entry.rank <= 3 ? <Trophy className="h-4 w-4" /> : entry.rank}
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src={entry.avatar} alt={entry.name} />
            <AvatarFallback>{entry.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{entry.name}</p>
            <p className="text-xs text-muted-foreground">Level {entry.level}</p>
          </div>
          <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
            {formatNumber(entry.xp)} XP
          </span>
        </motion.div>
      ))}
    </div>
  );
}
