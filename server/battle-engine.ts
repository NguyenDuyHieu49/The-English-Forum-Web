import { randomUUID } from "crypto";
import type {
  BattleMatch,
  BattlePlayerState,
  BattleRound,
  BattleEvent,
  MatchmakingEntry,
  MatchMode,
  BattleRegion,
} from "./types";
import {
  MAX_HP,
  MAX_MANA,
  ROUNDS_PER_MATCH,
  ULTIMATE_MANA_COST,
} from "../src/constants/battle-arena";
import { selectBattleQuestions } from "../src/mock/battle-questions";
import {
  calculateDamage,
  applyStun,
  isStunned,
  validateChoice,
  validateAnswerTiming,
  markAnswered,
  hasAnswered,
  getMatchWinner,
  cleanupMatch,
} from "./anti-cheat";

const activeMatches = new Map<string, BattleMatch>();
const playerMatchMap = new Map<string, string>();
const matchQuestions = new Map<string, ReturnType<typeof selectBattleQuestions>>();

export function getMatch(matchId: string): BattleMatch | undefined {
  return activeMatches.get(matchId);
}

export function getMatchByPlayer(userId: string): BattleMatch | undefined {
  const matchId = playerMatchMap.get(userId);
  return matchId ? activeMatches.get(matchId) : undefined;
}

function createPlayer(entry: MatchmakingEntry): BattlePlayerState {
  return {
    userId: entry.userId,
    userName: entry.userName,
    avatar: entry.avatar,
    country: entry.country,
    city: entry.city,
    heroId: entry.heroId,
    skinId: entry.skinId,
    titleId: null,
    frameId: null,
    rankTier: entry.rankTier,
    hp: MAX_HP,
    maxHp: MAX_HP,
    mana: 0,
    maxMana: MAX_MANA,
    stunnedUntil: 0,
    combo: 0,
    socketId: entry.socketId,
  };
}

export function createMatch(
  player1: MatchmakingEntry,
  player2: MatchmakingEntry,
  mode: MatchMode,
  region: BattleRegion
): BattleMatch {
  const matchId = randomUUID();
  const avgRank = player1.rankTier;

  const questions = selectBattleQuestions(ROUNDS_PER_MATCH, [], avgRank);
  matchQuestions.set(matchId, questions);

  const match: BattleMatch = {
    id: matchId,
    mode,
    region,
    phase: "match_found",
    players: [createPlayer(player1), createPlayer(player2)],
    currentRound: null,
    roundHistory: [],
    events: [],
    winnerId: null,
    startedAt: new Date().toISOString(),
    endedAt: null,
  };

  activeMatches.set(matchId, match);
  playerMatchMap.set(player1.userId, matchId);
  playerMatchMap.set(player2.userId, matchId);

  return match;
}

export function startBattle(matchId: string): BattleMatch | null {
  const match = activeMatches.get(matchId);
  if (!match) return null;

  match.phase = "battle";
  return startNextRound(matchId);
}

function startNextRound(matchId: string): BattleMatch | null {
  const match = activeMatches.get(matchId);
  if (!match) return null;

  const questions = matchQuestions.get(matchId);
  if (!questions) return null;

  const roundIndex = match.roundHistory.length;
  if (roundIndex >= questions.length) {
    return endMatch(matchId);
  }

  const question = questions[roundIndex];
  const now = Date.now();

  const round: BattleRound = {
    roundIndex,
    question,
    answeredBy: null,
    correctAnswer: null,
    startedAt: now,
    endsAt: now + question.timeLimitMs,
  };

  match.currentRound = round;
  activeMatches.set(matchId, match);
  return match;
}

