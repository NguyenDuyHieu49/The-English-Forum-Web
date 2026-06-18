"use client";

import { useMouseBehavior } from "@/hooks/use-mouse-behavior";
import { useTranslation } from "@/hooks/use-translation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MouseBehaviorWarningProps {
  enabled?: boolean;
}

export function MouseBehaviorWarning({ enabled = true }: MouseBehaviorWarningProps) {
  const { showWarning, dismissWarning } = useMouseBehavior(enabled);
  const { t } = useTranslation();

  return (
    <Dialog open={showWarning} onOpenChange={dismissWarning}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.focus.refocusTitle}</DialogTitle>
          <DialogDescription>{t.focus.refocusDesc}</DialogDescription>
        </DialogHeader>
        <Button onClick={dismissWarning} className="w-full">
          {t.focus.refocusBtn}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
