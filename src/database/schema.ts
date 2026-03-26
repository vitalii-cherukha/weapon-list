import { db } from './client';

export function initDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS weapons (
      id TEXT PRIMARY KEY,
      model TEXT NOT NULL,
      serialNumber TEXT UNIQUE NOT NULL,
      owner TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'STORAGE',
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `);
}
