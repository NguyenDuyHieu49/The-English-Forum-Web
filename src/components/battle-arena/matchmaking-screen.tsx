"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MATCHMAKING_TIPS } from "@/constants/battle-arena";
import { Button } from "@/components/ui/button";
import { Users, Loader2 } from "lucide-react";

interface MatchmakingScreenProps {
  onlineCount: number;
  estimatedWait: number;
  onCancel: () => void;
}

export function MatchmakingScreen({ onlineCount, estimatedWait, onCancel }: MatchmakingScreenProps) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % MATCHMAKING_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8 p-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        className="relative"
      >
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-800 shadow-2xl shadow-violet-500/30">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -inset-4 rounded-full border-2 border-violet-500/30"
        />
      </motion.div>

      <div className="text-center">
        <h2 className="text-2xl font-black text-foreground">Searching for an opponent...</h2>
        <p className="mt-2 text-muted-foreground">Estimated wait: ~{estimatedWait}s</p>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-sm">
        <Users className="h-4 w-4 text-emerald-500" />
        <span>{onlineCount.toLocaleString()} players online</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={tipIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="max-w-md text-center text-sm text-muted-foreground"
        >
          💡 {MATCHMAKING_TIPS[tipIndex]}
        </motion.p>
      </AnimatePresence>

      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
