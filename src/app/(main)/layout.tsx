"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useFocusDetection } from "@/hooks/use-focus-detection";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useFocusDetection({ enabled: true });

  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
