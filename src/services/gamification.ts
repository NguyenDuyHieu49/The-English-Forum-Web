import { REWARD_POOL } from "@/constants/gamification";
import type { Reward, RewardType } from "@/types/gamification";

const RARITY_MAP: Record<RewardType, Reward["rarity"]> = {
  tokens: "common",
  xp: "common",
  pet_food: "rare",
  decoration: "rare",
  badge: "epic",
  lucky_box: "legendary",
};

const LABEL_MAP: Record<RewardType, (amount: number) => string> = {
  tokens: (a) => `${a} Tokens`,
  xp: (a) => `${a} XP`,
  pet_food: (a) => `${a}x Pet Food`,
  decoration: () => "Rare Decoration",
  badge: () => "Epic Badge",
  lucky_box: () => "Lucky Box",
};

function weightedRandom<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) return item;
  }
  return items[items.length - 1];
}

export function generateRandomReward(): Reward {
  const poolItem = weightedRandom(REWARD_POOL);
  const amount =
    poolItem.min +
    Math.floor(Math.random() * (poolItem.max - poolItem.min + 1));

  return {
    id: `reward-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: poolItem.type,
    amount,
    label: LABEL_MAP[poolItem.type](amount),
    rarity: RARITY_MAP[poolItem.type],
  };
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

export function xpToNextLevel(xp: number): number {
  const currentLevelXp = (calculateLevel(xp) - 1) * 1000;
  return 1000 - (xp - currentLevelXp);
}
