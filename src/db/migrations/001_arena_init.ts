import type { ArenaDatabase } from "@/types/arena";
import type { Migration } from "@/db/schema";
import { seedArenaDatabase } from "@/db/seeders/arena-seed";

export const migration001: Migration = {
  version: 1,
  name: "arena_init",
  up: (db) => seedArenaDatabase({ ...db, version: 0 }),
};

export const MIGRATIONS: Migration[] = [migration001];

export function runMigrations(db: ArenaDatabase): ArenaDatabase {
  let current = { ...db };
  for (const migration of MIGRATIONS) {
    if (current.version < migration.version) {
      current = migration.up(current);
      current.version = migration.version;
    }
  }
  return current;
}
