"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import type { BossBattleState } from "@/types/arena";

interface BossBattleUIProps {
  battle: BossBattleState;
  questionText: string;
  choices: { id: string; text: string }[];
  onAnswer: (choiceId: string, correct: boolean) => void;
  correctId: string;
}

export function BossBattleUI({
  battle,
  questionText,
  choices,
  onAnswer,
  correctId,
}: BossBattleUIProps) {
  const bossPct = (battle.bossHp / battle.bossMaxHp) * 100;
  const playerPct = (battle.playerHp / battle.playerMaxHp) * 100;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-red-950 to-zinc-900 p-6 text-white">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-center"
        >
          <span className="text-6xl">{battle.bossEmoji}</span>
          <h2 className="mt-2 text-xl font-bold">{battle.bossName}</h2>
        </motion.div>
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-xs">
            <span>Boss HP</span>
            <span>{battle.bossHp}/{battle.bossMaxHp}</span>
          </div>
          <Progress value={bossPct} className="h-3 bg-red-900/50 [&>div]:bg-red-500" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Your HP</span>
          <span>{battle.playerHp}/{battle.playerMaxHp}</span>
        </div>
        <Progress value={playerPct} className="h-2 [&>div]:bg-emerald-500" />
        <p className="mt-1 text-xs text-muted-foreground">
          Question {battle.questionIndex + 1}/{battle.totalQuestions}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">{questionText}</h3>
        <div className="space-y-2">
          {choices.map((c) => (
            <motion.button
              key={c.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswer(c.id, c.id === correctId)}
              className="flex w-full items-center gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:border-violet-500/50 hover:bg-violet-500/5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                {c.id.toUpperCase()}
              </span>
              <span className="text-sm">{c.text}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
