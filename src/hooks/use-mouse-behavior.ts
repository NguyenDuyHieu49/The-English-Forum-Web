"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MouseBehaviorTracker } from "@/ml/mouse-behavior/tracker";
import type { MouseBehaviorMetrics } from "@/types/focus";

export function useMouseBehavior(enabled = true) {
  const trackerRef = useRef<MouseBehaviorTracker | null>(null);
  const [metrics, setMetrics] = useState<MouseBehaviorMetrics | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    trackerRef.current = new MouseBehaviorTracker();

    const handleMove = (e: MouseEvent) => {
      trackerRef.current?.track(e);
    };

    window.addEventListener("mousemove", handleMove);

    const interval = setInterval(() => {
      if (trackerRef.current) {
        const m = trackerRef.current.getMetrics();
        setMetrics(m);
        if (m.isSuspicious && m.randomMovementScore > 500) {
          setShowWarning(true);
        }
      }
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      clearInterval(interval);
      trackerRef.current?.reset();
    };
  }, [enabled]);

  const dismissWarning = useCallback(() => setShowWarning(false), []);

  return { metrics, showWarning, dismissWarning };
}
