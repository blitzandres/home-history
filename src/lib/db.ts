import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { Entry, EntryImage, Home, HomeWithEntries } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "home-history.db");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

let dbInstance: Database.Database | null = null;

function ensureDirs() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;
  ensureDirs();
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS homes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      address TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      home_id INTEGER NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
      year_start INTEGER,
      year_end INTEGER,
      story TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS entry_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
      path TEXT NOT NULL,
      original_name TEXT NOT NULL DEFAULT ''
    );
  `);
  dbInstance = db;
  return db;
}

export function getUploadsDir(): string {
  ensureDirs();
  return UPLOADS_DIR;
}

export function findOrCreateHome(address: string, slug: string): Home {
  const db = getDb();
  const existing = db
    .prepare("SELECT * FROM homes WHERE slug = ?")
    .get(slug) as Home | undefined;
  if (existing) return existing;

  const result = db
    .prepare("INSERT INTO homes (slug, address) VALUES (?, ?)")
    .run(slug, address.trim());
  return db
    .prepare("SELECT * FROM homes WHERE id = ?")
    .get(result.lastInsertRowid) as Home;
}

export function getHomeBySlug(slug: string): Home | null {
  const db = getDb();
  const home = db
    .prepare("SELECT * FROM homes WHERE slug = ?")
    .get(slug) as Home | undefined;
  return home ?? null;
}

export function getHomeWithEntries(slug: string): HomeWithEntries | null {
  const home = getHomeBySlug(slug);
  if (!home) return null;

  const db = getDb();
  const entries = db
    .prepare(
      `SELECT * FROM entries
       WHERE home_id = ?
       ORDER BY
         CASE WHEN year_start IS NULL THEN 1 ELSE 0 END,
         year_start ASC,
         year_end ASC,
         created_at ASC`
    )
    .all(home.id) as Omit<Entry, "images">[];

  const imageStmt = db.prepare(
    "SELECT * FROM entry_images WHERE entry_id = ? ORDER BY id ASC"
  );

  const withImages: Entry[] = entries.map((e) => ({
    ...e,
    images: imageStmt.all(e.id) as EntryImage[],
  }));

  return { ...home, entries: withImages };
}

export function createEntry(params: {
  homeId: number;
  yearStart: number | null;
  yearEnd: number | null;
  story: string;
  images: { relativePath: string; originalName: string }[];
}): Entry {
  const db = getDb();
  const insertEntry = db.prepare(
    `INSERT INTO entries (home_id, year_start, year_end, story)
     VALUES (?, ?, ?, ?)`
  );
  const insertImage = db.prepare(
    `INSERT INTO entry_images (entry_id, path, original_name)
     VALUES (?, ?, ?)`
  );

  const tx = db.transaction(() => {
    const result = insertEntry.run(
      params.homeId,
      params.yearStart,
      params.yearEnd,
      params.story
    );
    const entryId = Number(result.lastInsertRowid);
    for (const img of params.images) {
      insertImage.run(entryId, img.relativePath, img.originalName);
    }
    return entryId;
  });

  const entryId = tx();
  const entry = db
    .prepare("SELECT * FROM entries WHERE id = ?")
    .get(entryId) as Omit<Entry, "images">;
  const images = db
    .prepare("SELECT * FROM entry_images WHERE entry_id = ?")
    .all(entryId) as EntryImage[];
  return { ...entry, images };
}
