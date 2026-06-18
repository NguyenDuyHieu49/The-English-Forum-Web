"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Play, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_QUIZZES } from "@/mock/quizzes";
import { cn } from "@/lib/utils";

const DIFFICULTY_COLORS = {
  easy: "bg-emerald-500/10 text-emerald-600",
  medium: "bg-yellow-500/10 text-yellow-600",
  hard: "bg-red-500/10 text-red-600",
};

export default function QuizBrowsePage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">Quiz</h1>
        <p className="mt-1 text-muted-foreground">
          Test your knowledge and earn rewards
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_QUIZZES.map((quiz, i) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="group h-full transition-all hover:shadow-lg hover:shadow-violet-500/10">
              <CardContent className="flex h-full flex-col p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      DIFFICULTY_COLORS[quiz.difficulty]
                    )}
                  >
                    {quiz.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {quiz.category}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold">{quiz.title}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
                  {quiz.description}
                </p>
                <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {Math.floor(quiz.timeLimit / 60)} min
                  </span>
                  <span>{quiz.questionCount} questions</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {quiz.plays}
                  </span>
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/quiz/${quiz.id}`}>
                    <Play className="mr-1.5 h-3.5 w-3.5" />
                    Start Quiz
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
