# English Battle Arena — Architecture

## Overview

**English Battle Arena** is a real-time PvP English learning game integrated into The English Forum Web. Players match worldwide, answer English questions faster than opponents, and attack with hero abilities.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, Framer Motion, Tailwind v4 |
| State | Zustand + localStorage (`tef-battle-arena-store`) |
| Real-time | Socket.io (server on port 3001) |
| Auth | Firebase Auth (UID as player identity) |
| Questions | Client + server shared pool (`src/mock/battle-questions.ts`) |

## Routes

| Route | Description |
|-------|-------------|
| `/games/battle-arena` | Hub — Find Match, mode select, stats |
| `/games/battle-arena/heroes` | 10 heroes with abilities |
| `/games/battle-arena/shop` | In-game shop (coins + battle points) |
| `/games/battle-arena/season` | 30-day season pass |
| `/games/battle-arena/leaderboard` | Global rankings |
| `/games/battle-arena/leaderboard/country` | Country rankings |
| `/games/battle-arena/leaderboard/city` | City rankings |
| `/games/battle-arena/leaderboard/hero` | Per-hero rankings |
| `/games/battle-arena/leaderboard/season` | Season rankings |
| `/game/inventory` | Battle cosmetics inventory |

## Game Flow

```
Find Match → Matchmaking → VS Screen → Loading → Battle → Victory/Defeat → Rewards
```

### Battle Mechanics
- First correct answer = attack (12+ damage, combo bonus)
- Wrong answer = 2s stun
- Ultimate at 100 mana
- 10 rounds per match, HP = 100
- Match ends when HP reaches 0

## Heroes (10)

1. **Vocabulary Knight** — +10% vocab damage, Double Strike ultimate
2. **Grammar Wizard** — Extra time on grammar, Spell Blast ultimate
3. **Listening Ninja** — Faster audio, Critical Listen ultimate
4. **Sentence Samurai** — Combo bonus, Chain Slash ultimate
5. **Idiom Oracle** — Idiom specialist
6. **Pronunciation Paladin** — Clear voice passive
7. **Reading Ranger** — Reading comprehension
8. **Synonym Sorcerer** — Synonym magic
9. **Spelling Sentinel** — Streak damage
10. **Combo Crusader** — Momentum master

## Ranking Tiers

Bronze → Silver → Gold → Platinum → Diamond → Master → Legend

Rank points: +25 win / -15 loss (ranked), streak bonus.

## Database Tables (Logical Schema)

```
heroes, hero_skills, hero_skins, player_heroes
inventories, inventory_items, equipped_cosmetics
matchmaking_queue, game_matches, match_players, battle_events
ranked_points, leaderboards, battle_rewards
shop_items, player_titles, season_rewards
```

Persisted in Zustand (`src/store/battle-arena-store.ts`). Future: Firestore collections keyed by `user.uid`.

## WebSocket Server

```bash
# Start WS server only
npm run battle:server

# Start Next.js + WS together
npm run dev:full
```

**Port:** 3001 (configurable via `BATTLE_WS_PORT`)

**Env:** `NEXT_PUBLIC_BATTLE_WS_URL=http://localhost:3001`

### Events

| Event | Direction | Purpose |
|-------|-----------|---------|
| `queue:join` | C→S | Enter matchmaking |
| `queue:leave` | C→S | Cancel queue |
| `battle:answer` | C→S | Submit answer |
| `battle:ultimate` | C→S | Use ultimate |
| `battle:reconnect` | C→S | Reconnect to match |
| `match:found` | S→C | Opponent matched |
| `match:loading` | S→C | Loading phase |
| `match:start` | S→C | Battle begins |
| `round:start` | S→C | New question |
| `battle:attack` | S→C | Attack animation |
| `battle:stun` | S→C | Stun effect |
| `match:end` | S→C | Match over |

## Anti-Cheat

- Server validates answers (correct choice ID)
- Timer validation (round start/end bounds)
- Clock drift check (±5s)
- Duplicate submission prevention per round
- Match state persistence in server memory
- Reconnection via `battle:reconnect`

## Offline / Demo Mode

When WS server is unavailable, the client auto-falls back to **AI bot opponent** (`use-local-bot-battle.ts`). UI is identical; banner indicates offline mode.

## Question Pool

80+ questions across 8 categories in `src/mock/battle-questions.ts`:
- Vocabulary, Grammar, Listening, Sentence, Idioms, Synonyms, Reading, Pronunciation
- Difficulty: beginner / intermediate / advanced
- Balanced category rotation, recent-question dedup

## Reward System

| Reward | Source |
|--------|--------|
| XP | Match completion |
| Coins | Wins |
| Battle Points | Wins |
| Rank Points | Ranked wins/losses |
| Loot Chests | 35% drop on win |
| Hero Fragments | 15% drop on win |

## Integration Points

- **Arena Store:** `completeGame()` bridges XP to main app
- **App Store:** `addReward()` for tokens/XP
- **Firebase Auth:** Use `user.uid` instead of `local-user` when configured
- **Navigation:** Sidebar entry "English Battle Arena"

## Production Deployment

1. Deploy Socket.io server (Railway, Fly.io, or same VPS)
2. Set `NEXT_PUBLIC_BATTLE_WS_URL` to production WS URL
3. Add Redis for matchmaking queue (replace in-memory)
4. Add PostgreSQL/Firestore for match history persistence
5. Secure sockets with Firebase Auth token verification

## File Structure

```
server/
  index.ts          # Socket.io entry
  matchmaking.ts    # Queue + ELO matching
  battle-engine.ts  # Match state machine
  anti-cheat.ts     # Validation
src/
  types/battle-arena.ts
  constants/battle-arena.ts
  mock/battle-questions.ts
  store/battle-arena-store.ts
  hooks/use-battle-arena.ts
  hooks/use-battle-socket.ts
  hooks/use-local-bot-battle.ts
  services/battle-arena/
  components/battle-arena/
  app/(main)/games/battle-arena/
  app/(main)/game/inventory/
```
