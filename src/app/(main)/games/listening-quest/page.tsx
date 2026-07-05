"use client";

import { useCallback, useMemo, useState } from "react";
import { Volume2 } from "lucide-react";
import { GAME_META } from "@/constants/arena";
import { LISTENING_QUESTIONS, shuffle } from "@/mock/arena-games";
import { GameShell } from "@/components/arena/game-shell";
import { GameResultModal } from "@/components/arena/game-result-modal";
import { ConfettiEffect } from "@/components/arena/confetti-effect";
import { Button } from "@/components/ui/button";
import { useArenaStore } from "@/store/arena-store";
import { cn } from "@/lib/utils";
import type { GameSessionResult } from "@/types/arena";

export default function ListeningQuestPage() {
  const meta = GAME_META["listening-quest"];
  const completeGame = useArenaStore((s) => s.completeGame);
  const questions = useMemo(() => shuffle(LISTENING_QUESTIONS).slice(0, 5), []);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [reward, setReward] = useState<ReturnType<typeof completeGame> | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const current = questions[index];

  const playAudio = () => {
    if (typeof window === "undefined" || !current) return;
    const utterance = new SpeechSynthesisUtterance(current.text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setHasPlayed(true);
  };

  const submit = useCallback(
    (choiceId: string) => {
      if (selected || !hasPlayed) return;
      setSelected(choiceId);
      const isCorrect = choiceId === current.correctId;
      const newCorrect = correct + (isCorrect ? 1 : 0);

      setTimeout(() => {
        if (index >= questions.length - 1) {
          const result: GameSessionResult = {
            gameId: "listening-quest",
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
          setHasPlayed(false);
        }
      }, 500);
    },
    [selected, hasPlayed, current, correct, index, questions.length, completeGame]
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
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8">
              <Button size="lg" onClick={playAudio} className="rounded-full h-20 w-20">
                <Volume2 className="h-8 w-8" />
              </Button>
              <p className="text-sm text-muted-foreground">
                {hasPlayed ? "Choose the sentence you heard" : "Tap to listen, then pick the answer"}
              </p>
            </div>
            <div className="space-y-2">
              {current.choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => submit(c.id)}
                  disabled={!!selected || !hasPlayed}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left text-sm transition-all",
                    selected === c.id &&
                      (c.id === current.correctId
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-red-500 bg-red-500/10"),
                    !selected && hasPlayed && "hover:border-violet-500/50"
                  )}
                >
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
        onClose={() => setShowConfetti(false)}
      />
    </>
  );
}
