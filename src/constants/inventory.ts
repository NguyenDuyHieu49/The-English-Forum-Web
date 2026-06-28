import type { InventoryItemType } from "@/types/inventory";

export const INVENTORY_ITEM_META: Record<
  InventoryItemType,
  { emoji: string; nameKey: "chest" | "luckyBox" }
> = {
  chest: { emoji: "📦", nameKey: "chest" },
  lucky_box: { emoji: "🎁", nameKey: "luckyBox" },
};
