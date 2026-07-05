export type GameId =
  | "word-hunter"
  | "sentence-builder"
  | "grammar-challenge"
  | "listening-quest"
  | "boss-battle";

export type ArenaRarity = "common" | "rare" | "epic" | "legendary";

export type CosmeticSlot =
  | "title"
  | "profile_frame"
  | "avatar_item"
  | "badge";

export type ArenaItemType =
  | "xp_boost"
  | "streak_shield"
  | "lucky_chest"
  | "profile_frame"
  | "avatar_item"
  | "title"
  | "badge"
  | "seasonal_reward";

export interface GameProfile {
  userId: string;
  displayName: string;
  city: string;
  country: string;
  coins: number;
  arenaXp: number;
  arenaLevel: number;
  gamesWon: number;
  gamesPlayed: number;
  achievementPoints: number;
  bossStagesCleared: number;
  currentBossId: string | null;
  lastDailyRewardDay: number;
  lastDailyRewardDate: string | null;
  dailyRewardStreak: number;
  createdAt: string;
  updatedAt: string;
}

export interface EquippedCosmetics {
  titleId: string | null;
  profileFrameId: string | null;
  avatarItemId: string | null;
  badgeId: string | null;
}

export interface ArenaInventoryItem {
  id: string;
  catalogId: string;
  type: ArenaItemType;
  name: string;
  description: string;
  rarity: ArenaRarity;
  emoji: string;
  quantity: number;
  equipped: boolean;
  obtainedAt: string;
  expiresAt?: string;
}

export interface ArenaAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "game" | "streak" | "social" | "boss" | "leaderboard";
  target: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
  rewardCoins: number;
  rewardItemCatalogId?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  city: string;
  arenaLevel: number;
  arenaXp: number;
  streak: number;
  online: boolean;
}

export interface FriendActivity {
  id: string;
  friendId: string;
  friendName: string;
  type: "achievement" | "level_up" | "boss_win" | "streak" | "challenge";
  message: string;
  timestamp: string;
}

export interface GameChallenge {
  id: string;
  challengerId: string;
  challengerName: string;
  opponentId: string;
  opponentName: string;
  gameId: GameId;
  status: "pending" | "active" | "completed";
  challengerScore: number;
  opponentScore: number;
  createdAt: string;
}

export interface BossBattleState {
  bossId: string;
  bossName: string;
  bossEmoji: string;
  bossMaxHp: number;
  bossHp: number;
  playerMaxHp: number;
  playerHp: number;
  questionIndex: number;
  totalQuestions: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  city: string;
  country: string;
  arenaLevel: number;
  arenaXp: number;
  streak: number;
  gamesWon: number;
  achievementPoints: number;
  isCurrentUser?: boolean;
}

export type LeaderboardScope = "global" | "country" | "city" | "weekly" | "monthly" | "all_time";

export interface GameSessionResult {
  gameId: GameId;
  score: number;
  maxScore: number;
  correct: number;
  total: number;
  combo: number;
  perfect: boolean;
  timeBonus: number;
  durationMs: number;
}

export interface GameRewardBreakdown {
  baseXp: number;
  comboBonus: number;
  perfectBonus: number;
  streakBonus: number;
  dailyBonus: number;
  totalXp: number;
  coins: number;
  leveledUp: boolean;
  newLevel?: number;
}

export interface DailyRewardConfig {
  day: number;
  coins?: number;
  itemCatalogId?: string;
  xpBoostHours?: number;
  label: string;
  emoji: string;
}

export interface ArenaItemCatalog {
  id: string;
  type: ArenaItemType;
  name: string;
  description: string;
  rarity: ArenaRarity;
  emoji: string;
  slot?: CosmeticSlot;
}

export interface ArenaAdminEvent {
  id: string;
  title: string;
  description: string;
  xpMultiplier: number;
  coinMultiplier: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export interface ArenaDatabase {
  version: number;
  gameProfile: GameProfile;
  equipped: EquippedCosmetics;
  inventory: ArenaInventoryItem[];
  achievements: ArenaAchievement[];
  friends: Friend[];
  friendActivity: FriendActivity[];
  challenges: GameChallenge[];
  bossBattle: BossBattleState | null;
  activeEvent: ArenaAdminEvent | null;
}
