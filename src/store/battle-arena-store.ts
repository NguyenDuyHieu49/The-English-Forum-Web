import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BattleDatabase,
  BattleEquippedCosmetics,
  BattleCosmeticSlot,
  MatchMode,
  BattleReward,
  BattleInventoryItem,
} from "@/types/battle-arena";
import { createEmptyBattleDatabase } from "@/db/battle-schema";
import { runBattleMigrations } from "@/db/migrations/002_battle_arena_init";
import { BATTLE_STORAGE_KEY } from "@/constants/battle-arena";
import { calculateBattleRewards, applyRankPointsChange } from "@/services/battle-arena/rewards";
import { purchaseItem, canAfford } from "@/services/battle-arena/shop";
import { getShopItems } from "@/services/battle-arena/shop";
import { useArenaStore } from "@/store/arena-store";
import { useAppStore } from "@/store/app-store";
import { HEROES } from "@/constants/battle-arena";

interface BattleArenaState extends BattleDatabase {
  selectedMode: MatchMode;
  lastReward: BattleReward | null;
  showRewardModal: boolean;

  initBattleArena: () => void;
  setMode: (mode: MatchMode) => void;
  setRegion: (region: BattleDatabase["rankedProfile"]["region"]) => void;
  selectHero: (heroId: string) => void;
  equipCosmetic: (slot: BattleCosmeticSlot, itemId: string | null) => void;
  unlockHero: (heroId: string) => boolean;
  addHeroFragments: (heroId: string, amount: number) => void;
  completeMatch: (won: boolean, mode: MatchMode, questionIds: string[]) => BattleReward;
  buyShopItem: (catalogId: string, currency: "coins" | "battlePoints") => "success" | "insufficient" | "not_found";
  equipInventoryItem: (itemId: string) => void;
  purchaseBattlePass: () => "success" | "insufficient";
  dismissReward: () => void;
  getSelectedHero: () => typeof HEROES[0] | undefined;
}

