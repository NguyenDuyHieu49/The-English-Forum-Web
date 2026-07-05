import type { MatchmakingEntry, MatchMode, BattleRegion, QueueJoinPayload } from "./types";
import { MATCHMAKING_TIMEOUT_MS } from "../src/constants/battle-arena";

const casualQueue: MatchmakingEntry[] = [];
const rankedQueue: MatchmakingEntry[] = [];

function ratingDistance(a: number, b: number): number {
  return Math.abs(a - b);
}

function regionMatch(a: BattleRegion, b: BattleRegion): boolean {
  if (a === "worldwide" || b === "worldwide") return true;
  return a === b;
}

export function addToQueue(payload: QueueJoinPayload, socketId: string): MatchmakingEntry {
  const entry: MatchmakingEntry = {
    ...payload,
    socketId,
    queuedAt: Date.now(),
  };

  removeFromQueue(payload.userId);

  if (payload.mode === "ranked") {
    rankedQueue.push(entry);
  } else {
    casualQueue.push(entry);
  }

  return entry;
}

export function removeFromQueue(userId: string): void {
  const cIdx = casualQueue.findIndex((e) => e.userId === userId);
  if (cIdx >= 0) casualQueue.splice(cIdx, 1);
  const rIdx = rankedQueue.findIndex((e) => e.userId === userId);
  if (rIdx >= 0) rankedQueue.splice(rIdx, 1);
}

export function tryMatch(mode: MatchMode): [MatchmakingEntry, MatchmakingEntry] | null {
  const queue = mode === "ranked" ? rankedQueue : casualQueue;
  if (queue.length < 2) return null;

  const now = Date.now();
  queue.sort((a, b) => a.queuedAt - b.queuedAt);

  for (let i = 0; i < queue.length; i++) {
    for (let j = i + 1; j < queue.length; j++) {
      const a = queue[i];
      const b = queue[j];

      if (now - a.queuedAt > MATCHMAKING_TIMEOUT_MS) continue;
      if (now - b.queuedAt > MATCHMAKING_TIMEOUT_MS) continue;

      const regionOk = regionMatch(a.region, b.region) || regionMatch(a.region, "worldwide") || regionMatch(b.region, "worldwide");

      if (mode === "ranked") {
        const dist = ratingDistance(a.rankPoints, b.rankPoints);
        if (dist > 400 && now - a.queuedAt < 15000) continue;
      }

      if (!regionOk && now - a.queuedAt < 20000) continue;

      queue.splice(j, 1);
      queue.splice(i, 1);
      return [a, b];
    }
  }

  return null;
}

export function getQueueSize(mode?: MatchMode): number {
  if (mode === "ranked") return rankedQueue.length;
  if (mode === "casual") return casualQueue.length;
  return casualQueue.length + rankedQueue.length;
}

export function getEstimatedWait(mode: MatchMode): number {
  const size = getQueueSize(mode);
  if (size >= 2) return 3;
  if (size === 1) return 15;
  return 30;
}

export function pruneStale(): void {
  const now = Date.now();
  for (const q of [casualQueue, rankedQueue]) {
    for (let i = q.length - 1; i >= 0; i--) {
      if (now - q[i].queuedAt > MATCHMAKING_TIMEOUT_MS) {
        q.splice(i, 1);
      }
    }
  }
}
