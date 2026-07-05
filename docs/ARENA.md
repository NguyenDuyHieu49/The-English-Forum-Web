# English Adventure Arena — Architecture

## Overview

**English Adventure Arena** is a Duolingo-style gamified learning module integrated into The English Forum Web. It adds mini-games, city-based leaderboards, cosmetics inventory, achievements, daily rewards, and boss battles — all wired into the existing auth, UI, and gamification stack.

## Stack Integration

| Layer | Implementation |
|-------|----------------|
| Auth | Reuses Firebase Auth + `AuthGuard` (demo mode when Firebase unset) |
| UI | shadcn-style components, Tailwind v4, Framer Motion |
| State | `useArenaStore` (Zustand + `localStorage` key `tef-arena-store`) |
| Main XP/Tokens | `useAppStore` bridged on game completion |
| i18n | `useTranslation()` + `nav.games` / `nav.leaderboard` |
| Database | **Client-side schema** in `src/db/` (migrations + seeders) — no SQL server |

> **Note:** The project has no Prisma/Firestore. Persistence uses Zustand `persist` mimicking database tables. When you add Firestore, map `ArenaDatabase` fields to collections keyed by `user.uid`.

## Directory Structure

```
src/
├── types/arena.ts              # Domain types
├── constants/arena.ts          # Game config, XP curves, cities, catalog
├── mock/arena-games.ts         # Word/sentence/grammar/listening content
├── mock/arena-leaderboard.ts   # Mock leaderboard players
├── db/
│   ├── schema.ts               # Table names + empty DB factory
│   ├── migrations/001_arena_init.ts
│   └── seeders/arena-seed.ts   # Demo profile, friends, inventory
├── services/arena/
│   ├── xp.ts                   # Reward calculation
│   ├── inventory.ts            # Mystery chest loot
│   ├── achievements.ts         # Progress tracking
│   └── leaderboard.ts          # City/global/weekly boards
├── store/arena-store.ts        # All arena actions
├── components/arena/           # Reusable game UI
└── app/(main)/
    ├── games/                  # Hub + 5 mini-games + admin
    ├── leaderboard/            # Hub, city, global
    └── profile/
        ├── inventory/          # Arena cosmetics
        └── achievements/       # Arena achievements
```

## Database Schema (Logical Tables)

| Table | Stored In |
|-------|-----------|
| `game_profiles` | `arenaStore.gameProfile` |
| `equipped_cosmetics` | `arenaStore.equipped` |
| `inventory_items` | `arenaStore.inventory[]` |
| `user_achievements` | `arenaStore.achievements[]` |
| `friendships` | `arenaStore.friends[]` |
| `game_matches` | `arenaStore.challenges[]` |
| `boss_battles` | `arenaStore.bossBattle` |
| `daily_rewards` | `gameProfile.lastDailyRewardDay` |
| `leaderboards` | Computed from mock + user stats |

**Migration:** `runMigrations()` in `001_arena_init.ts` runs on `initArena()`.

## Mini-Games

| Game | Route | Mechanics |
|------|-------|-----------|
| Word Hunter | `/games/word-hunter` | Match words ↔ meanings, 60s timer, combo |
| Sentence Builder | `/games/sentence-builder` | Rearrange word tiles |
| Grammar Challenge | `/games/grammar-challenge` | MCQ, progressive difficulty |
| Listening Quest | `/games/listening-quest` | Browser TTS + MCQ |
| Boss Battle | `/games/boss-battle` | HP battle after 3 games |

## Gamification Flow

1. Player completes game → `GameSessionResult`
2. `calculateGameRewards()` → XP, coins, bonuses
3. `completeGame()` updates arena profile + checks achievements
4. Bridge syncs XP/tokens to main `useAppStore`
5. `LevelUpModal` / `GameResultModal` / `ConfettiEffect` feedback

### XP Formula

- Base XP × accuracy + combo + perfect + streak + daily bonuses
- Level curve: `totalXpForLevel(n)` with 1.12 exponent, max level 100

### Virtual Currency

- **Learning Coins** → `gameProfile.coins` (arena) + main `userStats.tokens` (bridge)

## Inventory & Cosmetics

Item types: `xp_boost`, `streak_shield`, `lucky_chest`, `profile_frame`, `avatar_item`, `title`, `badge`, `seasonal_reward`.

- **Equip/Unequip:** `/profile/inventory`
- **Mystery chests:** configurable drop rates in `CHEST_DROP_RATES`

## Leaderboards

Scopes: `global`, `city`, `weekly`, `monthly`, `all_time`.

City leaderboard is primary — user selects city on `/games` hub.

**Rewards by rank:**
- #1: Legendary title + gold frame
- Top 3: Silver frame
- Top 10: City badge

## Daily Rewards

7-day cycle in `DAILY_REWARDS`. Claim on `/games` hub via `claimDailyReward()`.

## Admin

`/games/admin` — demo panel for event multipliers, drop rates, item catalog.

## API Endpoints (Future)

When adding a backend, expose:

```
GET  /api/arena/profile
POST /api/arena/games/complete
GET  /api/arena/leaderboard/:scope
POST /api/arena/inventory/equip
POST /api/arena/daily-reward/claim
```

## Running Locally

```bash
cd HCI && nvm use 20 && npm run dev:clean
```

Navigate to **English Adventure Arena** in the sidebar (`/games`).
