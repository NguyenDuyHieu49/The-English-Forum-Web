"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameRewardBreakdown } from "@/types/arena";

interface GameResultModalProps {
  open: boolean;
  reward: GameRewardBreakdown | null;
  won: boolean;
  onClose: () => void;
}

export function GameResultModal({ open, reward, won, onClose }: GameResultModalProps) {
  return (
    <AnimatePresence>
      {open && reward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-4xl">
              {won ? "🏆" : "💪"}
            </div>
            <h2 className="text-2xl font-bold">{won ? "Victory!" : "Good Try!"}</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-lg font-bold text-violet-600">+{reward.totalXp} XP</p>
              <p className="font-semibold text-amber-600">+{reward.coins} Coins</p>
              {reward.comboBonus > 0 && (
                <p className="text-muted-foreground">Combo bonus: +{reward.comboBonus} XP</p>
              )}
              {reward.perfectBonus > 0 && (
                <p className="text-emerald-600">Perfect bonus: +{reward.perfectBonus} XP</p>
              )}
              {reward.leveledUp && (
                <p className="font-bold text-violet-500">🎉 Level {reward.newLevel}!</p>
              )}
            </div>
            <Button className="mt-6 w-full" onClick={onClose}>
              Continue
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LevelUpModal({
  open,
  level,
  onClose,
}: {
  open: boolean;
  level: number;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-10 text-center text-white shadow-2xl"
          >
            <Trophy className="mx-auto mb-4 h-16 w-16" />
            <p className="text-lg opacity-90">Level Up!</p>
            <p className="text-5xl font-black">{level}</p>
            <Button variant="secondary" className="mt-6" onClick={onClose}>
              Awesome!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
