"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ShopItem } from "@/types/battle-arena";
import { cn } from "@/lib/utils";

interface ShopPanelProps {
  items: ShopItem[];
  coins: number;
  battlePoints: number;
  onPurchase: (catalogId: string, currency: "coins" | "battlePoints") => void;
}

const RARITY_BORDER: Record<string, string> = {
  common: "border-gray-500/30",
  rare: "border-blue-500/30",
  epic: "border-purple-500/30",
  legendary: "border-amber-500/30",
  mythic: "border-pink-500/30",
};

export function ShopPanel({ items, coins, battlePoints, onPurchase }: ShopPanelProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className={cn("overflow-hidden", RARITY_BORDER[item.rarity])}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{item.emoji}</span>
              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <p className="mt-1 text-xs capitalize text-violet-400">{item.rarity}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={coins < item.priceCoins}
                onClick={() => onPurchase(item.id, "coins")}
                className="flex-1 text-xs"
              >
                🪙 {item.priceCoins}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={battlePoints < item.priceBattlePoints}
                onClick={() => onPurchase(item.id, "battlePoints")}
                className="flex-1 text-xs"
              >
                ⚔️ {item.priceBattlePoints}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
