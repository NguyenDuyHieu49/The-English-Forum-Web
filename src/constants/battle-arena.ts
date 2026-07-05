import type {
  Hero,
  HeroSkin,
  RankTier,
  ShopItem,
  SeasonInfo,
  LootRarity,
} from "@/types/battle-arena";

export const BATTLE_DB_VERSION = 2;
export const BATTLE_STORAGE_KEY = "tef-battle-arena-store";

export const MAX_HP = 100;
export const MAX_MANA = 100;
export const STUN_DURATION_MS = 2000;
export const ROUNDS_PER_MATCH = 10;
export const BASE_ATTACK_DAMAGE = 12;
export const ULTIMATE_MANA_COST = 100;
export const MATCHMAKING_TIMEOUT_MS = 60000;

export const RANK_TIERS: RankTier[] = [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "diamond",
  "master",
  "legend",
];

export const RANK_THRESHOLDS: Record<RankTier, number> = {
  bronze: 0,
  silver: 500,
  gold: 1000,
  platinum: 1500,
  diamond: 2000,
  master: 2500,
  legend: 3000,
};

export const RANK_META: Record<
  RankTier,
  { label: string; emoji: string; color: string }
> = {
  bronze: { label: "Bronze", emoji: "🥉", color: "from-amber-700 to-amber-900" },
  silver: { label: "Silver", emoji: "🥈", color: "from-slate-400 to-slate-600" },
  gold: { label: "Gold", emoji: "🥇", color: "from-yellow-400 to-amber-600" },
  platinum: { label: "Platinum", emoji: "💎", color: "from-cyan-400 to-blue-600" },
  diamond: { label: "Diamond", emoji: "💠", color: "from-sky-300 to-indigo-500" },
  master: { label: "Master", emoji: "👑", color: "from-purple-500 to-violet-700" },
  legend: { label: "Legend", emoji: "🔥", color: "from-red-500 to-orange-600" },
};

