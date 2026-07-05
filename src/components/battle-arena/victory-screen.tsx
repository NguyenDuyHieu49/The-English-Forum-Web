"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { BattleReward } from "@/types/battle-arena";
import { ConfettiEffect } from "@/components/arena/confetti-effect";

interface VictoryScreenProps {
  won: boolean;
  reward: BattleReward | null;
  opponentName: string;
  onContinue: () => void;
}

export function VictoryScreen({ won, reward, opponentName, onContinue }: VictoryScreenProps) {
  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center space-y-6 p-6">
      <ConfettiEffect active={won} />

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 10 }}
        className="text-8xl"
      >
        {won ? "🏆" : "💀"}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`text-4xl font-black ${won ? "text-yellow-400" : "text-red-400"}`}
      >
        {won ? "VICTORY!" : "DEFEAT"}
      </motion.h2>

      <p className="text-muted-foreground">
        {won ? `You defeated ${opponentName}!` : `${opponentName} won this battle.`}
      </p>

      {reward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 rounded-2xl bg-muted/30 p-6"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-400">+{reward.xp}</p>
            <p className="text-xs text-muted-foreground">XP</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">+{reward.coins}</p>
            <p className="text-xs text-muted-foreground">Coins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">+{reward.battlePoints}</p>
            <p className="text-xs text-muted-foreground">Battle Pts</p>
          </div>
          {reward.rankPointsChange !== 0 && (
            <div className="col-span-3 text-center">
              <p className={`font-bold ${reward.rankPointsChange > 0 ? "text-emerald-400" : "text-red-400"}`}>
                Rank {reward.rankPointsChange > 0 ? "+" : ""}{reward.rankPointsChange} pts
              </p>
            </div>
          )}
        </motion.div>
      )}

      <Button size="lg" onClick={onContinue} className="mt-4">
        Continue
      </Button>
    </div>
  );
}