export function processAnswer(
  matchId: string,
  userId: string,
  choiceId: string,
  clientTimestamp: number
): {
  match: BattleMatch;
  event?: BattleEvent;
  roundComplete: boolean;
} | null {
  const match = activeMatches.get(matchId);
  if (!match || !match.currentRound) return null;

  const round = match.currentRound;
  const serverNow = Date.now();

  if (hasAnswered(matchId, userId, round.roundIndex)) {
    return { match, roundComplete: false };
  }

  const timing = validateAnswerTiming(round.startedAt, round.endsAt, clientTimestamp, serverNow);
  if (!timing.valid) return { match, roundComplete: false };

  const playerIdx = match.players.findIndex((p) => p.userId === userId);
  if (playerIdx < 0) return null;

  const player = match.players[playerIdx];
  if (isStunned(player)) return { match, roundComplete: false };

  markAnswered(matchId, userId, round.roundIndex);

  const correct = validateChoice(round.question.correctId, choiceId);
  const opponentIdx = playerIdx === 0 ? 1 : 0;
  let event: BattleEvent | undefined;
  let roundComplete = false;

  if (correct && !round.answeredBy) {
    round.answeredBy = userId;
    round.correctAnswer = true;

    const damage = calculateDamage(player, true, round.question.category);
    match.players[opponentIdx] = {
      ...match.players[opponentIdx],
      hp: Math.max(0, match.players[opponentIdx].hp - damage),
    };
    match.players[playerIdx] = {
      ...player,
      combo: player.combo + 1,
      mana: Math.min(MAX_MANA, player.mana + 20),
    };

    event = {
      id: randomUUID(),
      matchId,
      type: "attack",
      actorId: userId,
      targetId: match.players[opponentIdx].userId,
      damage,
      roundIndex: round.roundIndex,
      timestamp: new Date().toISOString(),
    };
    match.events.push(event);
    roundComplete = true;
  } else if (!correct) {
    match.players[playerIdx] = applyStun({
      ...player,
      combo: 0,
    });

    event = {
      id: randomUUID(),
      matchId,
      type: "stun",
      actorId: userId,
      roundIndex: round.roundIndex,
      timestamp: new Date().toISOString(),
    };
    match.events.push(event);
  }

  if (match.players[0].hp <= 0 || match.players[1].hp <= 0) {
    return { match: endMatch(matchId)!, event, roundComplete: true };
  }

  if (roundComplete) {
    match.roundHistory.push({ ...round });
    match.currentRound = null;
    activeMatches.set(matchId, match);

    if (match.players[0].hp <= 0 || match.players[1].hp <= 0) {
      return { match: endMatch(matchId)!, event, roundComplete: true };
    }

    startNextRound(matchId);
  }

  activeMatches.set(matchId, match);
  return { match: activeMatches.get(matchId)!, event, roundComplete };
}

export function processUltimate(matchId: string, userId: string): BattleMatch | null {
  const match = activeMatches.get(matchId);
  if (!match || !match.currentRound) return null;

  const playerIdx = match.players.findIndex((p) => p.userId === userId);
  if (playerIdx < 0) return null;

  const player = match.players[playerIdx];
  if (player.mana < ULTIMATE_MANA_COST) return match;

  const opponentIdx = playerIdx === 0 ? 1 : 0;
  const damage = calculateDamage(player, true, match.currentRound.question.category, true);

  match.players[opponentIdx] = {
    ...match.players[opponentIdx],
    hp: Math.max(0, match.players[opponentIdx].hp - damage),
  };
  match.players[playerIdx] = {
    ...player,
    mana: 0,
  };

  match.events.push({
    id: randomUUID(),
    matchId,
    type: "ultimate",
    actorId: userId,
    targetId: match.players[opponentIdx].userId,
    damage,
    roundIndex: match.currentRound.roundIndex,
    timestamp: new Date().toISOString(),
  });

  if (match.players[0].hp <= 0 || match.players[1].hp <= 0) {
    return endMatch(matchId);
  }

  activeMatches.set(matchId, match);
  return match;
}

export function endMatch(matchId: string): BattleMatch | null {
  const match = activeMatches.get(matchId);
  if (!match) return null;

  match.winnerId = getMatchWinner(match);
  match.phase = match.winnerId ? "victory" : "defeat";
  match.endedAt = new Date().toISOString();

  for (const p of match.players) {
    playerMatchMap.delete(p.userId);
  }

  activeMatches.set(matchId, match);
  return match;
}

export function removeMatch(matchId: string): void {
  const match = activeMatches.get(matchId);
  if (match) {
    for (const p of match.players) {
      playerMatchMap.delete(p.userId);
    }
  }
  activeMatches.delete(matchId);
  matchQuestions.delete(matchId);
  cleanupMatch(matchId);
}

export function updatePlayerSocket(userId: string, socketId: string): void {
  const matchId = playerMatchMap.get(userId);
  if (!matchId) return;
  const match = activeMatches.get(matchId);
  if (!match) return;
  const idx = match.players.findIndex((p) => p.userId === userId);
  if (idx >= 0) {
    match.players[idx] = { ...match.players[idx], socketId };
    activeMatches.set(matchId, match);
  }
}

export function getActiveMatchCount(): number {
  return activeMatches.size;
}
