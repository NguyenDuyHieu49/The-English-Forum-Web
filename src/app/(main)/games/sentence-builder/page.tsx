"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GAME_META } from "@/constants/arena";
import { SENTENCE_PUZZLES, shuffle } from "@/mock/arena-games";
import { GameShell } from "@/components/arena/game-shell";
import { GameResultModal } from "@/components/arena/game-result-modal";
import { ConfettiEffect } from "@/components/arena/confetti-effect";
import { useArenaStore } from "@/store/arena-store";
import { cn } from "@/lib/utils";
import type { GameSessionResult } from "@/types/arena";

export default function SentenceBuilderPage() {
  const router = useRouter();
  const meta = GAME_META["sentence-builder"];
  const completeGame = useArenaStore((s) => s.completeGame);
  const puzzles = useMemo(() => shuffle(SENTENCE_PUZZLES).slice(0, 5), []);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [reward, setReward] = useState<ReturnType<typeof completeGame> | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const current = puzzles[index];
  const shuffledWords = useMemo(
    () => (current ? shuffle(current.words) : []),
    [current]
  );

  const toggleWord = (word: string, i: number) => {
    const key = `${word}-${i}`;
    const idx = selected.indexOf(key);
    if (idx >= 0) {
      setSelected(selected.filter((_, j) => j !== idx));
    } else {
      setSelected([...selected, key]);
    }
  };

  const builtSentence = selected
    .map((k) => k.slice(0, k.lastIndexOf("-")))
    .join(" ");

  const checkAnswer = useCallback(() => {
    const isCorrect = builtSentence === current.correct;
    const newCorrect = correct + (isCorrect ? 1 : 0);

    if (index >= puzzles.length - 1) {
      const result: GameSessionResult = {
        gameId: "sentence-builder",
        score: newCorrect,
        maxScore: puzzles.length,
        correct: newCorrect,
        total: puzzles.length,
        combo: 0,
        perfect: newCorrect === puzzles.length,
        timeBonus: 0,
        durationMs: 0,
      };
      const r = completeGame(result);
      setReward(r);
      setFinished(true);
      setShowConfetti(newCorrect >= puzzles.length * 0.6);
    } else {
      setCorrect(newCorrect);
      setIndex((i) => i + 1);
      setSelected([]);
    }
  }, [builtSentence, current, correct, index, puzzles.length, completeGame]);

  if (!current && !finished) return null;

  return (
    <>
      <ConfettiEffect active={showConfetti} />
      <GameShell
        title={meta.title}
        emoji={meta.emoji}
        color={meta.color}
        progress={((index + 1) / puzzles.length) * 100}
      >
        {!finished && (
          <div className="space-y-6">
            <div className="min-h-[60px] rounded-xl border-2 border-dashed border-violet-500/30 bg-violet-500/5 p-4 text-center">
              <p className="text-sm font-medium">
                {builtSentence || "Tap words to build the sentence..."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {shuffledWords.map((word, i) => {
                const key = `${word}-${i}`;
                const used = selected.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleWord(word, i)}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                      used
                        ? "border-violet-500 bg-violet-500 text-white"
                        : "border-border hover:border-violet-500/50"
                    )}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
            <button
              onClick={checkAnswer}
              disabled={selected.length === 0}
              className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white disabled:opacity-50"
            >
              Check Answer
            </button>
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
