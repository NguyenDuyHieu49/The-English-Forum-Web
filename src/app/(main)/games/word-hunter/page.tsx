"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GAME_META } from "@/constants/arena";
import { WORD_HUNTER_PAIRS, shuffle } from "@/mock/arena-games";
import { GameShell } from "@/components/arena/game-shell";
import { GameResultModal } from "@/components/arena/game-result-modal";
import { ConfettiEffect } from "@/components/arena/confetti-effect";
import { useArenaStore } from "@/store/arena-store";
import { cn } from "@/lib/utils";
import type { GameSessionResult } from "@/types/arena";

export default function WordHunterPage() {
  const router = useRouter();
  const meta = GAME_META["word-hunter"];
  const completeGame = useArenaStore((s) => s.completeGame);
  const pairs = useMemo(() => shuffle(WORD_HUNTER_PAIRS).slice(0, 8), []);
  const [index, setIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timer, setTimer] = useState(60);
  const [finished, setFinished] = useState(false);
  const [reward, setReward] = useState<ReturnType<typeof completeGame> | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const current = pairs[index];
  const choices = useMemo(() => {
    if (!current) return [];
    return shuffle([current.meaning, ...current.distractors]);
  }, [current]);

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setTimer((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [finished]);

  useEffect(() => {
    if (timer === 0 && !finished) endGame();
  }, [timer, finished]);

  const endGame = useCallback(() => {
    const result: GameSessionResult = {
      gameId: "word-hunter",
      score: correct,
      maxScore: pairs.length,
      correct,
      total: index + (selected ? 1 : 0),
      combo: maxCombo,
      perfect: correct === pairs.length,
      timeBonus: timer > 20 ? 10 : 0,
      durationMs: (60 - timer) * 1000,
    };
    const r = completeGame(result);
    setReward(r);
    setFinished(true);
    setShowConfetti(correct >= pairs.length * 0.6);
  }, [correct, pairs.length, index, selected, maxCombo, timer, completeGame]);

  const handlePick = (meaning: string) => {
    if (finished || selected) return;
    setSelected(meaning);
    const isCorrect = meaning === current.meaning;
    if (isCorrect) {
      setCorrect((c) => c + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));
    } else {
      setCombo(0);
    }
    setTimeout(() => {
      if (index >= pairs.length - 1) {
        endGame();
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 600);
  };

  if (!current && !finished) return null;

  return (
    <>
      <ConfettiEffect active={showConfetti} />
      <GameShell
        title={meta.title}
        emoji={meta.emoji}
        color={meta.color}
        progress={((index + 1) / pairs.length) * 100}
        combo={combo}
        timer={timer}
      >
        {!finished && current && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">Match the meaning</p>
              <p className="mt-2 text-3xl font-black text-violet-600">{current.word}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {choices.map((c) => (
                <button
                  key={c}
                  onClick={() => handlePick(c)}
                  disabled={!!selected}
                  className={cn(
                    "rounded-xl border p-4 text-left text-sm font-medium transition-all",
                    selected === c &&
                      (c === current.meaning
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-red-500 bg-red-500/10"),
                    !selected && "hover:border-violet-500/50 hover:bg-violet-500/5"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </GameShell>
      <GameResultModal
        open={finished}
        reward={reward}
        won={correct >= pairs.length * 0.6}
        onClose={() => {
          setShowConfetti(false);
          router.push("/games");
        }}
      />
    </>
  );
}
