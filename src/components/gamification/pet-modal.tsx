"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import { PET_FOOD_ITEMS } from "@/constants/gamification";
import { getPetDisplayEmoji } from "@/constants/pet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const MOOD_EMOJI: Record<string, string> = {
  ecstatic: "😄",
  happy: "🙂",
  neutral: "😐",
  sad: "😢",
  lonely: "💔",
};

interface PetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PetModal({ open, onOpenChange }: PetModalProps) {
  const pet = useAppStore((s) => s.userStats.pet);
  const tokens = useAppStore((s) => s.userStats.tokens);
  const buyPetFood = useAppStore((s) => s.buyPetFood);
  const { t } = useTranslation();
  const [message, setMessage] = useState<string | null>(null);

  const emoji = getPetDisplayEmoji(pet.type);

  const handleBuyFood = (foodId: string) => {
    const result = buyPetFood(foodId);
    if (result === "success") setMessage(t.pet.feedSuccess);
    else if (result === "insufficient_tokens") setMessage(t.pet.notEnoughTokens);
    else setMessage(t.pet.feedError);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) setMessage(null);
        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.pet.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="text-7xl"
          >
            {emoji}
          </motion.div>

          <div className="text-center">
            <h3 className="text-xl font-bold">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">
              {t.pet.catSubtitle} · {MOOD_EMOJI[pet.mood]} {t.pet.moods[pet.mood]}
            </p>
          </div>

          <div className="w-full space-y-3 rounded-xl bg-muted/40 p-4">
            <div className="flex justify-between text-sm">
              <span>{t.gamification.level} {pet.level}</span>
              <span>{pet.energy}% {t.pet.energy}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t.pet.energy}</span>
                <span>{pet.energy}%</span>
              </div>
              <Progress value={pet.energy} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>XP</span>
                <span>{pet.experience}/100</span>
              </div>
              <Progress value={pet.experience} className="h-2" />
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-600 dark:text-amber-400">
            <Sparkles className="h-4 w-4" />
            {tokens} {t.common.tokens}
          </div>

          {message && (
            <p
              className={cn(
                "w-full rounded-lg px-3 py-2 text-center text-sm",
                message === t.pet.feedSuccess
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              )}
            >
              {message}
            </p>
          )}

          <div className="w-full">
            <h4 className="mb-3 text-sm font-semibold">{t.pet.foodShop}</h4>
            <div className="grid grid-cols-2 gap-2">
              {PET_FOOD_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-xl border border-border p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {t.pet.foods[item.nameKey]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        +{item.energy}% · +{item.xp} XP
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    disabled={tokens < item.price}
                    onClick={() => handleBuyFood(item.id)}
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    {item.price}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
