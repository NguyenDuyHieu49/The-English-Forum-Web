"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SeasonPassPanel } from "@/components/battle-arena";
import { useBattleArenaStore } from "@/store/battle-arena-store";

export default function SeasonPage() {
  const initBattleArena = useBattleArenaStore((s) => s.initBattleArena);
  const profile = useBattleArenaStore((s) => s.rankedProfile);
  const battlePassPremium = useBattleArenaStore((s) => s.battlePassPremium);
  const purchaseBattlePass = useBattleArenaStore((s) => s.purchaseBattlePass);

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
          <h1 className="text-2xl font-black">Season Pass</h1>
          <p className="text-sm text-muted-foreground">30-day seasons with exclusive rewards</p>
        </div>
      </div>

      <SeasonPassPanel
        seasonXp={profile.seasonXp}
        battlePassPremium={battlePassPremium}
        coins={profile.coins}
        onPurchasePremium={purchaseBattlePass}
      />

      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold">Season End Rewards</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>🏆 Legend tier: Exclusive Mythic skin + Legendary title</li>
            <li>💎 Diamond+: Epic frame + Victory effect</li>
            <li>🥇 Gold+: Rare emote + Battle animation</li>
            <li>📊 Soft reset: Rank points reduced by 30% next season</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
