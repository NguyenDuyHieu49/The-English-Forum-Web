"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SOCIAL_SCROLL_WARNING_MS } from "@/constants/focus";
import { useAppStore } from "@/store/app-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SocialScrollReminder() {
  const pathname = usePathname();
  const { socialScrollStart, setSocialScrollStart } = useAppStore();
  const { t } = useTranslation();
  const isSocial = pathname === "/social";

  useEffect(() => {
    if (!isSocial) {
      setSocialScrollStart(null);
      return;
    }

    setSocialScrollStart(Date.now());

    const handleScroll = () => setSocialScrollStart(Date.now());

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSocial, setSocialScrollStart]);

  const showWarning =
    isSocial &&
    socialScrollStart !== null &&
    Date.now() - socialScrollStart > SOCIAL_SCROLL_WARNING_MS;

  return (
    <Dialog open={showWarning} onOpenChange={() => setSocialScrollStart(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.focus.socialReminderTitle}</DialogTitle>
          <DialogDescription>{t.focus.socialReminderDesc}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setSocialScrollStart(Date.now())}
          >
            {t.focus.keepBrowsing}
          </Button>
          <Button className="flex-1" asChild>
            <Link href="/courses">{t.focus.backToCourses}</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
