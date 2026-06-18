"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import type { DailyMission } from "@/types/mission";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  mission: DailyMission;
  index?: number;
}

export function MissionCard({ mission, index = 0 }: MissionCardProps) {
  const progressPercent = Math.min(100, (mission.progress / mission.target) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cn(
        "rounded-xl border border-border p-4 transition-all",
        mission.completed && "bg-emerald-500/5 border-emerald-500/20"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          {mission.completed ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          ) : (
            <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          )}
          <div>
            <h4 className="font-medium">{mission.title}</h4>
            <p className="text-xs text-muted-foreground">{mission.description}</p>
          </div>
        </div>
        <div className="shrink-0 text-right text-xs">
          <p className="font-semibold text-violet-600 dark:text-violet-400">
            +{mission.tokenReward} tokens
          </p>
          <p className="text-muted-foreground">+{mission.xpReward} XP</p>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {mission.progress}/{mission.target} {mission.unit}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} />
      </div>
    </motion.div>
  );
}
