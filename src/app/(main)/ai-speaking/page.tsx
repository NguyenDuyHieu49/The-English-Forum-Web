"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SpeakingFeedback } from "@/types/speaking";

const MOCK_FEEDBACK: SpeakingFeedback = {
  pronunciation: 82,
  grammar: 78,
  fluency: 85,
  overall: 82,
  suggestions: [
    "Try to emphasize the 'th' sound in 'think' and 'through'",
    "Your sentence structure is good — try using more complex clauses",
    "Great pacing! Consider pausing slightly between key points",
  ],
  transcript:
    "Human-computer interaction is the study of how people interact with computers and how to design interfaces that are intuitive and efficient.",
};

export default function AISpeakingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [transcript, setTranscript] = useState("");

  const startRecording = () => {
    setIsRecording(true);
    setFeedback(null);
    setTranscript("");
  };

  const stopRecording = () => {
    setIsRecording(false);
    setTimeout(() => {
      setTranscript(MOCK_FEEDBACK.transcript);
      setFeedback(MOCK_FEEDBACK);
    }, 800);
  };

  const scores = feedback
    ? [
        { label: "Pronunciation", value: feedback.pronunciation, color: "bg-blue-500" },
        { label: "Grammar", value: feedback.grammar, color: "bg-violet-500" },
        { label: "Fluency", value: feedback.fluency, color: "bg-emerald-500" },
      ]
    : [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">AI Speaking</h1>
        <p className="mt-1 text-muted-foreground">
          Practice speaking and get AI-powered feedback
        </p>
      </motion.div>

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center p-8">
          <motion.div
            animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`mb-6 flex h-32 w-32 items-center justify-center rounded-full ${
              isRecording
                ? "bg-red-500/10 ring-4 ring-red-500/30"
                : "bg-violet-500/10"
            }`}
          >
            {isRecording ? (
              <Mic className="h-12 w-12 text-red-500" />
            ) : (
              <MicOff className="h-12 w-12 text-violet-500" />
            )}
          </motion.div>

          <p className="mb-6 text-center text-sm text-muted-foreground">
            {isRecording
              ? "Listening... Speak clearly about any topic"
              : "Click the button below to start recording"}
          </p>

          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {transcript && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{transcript}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>AI Feedback</span>
                <span className="text-2xl font-bold gradient-text">
                  {feedback.overall}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scores.map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{s.label}</span>
                    <span className="font-semibold">{s.value}%</span>
                  </div>
                  <Progress value={s.value} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-violet-500">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
