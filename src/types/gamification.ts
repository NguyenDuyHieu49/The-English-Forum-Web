export type RewardType = "tokens" | "xp" | "pet_food" | "decoration" | "badge" | "lucky_box";

export interface PetFoodItem {
  id: string;
  nameKey: "salmon" | "tuna" | "milk" | "premium";
  price: number;
  emoji: string;
  energy: number;
  xp: number;
}

export type PetType = "cat" | "dog" | "fox" | "owl" | "dragon";

export type PetMood = "ecstatic" | "happy" | "neutral" | "sad" | "lonely";

export interface Reward {
  id: string;
  type: RewardType;
  amount: number;
  label: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Streak {
  daily: number;
  weekly: number;
  monthly: number;
  lastActiveDate: string;
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  level: number;
  experience: number;
  mood: PetMood;
  energy: number;
  evolutionStage: number;
}

export interface UserStats {
  xp: number;
  level: number;
  tokens: number;
  learningHours: number;
  focusScore: number;
  streak: Streak;
  achievements: Achievement[];
  pet: Pet;
}