export const HEROES: Hero[] = [
  {
    id: "vocab-knight",
    name: "Vocabulary Knight",
    title: "Word Slayer",
    emoji: "⚔️",
    lore: "A noble warrior who wields the power of words. Each correct vocabulary answer strengthens his blade.",
    color: "from-emerald-500 to-teal-700",
    specialty: "vocabulary",
    baseHp: 100,
    baseMana: 80,
    passive: { id: "vk-passive", name: "Word Edge", description: "+10% damage on vocabulary questions", cooldownRounds: 0, damageMultiplier: 1.1 },
    ultimate: { id: "vk-ult", name: "Double Strike", description: "Double damage on next vocabulary hit", cooldownRounds: 4, damageMultiplier: 2 },
    unlockCost: 0,
    fragmentCost: 0,
  },
  {
    id: "grammar-wizard",
    name: "Grammar Wizard",
    title: "Syntax Sage",
    emoji: "🧙",
    lore: "Master of tenses and clauses. Time bends to his grammatical will.",
    color: "from-violet-500 to-purple-700",
    specialty: "grammar",
    baseHp: 90,
    baseMana: 100,
    passive: { id: "gw-passive", name: "Time Warp", description: "+3 seconds on grammar questions", cooldownRounds: 0, timeBonusMs: 3000 },
    ultimate: { id: "gw-ult", name: "Spell Blast", description: "Massive grammar damage blast", cooldownRounds: 5, damageMultiplier: 2.5 },
    unlockCost: 500,
    fragmentCost: 10,
  },
  {
    id: "listening-ninja",
    name: "Listening Ninja",
    title: "Silent Ear",
    emoji: "🥷",
    lore: "Moves like shadow, hears like thunder. No sound escapes his perception.",
    color: "from-slate-600 to-zinc-800",
    specialty: "listening",
    baseHp: 95,
    baseMana: 85,
    passive: { id: "ln-passive", name: "Quick Ear", description: "Faster listening playback", cooldownRounds: 0, timeBonusMs: 2000 },
    ultimate: { id: "ln-ult", name: "Critical Listen", description: "Critical hit on listening rounds", cooldownRounds: 4, damageMultiplier: 2.2 },
    unlockCost: 500,
    fragmentCost: 10,
  },
  {
    id: "sentence-samurai",
    name: "Sentence Samurai",
    title: "Blade of Order",
    emoji: "🗡️",
    lore: "Cuts through chaos to forge perfect sentences. Combo master of the arena.",
    color: "from-red-500 to-rose-700",
    specialty: "sentence",
    baseHp: 105,
    baseMana: 75,
    passive: { id: "ss-passive", name: "Combo Flow", description: "+2 bonus damage per combo", cooldownRounds: 0, damageMultiplier: 1.15 },
    ultimate: { id: "ss-ult", name: "Chain Slash", description: "Triple combo damage burst", cooldownRounds: 5, damageMultiplier: 3 },
    unlockCost: 750,
    fragmentCost: 15,
  },
  {
    id: "idiom-oracle",
    name: "Idiom Oracle",
    title: "Prophet of Phrases",
    emoji: "🔮",
    lore: "Sees meaning hidden in ancient expressions. Idioms are her prophecy.",
    color: "from-fuchsia-500 to-pink-700",
    specialty: "idioms",
    baseHp: 88,
    baseMana: 95,
    passive: { id: "io-passive", name: "Phrase Sight", description: "+15% idiom damage", cooldownRounds: 0, damageMultiplier: 1.15 },
    ultimate: { id: "io-ult", name: "Oracle Burst", description: "Reveal and strike with idiom power", cooldownRounds: 4, damageMultiplier: 2 },
    unlockCost: 750,
    fragmentCost: 15,
  },
  {
    id: "pronunciation-paladin",
    name: "Pronunciation Paladin",
    title: "Voice of Truth",
    emoji: "🛡️",
    lore: "Holy guardian of clear speech. Mispronunciation trembles before him.",
    color: "from-blue-500 to-indigo-700",
    specialty: "pronunciation",
    baseHp: 110,
    baseMana: 70,
    passive: { id: "pp-passive", name: "Clear Voice", description: "+8% all damage", cooldownRounds: 0, damageMultiplier: 1.08 },
    ultimate: { id: "pp-ult", name: "Sonic Shield", description: "Damage + self heal 15 HP", cooldownRounds: 6, damageMultiplier: 1.8 },
    unlockCost: 1000,
    fragmentCost: 20,
  },
  {
    id: "reading-ranger",
    name: "Reading Ranger",
    title: "Page Walker",
    emoji: "🏹",
    lore: "Tracks meaning through paragraphs. Reading comprehension is his hunting ground.",
    color: "from-green-500 to-lime-700",
    specialty: "reading",
    baseHp: 92,
    baseMana: 90,
    passive: { id: "rr-passive", name: "Sharp Focus", description: "+12% reading damage", cooldownRounds: 0, damageMultiplier: 1.12 },
    ultimate: { id: "rr-ult", name: "Piercing Shot", description: "Ignore stun, deal heavy reading damage", cooldownRounds: 5, damageMultiplier: 2.3 },
    unlockCost: 1000,
    fragmentCost: 20,
  },
  {
    id: "synonym-sorcerer",
    name: "Synonym Sorcerer",
    title: "Mirror Mage",
    emoji: "✨",
    lore: "Every word has a twin. He commands them all with arcane precision.",
    color: "from-amber-400 to-orange-600",
    specialty: "synonyms",
    baseHp: 85,
    baseMana: 110,
    passive: { id: "sy-passive", name: "Mirror Power", description: "+10% synonym damage + mana regen", cooldownRounds: 0, damageMultiplier: 1.1 },
    ultimate: { id: "sy-ult", name: "Twin Blast", description: "Double synonym strike", cooldownRounds: 4, damageMultiplier: 2.1 },
    unlockCost: 1200,
    fragmentCost: 25,
  },
  {
    id: "spelling-sentinel",
    name: "Spelling Sentinel",
    title: "Letter Guardian",
    emoji: "📝",
    lore: "Stands watch over every letter. One typo and enemies fall.",
    color: "from-cyan-500 to-teal-700",
    specialty: "vocabulary",
    baseHp: 100,
    baseMana: 80,
    passive: { id: "sp-passive", name: "Perfect Script", description: "+5% damage per correct streak", cooldownRounds: 0, damageMultiplier: 1.05 },
    ultimate: { id: "sp-ult", name: "Letter Storm", description: "AoE spelling devastation", cooldownRounds: 5, damageMultiplier: 2.4 },
    unlockCost: 1200,
    fragmentCost: 25,
  },
  {
    id: "combo-crusader",
    name: "Combo Crusader",
    title: "Unstoppable Force",
    emoji: "💥",
    lore: "Feeds on momentum. The longer the streak, the harder the blow.",
    color: "from-orange-500 to-red-700",
    specialty: "grammar",
    baseHp: 115,
    baseMana: 65,
    passive: { id: "cc-passive", name: "Momentum", description: "+3 damage per combo stack", cooldownRounds: 0 },
    ultimate: { id: "cc-ult", name: "Crusade Fury", description: "Unleash all combo damage at once", cooldownRounds: 6, damageMultiplier: 3.5 },
    unlockCost: 1500,
    fragmentCost: 30,
  },
];

