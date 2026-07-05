"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  BattleMatch,
  BattleRound,
  BattleEvent,
  MatchMode,
  BattleRegion,
  QueueJoinPayload,
  MatchPhase,
} from "@/types/battle-arena";

const WS_URL = process.env.NEXT_PUBLIC_BATTLE_WS_URL ?? "http://localhost:3001";

export const WS_EVENTS = {
  QUEUE_JOIN: "queue:join",
  QUEUE_LEAVE: "queue:leave",
  BATTLE_ANSWER: "battle:answer",
  BATTLE_ULTIMATE: "battle:ultimate",
  BATTLE_RECONNECT: "battle:reconnect",
  QUEUE_STATUS: "queue:status",
  MATCH_FOUND: "match:found",
  MATCH_LOADING: "match:loading",
  MATCH_START: "match:start",
  ROUND_START: "round:start",
  BATTLE_UPDATE: "battle:update",
  BATTLE_ATTACK: "battle:attack",
  BATTLE_STUN: "battle:stun",
  MATCH_END: "match:end",
  ONLINE_COUNT: "online:count",
} as const;

export interface BattleSocketState {
  connected: boolean;
  phase: MatchPhase;
  match: BattleMatch | null;
  opponent: BattleMatch["players"][0] | null;
  currentRound: BattleRound | null;
  lastEvent: BattleEvent | null;
  onlineCount: number;
  queuePosition: number;
  estimatedWait: number;
  winnerId: string | null;
  error: string | null;
}

const initialState: BattleSocketState = {
  connected: false,
  phase: "idle",
  match: null,
  opponent: null,
  currentRound: null,
  lastEvent: null,
  onlineCount: 0,
  queuePosition: 0,
  estimatedWait: 30,
  winnerId: null,
  error: null,
};

export function useBattleSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<BattleSocketState>(initialState);

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setState((s) => ({ ...s, connected: true, error: null }));
    });

    socket.on("disconnect", () => {
      setState((s) => ({ ...s, connected: false }));
    });

    socket.on(WS_EVENTS.ONLINE_COUNT, (data: { count: number }) => {
      setState((s) => ({ ...s, onlineCount: data.count }));
    });

    socket.on(WS_EVENTS.QUEUE_STATUS, (data: { status: string; position?: number; estimatedWait?: number }) => {
      if (data.status === "cancelled") {
        setState((s) => ({ ...s, phase: "idle", queuePosition: 0 }));
      } else {
        setState((s) => ({
          ...s,
          phase: "queue",
          queuePosition: data.position ?? 0,
          estimatedWait: data.estimatedWait ?? 30,
        }));
      }
    });

    socket.on(WS_EVENTS.MATCH_FOUND, (data: { match: BattleMatch; opponent: BattleMatch["players"][0] }) => {
      setState((s) => ({
        ...s,
        phase: "match_found",
        match: data.match,
        opponent: data.opponent,
      }));
    });

    socket.on(WS_EVENTS.MATCH_LOADING, () => {
      setState((s) => ({ ...s, phase: "loading" }));
    });

    socket.on(WS_EVENTS.MATCH_START, (data: { match: BattleMatch }) => {
      setState((s) => ({
        ...s,
        phase: "battle",
        match: data.match,
      }));
    });

    socket.on(WS_EVENTS.ROUND_START, (data: { round: BattleRound; match: BattleMatch }) => {
      setState((s) => ({
        ...s,
        currentRound: data.round,
        match: data.match,
      }));
    });

    socket.on(WS_EVENTS.BATTLE_UPDATE, (data: { match: BattleMatch }) => {
      setState((s) => ({ ...s, match: data.match }));
    });

    socket.on(WS_EVENTS.BATTLE_ATTACK, (data: { event: BattleEvent; match: BattleMatch }) => {
      setState((s) => ({
        ...s,
        lastEvent: data.event,
        match: data.match,
      }));
    });

    socket.on(WS_EVENTS.BATTLE_STUN, (data: { event: BattleEvent; match: BattleMatch }) => {
      setState((s) => ({
        ...s,
        lastEvent: data.event,
        match: data.match,
      }));
    });

    socket.on(WS_EVENTS.MATCH_END, (data: { match: BattleMatch; winnerId: string }) => {
      setState((s) => ({
        ...s,
        match: data.match,
        winnerId: data.winnerId,
        phase: "victory",
      }));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const joinQueue = useCallback((payload: QueueJoinPayload) => {
    socketRef.current?.emit(WS_EVENTS.QUEUE_JOIN, payload);
  }, []);

  const leaveQueue = useCallback((userId: string) => {
    socketRef.current?.emit(WS_EVENTS.QUEUE_LEAVE, { userId });
    setState((s) => ({ ...s, phase: "idle" }));
  }, []);

  const submitAnswer = useCallback((matchId: string, userId: string, roundIndex: number, choiceId: string) => {
    socketRef.current?.emit(WS_EVENTS.BATTLE_ANSWER, {
      matchId,
      userId,
      roundIndex,
      choiceId,
      clientTimestamp: Date.now(),
    });
  }, []);

  const useUltimate = useCallback((matchId: string, userId: string) => {
    socketRef.current?.emit(WS_EVENTS.BATTLE_ULTIMATE, { matchId, userId });
  }, []);

  const reconnect = useCallback((userId: string) => {
    socketRef.current?.emit(WS_EVENTS.BATTLE_RECONNECT, { userId });
  }, []);

  const resetState = useCallback(() => {
    setState({ ...initialState, connected: state.connected, onlineCount: state.onlineCount });
  }, [state.connected, state.onlineCount]);

  return {
    ...state,
    joinQueue,
    leaveQueue,
    submitAnswer,
    useUltimate,
    reconnect,
    resetState,
  };
}
