"use client";

import { useState, useCallback, useRef } from "react";
import type {
  BattleMatch,
  BattleRound,
  BattlePlayerState,
  MatchMode,
  BattleRegion,
  QueueJoinPayload,
  MatchPhase,
} from "@/types/battle-arena";
import {
  MAX_HP,
  MAX_MANA,
  ROUNDS_PER_MATCH,
  STUN_DURATION_MS,
  BASE_ATTACK_DAMAGE,
  MATCHMAKING_TIPS,
  ENGLISH_TIPS,
} from "@/constants/battle-arena";
import { selectBattleQuestions } from "@/mock/battle-questions";

export interface LocalBotState {
  phase: MatchPhase;
  match: BattleMatch | null;
  opponent: BattlePlayerState | null;
  currentRound: BattleRound | null;
  onlineCount: number;
  estimatedWait: number;
  winnerId: string | null;
  lastAttack: { damage: number; attacker: string } | null;
  connected: boolean;
}

const BOT_NAMES = ["AI_Rival", "BotMaster", "ShadowFoe", "GrammarBot", "WordBot"];
const BOT_HEROES = ["grammar-wizard", "listening-ninja", "sentence-samurai", "idiom-oracle"];

function createBotPlayer(payload: QueueJoinPayload): BattlePlayerState {
  const heroId = BOT_HEROES[Math.floor(Math.random() * BOT_HEROES.length)];
  return {
    userId: `bot-${Date.now()}`,
    userName: BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)],
    avatar: "🤖",
    country: "AI Land",
    city: "Server City",
    heroId,
    skinId: null,
    titleId: null,
    frameId: null,
    rankTier: payload.rankTier,
    hp: MAX_HP,
    maxHp: MAX_HP,
    mana: 0,
    maxMana: MAX_MANA,
    stunnedUntil: 0,
    combo: 0,
    socketId: "bot",
  };
}

function createLocalPlayer(payload: QueueJoinPayload): BattlePlayerState {
  return {
    userId: payload.userId,
    userName: payload.userName,
    avatar: payload.avatar,
    country: payload.country,
    city: payload.city,
    heroId: payload.heroId,
    skinId: payload.skinId,
    titleId: null,
    frameId: null,
    rankTier: payload.rankTier,
    hp: MAX_HP,
    maxHp: MAX_HP,
    mana: 0,
    maxMana: MAX_MANA,
    stunnedUntil: 0,
    combo: 0,
    socketId: "local",
  };
}

