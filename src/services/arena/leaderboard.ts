import type { LeaderboardEntry, LeaderboardScope } from "@/types/arena";
import { MOCK_ARENA_LEADERBOARD } from "@/mock/arena-leaderboard";

export function getLeaderboard(
  scope: LeaderboardScope,
  filters: { city?: string; country?: string; userXp?: number; userName?: string }
): LeaderboardEntry[] {
  let entries = [...MOCK_ARENA_LEADERBOARD];

  if (scope === "city" && filters.city) {
    entries = entries.filter((e) => e.city === filters.city);
  }
  if (scope === "country" && filters.country) {
    entries = entries.filter((e) => e.country === filters.country);
  }
  if (scope === "weekly") {
    entries = entries.map((e) => ({ ...e, arenaXp: Math.floor(e.arenaXp * 0.15) }));
  }
  if (scope === "monthly") {
    entries = entries.map((e) => ({ ...e, arenaXp: Math.floor(e.arenaXp * 0.4) }));
  }

  entries.sort((a, b) => b.arenaXp - a.arenaXp);

  const userEntry: LeaderboardEntry = {
    rank: 0,
    userId: "local-user",
    name: filters.userName ?? "You",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    city: filters.city ?? "Hanoi",
    country: filters.country ?? "Vietnam",
    arenaLevel: 1,
    arenaXp: filters.userXp ?? 0,
    streak: 0,
    gamesWon: 0,
    achievementPoints: 0,
    isCurrentUser: true,
  };

  const withoutUser = entries.filter((e) => !e.isCurrentUser);
  const merged = [...withoutUser, { ...userEntry, arenaXp: filters.userXp ?? userEntry.arenaXp }];
  merged.sort((a, b) => b.arenaXp - a.arenaXp);

  return merged.map((e, i) => ({
    ...e,
    rank: i + 1,
    isCurrentUser: e.userId === "local-user" || e.isCurrentUser,
  }));
}

export function getCityRank(city: string, userXp: number, userName: string): number {
  const board = getLeaderboard("city", { city, userXp, userName });
  const user = board.find((e) => e.isCurrentUser);
  return user?.rank ?? 99;
}

export function getLeaderboardRewards(rank: number) {
  if (rank === 1) return { titleId: "title-legend", frameId: "frame-gold", badgeId: null };
  if (rank <= 3) return { titleId: null, frameId: "frame-silver", badgeId: null };
  if (rank <= 10) return { titleId: null, frameId: null, badgeId: "badge-top10" };
  return { titleId: null, frameId: null, badgeId: null };
}
