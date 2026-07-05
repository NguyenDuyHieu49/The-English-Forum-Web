import type { ArenaInventoryItem, ArenaRarity, ArenaItemCatalog } from "@/types/arena";
import { ARENA_ITEM_CATALOG, CHEST_DROP_RATES } from "@/constants/arena";

function rollRarity(): ArenaRarity {
  const roll = Math.random();
  let cumulative = 0;
  for (const [rarity, rate] of Object.entries(CHEST_DROP_RATES)) {
    cumulative += rate;
    if (roll <= cumulative) return rarity as ArenaRarity;
  }
  return "common";
}

function itemsByRarity(rarity: ArenaRarity): ArenaItemCatalog[] {
  return ARENA_ITEM_CATALOG.filter((i) => i.rarity === rarity && i.type !== "lucky_chest");
}

export function openMysteryChest(): {
  coins: number;
  item?: ArenaInventoryItem;
  rarity: ArenaRarity;
} {
  const rarity = rollRarity();
  const roll = Math.random();

  if (roll > 0.6) {
    const pool = itemsByRarity(rarity);
    if (pool.length > 0) {
      const catalog = pool[Math.floor(Math.random() * pool.length)];
      return {
        coins: 0,
        rarity,
        item: {
          id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          catalogId: catalog.id,
          type: catalog.type,
          name: catalog.name,
          description: catalog.description,
          rarity: catalog.rarity,
          emoji: catalog.emoji,
          quantity: 1,
          equipped: false,
          obtainedAt: new Date().toISOString(),
        },
      };
    }
  }

  const coinAmounts: Record<ArenaRarity, number> = {
    common: 25,
    rare: 50,
    epic: 100,
    legendary: 200,
  };

  return { coins: coinAmounts[rarity], rarity };
}

export function createInventoryFromCatalog(catalogId: string): ArenaInventoryItem | null {
  const catalog = ARENA_ITEM_CATALOG.find((i) => i.id === catalogId);
  if (!catalog) return null;
  return {
    id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    catalogId: catalog.id,
    type: catalog.type,
    name: catalog.name,
    description: catalog.description,
    rarity: catalog.rarity,
    emoji: catalog.emoji,
    quantity: 1,
    equipped: false,
    obtainedAt: new Date().toISOString(),
  };
}

export function getCatalogItem(catalogId: string): ArenaItemCatalog | undefined {
  return ARENA_ITEM_CATALOG.find((i) => i.id === catalogId);
}
