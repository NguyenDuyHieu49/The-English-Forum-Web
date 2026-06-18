"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Copy, Languages, Volume2, X } from "lucide-react";
import { useReadingAssistant } from "@/hooks/use-reading-assistant";
import { useTranslation } from "@/hooks/use-translation";
import { CEFR_LEVEL_COLORS } from "@/services/word-level";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReadingAssistant() {
  const { state, lookup, translate, copy, close } = useReadingAssistant();
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {state.visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          style={{
            position: "fixed",
            left: state.x,
            top: state.y,
            transform: "translate(-50%, -100%)",
            zIndex: 9999,
          }}
          className="rounded-xl border border-border bg-card p-2 shadow-2xl"
        >
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={lookup} disabled={state.loading}>
              <BookOpen className="mr-1 h-3.5 w-3.5" />
              {t.reading.dictionary}
            </Button>
            <Button variant="ghost" size="sm" onClick={translate} disabled={state.loading}>
              <Languages className="mr-1 h-3.5 w-3.5" />
              {t.reading.translate}
            </Button>
            <Button variant="ghost" size="sm" onClick={copy}>
              <Copy className="mr-1 h-3.5 w-3.5" />
              {t.reading.copy}
            </Button>
            <Button variant="ghost" size="icon" onClick={close} className="h-8 w-8">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {(state.definition || state.translation) && (
            <div className="mt-2 max-w-xs border-t border-border px-2 pt-2">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {state.level && (
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      CEFR_LEVEL_COLORS[state.level]
                    )}
                  >
                    {t.reading.level}: {state.level}
                  </span>
                )}
              </div>
              {state.pronunciation && (
                <p className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Volume2 className="h-3 w-3" />
                  {state.pronunciation}
                </p>
              )}
              {state.definition && <p className="text-sm">{state.definition}</p>}
              {state.synonyms && state.synonyms.length > 0 && (
                <div className="mt-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {t.reading.synonyms}
                  </p>
                  <p className="mt-0.5 text-sm text-violet-600 dark:text-violet-400">
                    {state.synonyms.join(", ")}
                  </p>
                </div>
              )}
              {state.definition && state.synonyms?.length === 0 && (
                <p className="mt-2 text-xs text-muted-foreground">{t.reading.noSynonyms}</p>
              )}
              {state.translation && (
                <p className="mt-1 text-sm text-violet-600 dark:text-violet-400">
                  {state.translation}
                </p>
              )}
              {state.examples?.map((ex, i) => (
                <p key={i} className="mt-1 text-xs italic text-muted-foreground">
                  &ldquo;{ex}&rdquo;
                </p>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
