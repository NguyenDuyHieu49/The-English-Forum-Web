"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Upload } from "lucide-react";
import type { DailyMission } from "@/types/mission";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

interface MissionCardProps {
  mission: DailyMission;
  index?: number;
  onSubmitFile?: (missionId: string, file: File) => void;
}

export function MissionCard({ mission, index = 0, onSubmitFile }: MissionCardProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressPercent = Math.min(100, (mission.progress / mission.target) * 100);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSubmitFile) {
      onSubmitFile(mission.id, file);
    }
    e.target.value = "";
  };

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
            +{mission.tokenReward} {t.common.tokens}
          </p>
          <p className="text-muted-foreground">+{mission.xpReward} XP</p>
        </div>
      </div>

      {!mission.requiresUpload && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {mission.progress}/{mission.target} {mission.unit}
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} />
        </div>
      )}

      {mission.requiresUpload && !mission.completed && (
        <div className="mt-3 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {t.missions.submitFile}
          </Button>
          <p className="text-center text-[10px] text-muted-foreground">
            {t.missions.acceptedFormats}
          </p>
        </div>
      )}

      {mission.submittedFile && (
        <p className="mt-2 truncate text-xs text-emerald-600 dark:text-emerald-400">
          {t.missions.submitted}: {mission.submittedFile}
        </p>
      )}
    </motion.div>
  );
}
