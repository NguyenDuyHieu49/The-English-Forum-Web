"use client";

import { Bell, Flame, Focus, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const {
    focusMode,
    setFocusMode,
    userStats,
    focusResult,
    sidebarCollapsed,
  } = useAppStore();
  const { t } = useTranslation();

  if (focusMode) {
    return (
      <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Focus className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-medium text-muted-foreground">
            {t.focus.mode}
          </span>
        </div>
        <div className="flex items-center gap-6">
          {focusResult && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{t.focus.score}</span>
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums",
                  focusResult.score >= 80
                    ? "text-emerald-500"
                    : focusResult.score >= 60
                      ? "text-yellow-500"
                      : "text-red-500"
                )}
              >
                {focusResult.score}
              </span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => setFocusMode(false)}>
            {t.focus.exitMode}
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md transition-all duration-300",
        sidebarCollapsed ? "left-[72px]" : "left-[280px]"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
            {userStats.streak.daily} {t.gamification.dayStreak}
          </span>
        </div>
        {focusResult && (
          <div className="hidden items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 sm:flex">
            <Focus className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {t.home.focusScore}: {focusResult.score}%
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-2 hidden items-center gap-3 text-sm sm:flex">
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatNumber(userStats.xp)}
            </span>{" "}
            XP
          </span>
          <span className="text-muted-foreground">
            <span className="font-semibold text-violet-600 dark:text-violet-400">
              {userStats.tokens}
            </span>{" "}
            {t.common.tokens}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setFocusMode(true)}
          aria-label={t.focus.mode}
          title={t.focus.mode}
        >
          <Focus className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
