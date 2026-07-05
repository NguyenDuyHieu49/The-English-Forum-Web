"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const RARITY_STYLES = {
  common: "from-zinc-500 to-zinc-600",
  rare: "from-blue-500 to-cyan-500",
  epic: "from-violet-500 to-purple-600",
  legendary: "from-amber-400 to-orange-500",
};

export function RewardPopup() {
  const { showReward, setShowReward } = useAppStore();
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {showReward && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setShowReward(null)}
              className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground hover:text-foreground"
              aria-label={t.common.close}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
                  RARITY_STYLES[showReward.rarity]
                )}
              >
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {showReward.rarity} {t.gamification.rarityReward}
                </p>
                <p className="text-lg font-bold">{showReward.label}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
