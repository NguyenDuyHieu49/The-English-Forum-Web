import type { BattleLeaderboardEntry, RankTier } from "@/types/battle-arena";
import { HEROES, RANK_META } from "@/constants/battle-arena";

const MOCK_NAMES = [
  "DragonSlayer", "WordMaster", "GrammarKing", "NinjaLearner", "ComboQueen",
  "SyntaxHero", "VocabViper", "ListenLord", "IdiomIcon", "ReadingRex",
  "SpellSlinger", "BattleBard", "EnglishEagle", "PhrasePhantom", "TenseTitan",
];

const CITIES = ["Hanoi", "Ho Chi Minh City", "Da Nang", "Tokyo", "Seoul", "Bangkok", "Singapore", "London", "New York", "Sydney"];
const COUNTRIES = ["Vietnam", "Japan", "Korea", "Thailand", "Singapore", "UK", "USA", "Australia"];
const TIERS: RankTier[] = ["bronze", "silver", "gold", "platinum", "diamond", "master", "legend"];

export function generateMockBattleLeaderboard(
  scope: "global" | "country" | "city" | "hero" | "season",
  filter?: { country?: string; city?: string; heroId?: string },
  currentUser?: { name: string; rankPoints: number; wins: number; losses: number; heroId: string; country: string; city: string }
): BattleLeaderboardEntry[] {
  const entries: BattleLeaderboardEntry[] = [];

  for (let i = 0; i < 20; i++) {
    const wins = Math.floor(Math.random() * 200) + 10;
    const losses = Math.floor(Math.random() * 100) + 5;
    const heroId = HEROES[i % HEROES.length].id;
    const country = COUNTRIES[i % COUNTRIES.length];
    const city = CITIES[i % CITIES.length];

    if (scope === "country" && filter?.country && country !== filter.country) continue;
    if (scope === "city" && filter?.city && city !== filter.city) continue;
    if (scope === "hero" && filter?.heroId && heroId !== filter.heroId) continue;

    const rankPoints = Math.floor(Math.random() * 3500);
    const tier = TIERS.filter((t) => rankPoints >= ({ bronze: 0, silver: 500, gold: 1000, platinum: 1500, diamond: 2000, master: 2500, legend: 3000 }[t])).pop() ?? "bronze";

    entries.push({
      rank: 0,
      userId: `mock-${i}`,
      name: MOCK_NAMES[i % MOCK_NAMES.length],
      avatar: HEROES[i % HEROES.length].emoji,
      country,
      city,
      heroId,
      rankTier: tier,
      rankPoints,
      wins,
      winRate: Math.round((wins / (wins + losses)) * 100),
      winStreak: Math.floor(Math.random() * 15),
      highestTier: tier,
    });
  }

  if (currentUser) {
    const total = currentUser.wins + currentUser.losses;
    entries.push({
      rank: 0,
      userId: "local-user",
      name: currentUser.name,
      avatar: HEROES.find((h) => h.id === currentUser.heroId)?.emoji ?? "🎮",
      country: currentUser.country,
      city: currentUser.city,
      heroId: currentUser.heroId,
      rankTier: TIERS.filter((t) => currentUser.rankPoints >= ({ bronze: 0, silver: 500, gold: 1000, platinum: 1500, diamond: 2000, master: 2500, legend: 3000 }[t])).pop() ?? "bronze",
      rankPoints: currentUser.rankPoints,
      wins: currentUser.wins,
      winRate: total > 0 ? Math.round((currentUser.wins / total) * 100) : 0,
      winStreak: 0,
      highestTier: "bronze",
      isCurrentUser: true,
    });
  }

  entries.sort((a, b) => b.rankPoints - a.rankPoints);
  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}

export { RANK_META };
