export type InventoryItemType = "chest" | "lucky_box";

export type InventorySource = "daily_checkin" | "mission" | "reward";

export interface InventoryItem {
  id: string;
  type: InventoryItemType;
  source: InventorySource;
  obtainedAt: string;
}

export interface OpenLootResult {
  label: string;
  tokens: number;
  xp: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}
