import type {
  BattleReward,
  BattleInventoryItem,
  LootRarity,
  MatchMode,
  RankedProfile,
} from "@/types/battle-arena";
import { SHOP_ITEMS } from "@/constants/battle-arena";
import { randomUUID } from "@/lib/uuid";

function rollRarity(): LootRarity {
  const roll = Math.random();
  let cumulative = 0;
  const order: LootRarity[] = ["mythic", "legendary", "epic", "rare", "common"];
  const rates = { mythic: 0.02, legendary: 0.08, epic: 0.15, rare: 0.30, common: 0.45 };
  for (const r of order) {
    cumulative += rates[r];
    if (roll < cumulative) return r;
  }
  return "common";
}

export function calculateBattleRewards(
  won: boolean,
  mode: MatchMode,
  profile: RankedProfile,
  questionIds: string[]
): BattleReward {
  const baseXp = won ? 80 : 30;
  const baseCoins = won ? 50 : 15;
  const baseBp = won ? 25 : 8;
  const modeMult = mode === "ranked" ? 1.5 : 1;
  const streakMult = won ? 1 + profile.winStreak * 0.05 : 1;

  const rankPointsChange = mode === "ranked"
    ? won ? 25 + Math.min(profile.winStreak * 2, 20) : -15
    : 0;

  const loot: BattleInventoryItem[] = [];
  let chestDropped = false;

  if (won && Math.random() < 0.35) {
    chestDropped = true;
    const rarity = rollRarity();
    const shopPool = SHOP_ITEMS.filter((s) => s.rarity === rarity || s.rarity === "common");
    const item = shopPool[Math.floor(Math.random() * shopPool.length)];
    if (item) {
      loot.push({
        id: randomUUID(),
        catalogId: item.id,
        type: item.type,
        name: item.name,
        description: item.description,
        rarity: item.rarity,
        emoji: item.emoji,
        quantity: 1,
        heroId: item.heroId,
        obtainedAt: new Date().toISOString(),
      });
    }
  }

  if (won && Math.random() < 0.15) {
    loot.push({
      id: randomUUID(),
      catalogId: "hero-fragment",
      type: "hero_fragment",
      name: "Hero Fragment",
      description: "Collect to unlock heroes",
      rarity: "rare",
      emoji: "🧩",
      quantity: Math.floor(Math.random() * 3) + 1,
      obtainedAt: new Date().toISOString(),
    });
  }

  return {
    xp: Math.round(baseXp * modeMult * streakMult),
    coins: Math.round(baseCoins * modeMult),
    battlePoints: Math.round(baseBp * modeMult),
    rankPointsChange,
    loot,
    chestDropped,
  };
}

export function applyRankPointsChange(profile: RankedProfile, change: number): RankedProfile {
  const newPoints = Math.max(0, profile.rankPoints + change);
  const tiers = [
    { tier: "legend" as const, min: 3000 },
    { tier: "master" as const, min: 2500 },
    { tier: "diamond" as const, min: 2000 },
    { tier: "platinum" as const, min: 1500 },
    { tier: "gold" as const, min: 1000 },
    { tier: "silver" as const, min: 500 },
    { tier: "bronze" as const, min: 0 },
  ];
  const tier = tiers.find((t) => newPoints >= t.min)?.tier ?? "bronze";
  const tierOrder = ["bronze", "silver", "gold", "platinum", "diamond", "master", "legend"];
  const highestIdx = Math.max(tierOrder.indexOf(profile.highestTier), tierOrder.indexOf(tier));

  return {
    ...profile,
    rankPoints: newPoints,
    rankTier: tier,
    highestTier: tierOrder[highestIdx] as RankedProfile["highestTier"],
    updatedAt: new Date().toISOString(),
  };
}
