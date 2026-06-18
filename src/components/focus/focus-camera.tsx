"use client";

import { cn } from "@/lib/utils";
import { FOCUS_STATE_COLORS } from "@/constants/focus";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import type { FocusState } from "@/types/focus";

interface FocusCameraProps {
  className?: string;
}

export function FocusCamera({ className }: FocusCameraProps) {
  const focusResult = useAppStore((s) => s.focusResult);
  const focusMode = useAppStore((s) => s.focusMode);
  const { t } = useTranslation();

  const stateLabel = focusResult
    ? t.focus.states[focusResult.state as FocusState]
    : "";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-zinc-900",
        focusMode ? "fixed bottom-6 right-6 h-36 w-48 z-50" : "h-32 w-44",
        className
      )}
    >
      <div className="flex h-full items-center justify-center text-xs text-white/50">
        Camera
      </div>
      {focusResult && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 text-center">
          <span
            className={cn(
              "text-xs font-semibold",
              FOCUS_STATE_COLORS[focusResult.state]
            )}
          >
            {focusResult.score}% · {stateLabel}
          </span>
        </div>
      )}
    </div>
  );
}
