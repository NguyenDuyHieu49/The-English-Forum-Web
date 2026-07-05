import type { BattleDatabase } from "@/types/battle-arena";
import { BATTLE_DB_VERSION } from "@/constants/battle-arena";
import { HEROES } from "@/constants/battle-arena";

export const BATTLE_SCHEMA_TABLES = [
  "heroes",
  "hero_skills",
  "hero_skins",
  "player_heroes",
  "inventories",
  "inventory_items",
  "matchmaking_queue",
  "game_matches",
  "match_players",
  "battle_events",
  "ranked_points",
  "leaderboards",
  "battle_rewards",
  "shop_items",
  "player_titles",
  "equipped_cosmetics",
  "season_rewards",
] as const;

export function createEmptyBattleDatabase(): BattleDatabase {
  const now = new Date().toISOString();
  return {
    version: 0,
    rankedProfile: {
      userId: "local-user",
      displayName: "You",
      avatar: "🎮",
      country: "Vietnam",
      city: "Hanoi",
      rankTier: "bronze",
      rankPoints: 0,
      wins: 0,
      losses: 0,
      winStreak: 0,
      bestStreak: 0,
      highestTier: "bronze",
      battlePoints: 100,
      coins: 500,
      seasonXp: 0,
      seasonId: "season-1",
      region: "asia",
      updatedAt: now,
    },
    playerHeroes: HEROES.map((h) => ({
      heroId: h.id,
      level: 1,
      fragments: h.id === "vocab-knight" ? 0 : 0,
      unlocked: h.id === "vocab-knight",
      equippedSkinId: null,
    })),
    equipped: {
      heroId: "vocab-knight",
      skinId: null,
      titleId: null,
      frameId: null,
      battleIntroId: null,
      victoryAnimationId: null,
      emoteId: null,
    },
    inventory: [],
    battlePassPremium: false,
    battlePassTier: 0,
    recentQuestionIds: [],
    matchHistory: [],
  };
}

export const BATTLE_DB_VERSION_EXPORT = BATTLE_DB_VERSION;
