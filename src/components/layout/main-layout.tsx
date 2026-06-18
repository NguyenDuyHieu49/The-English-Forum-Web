"use client";

import { useAppStore } from "@/store/app-store";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { DistractionModal } from "@/components/focus/distraction-modal";
import { RewardPopup } from "@/components/gamification/reward-popup";
import { ReadingAssistant } from "@/components/reading/reading-assistant";
import { SocialScrollReminder } from "@/components/layout/social-scroll-reminder";
import { cn } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, focusMode } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300",
          focusMode ? "pl-0" : sidebarCollapsed ? "pl-[72px]" : "pl-[280px]"
        )}
      >
        <div className={cn("p-6", focusMode && "p-8 pt-20")}>{children}</div>
      </main>
      <DistractionModal />
      <RewardPopup />
      <ReadingAssistant />
      <SocialScrollReminder />
    </div>
  );
}