export const HERO_SKINS: HeroSkin[] = [
  { id: "vk-skin-gold", heroId: "vocab-knight", name: "Golden Knight", emoji: "🛡️", rarity: "legendary", description: "Shining armor of champions", price: 2000 },
  { id: "vk-skin-shadow", heroId: "vocab-knight", name: "Shadow Blade", emoji: "🌑", rarity: "epic", description: "Dark vocabulary warrior", price: 800 },
  { id: "gw-skin-arcane", heroId: "grammar-wizard", name: "Arcane Robes", emoji: "🌟", rarity: "epic", description: "Mystical grammar master", price: 800 },
  { id: "gw-skin-cosmic", heroId: "grammar-wizard", name: "Cosmic Sage", emoji: "🌌", rarity: "mythic", description: "Universe-bending syntax", price: 3500 },
  { id: "ln-skin-stealth", heroId: "listening-ninja", name: "Stealth Suit", emoji: "👤", rarity: "rare", description: "Invisible listener", price: 500 },
  { id: "ss-skin-sakura", heroId: "sentence-samurai", name: "Sakura Blade", emoji: "🌸", rarity: "legendary", description: "Cherry blossom warrior", price: 2000 },
  { id: "io-skin-mystic", heroId: "idiom-oracle", name: "Mystic Veil", emoji: "🎭", rarity: "epic", description: "Prophetic elegance", price: 900 },
  { id: "pp-skin-holy", heroId: "pronunciation-paladin", name: "Holy Armor", emoji: "✝️", rarity: "legendary", description: "Divine pronunciation", price: 2200 },
  { id: "cc-skin-inferno", heroId: "combo-crusader", name: "Inferno Plate", emoji: "🔥", rarity: "mythic", description: "Burning combo fury", price: 4000 },
  { id: "sy-skin-prism", heroId: "synonym-sorcerer", name: "Prism Robe", emoji: "🌈", rarity: "epic", description: "Rainbow word magic", price: 850 },
];

export const SHOP_ITEMS: ShopItem[] = [
  ...HERO_SKINS.map((s) => ({
    id: `shop-${s.id}`,
    type: "hero_skin" as const,
    name: s.name,
    description: s.description,
    rarity: s.rarity,
    emoji: s.emoji,
    priceCoins: s.price,
    priceBattlePoints: Math.floor(s.price / 2),
    heroId: s.heroId,
  })),
  { id: "shop-frame-legend", type: "avatar_frame", name: "Legend Frame", description: "Exclusive legendary border", rarity: "legendary" as LootRarity, emoji: "🖼️", priceCoins: 1500, priceBattlePoints: 750 },
  { id: "shop-frame-mythic", type: "avatar_frame", name: "Mythic Frame", description: "Mythic rainbow frame", rarity: "mythic" as LootRarity, emoji: "💫", priceCoins: 3000, priceBattlePoints: 1500 },
  { id: "shop-title-champion", type: "title", name: "Arena Champion", description: "Prove your dominance", rarity: "epic" as LootRarity, emoji: "🏆", priceCoins: 600, priceBattlePoints: 300 },
  { id: "shop-title-undefeated", type: "title", name: "Undefeated", description: "For the fearless", rarity: "legendary" as LootRarity, emoji: "⚡", priceCoins: 1200, priceBattlePoints: 600 },
  { id: "shop-emote-gg", type: "emote", name: "GG Wave", description: "Good game emote", rarity: "common" as LootRarity, emoji: "👋", priceCoins: 100, priceBattlePoints: 50 },
  { id: "shop-emote-fire", type: "emote", name: "On Fire", description: "You're unstoppable!", rarity: "rare" as LootRarity, emoji: "🔥", priceCoins: 250, priceBattlePoints: 125 },
  { id: "shop-victory-fireworks", type: "victory_effect", name: "Fireworks", description: "Victory celebration", rarity: "epic" as LootRarity, emoji: "🎆", priceCoins: 800, priceBattlePoints: 400 },
  { id: "shop-battle-slash", type: "battle_animation", name: "Lightning Slash", description: "Epic attack animation", rarity: "epic" as LootRarity, emoji: "⚡", priceCoins: 700, priceBattlePoints: 350 },
  { id: "shop-xp-boost-2h", type: "xp_booster", name: "XP Booster 2h", description: "+100% XP for 2 hours", rarity: "rare" as LootRarity, emoji: "📈", priceCoins: 300, priceBattlePoints: 150 },
  { id: "shop-chest-epic", type: "chest", name: "Epic Battle Chest", description: "Guaranteed epic+ loot", rarity: "epic" as LootRarity, emoji: "📦", priceCoins: 500, priceBattlePoints: 250 },
  { id: "shop-chest-legendary", type: "chest", name: "Legendary Chest", description: "Chance for mythic drops", rarity: "legendary" as LootRarity, emoji: "🎁", priceCoins: 1000, priceBattlePoints: 500 },
];

