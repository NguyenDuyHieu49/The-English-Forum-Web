import type { ArenaAchievement, GameId } from "@/types/arena";
import type { GameSessionResult } from "@/types/arena";
import { createInventoryFromCatalog } from "./inventory";

export function checkAchievements(
  achievements: ArenaAchievement[],
  context: {
    gamesWon: number;
    streak: number;
    bossStagesCleared: number;
    arenaLevel: number;
    cityRank: number;
    lastGame?: GameSessionResult;
  }
): { updated: ArenaAchievement[]; newlyUnlocked: ArenaAchievement[]; bonusCoins: number; newItems: string[] } {
  const newlyUnlocked: ArenaAchievement[] = [];
  let bonusCoins = 0;
  const newItems: string[] = [];

  const updated = achievements.map((a) => {
    if (a.unlocked) return a;

    let progress = a.progress;
    switch (a.id) {
      case "first-victory":
        progress = context.gamesWon;
        break;
      case "streak-7":
        progress = context.streak;
        break;
      case "grammar-master":
        if (context.lastGame?.gameId === "grammar-challenge" && context.lastGame.perfect) {
          progress = a.progress + 1;
        }
        break;
      case "vocab-king":
        if (context.lastGame?.gameId === "word-hunter") {
          progress = Math.max(a.progress, context.lastGame.combo);
        }
        break;
      case "boss-slayer":
        progress = context.bossStagesCleared;
        break;
      case "city-top10":
        progress = context.cityRank <= 10 && context.cityRank > 0 ? 10 : a.progress;
        break;
      case "legendary-learner":
        progress = context.arenaLevel;
        break;
    }

    const unlocked = progress >= a.target;
    if (unlocked && !a.unlocked) {
      const unlockedAchievement = {
        ...a,
        progress,
        unlocked: true,
        unlockedAt: new Date().toISOString().slice(0, 10),
      };
      newlyUnlocked.push(unlockedAchievement);
      bonusCoins += a.rewardCoins;
      if (a.rewardItemCatalogId) newItems.push(a.rewardItemCatalogId);
      return unlockedAchievement;
    }

    return { ...a, progress };
  });

  return { updated, newlyUnlocked, bonusCoins, newItems };
}

export function trackGameForAchievements(gameId: GameId): string[] {
  const map: Partial<Record<GameId, string[]>> = {
    "grammar-challenge": ["grammar-master"],
    "word-hunter": ["vocab-king"],
    "boss-battle": ["boss-slayer"],
  };
  return map[gameId] ?? [];
}

export function createAchievementItems(catalogIds: string[]) {
  return catalogIds
    .map((id) => createInventoryFromCatalog(id))
    .filter((i): i is NonNullable<typeof i> => i !== null);
}
