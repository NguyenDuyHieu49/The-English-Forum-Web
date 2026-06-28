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

export function openInventoryItem(type: InventoryItemType): OpenLootResult {
  if (type === "lucky_box") {
    const roll = Math.random();
    if (roll > 0.85) {
      return { label: "100 Tokens + 150 XP", tokens: 100, xp: 150, rarity: "legendary" };
    }
    if (roll > 0.55) {
      return { label: "60 Tokens + 100 XP", tokens: 60, xp: 100, rarity: "epic" };
    }
    return { label: "35 Tokens + 70 XP", tokens: 35, xp: 70, rarity: "rare" };
  }

  const roll = Math.random();
  if (roll > 0.7) {
    return { label: "30 Tokens + 50 XP", tokens: 30, xp: 50, rarity: "rare" };
  }
  return { label: "15 Tokens + 25 XP", tokens: 15, xp: 25, rarity: "common" };
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
