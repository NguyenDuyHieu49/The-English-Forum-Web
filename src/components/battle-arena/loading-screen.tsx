"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ENGLISH_TIPS } from "@/constants/battle-arena";
import { getHero } from "@/constants/battle-arena";
import type { BattlePlayerState } from "@/types/battle-arena";

interface LoadingScreenProps {
  player: BattlePlayerState;
  opponent: BattlePlayerState;
}

export function LoadingScreen({ player, opponent }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const playerHero = getHero(player.heroId);
  const opponentHero = getHero(opponent.heroId);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 100));
    }, 200);
    const tipInterval = setInterval(() => {
      setTipIndex((i) => (i + 1) % ENGLISH_TIPS.length);
    }, 2500);
    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8 p-6">
      <h2 className="text-2xl font-black">Loading Battle...</h2>

      <div className="flex items-center gap-12">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br ${playerHero?.color} text-4xl`}
        >
          {playerHero?.emoji}
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="text-3xl"
        >
          ⚔️
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
          className={`flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br ${opponentHero?.color} text-4xl`}
        >
          {opponentHero?.emoji}
        </motion.div>
      </div>

      <div className="w-full max-w-md space-y-2">
        <Progress value={progress} className="h-3" />
        <p className="text-center text-sm text-muted-foreground">{progress}%</p>
      </div>

      <motion.p
        key={tipIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md text-center text-sm italic text-muted-foreground"
      >
        {ENGLISH_TIPS[tipIndex]}
      </motion.p>
    </div>
  );
}
