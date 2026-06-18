"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { isFirebaseConfigured } from "@/services/firebase";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, isConfigured } = useAuth();

  useEffect(() => {
    if (!loading && isConfigured && !user) {
      router.replace("/login");
    }
  }, [user, loading, isConfigured, router]);

  if (loading && isConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (isConfigured && !user) {
    return null;
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, isConfigured } = useAuth();

  useEffect(() => {
    if (!loading && isConfigured && user) {
      router.replace("/");
    }
    if (!loading && !isConfigured) {
      // Demo mode — skip login, go straight to app
      router.replace("/");
    }
  }, [user, loading, isConfigured, router]);

  if (loading && isConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (isConfigured && user) {
    return null;
  }

  if (!isConfigured) {
    return null;
  }

  return <>{children}</>;
}
