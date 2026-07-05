import type { BattleLeaderboardEntry, BattleLeaderboardScope } from "@/types/battle-arena";
import { generateMockBattleLeaderboard } from "@/mock/battle-leaderboard";

export function getBattleLeaderboard(
  scope: BattleLeaderboardScope,
  currentUser?: {
    name: string;
    rankPoints: number;
    wins: number;
    losses: number;
    heroId: string;
    country: string;
    city: string;
  },
  filter?: { country?: string; city?: string; heroId?: string }
): BattleLeaderboardEntry[] {
  return generateMockBattleLeaderboard(scope, filter, currentUser);
}
