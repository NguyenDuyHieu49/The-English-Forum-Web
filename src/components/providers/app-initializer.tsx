"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const focusMode = useAppStore((s) => s.focusMode);
  const locale = useAppStore((s) => s.locale);

  useEffect(() => {
    document.documentElement.classList.toggle("focus-mode", focusMode);
  }, [focusMode]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <>{children}</>;
}
