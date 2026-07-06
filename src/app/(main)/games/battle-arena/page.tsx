"use client";

import { useEffect, useCallback, useReducer } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swords, Trophy, ShoppingBag, Users, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBattleArenaStore } from "@/store/battle-arena-store";
import { useBattleArena } from "@/hooks/use-battle-arena";
import { useArenaStore } from "@/store/arena-store";
import {
  RankBadge,
  MatchmakingScreen,
  VsScreen,
  LoadingScreen,
  BattleScreen,
  VictoryScreen,
  RewardOpening,
} from "@/components/battle-arena";
import { HEROES } from "@/constants/battle-arena";

export default function BattleArenaPage() {
  const initBattleArena = useBattleArenaStore((s) => s.initBattleArena);
  const profile = useBattleArenaStore((s) => s.rankedProfile);
  const equipped = useBattleArenaStore((s) => s.equipped);
  const selectedMode = useBattleArenaStore((s) => s.selectedMode);
  const setMode = useBattleArenaStore((s) => s.setMode);
  const completeMatch = useBattleArenaStore((s) => s.completeMatch);
  const lastReward = useBattleArenaStore((s) => s.lastReward);
  const showRewardModal = useBattleArenaStore((s) => s.showRewardModal);
  const dismissReward = useBattleArenaStore((s) => s.dismissReward);
  const arenaProfile = useArenaStore((s) => s.gameProfile);

  const battle = useBattleArena();

  useEffect(() => {
    initBattleArena();
  }, [initBattleArena]);

  const selectedHero = HEROES.find((h) => h.id === equipped.heroId);

  const handleFindMatch = useCallback(() => {
    battle.joinQueue({
      userId: profile.userId,
      userName: profile.displayName,
      avatar: selectedHero?.emoji ?? "🎮",
      country: profile.country,
      city: profile.city,
      heroId: equipped.heroId,
      skinId: equipped.skinId,
      rankTier: profile.rankTier,
      rankPoints: profile.rankPoints,
      mode: selectedMode,
      region: profile.region,
    });
  }, [battle, profile, equipped, selectedMode, selectedHero]);

  const handleVictoryContinue = useCallback(() => {
    const won = battle.winnerId === profile.userId;
    const questionIds = battle.currentRound
      ? [battle.currentRound.question.id]
      : [];
    completeMatch(won, selectedMode, questionIds);
    battle.resetState();
  }, [battle, profile.userId, selectedMode, completeMatch]);

  const player = battle.match?.players.find((p) => p.userId === profile.userId);
  const stunTick = "stunTick" in battle ? (battle.stunTick as number) : 0;
  const [, bumpStun] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    if (!player || Date.now() >= player.stunnedUntil) return;
    const delay = player.stunnedUntil - Date.now() + 50;
    const t = setTimeout(bumpStun, delay);
    return () => clearTimeout(t);
  }, [player?.stunnedUntil, stunTick, bumpStun]);

  const stunned = player ? Date.now() < player.stunnedUntil : false;

  if (battle.serverChecking) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Connecting to battle server...</p>
      </div>
    );
  }

  if (battle.phase === "queue") {
    return (
      <MatchmakingScreen
        onlineCount={battle.onlineCount}
        estimatedWait={battle.estimatedWait}
        onCancel={() => battle.leaveQueue(profile.userId)}
      />
    );
  }

  if (battle.phase === "match_found" && battle.match && battle.opponent && player) {
    return <VsScreen player={player} opponent={battle.opponent} />;
  }

  if (battle.phase === "loading" && battle.match && battle.opponent && player) {
    return <LoadingScreen player={player} opponent={battle.opponent} />;
  }

  if (battle.phase === "battle" && battle.match && player) {
    return (
      <BattleScreen
        match={battle.match}
        currentRound={battle.currentRound}
        userId={profile.userId}
        lastAttack={"lastAttack" in battle ? battle.lastAttack : null}
        stunned={stunned}
        onAnswer={(choiceId) => {
          if (battle.match && battle.currentRound) {
            battle.submitAnswer(
              battle.match.id,
              profile.userId,
              battle.currentRound.roundIndex,
              choiceId
            );
          }
        }}
        onUltimate={() => {
          if (battle.match) battle.useUltimate(battle.match.id, profile.userId);
        }}
      />
    );
  }

  if (battle.phase === "victory" && battle.match && battle.opponent) {
  return (
    <>
      <VictoryScreen
        won={battle.winnerId === profile.userId}
        reward={lastReward}
        opponentName={battle.opponent.userName}
        onContinue={handleVictoryContinue}
      />
      {showRewardModal && lastReward && lastReward.loot.length > 0 && (
        <RewardOpening items={lastReward.loot} onClose={dismissReward} />
      )}
    </>
  );
  }

  return (
    <div className="space-y-8">
      {battle.isLocalMode && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-600">
          🤖 Offline mode — playing vs AI bot. Start WS server for real PvP: <code className="text-xs">npm run battle:server</code>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-3xl font-black text-transparent">
              ⚔️ English Battle Arena
            </h1>
            <p className="mt-1 text-muted-foreground">
              Real-time PvP English battles. Answer fast, attack hard, climb the ranks!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RankBadge tier={profile.rankTier} points={profile.rankPoints} />
            <span className="text-sm">🪙 {profile.coins}</span>
            <span className="text-sm">⚔️ {profile.battlePoints} BP</span>
          </div>
        </div>
      </motion.div>

      <Card className="overflow-hidden border-red-500/20">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedHero?.color ?? "from-gray-600 to-gray-800"} text-6xl shadow-xl`}
            >
              {selectedHero?.emoji ?? "🎮"}
            </motion.div>
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{selectedHero?.name ?? "Select Hero"}</h2>
              <p className="text-sm text-muted-foreground">{selectedHero?.lore}</p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-muted px-3 py-1 text-xs">
                  W: {profile.wins} · L: {profile.losses}
                </span>
                <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
                  🔥 Streak: {profile.winStreak}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant={selectedMode === "casual" ? "default" : "outline"}
          onClick={() => setMode("casual")}
        >
          Casual
        </Button>
        <Button
          variant={selectedMode === "ranked" ? "default" : "outline"}
          onClick={() => setMode("ranked")}
        >
          Ranked
        </Button>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          size="lg"
          onClick={handleFindMatch}
          className="h-16 w-full bg-gradient-to-r from-red-600 to-orange-600 text-xl font-black shadow-lg shadow-red-500/30"
        >
          <Swords className="mr-3 h-6 w-6" />
          FIND MATCH
        </Button>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/games/battle-arena/heroes", icon: Shield, label: "Heroes", color: "text-violet-500" },
          { href: "/games/battle-arena/shop", icon: ShoppingBag, label: "Shop", color: "text-amber-500" },
          { href: "/game/inventory", icon: Sparkles, label: "Inventory", color: "text-pink-500" },
          { href: "/games/battle-arena/leaderboard", icon: Trophy, label: "Leaderboard", color: "text-yellow-500" },
          { href: "/games/battle-arena/season", icon: Users, label: "Season Pass", color: "text-blue-500" },
        ].map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="transition-colors hover:border-violet-500/30 hover:bg-muted/30">
              <CardContent className="flex items-center gap-3 p-4">
                <link.icon className={`h-5 w-5 ${link.color}`} />
                <span className="font-medium">{link.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {battle.onlineCount.toLocaleString()} warriors online · City: {arenaProfile.city}
      </p>
    </div>
  );
}
