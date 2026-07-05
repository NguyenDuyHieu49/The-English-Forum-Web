"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Zap } from "lucide-react";
import type { BattleMatch, BattleRound } from "@/types/battle-arena";
import { getHero } from "@/constants/battle-arena";
import { HpBar, ManaBar } from "./hp-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BattleScreenProps {
  match: BattleMatch;
  currentRound: BattleRound | null;
  userId: string;
  lastAttack?: { damage: number; attacker: string } | null;
  stunned: boolean;
  onAnswer: (choiceId: string) => void;
  onUltimate: () => void;
}

export function BattleScreen({
  match,
  currentRound,
  userId,
  lastAttack,
  stunned,
  onAnswer,
  onUltimate,
}: BattleScreenProps) {
  const playerIdx = match.players.findIndex((p) => p.userId === userId);
  const player = match.players[playerIdx];
  const opponent = match.players[playerIdx === 0 ? 1 : 0];
  const playerHero = getHero(player.heroId);
  const opponentHero = getHero(opponent.heroId);
  const ultimateReady = player.mana >= 100;

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative min-h-[70vh] space-y-4">
      <AnimatePresence>
        {lastAttack && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          >
            <span className="text-6xl font-black text-red-500 drop-shadow-lg">
              -{lastAttack.damage} HP!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {stunned && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <span className="text-2xl font-bold text-yellow-400">⚡ STUNNED!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-transparent p-4">
          <motion.div
            animate={lastAttack?.attacker === userId ? { x: [0, 20, 0] } : {}}
            className={`mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${playerHero?.color} text-5xl shadow-lg`}
          >
            {playerHero?.emoji}
          </motion.div>
          <p className="text-center font-bold">{player.userName}</p>
          <HpBar current={player.hp} max={player.maxHp} side="left" />
          <ManaBar current={player.mana} max={player.maxMana} />
          {player.combo > 0 && (
            <p className="text-center text-sm font-bold text-orange-400">🔥 Combo x{player.combo}</p>
          )}
        </div>

        <div className="space-y-3 rounded-2xl bg-gradient-to-br from-red-950/50 to-transparent p-4">
          <motion.div
            animate={lastAttack?.attacker !== userId && lastAttack ? { x: [0, -10, 0] } : {}}
            className={`mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${opponentHero?.color} text-5xl shadow-lg`}
          >
            {opponentHero?.emoji}
          </motion.div>
          <p className="text-center font-bold">{opponent.userName}</p>
          <HpBar current={opponent.hp} max={opponent.maxHp} side="right" />
          <ManaBar current={opponent.mana} max={opponent.maxMana} />
        </div>
      </div>

      {currentRound && (
        <motion.div
          key={currentRound.roundIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-violet-500/20 bg-card p-6 shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium capitalize text-violet-400">
              {currentRound.question.category} · {currentRound.question.difficulty}
            </span>
            <span className="text-xs text-muted-foreground">
              Round {currentRound.roundIndex + 1}
            </span>
          </div>

          <h3 className="mb-4 text-lg font-semibold">{currentRound.question.text}</h3>

          {currentRound.question.audioText && (
            <Button
              variant="outline"
              size="sm"
              className="mb-4"
              onClick={() => speakText(currentRound.question.audioText!)}
            >
              <Volume2 className="mr-2 h-4 w-4" />
              Play Audio
            </Button>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            {currentRound.question.choices.map((c) => (
              <motion.button
                key={c.id}
                whileHover={{ scale: stunned ? 1 : 1.02 }}
                whileTap={{ scale: stunned ? 1 : 0.98 }}
                disabled={stunned || !!currentRound.answeredBy}
                onClick={() => onAnswer(c.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-border p-4 text-left transition-colors",
                  "hover:border-violet-500/50 hover:bg-violet-500/5",
                  (stunned || currentRound.answeredBy) && "pointer-events-none opacity-50"
                )}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                  {c.id.toUpperCase()}
                </span>
                <span className="text-sm">{c.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {ultimateReady && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-8 right-8 z-30"
        >
          <Button
            size="lg"
            onClick={onUltimate}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 font-bold shadow-lg shadow-amber-500/30"
          >
            <Zap className="mr-2 h-5 w-5" />
            ULTIMATE!
          </Button>
        </motion.div>
      )}
    </div>
  );
}
