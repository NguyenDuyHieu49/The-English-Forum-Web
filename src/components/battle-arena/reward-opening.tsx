"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BattleInventoryItem } from "@/types/battle-arena";
import { Button } from "@/components/ui/button";

interface RewardOpeningProps {
  items: BattleInventoryItem[];
  onClose: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: "from-gray-500 to-gray-700",
  rare: "from-blue-500 to-blue-700",
  epic: "from-purple-500 to-purple-700",
  legendary: "from-amber-500 to-orange-600",
  mythic: "from-pink-500 to-red-600",
};

export function RewardOpening({ items, onClose }: RewardOpeningProps) {
  const [revealed, setRevealed] = useState(0);
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    const interval = setInterval(() => {
      setRevealed((r) => {
        if (r >= items.length) {
          clearInterval(interval);
          return r;
        }
        return r + 1;
      });
    }, 800);
  };

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg space-y-6 rounded-2xl bg-card p-6">
        <h2 className="text-center text-2xl font-black">🎁 Loot Chest!</h2>

        {!opening ? (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mx-auto flex h-32 w-32 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-6xl shadow-xl"
            onClick={handleOpen}
          >
            📦
          </motion.div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {items.slice(0, revealed).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className={`flex items-center gap-4 rounded-xl bg-gradient-to-r ${RARITY_COLORS[item.rarity]} p-4 text-white`}
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs capitalize opacity-80">{item.rarity}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {opening && revealed >= items.length && (
          <Button className="w-full" onClick={onClose}>
            Collect All
          </Button>
        )}

        {!opening && (
          <p className="text-center text-sm text-muted-foreground">Tap the chest to open!</p>
        )}
      </div>
    </div>
  );
}