export const useBattleArenaStore = create<BattleArenaState>()(
  persist(
    (set, get) => ({
      ...runBattleMigrations(createEmptyBattleDatabase()),
      selectedMode: "casual",
      lastReward: null,
      showRewardModal: false,

      initBattleArena: () => {
        const state = get();
        const migrated = runBattleMigrations(state);
        set({ ...migrated });
      },

      setMode: (mode) => set({ selectedMode: mode }),

      setRegion: (region) =>
        set((s) => ({
          rankedProfile: { ...s.rankedProfile, region, updatedAt: new Date().toISOString() },
        })),

      selectHero: (heroId) => {
        const hero = get().playerHeroes.find((h) => h.heroId === heroId);
        if (!hero?.unlocked) return;
        set((s) => ({
          equipped: { ...s.equipped, heroId },
        }));
      },

      equipCosmetic: (slot, itemId) => {
        const key = `${slot}Id` as keyof BattleEquippedCosmetics;
        set((s) => ({
          equipped: { ...s.equipped, [key]: itemId },
        }));
      },

      unlockHero: (heroId) => {
        const heroDef = HEROES.find((h) => h.id === heroId);
        const playerHero = get().playerHeroes.find((h) => h.heroId === heroId);
        if (!heroDef || !playerHero || playerHero.unlocked) return false;

        if (playerHero.fragments >= heroDef.fragmentCost && get().rankedProfile.coins >= heroDef.unlockCost) {
          set((s) => ({
            rankedProfile: { ...s.rankedProfile, coins: s.rankedProfile.coins - heroDef.unlockCost },
            playerHeroes: s.playerHeroes.map((h) =>
              h.heroId === heroId ? { ...h, unlocked: true, fragments: h.fragments - heroDef.fragmentCost } : h
            ),
          }));
          return true;
        }
        return false;
      },

      addHeroFragments: (heroId, amount) =>
        set((s) => ({
          playerHeroes: s.playerHeroes.map((h) =>
            h.heroId === heroId ? { ...h, fragments: h.fragments + amount } : h
          ),
        })),

      completeMatch: (won, mode, questionIds) => {
        const s = get();
        const reward = calculateBattleRewards(won, mode, s.rankedProfile, questionIds);

        let profile = {
          ...s.rankedProfile,
          wins: won ? s.rankedProfile.wins + 1 : s.rankedProfile.wins,
          losses: won ? s.rankedProfile.losses : s.rankedProfile.losses + 1,
          winStreak: won ? s.rankedProfile.winStreak + 1 : 0,
          bestStreak: won ? Math.max(s.rankedProfile.bestStreak, s.rankedProfile.winStreak + 1) : s.rankedProfile.bestStreak,
          coins: s.rankedProfile.coins + reward.coins,
          battlePoints: s.rankedProfile.battlePoints + reward.battlePoints,
          seasonXp: s.rankedProfile.seasonXp + reward.xp,
        };

        if (mode === "ranked") {
          profile = applyRankPointsChange(profile, reward.rankPointsChange);
        }

        set({
          rankedProfile: profile,
          inventory: [...s.inventory, ...reward.loot],
          recentQuestionIds: [...s.recentQuestionIds, ...questionIds].slice(-50),
          matchHistory: [
            { matchId: `match-${Date.now()}`, won, mode, at: new Date().toISOString() },
            ...s.matchHistory,
          ].slice(0, 50),
          lastReward: reward,
          showRewardModal: true,
        });

        useArenaStore.getState().completeGame({
          gameId: "boss-battle",
          score: won ? 100 : 30,
          maxScore: 100,
          correct: won ? 8 : 3,
          total: 10,
          combo: won ? 5 : 0,
          perfect: won,
          timeBonus: 0,
          durationMs: 120000,
        });

        useAppStore.getState().addReward({
          id: `battle-xp-${Date.now()}`,
          type: "xp",
          amount: reward.xp,
          label: `+${reward.xp} Battle XP`,
          rarity: "common",
        });
        if (reward.coins > 0) {
          const mainStore = useAppStore.getState();
          const stats = { ...mainStore.userStats };
          stats.tokens += reward.coins;
          useAppStore.setState({ userStats: stats });
        }

        return reward;
      },

      buyShopItem: (catalogId, currency) => {
        const item = getShopItems().find((i) => i.id === catalogId);
        if (!item) return "not_found";

        const profile = get().rankedProfile;
        if (!canAfford(item, profile.coins, profile.battlePoints, currency)) return "insufficient";

        const result = purchaseItem(item, currency);
        const cost = result.cost;

        set((s) => ({
          rankedProfile: {
            ...s.rankedProfile,
            coins: currency === "coins" ? s.rankedProfile.coins - cost : s.rankedProfile.coins,
            battlePoints: currency === "battlePoints" ? s.rankedProfile.battlePoints - cost : s.rankedProfile.battlePoints,
          },
          inventory: result.item ? [...s.inventory, result.item] : s.inventory,
        }));

        return "success";
      },

      equipInventoryItem: (itemId) => {
        const item = get().inventory.find((i) => i.id === itemId);
        if (!item) return;

        const slotMap: Partial<Record<BattleInventoryItem["type"], BattleCosmeticSlot>> = {
          hero_skin: "skin",
          avatar_frame: "frame",
          title: "title",
          emote: "emote",
          victory_effect: "victory_animation",
          battle_animation: "battle_intro",
        };

        const slot = slotMap[item.type];
        if (slot) {
          get().equipCosmetic(slot, item.catalogId);
        }
      },

      purchaseBattlePass: () => {
        const cost = 500;
        if (get().rankedProfile.coins < cost) return "insufficient";
        set((s) => ({
          battlePassPremium: true,
          rankedProfile: { ...s.rankedProfile, coins: s.rankedProfile.coins - cost },
        }));
        return "success";
      },

      dismissReward: () => set({ showRewardModal: false, lastReward: null }),

      getSelectedHero: () => {
        const heroId = get().equipped.heroId;
        return HEROES.find((h) => h.id === heroId);
      },
    }),
    { name: BATTLE_STORAGE_KEY }
  )
);
