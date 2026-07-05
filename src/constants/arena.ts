import type {
  ArenaItemCatalog,
  ArenaAchievement,
  DailyRewardConfig,
  GameId,
} from "@/types/arena";

export const VIETNAM_CITIES = [
  "Hanoi",
  "Ho Chi Minh City",
  "Da Nang",
  "Hai Phong",
  "Can Tho",
  "Bien Hoa",
  "Hue",
  "Nha Trang",
] as const;

export const GAME_META: Record<
  GameId,
  { title: string; emoji: string; color: string; baseXp: number; baseCoins: number }
> = {
  "word-hunter": {
    title: "Word Hunter",
    emoji: "🎯",
    color: "from-emerald-500 to-teal-600",
    baseXp: 40,
    baseCoins: 15,
  },
  "sentence-builder": {
    title: "Sentence Builder",
    emoji: "🧩",
    color: "from-blue-500 to-indigo-600",
    baseXp: 50,
    baseCoins: 20,
  },
  "grammar-challenge": {
    title: "Grammar Challenge",
    emoji: "📚",
    color: "from-violet-500 to-purple-600",
    baseXp: 45,
    baseCoins: 18,
  },
  "listening-quest": {
    title: "Listening Quest",
    emoji: "🎧",
    color: "from-orange-500 to-amber-600",
    baseXp: 55,
    baseCoins: 22,
  },
  "boss-battle": {
    title: "Boss Battle",
    emoji: "⚔️",
    color: "from-red-500 to-rose-600",
    baseXp: 100,
    baseCoins: 50,
  },
};

export const ARENA_ITEM_CATALOG: ArenaItemCatalog[] = [
  { id: "xp-boost-1h", type: "xp_boost", name: "XP Boost Card", description: "+50% XP for 1 hour", rarity: "rare", emoji: "⚡" },
  { id: "streak-shield", type: "streak_shield", name: "Streak Shield", description: "Protect your streak for 1 day", rarity: "epic", emoji: "🛡️" },
  { id: "lucky-chest", type: "lucky_chest", name: "Lucky Chest", description: "Open for random rewards", rarity: "rare", emoji: "🎁" },
  { id: "frame-gold", type: "profile_frame", name: "Golden Frame", description: "Legendary golden avatar frame", rarity: "legendary", emoji: "🖼️", slot: "profile_frame" },
  { id: "frame-silver", type: "profile_frame", name: "Silver Frame", description: "Top 3 city leaderboard frame", rarity: "epic", emoji: "✨", slot: "profile_frame" },
  { id: "frame-neon", type: "profile_frame", name: "Neon Frame", description: "Vibrant neon profile frame", rarity: "rare", emoji: "💫", slot: "profile_frame" },
  { id: "avatar-crown", type: "avatar_item", name: "Crown", description: "Royal crown avatar accessory", rarity: "epic", emoji: "👑", slot: "avatar_item" },
  { id: "avatar-wizard", type: "avatar_item", name: "Wizard Hat", description: "Grammar master hat", rarity: "rare", emoji: "🧙", slot: "avatar_item" },
  { id: "title-legend", type: "title", name: "Legendary Learner", description: "City #1 title", rarity: "legendary", emoji: "🏆", slot: "title" },
  { id: "title-grammar", type: "title", name: "Grammar Master", description: "Grammar Challenge expert", rarity: "epic", emoji: "📖", slot: "title" },
  { id: "title-vocab", type: "title", name: "Vocabulary King", description: "Word Hunter champion", rarity: "epic", emoji: "👑", slot: "title" },
  { id: "badge-boss", type: "badge", name: "Boss Slayer", description: "Defeated 5 bosses", rarity: "legendary", emoji: "⚔️", slot: "badge" },
  { id: "badge-streak7", type: "badge", name: "7-Day Flame", description: "7-day learning streak", rarity: "rare", emoji: "🔥", slot: "badge" },
  { id: "badge-top10", type: "badge", name: "City Top 10", description: "Top 10 in your city", rarity: "epic", emoji: "🌟", slot: "badge" },
  { id: "seasonal-spring", type: "seasonal_reward", name: "Spring Blossom", description: "Limited spring cosmetic", rarity: "legendary", emoji: "🌸" },
];

