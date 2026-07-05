"use client";

import { motion } from "framer-motion";
import type { BattlePlayerState } from "@/types/battle-arena";
import { getHero } from "@/constants/battle-arena";
import { RankBadge } from "./rank-badge";

interface VsScreenProps {
  player: BattlePlayerState;
  opponent: BattlePlayerState;
}

function PlayerPanel({ player, side }: { player: BattlePlayerState; side: "left" | "right" }) {
  const hero = getHero(player.heroId);

  return (
    <motion.div
      initial={{ x: side === "left" ? -200 : 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 15, delay: side === "left" ? 0 : 0.3 }}
      className={`flex flex-col items-center ${side === "right" ? "text-right" : "text-left"}`}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2, delay: side === "left" ? 0 : 0.5 }}
        className={`flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br ${hero?.color ?? "from-gray-600 to-gray-800"} text-5xl shadow-xl`}
      >
        {hero?.emoji ?? player.avatar}
      </motion.div>
      <h3 className="mt-3 text-xl font-black">{player.userName}</h3>
      <p className="text-sm text-muted-foreground">{player.city}, {player.country}</p>
      <div className="mt-2">
        <RankBadge tier={player.rankTier} size="sm" />
      </div>
      <p className="mt-1 text-sm font-medium text-violet-400">{hero?.name}</p>
    </motion.div>
  );
}

export function VsScreen({ player, opponent }: VsScreenProps) {
  return (
    <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden p-6">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 via-background to-background" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1] }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute z-10"
      >
        <span className="text-6xl font-black text-red-500 drop-shadow-lg">VS</span>
      </motion.div>

      <div className="relative z-0 grid w-full max-w-3xl grid-cols-3 items-center gap-4">
        <PlayerPanel player={player} side="left" />
        <div />
        <PlayerPanel player={opponent} side="right" />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 text-sm text-muted-foreground"
      >
        Prepare for battle!
      </motion.p>
    </div>
  );
}
