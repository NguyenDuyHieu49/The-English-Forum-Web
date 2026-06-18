import type { RewardType } from "@/types/gamification";

export const XP_PER_LEVEL = 1000;

export const REWARD_POOL: { type: RewardType; weight: number; min: number; max: number }[] = [
  { type: "tokens", weight: 35, min: 5, max: 50 },
  { type: "xp", weight: 30, min: 10, max: 100 },
  { type: "pet_food", weight: 15, min: 1, max: 3 },
  { type: "decoration", weight: 10, min: 1, max: 1 },
  { type: "badge", weight: 7, min: 1, max: 1 },
  { type: "lucky_box", weight: 3, min: 1, max: 1 },
];

export const STREAK_MILESTONES = [
  { days: 7, reward: { tokens: 100, xp: 200, badge: "Week Warrior" } },
  { days: 30, reward: { tokens: 500, xp: 1000, badge: "Monthly Master" } },
  { days: 100, reward: { tokens: 2000, xp: 5000, badge: "Century Scholar" } },
];

export const PET_TYPES = ["cat", "dog", "fox", "owl", "dragon"] as const;

export const PET_FOOD_ITEMS = [
  { id: "food-1", nameKey: "salmon" as const, price: 30, emoji: "🐟", energy: 15, xp: 10 },
  { id: "food-2", nameKey: "tuna" as const, price: 50, emoji: "🍣", energy: 25, xp: 20 },
  { id: "food-3", nameKey: "milk" as const, price: 20, emoji: "🥛", energy: 10, xp: 5 },
  { id: "food-4", nameKey: "premium" as const, price: 100, emoji: "✨", energy: 40, xp: 50 },
];

export const DEFAULT_ENROLLED_COURSE_IDS = ["c1", "c2", "c3"];
