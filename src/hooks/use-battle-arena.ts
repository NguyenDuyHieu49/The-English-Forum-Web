"use client";

import { useBattleSocket } from "./use-battle-socket";
import { useLocalBotBattle } from "./use-local-bot-battle";
import { useEffect, useState } from "react";

const WS_URL = process.env.NEXT_PUBLIC_BATTLE_WS_URL ?? "http://localhost:3001";

async function checkServerAvailable(): Promise<boolean> {
  try {
    const res = await fetch(WS_URL, { signal: AbortSignal.timeout(2000) });
    const data = await res.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}

export function useBattleArena() {
  const socket = useBattleSocket();
  const localBot = useLocalBotBattle();
  const [useLocal, setUseLocal] = useState<boolean | null>(null);

  useEffect(() => {
    checkServerAvailable().then((available) => {
      setUseLocal(!available);
    });
  }, []);

  if (useLocal === null) {
    return { ...localBot, isLocalMode: true, serverChecking: true };
  }

  if (useLocal) {
    return { ...localBot, isLocalMode: true, serverChecking: false };
  }

  return { ...socket, isLocalMode: false, serverChecking: false };
}
