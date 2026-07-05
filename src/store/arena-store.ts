import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ArenaDatabase,
  GameSessionResult,
  GameRewardBreakdown,
  GameId,
  GameChallenge,
  BossBattleState,
  CosmeticSlot,
} from "@/types/arena";
import { createEmptyDatabase, DB_VERSION } from "@/db/schema";
import { runMigrations } from "@/db/migrations/001_arena_init";
import { DAILY_REWARDS, BOSS_CONFIG, levelFromXp } from "@/constants/arena";
import { calculateGameRewards, gameWinThreshold, todayKey } from "@/services/arena/xp";
import { checkAchievements, createAchievementItems } from "@/services/arena/achievements";
import { openMysteryChest, createInventoryFromCatalog } from "@/services/arena/inventory";
import { getCityRank } from "@/services/arena/leaderboard";
import { useAppStore } from "@/store/app-store";

interface ArenaState extends ArenaDatabase {
  lastReward: GameRewardBreakdown | null;
  showLevelUp: boolean;
  showAchievement: string | null;
  gamesSinceBoss: number;

  initArena: () => void;
  setCity: (city: string) => void;
  setCountry: (country: string) => void;
  completeGame: (result: GameSessionResult) => GameRewardBreakdown;
  claimDailyReward: () => "success" | "already_claimed";
  canClaimDailyReward: () => boolean;
  openChest: (itemId: string) => { coins: number; rarity: string } | null;
  equipItem: (itemId: string) => void;
  unequipItem: (slot: CosmeticSlot) => void;
  useConsumable: (itemId: string) => boolean;
  startBossBattle: () => void;
  bossAnswer: (correct: boolean) => "ongoing" | "victory" | "defeat";
  sendChallenge: (friendId: string, gameId: GameId) => void;
  acceptChallenge: (challengeId: string) => void;
  dismissLevelUp: () => void;
  dismissAchievement: () => void;
  getEquippedTitle: () => string | null;
  getEquippedFrame: () => string | null;
}

function slotForItem(type: string): CosmeticSlot | null {
  const map: Record<string, CosmeticSlot> = {
    title: "title",
    profile_frame: "profile_frame",
    avatar_item: "avatar_item",
    badge: "badge",
  };
  return map[type] ?? null;
}

