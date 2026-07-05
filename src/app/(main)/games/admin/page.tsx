"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ARENA_ITEM_CATALOG, CHEST_DROP_RATES } from "@/constants/arena";
import { useArenaStore } from "@/store/arena-store";

export default function ArenaAdminPage() {
  const activeEvent = useArenaStore((s) => s.activeEvent);
  const [xpMult, setXpMult] = useState(activeEvent?.xpMultiplier ?? 1);
  const [coinMult, setCoinMult] = useState(activeEvent?.coinMultiplier ?? 1);
  const [eventActive, setEventActive] = useState(activeEvent?.active ?? false);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Settings className="h-6 w-6" />
          Arena Admin
        </h1>
        <p className="text-sm text-muted-foreground">Manage events, rewards, and drop rates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Event Active</Label>
            <Switch checked={eventActive} onCheckedChange={setEventActive} />
          </div>
          <div>
            <Label>XP Multiplier</Label>
            <Input type="number" step="0.25" value={xpMult} onChange={(e) => setXpMult(Number(e.target.value))} className="mt-1" />
          </div>
          <div>
            <Label>Coin Multiplier</Label>
            <Input type="number" step="0.25" value={coinMult} onChange={(e) => setCoinMult(Number(e.target.value))} className="mt-1" />
          </div>
          <Button className="w-full">Save Event (Demo)</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chest Drop Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(CHEST_DROP_RATES).map(([rarity, rate]) => (
            <div key={rarity} className="flex items-center justify-between text-sm">
              <span className="capitalize">{rarity}</span>
              <span>{(rate * 100).toFixed(0)}%</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Item Catalog ({ARENA_ITEM_CATALOG.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {ARENA_ITEM_CATALOG.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg bg-muted/30 p-2 text-sm">
                <span>{item.emoji}</span>
                <span className="flex-1 font-medium">{item.name}</span>
                <span className="capitalize text-muted-foreground">{item.rarity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
