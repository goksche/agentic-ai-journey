import "server-only";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const dataDir = path.resolve(process.env.DATA_DIR ?? "./data");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;
  fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(path.join(dataDir, "campus.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS task_progress (
      task_id TEXT PRIMARY KEY,
      done_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS module_progress (
      module_id TEXT PRIMARY KEY,
      quiz_score INTEGER,
      quiz_at TEXT,
      completed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      at TEXT NOT NULL,
      kind TEXT NOT NULL,
      ref TEXT NOT NULL
    );
  `);
  return db;
}

const now = () => new Date().toISOString();

export function doneTasks(): Map<string, string> {
  const rows = getDb().prepare("SELECT task_id, done_at FROM task_progress").all() as { task_id: string; done_at: string }[];
  return new Map(rows.map((r) => [r.task_id, r.done_at]));
}

export function setTaskDone(taskId: string, done: boolean): void {
  const d = getDb();
  if (done) {
    d.prepare("INSERT OR REPLACE INTO task_progress (task_id, done_at) VALUES (?, ?)").run(taskId, now());
    logActivity("task_done", taskId);
  } else {
    d.prepare("DELETE FROM task_progress WHERE task_id = ?").run(taskId);
    logActivity("task_reopened", taskId);
  }
}

export type ModuleProgress = { module_id: string; quiz_score: number | null; quiz_at: string | null; completed_at: string | null };

export function moduleProgress(): Map<string, ModuleProgress> {
  const rows = getDb().prepare("SELECT * FROM module_progress").all() as ModuleProgress[];
  return new Map(rows.map((r) => [r.module_id, r]));
}

export function setQuizScore(moduleId: string, score: number | null): void {
  getDb()
    .prepare(
      `INSERT INTO module_progress (module_id, quiz_score, quiz_at) VALUES (?, ?, ?)
       ON CONFLICT(module_id) DO UPDATE SET quiz_score = excluded.quiz_score, quiz_at = excluded.quiz_at`,
    )
    .run(moduleId, score, score === null ? null : now());
  if (score !== null) logActivity("quiz", `${moduleId}:${score}`);
}

export function setModuleCompleted(moduleId: string, completed: boolean): void {
  getDb()
    .prepare(
      `INSERT INTO module_progress (module_id, completed_at) VALUES (?, ?)
       ON CONFLICT(module_id) DO UPDATE SET completed_at = excluded.completed_at`,
    )
    .run(moduleId, completed ? now() : null);
  logActivity(completed ? "module_completed" : "module_reopened", moduleId);
}

export function logActivity(kind: string, ref: string): void {
  getDb().prepare("INSERT INTO activity (at, kind, ref) VALUES (?, ?, ?)").run(now(), kind, ref);
}

export type Activity = { at: string; kind: string; ref: string };

export function recentActivity(limit = 8): Activity[] {
  return getDb().prepare("SELECT at, kind, ref FROM activity ORDER BY id DESC LIMIT ?").all(limit) as Activity[];
}

export function lastOpenedDoc(): string | null {
  const row = getDb().prepare("SELECT ref FROM activity WHERE kind = 'doc_opened' ORDER BY id DESC LIMIT 1").get() as
    | { ref: string }
    | undefined;
  return row?.ref ?? null;
}
