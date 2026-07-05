"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useArenaStore } from "@/store/arena-store";
import { cn } from "@/lib/utils";

const RARITY_STYLE = {
  common: "border-zinc-500/30",
  rare: "border-blue-500/30 bg-blue-500/5",
  epic: "border-violet-500/30 bg-violet-500/5",
  legendary: "border-amber-500/30 bg-amber-500/5",
};

export default function ProfileInventoryPage() {
  const inventory = useArenaStore((s) => s.inventory);
  const equipItem = useArenaStore((s) => s.equipItem);
  const unequipItem = useArenaStore((s) => s.unequipItem);
  const openChest = useArenaStore((s) => s.openChest);
  const useConsumable = useArenaStore((s) => s.useConsumable);
  const equipped = useArenaStore((s) => s.equipped);

  const consumables = inventory.filter((i) =>
    ["xp_boost", "streak_shield", "lucky_chest"].includes(i.type)
  );
  const cosmetics = inventory.filter((i) =>
    ["profile_frame", "avatar_item", "title", "badge", "seasonal_reward"].includes(i.type)
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-violet-500" />
            Arena Inventory
          </h1>
          <p className="text-sm text-muted-foreground">Equip cosmetics and use items</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">Consumables</h2>
        {consumables.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No consumables yet. Play games and claim daily rewards!</CardContent></Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {consumables.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={cn("overflow-hidden", RARITY_STYLE[item.rarity])}>
                  <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                    <span className="text-4xl">{item.emoji}</span>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                      {item.quantity > 1 && <p className="text-xs">x{item.quantity}</p>}
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        item.type === "lucky_chest" ? openChest(item.id) : useConsumable(item.id)
                      }
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {item.type === "lucky_chest" ? "Open" : "Use"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Cosmetics</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cosmetics.map((item, i) => {
            const slot = item.type === "profile_frame" ? "profile_frame"
              : item.type === "avatar_item" ? "avatar_item"
              : item.type === "title" ? "title"
              : item.type === "badge" ? "badge" : null;
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={cn("overflow-hidden", RARITY_STYLE[item.rarity], item.equipped && "ring-2 ring-violet-500")}>
                  <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                    <span className="text-4xl">{item.emoji}</span>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs capitalize text-muted-foreground">{item.rarity}</p>
                    {slot && (
                      <Button
                        size="sm"
                        variant={item.equipped ? "outline" : "default"}
                        className="w-full"
                        onClick={() =>
                          item.equipped ? unequipItem(slot) : equipItem(item.id)
                        }
                      >
                        {item.equipped ? "Unequip" : "Equip"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {equipped.titleId && (
        <p className="text-center text-sm text-muted-foreground">
          Equipped title shows beside your username in leaderboards.
        </p>
      )}
    </div>
  );
}
