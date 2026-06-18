import type { FocusState } from "@/types/focus";

export const FOCUS_STATE_THRESHOLDS: Record<FocusState, { min: number; max: number }> = {
  focused: { min: 80, max: 100 },
  slightly_distracted: { min: 60, max: 79 },
  distracted: { min: 40, max: 59 },
  sleepy: { min: 20, max: 39 },
  away: { min: 0, max: 19 },
};

export const FOCUS_STATE_LABELS: Record<FocusState, string> = {
  focused: "Focused",
  slightly_distracted: "Slightly Distracted",
  distracted: "Distracted",
  sleepy: "Sleepy",
  away: "Away",
};

export const FOCUS_STATE_COLORS: Record<FocusState, string> = {
  focused: "text-emerald-500",
  slightly_distracted: "text-yellow-500",
  distracted: "text-orange-500",
  sleepy: "text-purple-500",
  away: "text-red-500",
};

export const MOUSE_BEHAVIOR_THRESHOLDS = {
  idleWarningMs: 30_000,
  randomMovementThreshold: 500,
  speedThreshold: 2.5,
};

export const SOCIAL_SCROLL_WARNING_MS = 120_000;

export const FOCUS_AUTO_SNOOZE_MS = 30 * 60 * 1000;
