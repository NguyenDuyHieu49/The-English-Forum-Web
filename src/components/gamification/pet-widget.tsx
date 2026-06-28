"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import { PetModal } from "@/components/gamification/pet-modal";
import { cn } from "@/lib/utils";

const PET_EMOJI: Record<string, string[]> = {
  cat: ["🐱", "🐈", "🦁"],
};

const MOOD_EMOJI: Record<string, string> = {
  ecstatic: "😄",
  happy: "🙂",
  neutral: "😐",
  sad: "😢",
  lonely: "💔",
};

interface PetWidgetProps {
  compact?: boolean;
  collapsed?: boolean;
}

export function PetWidget({ compact = false, collapsed = false }: PetWidgetProps) {
  const [open, setOpen] = useState(false);
  const pet = useAppStore((s) => s.userStats.pet);
  const { t } = useTranslation();
  const emojis = PET_EMOJI[pet.type] ?? PET_EMOJI.cat;
  const emoji = emojis[pet.evolutionStage - 1] ?? emojis[0];

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-violet-500/5 to-indigo-500/5 text-left transition-shadow hover:shadow-md",
          compact && "p-3",
          !compact && !collapsed && "p-5",
          collapsed && "flex items-center justify-center p-2"
        )}
      >
        {collapsed ? (
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-2xl"
          >
            {emoji}
          </motion.span>
        ) : (
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className={cn("text-4xl", compact && "text-3xl")}
            >
              {emoji}
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{pet.name}</h3>
                <span>{MOOD_EMOJI[pet.mood]}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t.pet.tapToView} · {t.gamification.level} {pet.level} · {pet.energy}% {t.pet.energy}
              </p>
              {!compact && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
                    style={{ width: `${pet.experience % 100}%` }}
                  />
                </div>
              )}
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        )}
      </motion.button>

      <PetModal open={open} onOpenChange={setOpen} />
    </>
  );
}