export const ARENA_ACHIEVEMENTS_SEED: Omit<ArenaAchievement, "progress" | "unlocked" | "unlockedAt">[] = [
  { id: "first-victory", title: "First Victory", description: "Win your first arena game", icon: "🎉", category: "game", target: 1, rewardCoins: 50 },
  { id: "streak-7", title: "7-Day Streak", description: "Maintain a 7-day learning streak", icon: "🔥", category: "streak", target: 7, rewardCoins: 100, rewardItemCatalogId: "badge-streak7" },
  { id: "grammar-master", title: "Grammar Master", description: "Score perfect on Grammar Challenge 5 times", icon: "📚", category: "game", target: 5, rewardCoins: 150, rewardItemCatalogId: "title-grammar" },
  { id: "vocab-king", title: "Vocabulary King", description: "Reach 10 combo in Word Hunter", icon: "🎯", category: "game", target: 10, rewardCoins: 150, rewardItemCatalogId: "title-vocab" },
  { id: "boss-slayer", title: "Boss Slayer", description: "Defeat 3 bosses", icon: "⚔️", category: "boss", target: 3, rewardCoins: 200, rewardItemCatalogId: "badge-boss" },
  { id: "city-top10", title: "Top 10 City Player", description: "Reach top 10 in your city leaderboard", icon: "🏙️", category: "leaderboard", target: 10, rewardCoins: 300, rewardItemCatalogId: "badge-top10" },
  { id: "legendary-learner", title: "Legendary Learner", description: "Reach arena level 50", icon: "⭐", category: "game", target: 50, rewardCoins: 500, rewardItemCatalogId: "title-legend" },
];

export const DAILY_REWARDS: DailyRewardConfig[] = [
  { day: 1, coins: 100, label: "100 Coins", emoji: "🪙" },
  { day: 2, itemCatalogId: "xp-boost-1h", label: "XP Boost", emoji: "⚡" },
  { day: 3, itemCatalogId: "lucky-chest", label: "Mystery Chest", emoji: "🎁" },
  { day: 4, coins: 150, label: "150 Coins", emoji: "🪙" },
  { day: 5, itemCatalogId: "streak-shield", label: "Streak Shield", emoji: "🛡️" },
  { day: 6, coins: 200, label: "200 Coins", emoji: "🪙" },
  { day: 7, itemCatalogId: "frame-neon", label: "Neon Frame", emoji: "💫" },
];

export const CHEST_DROP_RATES: Record<string, number> = {
  common: 0.55,
  rare: 0.28,
  epic: 0.12,
  legendary: 0.05,
};

export const BOSS_CONFIG = {
  id: "grammar-dragon",
  bossId: "grammar-dragon",
  bossName: "Grammar Dragon",
  bossEmoji: "🐉",
  bossMaxHp: 100,
  bossHp: 100,
  playerMaxHp: 100,
  playerHp: 100,
  totalQuestions: 8,
};

export const STAGES_BEFORE_BOSS = 3;

export const MAX_ARENA_LEVEL = 100;

export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(1.12, level - 2));
}

export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 2; i <= level; i++) total += xpRequiredForLevel(i);
  return total;
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (level < MAX_ARENA_LEVEL && xp >= totalXpForLevel(level + 1)) {
    level++;
  }
  return level;
}

export function xpProgressInLevel(xp: number, level: number): { current: number; required: number } {
  const levelStart = totalXpForLevel(level);
  const nextLevel = totalXpForLevel(level + 1);
  const required = nextLevel - levelStart;
  const current = xp - levelStart;
  return { current: Math.max(0, current), required: required || 1 };
}
