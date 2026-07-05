import type { ArenaDatabase } from "@/types/arena";

export const DB_VERSION = 1;
export const ARENA_STORAGE_KEY = "tef-arena-db";

export const SCHEMA_TABLES = [
  "game_profiles",
  "user_levels",
  "user_streaks",
  "inventories",
  "inventory_items",
  "achievements",
  "user_achievements",
  "reward_chests",
  "daily_rewards",
  "leaderboards",
  "friendships",
  "game_matches",
  "boss_battles",
  "equipped_cosmetics",
] as const;

export type SchemaTable = (typeof SCHEMA_TABLES)[number];

export interface Migration {
  version: number;
  name: string;
  up: (db: ArenaDatabase) => ArenaDatabase;
}

export function createEmptyDatabase(): ArenaDatabase {
  return {
    version: 0,
    gameProfile: {
      userId: "local-user",
      displayName: "You",
      city: "Hanoi",
      country: "Vietnam",
      coins: 0,
      arenaXp: 0,
      arenaLevel: 1,
      gamesWon: 0,
      gamesPlayed: 0,
      achievementPoints: 0,
      bossStagesCleared: 0,
      currentBossId: null,
      lastDailyRewardDay: 0,
      lastDailyRewardDate: null,
      dailyRewardStreak: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    equipped: {
      titleId: null,
      profileFrameId: null,
      avatarItemId: null,
      badgeId: null,
    },
    inventory: [],
    achievements: [],
    friends: [],
    friendActivity: [],
    challenges: [],
    bossBattle: null,
    activeEvent: null,
  };
}
