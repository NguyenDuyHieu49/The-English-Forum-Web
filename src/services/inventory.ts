import type { Locale } from "@/constants/app";
import { getDictionary } from "@/i18n";
import type { InventoryItem, InventoryItemType, InventorySource, OpenLootResult } from "@/types/inventory";

export function createInventoryItem(
  type: InventoryItemType,
  source: InventorySource
): InventoryItem {
  return {
    id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    source,
    obtainedAt: new Date().toISOString(),
  };
}

export function openInventoryItem(type: InventoryItemType, locale: Locale = "en"): OpenLootResult {
  const loot = getDictionary(locale).gamification.loot;

  if (type === "lucky_box") {
    const roll = Math.random();
    if (roll > 0.85) {
      return { label: loot.luckyLegendary, tokens: 100, xp: 150, rarity: "legendary" };
    }
    if (roll > 0.55) {
      return { label: loot.luckyEpic, tokens: 60, xp: 100, rarity: "epic" };
    }
    return { label: loot.luckyRare, tokens: 35, xp: 70, rarity: "rare" };
  }

  const roll = Math.random();
  if (roll > 0.7) {
    return { label: loot.chestRare, tokens: 30, xp: 50, rarity: "rare" };
  }
  return { label: loot.chestCommon, tokens: 15, xp: 25, rarity: "common" };
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