export function useLocalBotBattle() {
  const [state, setState] = useState<LocalBotState>({
    phase: "idle",
    match: null,
    opponent: null,
    currentRound: null,
    onlineCount: 127,
    estimatedWait: 5,
    winnerId: null,
    lastAttack: null,
    connected: false,
  });

  const questionsRef = useRef<ReturnType<typeof selectBattleQuestions>>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const botAnswerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (botAnswerTimerRef.current) clearTimeout(botAnswerTimerRef.current);
  };

  const startRound = useCallback((match: BattleMatch, roundIndex: number) => {
    const question = questionsRef.current[roundIndex];
    if (!question) return;

    const now = Date.now();
    const round: BattleRound = {
      roundIndex,
      question,
      answeredBy: null,
      correctAnswer: null,
      startedAt: now,
      endsAt: now + question.timeLimitMs,
    };

    setState((s) => ({
      ...s,
      currentRound: round,
      match: { ...match, currentRound: round },
    }));

    const botDelay = 2000 + Math.random() * 6000;
    botAnswerTimerRef.current = setTimeout(() => {
      setState((prev) => {
        if (!prev.match || !prev.currentRound || prev.currentRound.answeredBy) return prev;

        const botCorrect = Math.random() < 0.55;
        if (!botCorrect) return prev;

        const botIdx = prev.match.players.findIndex((p) => p.userId.startsWith("bot"));
        const playerIdx = botIdx === 0 ? 1 : 0;
        const damage = BASE_ATTACK_DAMAGE + Math.floor(Math.random() * 8);

        const players = [...prev.match.players] as [BattlePlayerState, BattlePlayerState];
        players[playerIdx] = { ...players[playerIdx], hp: Math.max(0, players[playerIdx].hp - damage) };

        const updatedMatch = { ...prev.match, players };

        if (players[playerIdx].hp <= 0) {
          return {
            ...prev,
            match: { ...updatedMatch, winnerId: players[botIdx].userId, phase: "victory" as MatchPhase },
            winnerId: players[botIdx].userId,
            phase: "victory",
            lastAttack: { damage, attacker: players[botIdx].userId },
          };
        }

        const nextRound = roundIndex + 1;
        if (nextRound < questionsRef.current.length) {
          timersRef.current.push(setTimeout(() => startRound(updatedMatch, nextRound), 1500));
        } else {
          const winner = players[0].hp > players[1].hp ? players[0].userId : players[1].userId;
          return {
            ...prev,
            match: { ...updatedMatch, winnerId: winner, phase: "victory" as MatchPhase },
            winnerId: winner,
            phase: "victory",
            lastAttack: { damage, attacker: players[botIdx].userId },
          };
        }

        return {
          ...prev,
          match: updatedMatch,
          lastAttack: { damage, attacker: players[botIdx].userId },
        };
      });
    }, botDelay);
  }, []);

  const joinQueue = useCallback((payload: QueueJoinPayload) => {
    clearTimers();
    setState((s) => ({ ...s, phase: "queue", estimatedWait: 3 + Math.floor(Math.random() * 5) }));

    const t1 = setTimeout(() => {
      const player = createLocalPlayer(payload);
      const bot = createBotPlayer(payload);
      const questions = selectBattleQuestions(ROUNDS_PER_MATCH, [], payload.rankTier);
      questionsRef.current = questions;

      const match: BattleMatch = {
        id: `local-${Date.now()}`,
        mode: payload.mode,
        region: payload.region,
        phase: "match_found",
        players: [player, bot],
        currentRound: null,
        roundHistory: [],
        events: [],
        winnerId: null,
        startedAt: new Date().toISOString(),
        endedAt: null,
      };

      setState((s) => ({
        ...s,
        phase: "match_found",
        match,
        opponent: bot,
      }));

      const t2 = setTimeout(() => {
        setState((s) => ({ ...s, phase: "loading" }));
      }, 3000);
      timersRef.current.push(t2);

      const t3 = setTimeout(() => {
        setState((s) => ({
          ...s,
          phase: "battle",
          match: s.match ? { ...s.match, phase: "battle" } : null,
        }));
        if (match) startRound(match, 0);
      }, 6000);
      timersRef.current.push(t3);
    }, 2000 + Math.random() * 3000);
    timersRef.current.push(t1);
  }, [startRound]);

  const leaveQueue = useCallback(() => {
    clearTimers();
    setState({
      phase: "idle",
      match: null,
      opponent: null,
      currentRound: null,
      onlineCount: 127,
      estimatedWait: 5,
      winnerId: null,
      lastAttack: null,
      connected: false,
    });
  }, []);

  const submitAnswer = useCallback((matchId: string, userId: string, roundIndex: number, choiceId: string) => {
    if (botAnswerTimerRef.current) clearTimeout(botAnswerTimerRef.current);

    setState((prev) => {
      if (!prev.match || !prev.currentRound || prev.currentRound.answeredBy) return prev;
      if (prev.currentRound.roundIndex !== roundIndex) return prev;

      const question = prev.currentRound.question;
      const correct = question.correctId === choiceId;
      const playerIdx = prev.match.players.findIndex((p) => p.userId === userId);
      if (playerIdx < 0) return prev;

      const opponentIdx = playerIdx === 0 ? 1 : 0;
      const players = [...prev.match.players] as [BattlePlayerState, BattlePlayerState];

      if (correct) {
        const damage = BASE_ATTACK_DAMAGE + players[playerIdx].combo * 2;
        players[opponentIdx] = { ...players[opponentIdx], hp: Math.max(0, players[opponentIdx].hp - damage) };
        players[playerIdx] = {
          ...players[playerIdx],
          combo: players[playerIdx].combo + 1,
          mana: Math.min(MAX_MANA, players[playerIdx].mana + 20),
        };

        if (players[opponentIdx].hp <= 0) {
          return {
            ...prev,
            match: { ...prev.match, players, winnerId: userId, phase: "victory" as MatchPhase },
            winnerId: userId,
            phase: "victory",
            lastAttack: { damage, attacker: userId },
          };
        }

        const nextRound = roundIndex + 1;
        const updatedMatch = { ...prev.match, players };
        if (nextRound < questionsRef.current.length) {
          timersRef.current.push(setTimeout(() => startRound(updatedMatch, nextRound), 1500));
        }

        return {
          ...prev,
          match: updatedMatch,
          currentRound: { ...prev.currentRound, answeredBy: userId, correctAnswer: true },
          lastAttack: { damage, attacker: userId },
        };
      }

      players[playerIdx] = { ...players[playerIdx], combo: 0, stunnedUntil: Date.now() + STUN_DURATION_MS };
      return { ...prev, match: { ...prev.match, players } };
    });
  }, [startRound]);

  const resetState = useCallback(() => {
    clearTimers();
    setState({
      phase: "idle",
      match: null,
      opponent: null,
      currentRound: null,
      onlineCount: 127,
      estimatedWait: 5,
      winnerId: null,
      lastAttack: null,
      connected: false,
    });
  }, []);

  return {
    ...state,
    connected: true,
    queuePosition: 1,
    joinQueue,
    leaveQueue,
    submitAnswer,
    useUltimate: () => {},
    reconnect: () => {},
    resetState,
    tips: MATCHMAKING_TIPS,
    englishTips: ENGLISH_TIPS,
  };
}
