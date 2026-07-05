import type {
  ArenaAchievement,
  ArenaDatabase,
  ArenaInventoryItem,
  Friend,
  FriendActivity,
} from "@/types/arena";
import { ARENA_ITEM_CATALOG, ARENA_ACHIEVEMENTS_SEED } from "@/constants/arena";

function starterInventory(): ArenaInventoryItem[] {
  const shield = ARENA_ITEM_CATALOG.find((i) => i.id === "streak-shield")!;
  const boost = ARENA_ITEM_CATALOG.find((i) => i.id === "xp-boost-1h")!;
  return [
    {
      id: "inv-starter-shield",
      catalogId: shield.id,
      type: shield.type,
      name: shield.name,
      description: shield.description,
      rarity: shield.rarity,
      emoji: shield.emoji,
      quantity: 1,
      equipped: false,
      obtainedAt: new Date().toISOString(),
    },
    {
      id: "inv-starter-boost",
      catalogId: boost.id,
      type: boost.type,
      name: boost.name,
      description: boost.description,
      rarity: boost.rarity,
      emoji: boost.emoji,
      quantity: 2,
      equipped: false,
      obtainedAt: new Date().toISOString(),
    },
  ];
}

function seedAchievements(): ArenaAchievement[] {
  return ARENA_ACHIEVEMENTS_SEED.map((a) => ({
    ...a,
    progress: a.id === "first-victory" ? 0 : 0,
    unlocked: false,
  }));
}

function seedFriends(): Friend[] {
  return [
    {
      id: "f1",
      name: "Alex Nguyen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexN",
      city: "Hanoi",
      arenaLevel: 18,
      arenaXp: 17200,
      streak: 12,
      online: true,
    },
    {
      id: "f2",
      name: "Maria Santos",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      city: "Ho Chi Minh City",
      arenaLevel: 22,
      arenaXp: 24100,
      streak: 21,
      online: false,
    },
    {
      id: "f3",
      name: "Tom Baker",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
      city: "Hanoi",
      arenaLevel: 14,
      arenaXp: 12800,
      streak: 5,
      online: true,
    },
  ];
}

function seedFriendActivity(): FriendActivity[] {
  return [
    {
      id: "fa1",
      friendId: "f1",
      friendName: "Alex Nguyen",
      type: "boss_win",
      message: "defeated Grammar Dragon!",
      timestamp: "2h ago",
    },
    {
      id: "fa2",
      friendId: "f2",
      friendName: "Maria Santos",
      type: "streak",
      message: "reached a 21-day streak!",
      timestamp: "5h ago",
    },
    {
      id: "fa3",
      friendId: "f3",
      friendName: "Tom Baker",
      type: "achievement",
      message: "unlocked Vocabulary King!",
      timestamp: "1d ago",
    },
  ];
}

export function seedArenaDatabase(db: ArenaDatabase): ArenaDatabase {
  return {
    ...db,
    version: 1,
    gameProfile: {
      ...db.gameProfile,
      coins: 250,
      arenaXp: 1200,
      arenaLevel: 5,
      gamesWon: 8,
      gamesPlayed: 15,
      achievementPoints: 120,
      bossStagesCleared: 2,
      dailyRewardStreak: 3,
      lastDailyRewardDay: 3,
      lastDailyRewardDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    },
    inventory: starterInventory(),
    achievements: seedAchievements(),
    friends: seedFriends(),
    friendActivity: seedFriendActivity(),
    activeEvent: {
      id: "evt-spring",
      title: "Spring Learning Festival",
      description: "Double coins on all arena games!",
      xpMultiplier: 1.25,
      coinMultiplier: 2,
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      active: true,
    },
  };
}
