"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Bell, Camera, Globe, LogOut, Mic, Shield, Accessibility } from "lucide-react";
import type { Locale } from "@/constants/app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import { isFirebaseConfigured, logout } from "@/services/firebase";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { focusMode, setFocusMode, locale, setLocale } = useAppStore();
  const { t } = useTranslation();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      if (isFirebaseConfigured()) {
        await logout();
      }
      router.replace("/login");
    } catch {
      setLoggingOut(false);
    }
  };

  const settingsGroups = [
    {
      title: t.settings.appearance,
      icon: Globe,
      items: [
        {
          label: t.settings.darkMode,
          description: t.settings.darkModeDesc,
          checked: theme === "dark",
          onChange: (v: boolean) => setTheme(v ? "dark" : "light"),
        },
        {
          label: t.settings.focusMode,
          description: t.settings.focusModeDesc,
          checked: focusMode,
          onChange: setFocusMode,
        },
      ],
    },
    {
      title: t.settings.notifications,
      icon: Bell,
      items: [
        {
          label: t.settings.pushNotifications,
          description: t.settings.pushDesc,
          checked: true,
          onChange: () => {},
        },
        {
          label: t.settings.dailyReminders,
          description: t.settings.dailyRemindersDesc,
          checked: true,
          onChange: () => {},
        },
      ],
    },
    {
      title: t.settings.permissions,
      icon: Camera,
      items: [
        {
          label: t.settings.cameraAccess,
          description: t.settings.cameraDesc,
          checked: true,
          onChange: () => {},
        },
        {
          label: t.settings.micAccess,
          description: t.settings.micDesc,
          checked: false,
          onChange: () => {},
        },
      ],
    },
    {
      title: t.settings.privacy,
      icon: Shield,
      items: [
        {
          label: t.settings.onlineStatus,
          description: t.settings.onlineStatusDesc,
          checked: true,
          onChange: () => {},
        },
        {
          label: t.settings.shareProgress,
          description: t.settings.shareProgressDesc,
          checked: false,
          onChange: () => {},
        },
      ],
    },
    {
      title: t.settings.accessibility,
      icon: Accessibility,
      items: [
        {
          label: t.settings.reduceMotion,
          description: t.settings.reduceMotionDesc,
          checked: false,
          onChange: () => {},
        },
        {
          label: t.settings.highContrast,
          description: t.settings.highContrastDesc,
          checked: false,
          onChange: () => {},
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">{t.settings.title}</h1>
        <p className="mt-1 text-muted-foreground">{t.settings.subtitle}</p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-violet-500" />
            {t.settings.language}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">{t.settings.languageDesc}</p>
          <div className="flex gap-2">
            {(["vi", "en"] as Locale[]).map((lang) => (
              <Button
                key={lang}
                variant={locale === lang ? "default" : "outline"}
                onClick={() => setLocale(lang)}
                className="flex-1"
              >
                {lang === "vi" ? t.settings.vietnamese : t.settings.english}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {settingsGroups.map((group, gi) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.05 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <group.icon className="h-4 w-4 text-violet-500" />
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <Label>{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch checked={item.checked} onCheckedChange={item.onChange} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <Card>
        <CardContent className={cn("p-4 text-center text-sm text-muted-foreground")}>
          <Mic className="mx-auto mb-2 h-5 w-5" />
          {t.settings.currentLanguage}
        </CardContent>
      </Card>

      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <LogOut className="h-4 w-4 text-red-500" />
            {t.settings.account}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{t.settings.logoutDesc}</p>
          <Button
            variant="destructive"
            className="w-full"
            disabled={loggingOut}
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {loggingOut ? t.settings.loggingOut : t.settings.logout}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
