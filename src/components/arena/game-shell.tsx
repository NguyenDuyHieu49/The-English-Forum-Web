"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ComboDisplay } from "./arena-xp-bar";

interface GameShellProps {
  title: string;
  emoji: string;
  color: string;
  children: ReactNode;
  progress?: number;
  combo?: number;
  timer?: number;
  backHref?: string;
}

export function GameShell({
  title,
  emoji,
  color,
  children,
  progress = 0,
  combo = 0,
  timer,
  backHref = "/games",
}: GameShellProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={backHref}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
        {timer !== undefined && (
          <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-mono font-bold">
            <Clock className="h-4 w-4" />
            {timer}s
          </div>
        )}
        <ComboDisplay combo={combo} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl bg-gradient-to-r ${color} p-6 text-white`}
      >
        <span className="text-3xl">{emoji}</span>
        <h1 className="mt-2 text-2xl font-bold">{title}</h1>
      </motion.div>

      {progress > 0 && <Progress value={progress} className="h-2" />}

      {children}
    </div>
  );
}

export function useGameTimer(initialSeconds: number, running: boolean) {
  const [time, setTime] = useState(initialSeconds);

  useState(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTime((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  });

  return time;
}
