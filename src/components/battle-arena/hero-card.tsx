"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Hero } from "@/types/battle-arena";

interface HeroCardProps {
  hero: Hero;
  selected?: boolean;
  locked?: boolean;
  onSelect?: () => void;
  fragments?: number;
}

export function HeroCard({ hero, selected, locked, onSelect, fragments }: HeroCardProps) {
  return (
    <motion.button
      whileHover={!locked ? { scale: 1.03 } : undefined}
      whileTap={!locked ? { scale: 0.97 } : undefined}
      onClick={!locked ? onSelect : undefined}
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all",
        selected ? "border-violet-500 ring-2 ring-violet-500/30" : "border-border",
        locked ? "opacity-50 grayscale" : "hover:border-violet-500/50",
        `bg-gradient-to-br ${hero.color}`
      )}
    >
      <div className="text-4xl">{hero.emoji}</div>
      <h3 className="mt-2 font-bold text-white">{hero.name}</h3>
      <p className="text-xs text-white/80">{hero.title}</p>
      {locked && fragments !== undefined && (
        <p className="mt-2 text-xs text-white/70">🧩 {fragments}/{hero.fragmentCost}</p>
      )}
      {selected && (
        <div className="absolute right-2 top-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-white">
          SELECTED
        </div>
      )}
    </motion.button>
  );
}
