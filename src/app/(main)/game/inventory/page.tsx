"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBattleArenaStore } from "@/store/battle-arena-store";
import { cn } from "@/lib/utils";

const RARITY_COLORS: Record<string, string> = {
  common: "border-gray-500/30",
  rare: "border-blue-500/30",
  epic: "border-purple-500/30",
  legendary: "border-amber-500/30",
  mythic: "border-pink-500/30",
};

export default function BattleInventoryPage() {
  const initBattleArena = useBattleArenaStore((s) => s.initBattleArena);
  const inventory = useBattleArenaStore((s) => s.inventory);
  const equipped = useBattleArenaStore((s) => s.equipped);
  const equipInventoryItem = useBattleArenaStore((s) => s.equipInventoryItem);

  useEffect(() => {
    initBattleArena();
  }, [initBattleArena]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/games/battle-arena"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black">Battle Inventory</h1>
          <p className="text-sm text-muted-foreground">Equip skins, titles, frames, and more</p>
        </div>
      </div>

      {inventory.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No items yet. Win battles to earn loot!</p>
            <Button asChild>
              <Link href="/games/battle-arena">Find Match</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inventory.map((item) => {
            const isEquipped =
              equipped.skinId === item.catalogId ||
              equipped.titleId === item.catalogId ||
              equipped.frameId === item.catalogId ||
              equipped.emoteId === item.catalogId ||
              equipped.battleIntroId === item.catalogId ||
              equipped.victoryAnimationId === item.catalogId;

            return (
              <Card key={item.id} className={cn(RARITY_COLORS[item.rarity], isEquipped && "ring-2 ring-violet-500")}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                      <p className="mt-1 text-xs capitalize text-violet-400">
                        {item.rarity} · {item.type.replace("_", " ")}
                        {item.quantity > 1 && ` ×${item.quantity}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isEquipped ? "secondary" : "outline"}
                    className="mt-3 w-full"
                    onClick={() => equipInventoryItem(item.id)}
                  >
                    {isEquipped ? "Equipped ✓" : "Equip"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
