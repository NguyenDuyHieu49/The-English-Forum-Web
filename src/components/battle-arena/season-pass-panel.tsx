"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CURRENT_SEASON } from "@/constants/battle-arena";
import { cn } from "@/lib/utils";

interface SeasonPassPanelProps {
  seasonXp: number;
  battlePassPremium: boolean;
  coins: number;
  onPurchasePremium: () => void;
}

export function SeasonPassPanel({
  seasonXp,
  battlePassPremium,
  coins,
  onPurchasePremium,
}: SeasonPassPanelProps) {
  const maxXp = CURRENT_SEASON.freeRewards[CURRENT_SEASON.freeRewards.length - 1]?.xpRequired ?? 1500;

  return (
    <Card className="overflow-hidden border-violet-500/20">
      <CardHeader className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20">
        <CardTitle className="flex items-center justify-between">
          <span>🎖️ {CURRENT_SEASON.name}</span>
          {!battlePassPremium && (
            <Button size="sm" disabled={coins < CURRENT_SEASON.battlePassPremiumCost} onClick={onPurchasePremium}>
              Premium — {CURRENT_SEASON.battlePassPremiumCost} 🪙
            </Button>
          )}
          {battlePassPremium && (
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400">PREMIUM</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Season XP</span>
            <span>{seasonXp}/{maxXp}</span>
          </div>
          <Progress value={(seasonXp / maxXp) * 100} className="h-2" />
        </div>

        <div className="space-y-2">
          {CURRENT_SEASON.freeRewards.map((reward, i) => {
            const unlocked = seasonXp >= reward.xpRequired;
            const premiumReward = CURRENT_SEASON.premiumRewards[i];
            return (
              <div
                key={reward.tier}
                className={cn(
                  "flex items-center gap-4 rounded-xl border p-3",
                  unlocked ? "border-emerald-500/30 bg-emerald-500/5" : "border-border opacity-60"
                )}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                  {reward.tier}
                </span>
                <div className="flex flex-1 items-center gap-3">
                  <span className="text-xl">{reward.emoji}</span>
                  <div>
                    <p className="text-sm font-medium">{reward.name}</p>
                    <p className="text-xs text-muted-foreground">Free · {reward.xpRequired} XP</p>
                  </div>
                </div>
                {premiumReward && battlePassPremium && (
                  <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1">
                    <span>{premiumReward.emoji}</span>
                    <span className="text-xs font-medium">{premiumReward.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
