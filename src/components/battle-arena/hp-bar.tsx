"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface HpBarProps {
  current: number;
  max: number;
  label?: string;
  side?: "left" | "right";
  className?: string;
}

export function HpBar({ current, max, label, side = "left", className }: HpBarProps) {
  const pct = (current / max) * 100;
  const isLow = pct < 30;

  return (
    <div className={cn("space-y-1", className)}>
      <div className={cn("flex text-xs font-medium", side === "right" ? "flex-row-reverse" : "justify-between")}>
        <span className={isLow ? "text-red-400" : "text-emerald-400"}>{label ?? "HP"}</span>
        <span>{current}/{max}</span>
      </div>
      <div className="relative h-4 overflow-hidden rounded-full bg-black/40">
        <motion.div
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "absolute inset-y-0 rounded-full",
            side === "left" ? "left-0" : "right-0",
            isLow ? "bg-gradient-to-r from-red-600 to-red-400" : "bg-gradient-to-r from-emerald-600 to-emerald-400"
          )}
        />
      </div>
    </div>
  );
}

interface ManaBarProps {
  current: number;
  max: number;
  className?: string;
}

export function ManaBar({ current, max, className }: ManaBarProps) {
  const pct = (current / max) * 100;
  const ready = pct >= 100;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between text-xs font-medium text-blue-400">
        <span>Mana</span>
        <span>{ready ? "ULTIMATE READY!" : `${current}/${max}`}</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-black/40">
        <motion.div
          animate={{ width: `${pct}%` }}
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            ready ? "bg-gradient-to-r from-yellow-500 to-amber-300 animate-pulse" : "bg-gradient-to-r from-blue-600 to-cyan-400"
          )}
        />
      </div>
    </div>
  );
}
