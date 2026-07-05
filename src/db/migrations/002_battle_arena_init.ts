import type { BattleDatabase } from "@/types/battle-arena";
import { createEmptyBattleDatabase } from "@/db/battle-schema";
import { BATTLE_DB_VERSION } from "@/constants/battle-arena";

export interface BattleMigration {
  version: number;
  name: string;
  up: (db: BattleDatabase) => BattleDatabase;
}

export const battleMigration001: BattleMigration = {
  version: 1,
  name: "battle_arena_init",
  up: (db) => {
    if (db.version >= 1) return db;
    const seeded = createEmptyBattleDatabase();
    return { ...seeded, version: 1 };
  },
};

export const BATTLE_MIGRATIONS: BattleMigration[] = [battleMigration001];

export function runBattleMigrations(db: BattleDatabase): BattleDatabase {
  let current = { ...db };
  for (const migration of BATTLE_MIGRATIONS) {
    if (current.version < migration.version) {
      current = migration.up(current);
      current.version = migration.version;
    }
  }
  if (current.version < BATTLE_DB_VERSION) {
    current.version = BATTLE_DB_VERSION;
  }
  return current;
}
