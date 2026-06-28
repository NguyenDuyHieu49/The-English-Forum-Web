"use client";

import { motion } from "framer-motion";
import { Package, Sparkles } from "lucide-react";
import { INVENTORY_ITEM_META } from "@/constants/inventory";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { InventoryItemType } from "@/types/inventory";

const RARITY_BORDER = {
  chest: "border-amber-500/30 bg-amber-500/5",
  lucky_box: "border-violet-500/30 bg-violet-500/5",
};

export default function InventoryPage() {
  const { t } = useTranslation();
  const inventory = useAppStore((s) => s.inventory);
  const openInventoryItemById = useAppStore((s) => s.openInventoryItemById);

  const chests = inventory.filter((i) => i.type === "chest");
  const luckyBoxes = inventory.filter((i) => i.type === "lucky_box");

  const renderSection = (type: InventoryItemType, items: typeof inventory) => {
    const meta = INVENTORY_ITEM_META[type];
    const title = type === "chest" ? t.inventory.chests : t.inventory.luckyBoxes;

    return (
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <span className="text-2xl">{meta.emoji}</span>
          {title}
          <span className="text-sm font-normal text-muted-foreground">({items.length})</span>
        </h2>
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              {type === "chest" ? t.inventory.noChests : t.inventory.noLuckyBoxes}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={cn("overflow-hidden", RARITY_BORDER[type])}>
                  <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                    <span className="text-5xl">{meta.emoji}</span>
                    <div>
                      <p className="font-semibold">{t.inventory.items[meta.nameKey]}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.source === "daily_checkin"
                          ? t.inventory.fromCheckIn
                          : item.source === "mission"
                            ? t.inventory.fromMission
                            : t.inventory.fromReward}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => openInventoryItemById(item.id)}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {type === "chest" ? t.inventory.openChest : t.inventory.openLuckyBox}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">{t.inventory.title}</h1>
        <p className="mt-1 text-muted-foreground">{t.inventory.subtitle}</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: t.inventory.totalItems, value: inventory.length, emoji: "🎒" },
          { label: t.inventory.chests, value: chests.length, emoji: "📦" },
          { label: t.inventory.luckyBoxes, value: luckyBoxes.length, emoji: "🎁" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <span className="text-3xl">{stat.emoji}</span>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4 text-violet-500" />
            {t.inventory.howToGet}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>📦 {t.inventory.checkInHint}</p>
          <p>🎁 {t.inventory.missionHint}</p>
        </CardContent>
      </Card>

      {renderSection("chest", chests)}
      {renderSection("lucky_box", luckyBoxes)}
    </div>
  );
}