export const useArenaStore = create<ArenaState>()(
  persist(
    (set, get) => ({
      ...runMigrations(createEmptyDatabase()),
      lastReward: null,
      showLevelUp: false,
      showAchievement: null,
      gamesSinceBoss: 0,

      initArena: () => {
        const state = get();
        if (state.version < DB_VERSION) {
          const migrated = runMigrations(state);
          set({ ...migrated });
        }
      },

      setCity: (city) =>
        set((s) => ({
          gameProfile: { ...s.gameProfile, city, updatedAt: new Date().toISOString() },
        })),

      setCountry: (country) =>
        set((s) => ({
          gameProfile: { ...s.gameProfile, country, updatedAt: new Date().toISOString() },
        })),

      completeGame: (result) => {
        const s = get();
        const event = s.activeEvent;
        const xpMult = event?.active ? event.xpMultiplier : 1;
        const coinMult = event?.active ? event.coinMultiplier : 1;
        const reward = calculateGameRewards(
          result,
          s.gameProfile.dailyRewardStreak,
          xpMult,
          coinMult,
          s.gameProfile.arenaXp
        );

        const won = gameWinThreshold(result.gameId, result.correct, result.total);
        const newXp = s.gameProfile.arenaXp + reward.totalXp;
        const newLevel = levelFromXp(newXp);
        const cityRank = getCityRank(s.gameProfile.city, newXp, s.gameProfile.displayName);

        const achievementResult = checkAchievements(s.achievements, {
          gamesWon: s.gameProfile.gamesWon + (won ? 1 : 0),
          streak: s.gameProfile.dailyRewardStreak,
          bossStagesCleared: s.gameProfile.bossStagesCleared,
          arenaLevel: newLevel,
          cityRank,
          lastGame: result,
        });

        let inventory = [...s.inventory];
        for (const catalogId of achievementResult.newItems) {
          const item = createInventoryFromCatalog(catalogId);
          if (item) inventory.push(item);
        }

        const newAchievement = achievementResult.newlyUnlocked[0];

        set({
          gameProfile: {
            ...s.gameProfile,
            arenaXp: newXp,
            arenaLevel: newLevel,
            coins: s.gameProfile.coins + reward.coins + achievementResult.bonusCoins,
            gamesPlayed: s.gameProfile.gamesPlayed + 1,
            gamesWon: s.gameProfile.gamesWon + (won ? 1 : 0),
            achievementPoints: s.gameProfile.achievementPoints + (newAchievement ? 50 : 10),
            updatedAt: new Date().toISOString(),
          },
          achievements: achievementResult.updated,
          inventory,
          lastReward: reward,
          showLevelUp: reward.leveledUp ?? false,
          showAchievement: newAchievement?.id ?? null,
          gamesSinceBoss: s.gamesSinceBoss + 1,
        });

        const mainStore = useAppStore.getState();
        if (reward.totalXp > 0) {
          mainStore.addReward({
            id: `arena-xp-${Date.now()}`,
            type: "xp",
            amount: reward.totalXp,
            label: `+${reward.totalXp} Arena XP`,
            rarity: reward.leveledUp ? "epic" : "common",
          });
        }
        if (reward.coins > 0) {
          const stats = { ...mainStore.userStats };
          stats.tokens += reward.coins + achievementResult.bonusCoins;
          useAppStore.setState({ userStats: stats });
        }

        return reward;
      },

      claimDailyReward: () => {
        const s = get();
        const today = todayKey();
        if (s.gameProfile.lastDailyRewardDate === today) return "already_claimed";

        const nextDay = (s.gameProfile.lastDailyRewardDay % 7) + 1;
        const rewardConfig = DAILY_REWARDS.find((r) => r.day === nextDay)!;
        let inventory = [...s.inventory];
        let coins = s.gameProfile.coins;

        if (rewardConfig.coins) coins += rewardConfig.coins;
        if (rewardConfig.itemCatalogId) {
          const item = createInventoryFromCatalog(rewardConfig.itemCatalogId);
          if (item) inventory.push(item);
        }

        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const streakContinues = s.gameProfile.lastDailyRewardDate === yesterday;

        set({
          gameProfile: {
            ...s.gameProfile,
            coins,
            lastDailyRewardDay: nextDay,
            lastDailyRewardDate: today,
            dailyRewardStreak: streakContinues ? s.gameProfile.dailyRewardStreak + 1 : 1,
          },
          inventory,
        });
        return "success";
      },

      canClaimDailyReward: () => get().gameProfile.lastDailyRewardDate !== todayKey(),

      openChest: (itemId) => {
        const s = get();
        const item = s.inventory.find((i) => i.id === itemId);
        if (!item || item.type !== "lucky_chest") return null;

        const loot = openMysteryChest();
        let inventory = s.inventory.filter((i) => i.id !== itemId);
        if (loot.item) inventory.push(loot.item);

        set({
          inventory,
          gameProfile: {
            ...s.gameProfile,
            coins: s.gameProfile.coins + loot.coins,
          },
        });
        return { coins: loot.coins, rarity: loot.rarity };
      },

      equipItem: (itemId) => {
        const s = get();
        const item = s.inventory.find((i) => i.id === itemId);
        if (!item) return;
        const slot = slotForItem(item.type);
        if (!slot) return;

        const equipped = { ...s.equipped };
        const inventory = s.inventory.map((i) => {
          if (i.type === item.type) return { ...i, equipped: false };
          if (i.id === itemId) return { ...i, equipped: true };
          return i;
        });

        const slotKey = `${slot}Id` as keyof typeof equipped;
        equipped[slotKey] = item.catalogId;

        set({ equipped, inventory });
      },

      unequipItem: (slot) => {
        const s = get();
        const equipped = { ...s.equipped };
        const slotKey = `${slot}Id` as keyof typeof equipped;
        const catalogId = equipped[slotKey];
        equipped[slotKey] = null;

        const inventory = s.inventory.map((i) =>
          i.catalogId === catalogId ? { ...i, equipped: false } : i
        );
        set({ equipped, inventory });
      },

      useConsumable: (itemId) => {
        const s = get();
        const idx = s.inventory.findIndex((i) => i.id === itemId);
        if (idx === -1) return false;
        const item = s.inventory[idx];
        if (item.type !== "xp_boost" && item.type !== "streak_shield") return false;

        const inventory = [...s.inventory];
        if (item.quantity <= 1) inventory.splice(idx, 1);
        else inventory[idx] = { ...item, quantity: item.quantity - 1 };

        set({ inventory });
        return true;
      },

      startBossBattle: () => {
        set({
          bossBattle: {
            bossId: BOSS_CONFIG.id,
            bossName: BOSS_CONFIG.bossName,
            bossEmoji: BOSS_CONFIG.bossEmoji,
            bossMaxHp: BOSS_CONFIG.bossMaxHp,
            bossHp: BOSS_CONFIG.bossHp,
            playerMaxHp: BOSS_CONFIG.playerMaxHp,
            playerHp: BOSS_CONFIG.playerHp,
            questionIndex: 0,
            totalQuestions: BOSS_CONFIG.totalQuestions,
          },
        });
      },

      bossAnswer: (correct) => {
        const s = get();
        if (!s.bossBattle) return "ongoing";

        const battle = { ...s.bossBattle };
        if (correct) {
          battle.bossHp = Math.max(0, battle.bossHp - 15);
        } else {
          battle.playerHp = Math.max(0, battle.playerHp - 12);
        }
        battle.questionIndex += 1;

        if (battle.bossHp <= 0) {
          set({
            bossBattle: null,
            gameProfile: {
              ...s.gameProfile,
              bossStagesCleared: s.gameProfile.bossStagesCleared + 1,
            },
            gamesSinceBoss: 0,
          });
          return "victory";
        }
        if (battle.playerHp <= 0 || battle.questionIndex >= battle.totalQuestions) {
          set({ bossBattle: null });
          return battle.playerHp <= 0 ? "defeat" : "ongoing";
        }

        set({ bossBattle: battle });
        return "ongoing";
      },

      sendChallenge: (friendId, gameId) => {
        const s = get();
        const friend = s.friends.find((f) => f.id === friendId);
        if (!friend) return;

        const challenge: GameChallenge = {
          id: `ch-${Date.now()}`,
          challengerId: "local-user",
          challengerName: s.gameProfile.displayName,
          opponentId: friendId,
          opponentName: friend.name,
          gameId,
          status: "pending",
          challengerScore: 0,
          opponentScore: Math.floor(Math.random() * 80) + 20,
          createdAt: new Date().toISOString(),
        };
        set({ challenges: [...s.challenges, challenge] });
      },

      acceptChallenge: (challengeId) => {
        set((s) => ({
          challenges: s.challenges.map((c) =>
            c.id === challengeId ? { ...c, status: "completed" as const } : c
          ),
        }));
      },

      dismissLevelUp: () => set({ showLevelUp: false }),
      dismissAchievement: () => set({ showAchievement: null }),

      getEquippedTitle: () => {
        const s = get();
        if (!s.equipped.titleId) return null;
        return s.inventory.find((i) => i.catalogId === s.equipped.titleId)?.name ?? null;
      },

      getEquippedFrame: () => {
        const s = get();
        if (!s.equipped.profileFrameId) return null;
        return s.inventory.find((i) => i.catalogId === s.equipped.profileFrameId)?.emoji ?? null;
      },
    }),
    {
      name: "tef-arena-store",
      partialize: (state) => ({
        version: state.version,
        gameProfile: state.gameProfile,
        equipped: state.equipped,
        inventory: state.inventory,
        achievements: state.achievements,
        friends: state.friends,
        friendActivity: state.friendActivity,
        challenges: state.challenges,
        activeEvent: state.activeEvent,
        gamesSinceBoss: state.gamesSinceBoss,
      }),
    }
  )
);
