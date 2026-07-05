export type RankTier =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master"
  | "legend";

export type MatchMode = "casual" | "ranked";

export type BattleRegion = "asia" | "europe" | "america" | "worldwide";

export type QuestionCategory =
  | "vocabulary"
  | "grammar"
  | "listening"
  | "reading"
  | "idioms"
  | "pronunciation"
  | "sentence"
  | "synonyms";

export type QuestionDifficulty = "beginner" | "intermediate" | "advanced";

export type LootRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export type BattleItemType =
  | "hero_skin"
  | "avatar_frame"
  | "title"
  | "emote"
  | "victory_effect"
  | "battle_animation"
  | "xp_booster"
  | "chest"
  | "hero_fragment"
  | "badge";

export type BattleCosmeticSlot =
  | "hero"
  | "skin"
  | "title"
  | "frame"
  | "battle_intro"
  | "victory_animation"
  | "emote";

export type MatchPhase =
  | "idle"
  | "queue"
  | "match_found"
  | "loading"
  | "battle"
  | "victory"
  | "defeat";

export type BattleEventType =
  | "attack"
  | "stun"
  | "ultimate"
  | "round_start"
  | "round_end"
  | "match_end";

export interface HeroSkill {
  id: string;
  name: string;
  description: string;
  cooldownRounds: number;
  damageMultiplier?: number;
  timeBonusMs?: number;
}

export interface Hero {
  id: string;
  name: string;
  title: string;
  emoji: string;
  lore: string;
  color: string;
  specialty: QuestionCategory;
  baseHp: number;
  baseMana: number;
  passive: HeroSkill;
  ultimate: HeroSkill;
  unlockCost: number;
  fragmentCost: number;
}

export interface HeroSkin {
  id: string;
  heroId: string;
  name: string;
  emoji: string;
  rarity: LootRarity;
  description: string;
  price: number;
}

export interface PlayerHero {
  heroId: string;
  level: number;
  fragments: number;
  unlocked: boolean;
  equippedSkinId: string | null;
}

export interface BattleEquippedCosmetics {
  heroId: string;
  skinId: string | null;
  titleId: string | null;
  frameId: string | null;
  battleIntroId: string | null;
  victoryAnimationId: string | null;
  emoteId: string | null;
}

export interface BattleInventoryItem {
  id: string;
  catalogId: string;
  type: BattleItemType;
  name: string;
  description: string;
  rarity: LootRarity;
  emoji: string;
  quantity: number;
  heroId?: string;
  obtainedAt: string;
}

export interface ShopItem {
  id: string;
  type: BattleItemType;
  name: string;
  description: string;
  rarity: LootRarity;
  emoji: string;
  priceCoins: number;
  priceBattlePoints: number;
  heroId?: string;
  seasonOnly?: boolean;
}

export interface RankedProfile {
  userId: string;
  displayName: string;
  avatar: string;
  country: string;
  city: string;
  rankTier: RankTier;
  rankPoints: number;
  wins: number;
  losses: number;
  winStreak: number;
  bestStreak: number;
  highestTier: RankTier;
  battlePoints: number;
  coins: number;
  seasonXp: number;
  seasonId: string;
  region: BattleRegion;
  updatedAt: string;
}

export interface SeasonInfo {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  battlePassPremiumCost: number;
  freeRewards: SeasonReward[];
  premiumRewards: SeasonReward[];
}

export interface SeasonReward {
  tier: number;
  xpRequired: number;
  itemCatalogId: string;
  name: string;
  emoji: string;
  rarity: LootRarity;
  premium: boolean;
}

export interface BattleQuestion {
  id: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  text: string;
  audioText?: string;
  choices: { id: string; text: string }[];
  correctId: string;
  timeLimitMs: number;
}

export interface BattlePlayerState {
  userId: string;
  userName: string;
  avatar: string;
  country: string;
  city: string;
  heroId: string;
  skinId: string | null;
  titleId: string | null;
  frameId: string | null;
  rankTier: RankTier;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  stunnedUntil: number;
  combo: number;
  socketId: string;
}

export interface BattleRound {
  roundIndex: number;
  question: BattleQuestion;
  answeredBy: string | null;
  correctAnswer: boolean | null;
  startedAt: number;
  endsAt: number;
}

export interface BattleEvent {
  id: string;
  matchId: string;
  type: BattleEventType;
  actorId: string;
  targetId?: string;
  damage?: number;
  roundIndex: number;
  timestamp: string;
}

export interface BattleMatch {
  id: string;
  mode: MatchMode;
  region: BattleRegion;
  phase: MatchPhase;
  players: [BattlePlayerState, BattlePlayerState];
  currentRound: BattleRound | null;
  roundHistory: BattleRound[];
  events: BattleEvent[];
  winnerId: string | null;
  startedAt: string;
  endedAt: string | null;
}

export interface MatchmakingEntry {
  userId: string;
  userName: string;
  avatar: string;
  country: string;
  city: string;
  heroId: string;
  skinId: string | null;
  rankTier: RankTier;
  rankPoints: number;
  mode: MatchMode;
  region: BattleRegion;
  socketId: string;
  queuedAt: number;
}

export interface BattleReward {
  xp: number;
  coins: number;
  battlePoints: number;
  rankPointsChange: number;
  loot: BattleInventoryItem[];
  chestDropped: boolean;
}

export interface BattleLeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  country: string;
  city: string;
  heroId: string;
  rankTier: RankTier;
  rankPoints: number;
  wins: number;
  winRate: number;
  winStreak: number;
  highestTier: RankTier;
  isCurrentUser?: boolean;
}

export type BattleLeaderboardScope =
  | "global"
  | "country"
  | "city"
  | "hero"
  | "season";

export interface BattleDatabase {
  version: number;
  rankedProfile: RankedProfile;
  playerHeroes: PlayerHero[];
  equipped: BattleEquippedCosmetics;
  inventory: BattleInventoryItem[];
  battlePassPremium: boolean;
  battlePassTier: number;
  recentQuestionIds: string[];
  matchHistory: { matchId: string; won: boolean; mode: MatchMode; at: string }[];
}

// Socket event payloads
export interface QueueJoinPayload {
  userId: string;
  userName: string;
  avatar: string;
  country: string;
  city: string;
  heroId: string;
  skinId: string | null;
  rankTier: RankTier;
  rankPoints: number;
  mode: MatchMode;
  region: BattleRegion;
}

export interface AnswerPayload {
  matchId: string;
  roundIndex: number;
  choiceId: string;
  clientTimestamp: number;
}

export interface UltimatePayload {
  matchId: string;
}
