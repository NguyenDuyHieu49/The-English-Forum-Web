"use client";

import { use, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FocusCamera } from "@/components/focus/focus-camera";
import { MouseBehaviorWarning } from "@/components/focus/mouse-behavior-warning";
import { useAppStore } from "@/store/app-store";
import { generateRandomReward } from "@/services/gamification";
import { useTranslation } from "@/hooks/use-translation";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function QuizTakePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, locale } = useTranslation();
  const { quizzes } = useLocalizedContent();
  const quiz = useMemo(() => quizzes.find((q) => q.id === id), [quizzes, id]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [answers, setAnswers] = useState<
    { questionId: string; selectedChoiceId: string; isCorrect: boolean }[]
  >([]);
  const [finalAnswers, setFinalAnswers] = useState<
    { questionId: string; selectedChoiceId: string; isCorrect: boolean }[]
  >([]);
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const addReward = useAppStore((s) => s.addReward);

  const handleSubmit = useCallback(() => {
    if (!quiz || !selectedChoice) return;
    const question = quiz.questions[currentIndex];
    const isCorrect = selectedChoice === question.correctChoiceId;

    const newAnswers = [
      ...answers,
      { questionId: question.id, selectedChoiceId: selectedChoice, isCorrect },
    ];
    setAnswers(newAnswers);

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedChoice(null);
    } else {
      setFinalAnswers(newAnswers);
      setShowResult(true);
      addReward(generateRandomReward(locale));
    }
  }, [quiz, selectedChoice, currentIndex, answers, addReward, locale]);

  if (!quiz) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">{t.quiz.notFound}</p>
        <Button className="mt-4" asChild>
          <Link href="/quiz">{t.quiz.backToQuizzes}</Link>
        </Button>
      </div>
    );
  }

  if (showResult) {
    const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    return (
      <div className="mx-auto max-w-lg space-y-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">{t.quiz.quizComplete}</h1>
          <p className="mt-2 text-5xl font-bold gradient-text">{score}%</p>
          <p className="mt-2 text-muted-foreground">
            {correctCount}/{quiz.questions.length} {t.quiz.correctAnswers}
          </p>
        </motion.div>

        <AnimatePresence>
          {showReview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              {quiz.questions.map((q, i) => {
                const answer = finalAnswers[i];
                return (
                  <Card key={q.id}>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start gap-2">
                        {answer?.isCorrect ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        )}
                        <p className="text-sm font-medium">{q.text}</p>
                      </div>
                      {q.explanation && (
                        <p className="ml-6 text-xs text-muted-foreground">{q.explanation}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowReview(!showReview)}
          >
            {showReview ? t.quiz.hideReview : t.quiz.reviewAnswers}
          </Button>
          <Button className="flex-1" asChild>
            <Link href="/quiz">{t.quiz.backToQuizzes}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <MouseBehaviorWarning enabled />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t.quiz.questionOf} {currentIndex + 1} / {quiz.questions.length}
          </p>
        </div>
        <FocusCamera className="hidden sm:block" />
      </div>

      <Progress value={progress} />

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-6 text-lg font-semibold">{question.text}</h2>
              <div className="space-y-3">
                {question.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => setSelectedChoice(choice.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all",
                      selectedChoice === choice.id
                        ? "border-violet-500 bg-violet-500/5 ring-1 ring-violet-500/30"
                        : "border-border hover:border-violet-500/30 hover:bg-accent/50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium",
                        selectedChoice === choice.id
                          ? "bg-violet-600 text-white"
                          : "bg-muted"
                      )}
                    >
                      {choice.id.toUpperCase()}
                    </span>
                    <span className="text-sm">{choice.text}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Button
        className="w-full"
        size="lg"
        disabled={!selectedChoice}
        onClick={handleSubmit}
      >
        {currentIndex < quiz.questions.length - 1 ? t.quiz.nextQuestion : t.quiz.submitQuiz}
      </Button>
    </div>
  );
}
