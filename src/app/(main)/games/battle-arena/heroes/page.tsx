"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCard } from "@/components/battle-arena";
import { useBattleArenaStore } from "@/store/battle-arena-store";
import { HEROES } from "@/constants/battle-arena";

export default function HeroesPage() {
  const initBattleArena = useBattleArenaStore((s) => s.initBattleArena);
  const playerHeroes = useBattleArenaStore((s) => s.playerHeroes);
  const equipped = useBattleArenaStore((s) => s.equipped);
  const selectHero = useBattleArenaStore((s) => s.selectHero);
  const unlockHero = useBattleArenaStore((s) => s.unlockHero);
  const coins = useBattleArenaStore((s) => s.rankedProfile.coins);

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
          <h1 className="text-2xl font-black">Choose Your Hero</h1>
          <p className="text-sm text-muted-foreground">10 unique heroes with special abilities</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HEROES.map((hero) => {
          const ph = playerHeroes.find((p) => p.heroId === hero.id);
          const locked = !ph?.unlocked;
          return (
            <div key={hero.id} className="space-y-2">
              <HeroCard
                hero={hero}
                selected={equipped.heroId === hero.id}
                locked={locked}
                fragments={ph?.fragments}
                onSelect={() => selectHero(hero.id)}
              />
              <div className="rounded-xl bg-muted/30 p-3 text-xs">
                <p><strong>Passive:</strong> {hero.passive.description}</p>
                <p className="mt-1"><strong>Ultimate:</strong> {hero.ultimate.description}</p>
              </div>
              {locked && ph && (
                <Button
                  size="sm"
                  className="w-full"
                  disabled={ph.fragments < hero.fragmentCost || coins < hero.unlockCost}
                  onClick={() => unlockHero(hero.id)}
                >
                  Unlock — 🧩{hero.fragmentCost} + 🪙{hero.unlockCost}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
