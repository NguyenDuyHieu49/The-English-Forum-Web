"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { xpProgressInLevel } from "@/constants/arena";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ArenaXpBarProps {
  xp: number;
  level: number;
  className?: string;
  showLabel?: boolean;
}

export function ArenaXpBar({ xp, level, className, showLabel = true }: ArenaXpBarProps) {
  const { current, required } = xpProgressInLevel(xp, level);
  const pct = Math.min(100, (current / required) * 100);

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 font-semibold text-violet-600 dark:text-violet-400">
            <Zap className="h-3.5 w-3.5" />
            Level {level}
          </span>
          <span className="text-muted-foreground">
            {current}/{required} XP
          </span>
        </div>
      )}
      <Progress value={pct} className="h-2.5" />
    </div>
  );
}

export function ComboDisplay({ combo }: { combo: number }) {
  if (combo < 2) return null;
  return (
    <motion.div
      key={combo}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg"
    >
      🔥 {combo}x COMBO!
    </motion.div>
  );
}
