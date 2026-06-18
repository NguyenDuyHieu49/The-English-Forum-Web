import type { Locale } from "@/constants/app";
import { DEFAULT_LOCALE } from "@/constants/app";
import { FOCUS_AUTO_SNOOZE_MS } from "@/constants/focus";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FocusResult } from "@/types/focus";
import type { PetMood, Reward, UserStats } from "@/types/gamification";
import { MOCK_USER_STATS } from "@/mock/user";
import { DEFAULT_ENROLLED_COURSE_IDS, PET_FOOD_ITEMS } from "@/constants/gamification";

function moodFromEnergy(energy: number): PetMood {
  if (energy >= 90) return "ecstatic";
  if (energy >= 70) return "happy";
  if (energy >= 40) return "neutral";
  if (energy >= 20) return "sad";
  return "lonely";
}

interface AppState {
  sidebarCollapsed: boolean;
  focusMode: boolean;
  theme: "light" | "dark" | "system";
  focusResult: FocusResult | null;
  showDistractionModal: boolean;
  showReward: Reward | null;
  userStats: UserStats;
  enrolledCourseIds: string[];
  socialScrollStart: number | null;
  locale: Locale;
  focusAutoSnoozeUntil: number | null;

  toggleSidebar: () => void;
  setFocusMode: (enabled: boolean) => void;
  snoozeFocusAutoEnable: () => void;
  isFocusAutoSnoozeActive: () => boolean;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setFocusResult: (result: FocusResult | null) => void;
  setShowDistractionModal: (show: boolean) => void;
  setShowReward: (reward: Reward | null) => void;
  addReward: (reward: Reward) => void;
  buyPetFood: (foodId: string) => "success" | "insufficient_tokens" | "not_found";
  purchaseCourse: (courseId: string, price: number) => "success" | "insufficient_tokens" | "already_owned";
  isCourseEnrolled: (courseId: string) => boolean;
  setSocialScrollStart: (time: number | null) => void;
  setLocale: (locale: Locale) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      focusMode: false,
      theme: "system",
      focusResult: null,
      showDistractionModal: false,
      showReward: null,
      userStats: MOCK_USER_STATS,
      enrolledCourseIds: DEFAULT_ENROLLED_COURSE_IDS,
      socialScrollStart: null,
      locale: DEFAULT_LOCALE,
      focusAutoSnoozeUntil: null,

      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setFocusMode: (enabled) => {
        if (!enabled) {
          set({
            focusMode: false,
            focusAutoSnoozeUntil: Date.now() + FOCUS_AUTO_SNOOZE_MS,
          });
        } else {
          set({ focusMode: true });
        }
      },

      snoozeFocusAutoEnable: () =>
        set({
          focusAutoSnoozeUntil: Date.now() + FOCUS_AUTO_SNOOZE_MS,
          showDistractionModal: false,
        }),

      isFocusAutoSnoozeActive: () => {
        const until = get().focusAutoSnoozeUntil;
        return until !== null && Date.now() < until;
      },

      setTheme: (theme) => set({ theme }),

      setFocusResult: (result) => {
        set({ focusResult: result });
        if (get().isFocusAutoSnoozeActive()) return;
        if (
          result &&
          (result.state === "distracted" ||
            result.state === "sleepy" ||
            result.state === "away") &&
          !get().focusMode
        ) {
          set({ showDistractionModal: true });
        }
      },

      setShowDistractionModal: (show) => set({ showDistractionModal: show }),

      setShowReward: (reward) => set({ showReward: reward }),

      addReward: (reward) => {
        const stats = { ...get().userStats };
        if (reward.type === "tokens") stats.tokens += reward.amount;
        if (reward.type === "xp") stats.xp += reward.amount;
        set({ userStats: stats, showReward: reward });
      },

      buyPetFood: (foodId) => {
        const item = PET_FOOD_ITEMS.find((f) => f.id === foodId);
        if (!item) return "not_found";

        const stats = { ...get().userStats };
        if (stats.tokens < item.price) return "insufficient_tokens";

        const pet = { ...stats.pet };
        pet.energy = Math.min(100, pet.energy + item.energy);

        let experience = pet.experience + item.xp;
        let level = pet.level;
        while (experience >= 100) {
          experience -= 100;
          level += 1;
        }
        pet.experience = experience;
        pet.level = level;
        pet.evolutionStage = level >= 15 ? 3 : level >= 5 ? 2 : 1;
        pet.mood = moodFromEnergy(pet.energy);

        set({
          userStats: {
            ...stats,
            tokens: stats.tokens - item.price,
            pet,
          },
        });
        return "success";
      },

      purchaseCourse: (courseId, price) => {
        if (get().enrolledCourseIds.includes(courseId)) return "already_owned";

        const stats = { ...get().userStats };
        if (stats.tokens < price) return "insufficient_tokens";

        set({
          userStats: { ...stats, tokens: stats.tokens - price },
          enrolledCourseIds: [...get().enrolledCourseIds, courseId],
        });
        return "success";
      },

      isCourseEnrolled: (courseId) => get().enrolledCourseIds.includes(courseId),

      setSocialScrollStart: (time) => set({ socialScrollStart: time }),

      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "tef-store",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        userStats: state.userStats,
        enrolledCourseIds: state.enrolledCourseIds,
        locale: state.locale,
        focusAutoSnoozeUntil: state.focusAutoSnoozeUntil,
      }),
    }
  )
);
