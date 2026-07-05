import type { GameSessionResult, GameRewardBreakdown, GameId } from "@/types/arena";
import { GAME_META, levelFromXp, totalXpForLevel } from "@/constants/arena";

export function calculateGameRewards(
  result: GameSessionResult,
  streak: number,
  eventXpMultiplier = 1,
  eventCoinMultiplier = 1,
  currentXp = 0
): GameRewardBreakdown {
  const meta = GAME_META[result.gameId];
  const accuracy = result.total > 0 ? result.correct / result.total : 0;

  const baseXp = Math.round(meta.baseXp * accuracy);
  const comboBonus = Math.min(result.combo * 5, 50);
  const perfectBonus = result.perfect ? 30 : 0;
  const streakBonus = Math.min(streak * 3, 21);
  const dailyBonus = result.timeBonus;

  const rawXp = baseXp + comboBonus + perfectBonus + streakBonus + dailyBonus;
  const totalXp = Math.round(rawXp * eventXpMultiplier);
  const coins = Math.round(meta.baseCoins * accuracy * eventCoinMultiplier + (result.perfect ? 10 : 0));

  const oldLevel = levelFromXp(currentXp);
  const newLevel = levelFromXp(currentXp + totalXp);

  return {
    baseXp,
    comboBonus,
    perfectBonus,
    streakBonus,
    dailyBonus,
    totalXp,
    coins,
    leveledUp: newLevel > oldLevel,
    newLevel: newLevel > oldLevel ? newLevel : undefined,
  };
}

export function isBossUnlocked(gamesPlayed: number, bossStagesCleared: number): boolean {
  const gamesSinceBoss = gamesPlayed - bossStagesCleared * 3;
  return gamesSinceBoss >= 3;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function gameWinThreshold(gameId: GameId, correct: number, total: number): boolean {
  const minAccuracy = gameId === "boss-battle" ? 0.5 : 0.6;
  return total > 0 && correct / total >= minAccuracy;
}

export function xpToNextArenaLevel(xp: number, level: number): number {
  const next = totalXpForLevel(level + 1);
  return Math.max(0, next - xp);
}
