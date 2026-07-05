"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GAME_META } from "@/constants/arena";
import { BOSS_QUESTIONS } from "@/mock/arena-games";
import { GameShell } from "@/components/arena/game-shell";
import { BossBattleUI } from "@/components/arena/boss-battle-ui";
import { GameResultModal } from "@/components/arena/game-result-modal";
import { ConfettiEffect } from "@/components/arena/confetti-effect";
import { useArenaStore } from "@/store/arena-store";
import type { GameSessionResult } from "@/types/arena";

export default function BossBattlePage() {
  const router = useRouter();
  const meta = GAME_META["boss-battle"];
  const bossBattle = useArenaStore((s) => s.bossBattle);
  const startBossBattle = useArenaStore((s) => s.startBossBattle);
  const bossAnswer = useArenaStore((s) => s.bossAnswer);
  const completeGame = useArenaStore((s) => s.completeGame);
  const [finished, setFinished] = useState(false);
  const [victory, setVictory] = useState(false);
  const [reward, setReward] = useState<ReturnType<typeof completeGame> | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!bossBattle) startBossBattle();
  }, [bossBattle, startBossBattle]);

  const handleAnswer = (_choiceId: string, correct: boolean) => {
    if (correct) setCorrectCount((c) => c + 1);
    const result = bossAnswer(correct);

    if (result === "victory") {
      const gameResult: GameSessionResult = {
        gameId: "boss-battle",
        score: correctCount + (correct ? 1 : 0),
        maxScore: BOSS_QUESTIONS.length,
        correct: correctCount + (correct ? 1 : 0),
        total: BOSS_QUESTIONS.length,
        combo: 0,
        perfect: correctCount + (correct ? 1 : 0) === BOSS_QUESTIONS.length,
        timeBonus: 20,
        durationMs: 0,
      };
      const r = completeGame(gameResult);
      setReward(r);
      setVictory(true);
      setFinished(true);
      setShowConfetti(true);
    } else if (result === "defeat") {
      setVictory(false);
      setFinished(true);
    }
  };

  const question = bossBattle ? BOSS_QUESTIONS[bossBattle.questionIndex] : null;

  return (
    <>
      <ConfettiEffect active={showConfetti} />
      <GameShell title={meta.title} emoji={meta.emoji} color={meta.color}>
        {bossBattle && question && !finished && (
          <BossBattleUI
            battle={bossBattle}
            questionText={question.text}
            choices={question.choices}
            correctId={question.correctId}
            onAnswer={handleAnswer}
          />
        )}
        {finished && !bossBattle && !victory && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-4xl">💀</p>
            <p className="mt-4 text-lg font-bold">Defeated!</p>
            <p className="text-muted-foreground">Train more and try again.</p>
          </div>
        )}
      </GameShell>
      <GameResultModal
        open={finished && victory}
        reward={reward}
        won={victory}
        onClose={() => {
          setShowConfetti(false);
          setFinished(false);
          router.push("/games");
        }}
      />
    </>
  );
}
