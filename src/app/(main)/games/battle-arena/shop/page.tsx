"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopPanel } from "@/components/battle-arena";
import { useBattleArenaStore } from "@/store/battle-arena-store";
import { getShopItems } from "@/services/battle-arena/shop";

export default function BattleShopPage() {
  const initBattleArena = useBattleArenaStore((s) => s.initBattleArena);
  const profile = useBattleArenaStore((s) => s.rankedProfile);
  const buyShopItem = useBattleArenaStore((s) => s.buyShopItem);

  useEffect(() => {
    initBattleArena();
  }, [initBattleArena]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/games/battle-arena"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-black">Battle Shop</h1>
            <p className="text-sm text-muted-foreground">In-game currency only — no real money</p>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <span>🪙 {profile.coins}</span>
          <span>⚔️ {profile.battlePoints} BP</span>
        </div>
      </div>

      <ShopPanel
        items={getShopItems()}
        coins={profile.coins}
        battlePoints={profile.battlePoints}
        onPurchase={buyShopItem}
      />
    </div>
  );
}
