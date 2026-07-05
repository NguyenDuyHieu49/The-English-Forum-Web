"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Flame } from "lucide-react";
import type { LeaderboardEntry } from "@/types/arena";
import { cn, formatNumber } from "@/lib/utils";

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[];
  title?: string;
}

export function LeaderboardPanel({ entries, title }: LeaderboardPanelProps) {
  return (
    <div className="space-y-3">
      {title && <h3 className="font-semibold">{title}</h3>}
      {entries.map((entry, i) => (
        <motion.div
          key={entry.userId}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className={cn(
            "flex items-center gap-3 rounded-xl p-3",
            entry.isCurrentUser
              ? "bg-violet-500/10 ring-1 ring-violet-500/30"
              : "bg-muted/30"
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
            <p className="truncate text-sm font-medium">
              {entry.name}
              {entry.isCurrentUser && (
                <span className="ml-1 text-xs text-violet-500">(You)</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {entry.city} · Lv.{entry.arenaLevel}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-violet-600">
              {formatNumber(entry.arenaXp)} XP
            </p>
            <p className="flex items-center justify-end gap-0.5 text-xs text-orange-500">
              <Flame className="h-3 w-3" />
              {entry.streak}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
