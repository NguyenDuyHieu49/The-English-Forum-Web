"use client";

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

export function DistractionModal() {
  const { showDistractionModal, setShowDistractionModal, setFocusMode, snoozeFocusAutoEnable } =
    useAppStore();
  const { t } = useTranslation();

  return (
    <Dialog open={showDistractionModal} onOpenChange={setShowDistractionModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.focus.attentionCheck}</DialogTitle>
          <DialogDescription>{t.focus.attentionDesc}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => snoozeFocusAutoEnable()}
          >
            {t.focus.continueLearning}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setFocusMode(true);
              setShowDistractionModal(false);
            }}
          >
            {t.focus.enableFocusMode}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