export const LOOT_DROP_RATES: Record<LootRarity, number> = {
  common: 0.45,
  rare: 0.30,
  epic: 0.15,
  legendary: 0.08,
  mythic: 0.02,
};

export const MATCHMAKING_TIPS = [
  "Answer quickly to attack first!",
  "Wrong answers stun you for 2 seconds.",
  "Build combo for bonus damage.",
  "Use your ultimate when mana is full.",
  "Each hero has a specialty category.",
  "Ranked matches affect your tier.",
  "Win streaks earn bonus battle points.",
  "Practice in Casual mode first!",
  "Listen carefully on audio questions.",
  "Equip skins to stand out in VS screen.",
];

export const ENGLISH_TIPS = [
  "Did you know? 'Queue' is the only word with 5 vowels in a row!",
  "The word 'set' has the most definitions in English.",
  "English has over 170,000 words in current use.",
  "'Rhythm' is the longest word without a vowel.",
  "Practice 15 minutes daily for best results!",
  "'I am' is the shortest complete sentence.",
  "Over 1.5 billion people speak English worldwide.",
  "'Dreamt' is the only word ending in 'mt'.",
];

export const CURRENT_SEASON: SeasonInfo = {
  id: "season-1",
  name: "Season 1: Word Wars",
  startsAt: "2026-01-01T00:00:00.000Z",
  endsAt: "2026-01-31T00:00:00.000Z",
  battlePassPremiumCost: 500,
  freeRewards: [
    { tier: 1, xpRequired: 100, itemCatalogId: "shop-emote-gg", name: "GG Wave", emoji: "👋", rarity: "common", premium: false },
    { tier: 2, xpRequired: 300, itemCatalogId: "shop-xp-boost-2h", name: "XP Booster", emoji: "📈", rarity: "rare", premium: false },
    { tier: 3, xpRequired: 600, itemCatalogId: "shop-frame-legend", name: "Silver Frame", emoji: "✨", rarity: "rare", premium: false },
    { tier: 4, xpRequired: 1000, itemCatalogId: "shop-chest-epic", name: "Epic Chest", emoji: "📦", rarity: "epic", premium: false },
    { tier: 5, xpRequired: 1500, itemCatalogId: "shop-title-champion", name: "Rising Star", emoji: "⭐", rarity: "epic", premium: false },
  ],
  premiumRewards: [
    { tier: 1, xpRequired: 100, itemCatalogId: "vk-skin-shadow", name: "Shadow Blade", emoji: "🌑", rarity: "epic", premium: true },
    { tier: 2, xpRequired: 300, itemCatalogId: "shop-emote-fire", name: "On Fire", emoji: "🔥", rarity: "rare", premium: true },
    { tier: 3, xpRequired: 600, itemCatalogId: "gw-skin-arcane", name: "Arcane Robes", emoji: "🌟", rarity: "epic", premium: true },
    { tier: 4, xpRequired: 1000, itemCatalogId: "shop-victory-fireworks", name: "Fireworks", emoji: "🎆", rarity: "epic", premium: true },
    { tier: 5, xpRequired: 1500, itemCatalogId: "gw-skin-cosmic", name: "Cosmic Sage", emoji: "🌌", rarity: "mythic", premium: true },
  ],
};

export function tierFromPoints(points: number): RankTier {
  let tier: RankTier = "bronze";
  for (const t of RANK_TIERS) {
    if (points >= RANK_THRESHOLDS[t]) tier = t;
  }
  return tier;
}

export function getHero(id: string): Hero | undefined {
  return HEROES.find((h) => h.id === id);
}

export function getHeroSkin(id: string): HeroSkin | undefined {
  return HERO_SKINS.find((s) => s.id === id);
}
