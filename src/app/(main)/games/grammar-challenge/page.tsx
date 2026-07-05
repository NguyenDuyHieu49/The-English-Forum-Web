"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GAME_META } from "@/constants/arena";
import { GRAMMAR_QUESTIONS, shuffle } from "@/mock/arena-games";
import { GameShell } from "@/components/arena/game-shell";
import { GameResultModal } from "@/components/arena/game-result-modal";
import { ConfettiEffect } from "@/components/arena/confetti-effect";
import { useArenaStore } from "@/store/arena-store";
import { cn } from "@/lib/utils";
import type { GameSessionResult } from "@/types/arena";

export default function GrammarChallengePage() {
  const router = useRouter();
  const meta = GAME_META["grammar-challenge"];
  const completeGame = useArenaStore((s) => s.completeGame);
  const questions = useMemo(
    () => shuffle(GRAMMAR_QUESTIONS).sort((a, b) => a.difficulty - b.difficulty),
    []
  );
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [reward, setReward] = useState<ReturnType<typeof completeGame> | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const current = questions[index];

  const submit = useCallback(
    (choiceId: string) => {
      if (selected) return;
      setSelected(choiceId);
      const isCorrect = choiceId === current.correctId;
      const newCorrect = correct + (isCorrect ? 1 : 0);

      setTimeout(() => {
        if (index >= questions.length - 1) {
          const result: GameSessionResult = {
            gameId: "grammar-challenge",
            score: newCorrect,
            maxScore: questions.length,
            correct: newCorrect,
            total: questions.length,
            combo: 0,
            perfect: newCorrect === questions.length,
            timeBonus: 0,
            durationMs: 0,
          };
          const r = completeGame(result);
          setReward(r);
          setFinished(true);
          setShowConfetti(newCorrect >= questions.length * 0.6);
        } else {
          setCorrect(newCorrect);
          setIndex((i) => i + 1);
          setSelected(null);
        }
      }, 500);
    },
    [selected, current, correct, index, questions.length, completeGame]
  );

  if (!current && !finished) return null;

  return (
    <>
      <ConfettiEffect active={showConfetti} />
      <GameShell
        title={meta.title}
        emoji={meta.emoji}
        color={meta.color}
        progress={((index + 1) / questions.length) * 100}
      >
        {!finished && (
          <div className="space-y-4">
            <p className="text-lg font-semibold">{current.text}</p>
            <div className="space-y-2">
              {current.choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => submit(c.id)}
                  disabled={!!selected}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all",
                    selected === c.id &&
                      (c.id === current.correctId
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-red-500 bg-red-500/10"),
                    !selected && "hover:border-violet-500/50"
                  )}
                >
                  <span className="font-bold">{c.id.toUpperCase()}.</span>
                  {c.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </GameShell>
      <GameResultModal
        open={finished}
        reward={reward}
        won={(reward?.coins ?? 0) > 0}
        onClose={() => {
          setShowConfetti(false);
          router.push("/games");
        }}
      />
    </>
  );
}
