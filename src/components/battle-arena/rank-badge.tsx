"use client";

import { cn } from "@/lib/utils";
import type { RankTier } from "@/types/battle-arena";
import { RANK_META } from "@/constants/battle-arena";

interface RankBadgeProps {
  tier: RankTier;
  points?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RankBadge({ tier, points, size = "md", className }: RankBadgeProps) {
  const meta = RANK_META[tier];
  const sizes = { sm: "text-xs px-2 py-0.5", md: "text-sm px-3 py-1", lg: "text-base px-4 py-1.5" };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gradient-to-r font-bold text-white",
        meta.color,
        sizes[size],
        className
      )}
    >
      <span>{meta.emoji}</span>
      <span>{meta.label}</span>
      {points !== undefined && <span className="opacity-80">({points})</span>}
    </span>
  );
}
