import type { AnswerPayload, BattleMatch, BattlePlayerState } from "./types";
import { BASE_ATTACK_DAMAGE, STUN_DURATION_MS } from "../src/constants/battle-arena";
import { getHero } from "../src/constants/battle-arena";

export interface AnswerRecord {
  userId: string;
  choiceId: string;
  clientTimestamp: number;
  serverTimestamp: number;
}

const answerRecords = new Map<string, AnswerRecord[]>();

export function recordAnswer(matchId: string, record: AnswerRecord): void {
  const list = answerRecords.get(matchId) ?? [];
  list.push(record);
  answerRecords.set(matchId, list);
}

export function hasAnswered(matchId: string, userId: string, roundIndex: number): boolean {
  const key = `${matchId}:${roundIndex}:${userId}`;
  return answerRecords.has(key);
}

export function markAnswered(matchId: string, userId: string, roundIndex: number): void {
  const key = `${matchId}:${roundIndex}:${userId}`;
  answerRecords.set(key, []);
}

export function validateAnswerTiming(
  roundStartedAt: number,
  roundEndsAt: number,
  clientTimestamp: number,
  serverTimestamp: number
): { valid: boolean; reason?: string } {
  const serverNow = serverTimestamp;
  if (serverNow < roundStartedAt) {
    return { valid: false, reason: "round_not_started" };
  }
  if (serverNow > roundEndsAt + 500) {
    return { valid: false, reason: "round_expired" };
  }
  const drift = Math.abs(clientTimestamp - serverNow);
  if (drift > 5000) {
    return { valid: false, reason: "clock_drift" };
  }
  return { valid: true };
}

export function validateChoice(
  correctId: string,
  choiceId: string
): boolean {
  return correctId === choiceId;
}

export function calculateDamage(
  attacker: BattlePlayerState,
  isCorrect: boolean,
  category: string,
  isUltimate = false
): number {
  if (!isCorrect) return 0;

  const hero = getHero(attacker.heroId);
  let damage = BASE_ATTACK_DAMAGE;

  if (hero) {
    if (hero.specialty === category) {
      damage *= hero.passive.damageMultiplier ?? 1;
    }
    if (isUltimate) {
      damage *= hero.ultimate.damageMultiplier ?? 2;
    }
  }

  damage += attacker.combo * 2;
  return Math.round(damage);
}

export function applyStun(player: BattlePlayerState): BattlePlayerState {
  return {
    ...player,
    stunnedUntil: Date.now() + STUN_DURATION_MS,
  };
}

export function isStunned(player: BattlePlayerState): boolean {
  return Date.now() < player.stunnedUntil;
}

export function cleanupMatch(matchId: string): void {
  for (const key of answerRecords.keys()) {
    if (key.startsWith(matchId)) {
      answerRecords.delete(key);
    }
  }
}

export function getMatchWinner(match: BattleMatch): string | null {
  const [p1, p2] = match.players;
  if (p1.hp <= 0) return p2.userId;
  if (p2.hp <= 0) return p1.userId;
  if (p1.hp > p2.hp) return p1.userId;
  if (p2.hp > p1.hp) return p2.userId;
  return null;
}
