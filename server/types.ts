export type {
  RankTier,
  MatchMode,
  BattleRegion,
  MatchPhase,
  BattlePlayerState,
  BattleRound,
  BattleMatch,
  BattleEvent,
  MatchmakingEntry,
  BattleQuestion,
  QueueJoinPayload,
  AnswerPayload,
} from "../src/types/battle-arena";

export const WS_EVENTS = {
  // Client → Server
  QUEUE_JOIN: "queue:join",
  QUEUE_LEAVE: "queue:leave",
  BATTLE_ANSWER: "battle:answer",
  BATTLE_ULTIMATE: "battle:ultimate",
  BATTLE_RECONNECT: "battle:reconnect",

  // Server → Client
  QUEUE_STATUS: "queue:status",
  MATCH_FOUND: "match:found",
  MATCH_LOADING: "match:loading",
  MATCH_START: "match:start",
  ROUND_START: "round:start",
  ROUND_RESULT: "round:result",
  BATTLE_UPDATE: "battle:update",
  BATTLE_ATTACK: "battle:attack",
  BATTLE_STUN: "battle:stun",
  MATCH_END: "match:end",
  MATCH_ERROR: "match:error",
  ONLINE_COUNT: "online:count",
} as const;

export const DEFAULT_PORT = 3001;
