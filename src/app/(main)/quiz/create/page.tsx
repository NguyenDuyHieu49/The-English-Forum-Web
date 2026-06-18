"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { QuizDifficulty, QuizQuestion } from "@/types/quiz";

export default function QuizCreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("medium");
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "new-1",
      text: "",
      choices: [
        { id: "a", text: "" },
        { id: "b", text: "" },
        { id: "c", text: "" },
        { id: "d", text: "" },
      ],
      correctChoiceId: "a",
    },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `new-${questions.length + 1}`,
        text: "",
        choices: [
          { id: "a", text: "" },
          { id: "b", text: "" },
          { id: "c", text: "" },
          { id: "d", text: "" },
        ],
        correctChoiceId: "a",
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, text: string) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], text };
    setQuestions(updated);
  };

  const updateChoice = (qIndex: number, cIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].choices[cIndex] = {
      ...updated[qIndex].choices[cIndex],
      text,
    };
    setQuestions(updated);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="mx-auto mb-4 text-5xl">✅</div>
          <h1 className="text-2xl font-bold">Quiz Created!</h1>
          <p className="mt-2 text-muted-foreground">
            Your quiz &ldquo;{title}&rdquo; has been saved (mock).
          </p>
          <Button className="mt-6" onClick={() => setSubmitted(false)}>
            Create Another
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Quiz</h1>
          <p className="mt-1 text-muted-foreground">
            Build and preview your custom quiz
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
          <Eye className="mr-2 h-4 w-4" />
          {showPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      {!showPreview ? (
        <>
          <Card>
            <CardContent className="space-y-4 p-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Quiz title"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Difficulty</Label>
                <div className="mt-1.5 flex gap-2">
                  {(["easy", "medium", "hard"] as QuizDifficulty[]).map((d) => (
                    <Button
                      key={d}
                      variant={difficulty === d ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDifficulty(d)}
                      className="capitalize"
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {questions.map((q, qi) => (
            <Card key={q.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Question {qi + 1}</CardTitle>
                {questions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(qi)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={q.text}
                  onChange={(e) => updateQuestion(qi, e.target.value)}
                  placeholder="Question text"
                />
                {q.choices.map((choice, ci) => (
                  <div key={choice.id} className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = [...questions];
                        updated[qi].correctChoiceId = choice.id;
                        setQuestions(updated);
                      }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        q.correctChoiceId === choice.id
                          ? "bg-emerald-500 text-white"
                          : "bg-muted"
                      }`}
                    >
                      {choice.id.toUpperCase()}
                    </button>
                    <Input
                      value={choice.text}
                      onChange={(e) => updateChoice(qi, ci, e.target.value)}
                      placeholder={`Choice ${choice.id.toUpperCase()}`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={addQuestion} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>

          <Button
            className="w-full"
            size="lg"
            disabled={!title}
            onClick={() => setSubmitted(true)}
          >
            Submit Quiz
          </Button>
        </>
      ) : (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold">{title || "Untitled Quiz"}</h2>
            <p className="mt-1 text-muted-foreground">{description}</p>
            <span className="mt-2 inline-block rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-medium capitalize text-violet-600">
              {difficulty}
            </span>
            <div className="mt-6 space-y-4">
              {questions.map((q, i) => (
                <div key={q.id} className="rounded-xl border border-border p-4">
                  <p className="font-medium">
                    {i + 1}. {q.text || "Question text..."}
                  </p>
                  <div className="mt-2 space-y-1">
                    {q.choices.map((c) => (
                      <p
                        key={c.id}
                        className={`text-sm ${
                          c.id === q.correctChoiceId
                            ? "text-emerald-600 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {c.id.toUpperCase()}. {c.text || "..."}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
