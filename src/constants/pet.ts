import type { PetType } from "@/types/gamification";

/** Single consistent avatar per pet type — feeding does not change appearance */
export const PET_DISPLAY_EMOJI: Record<PetType, string> = {
  cat: "🐱",
  dog: "🐶",
  fox: "🦊",
  owl: "🦉",
  dragon: "🐉",
};

export function getPetDisplayEmoji(type: PetType): string {
  return PET_DISPLAY_EMOJI[type] ?? PET_DISPLAY_EMOJI.cat;
}
