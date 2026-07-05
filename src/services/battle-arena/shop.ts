import type { BattleInventoryItem, ShopItem } from "@/types/battle-arena";
import { SHOP_ITEMS } from "@/constants/battle-arena";
import { randomUUID } from "@/lib/uuid";

export function getShopItems(): ShopItem[] {
  return SHOP_ITEMS;
}

export function canAfford(
  item: ShopItem,
  coins: number,
  battlePoints: number,
  currency: "coins" | "battlePoints"
): boolean {
  return currency === "coins" ? coins >= item.priceCoins : battlePoints >= item.priceBattlePoints;
}

export function purchaseItem(
  item: ShopItem,
  currency: "coins" | "battlePoints"
): { success: boolean; item?: BattleInventoryItem; cost: number } {
  const cost = currency === "coins" ? item.priceCoins : item.priceBattlePoints;
  const inventoryItem: BattleInventoryItem = {
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
  };
  return { success: true, item: inventoryItem, cost };
}
