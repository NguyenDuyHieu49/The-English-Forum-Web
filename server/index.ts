import { createServer } from "http";
import { Server } from "socket.io";
import { WS_EVENTS, DEFAULT_PORT } from "./types";
import type { QueueJoinPayload, AnswerPayload } from "./types";
import {
  addToQueue,
  removeFromQueue,
  tryMatch,
  getQueueSize,
  getEstimatedWait,
  pruneStale,
} from "./matchmaking";
import {
  createMatch,
  startBattle,
  processAnswer,
  processUltimate,
  getMatchByPlayer,
  updatePlayerSocket,
  removeMatch,
  getActiveMatchCount,
} from "./battle-engine";

const httpServer = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    status: "ok",
    service: "English Battle Arena WebSocket Server",
    online: io.engine.clientsCount,
    queue: getQueueSize(),
    matches: getActiveMatchCount(),
  }));
});

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

let onlineCount = 0;

function broadcastOnlineCount() {
  io.emit(WS_EVENTS.ONLINE_COUNT, { count: onlineCount + Math.floor(Math.random() * 50) + 100 });
}

io.on("connection", (socket) => {
  onlineCount++;
  broadcastOnlineCount();

  socket.on(WS_EVENTS.QUEUE_JOIN, (payload: QueueJoinPayload) => {
    const entry = addToQueue(payload, socket.id);

    socket.emit(WS_EVENTS.QUEUE_STATUS, {
      status: "searching",
      position: getQueueSize(payload.mode),
      estimatedWait: getEstimatedWait(payload.mode),
    });

    const pair = tryMatch(payload.mode);
    if (pair) {
      const [p1, p2] = pair;
      const match = createMatch(p1, p2, payload.mode, payload.region);

      io.to(p1.socketId).emit(WS_EVENTS.MATCH_FOUND, { match, opponent: match.players[1] });
      io.to(p2.socketId).emit(WS_EVENTS.MATCH_FOUND, { match, opponent: match.players[0] });

      setTimeout(() => {
        io.to(p1.socketId).emit(WS_EVENTS.MATCH_LOADING, { matchId: match.id });
        io.to(p2.socketId).emit(WS_EVENTS.MATCH_LOADING, { matchId: match.id });
      }, 3000);

      setTimeout(() => {
        const started = startBattle(match.id);
        if (started) {
          io.to(p1.socketId).emit(WS_EVENTS.MATCH_START, { match: started });
          io.to(p2.socketId).emit(WS_EVENTS.MATCH_START, { match: started });
          if (started.currentRound) {
            io.to(p1.socketId).emit(WS_EVENTS.ROUND_START, { round: started.currentRound, match: started });
            io.to(p2.socketId).emit(WS_EVENTS.ROUND_START, { round: started.currentRound, match: started });
          }
        }
      }, 6000);
    }
  });

  socket.on(WS_EVENTS.QUEUE_LEAVE, (data: { userId: string }) => {
    removeFromQueue(data.userId);
    socket.emit(WS_EVENTS.QUEUE_STATUS, { status: "cancelled" });
  });

  socket.on(WS_EVENTS.BATTLE_ANSWER, (payload: AnswerPayload & { userId: string }) => {
    const result = processAnswer(payload.matchId, payload.userId, payload.choiceId, payload.clientTimestamp);
    if (!result) return;

    const { match, event, roundComplete } = result;
    const playerSockets = match.players.map((p) => p.socketId);

    if (event) {
      const eventName = event.type === "attack" ? WS_EVENTS.BATTLE_ATTACK : WS_EVENTS.BATTLE_STUN;
      for (const sid of playerSockets) {
        io.to(sid).emit(eventName, { event, match });
      }
    }

    io.to(playerSockets[0]).emit(WS_EVENTS.BATTLE_UPDATE, { match });
    io.to(playerSockets[1]).emit(WS_EVENTS.BATTLE_UPDATE, { match });

    if (roundComplete && match.currentRound) {
      for (const sid of playerSockets) {
        io.to(sid).emit(WS_EVENTS.ROUND_START, { round: match.currentRound, match });
      }
    }

    if (match.winnerId) {
      for (const sid of playerSockets) {
        io.to(sid).emit(WS_EVENTS.MATCH_END, { match, winnerId: match.winnerId });
      }
      setTimeout(() => removeMatch(match.id), 60000);
    }
  });

  socket.on(WS_EVENTS.BATTLE_ULTIMATE, (data: { matchId: string; userId: string }) => {
    const match = processUltimate(data.matchId, data.userId);
    if (!match) return;

    const playerSockets = match.players.map((p) => p.socketId);
    for (const sid of playerSockets) {
      io.to(sid).emit(WS_EVENTS.BATTLE_UPDATE, { match });
    }

    if (match.winnerId) {
      for (const sid of playerSockets) {
        io.to(sid).emit(WS_EVENTS.MATCH_END, { match, winnerId: match.winnerId });
      }
      setTimeout(() => removeMatch(match.id), 60000);
    }
  });

  socket.on(WS_EVENTS.BATTLE_RECONNECT, (data: { userId: string }) => {
    updatePlayerSocket(data.userId, socket.id);
    const match = getMatchByPlayer(data.userId);
    if (match) {
      socket.emit(WS_EVENTS.BATTLE_UPDATE, { match });
      if (match.currentRound) {
        socket.emit(WS_EVENTS.ROUND_START, { round: match.currentRound, match });
      }
    }
  });

  socket.on("disconnect", () => {
    onlineCount = Math.max(0, onlineCount - 1);
    broadcastOnlineCount();
  });
});

setInterval(() => {
  pruneStale();
  broadcastOnlineCount();
}, 10000);

const port = Number(process.env.BATTLE_WS_PORT ?? DEFAULT_PORT);
httpServer.listen(port, () => {
  console.log(`⚔️  English Battle Arena WS server on port ${port}`);
});
