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
    CREATE TABLE IF NOT EXISTS login_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      used_at TEXT
    );
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id TEXT NOT NULL,
      at TEXT NOT NULL,
      mode TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      answers TEXT NOT NULL
    );
  `);
  return db;
}

const now = () => new Date().toISOString();

export type QuizAttempt = {
  id: number;
  module_id: string;
  at: string;
  mode: "exam" | "practice";
  score: number;
  total: number;
  answers: { questionId: string; chosen: number | null; correct: boolean }[];
};

type QuizAttemptRow = Omit<QuizAttempt, "answers"> & { answers: string };

const toAttempt = (r: QuizAttemptRow): QuizAttempt => ({ ...r, answers: JSON.parse(r.answers) });

export function insertQuizAttempt(a: Omit<QuizAttempt, "id" | "at">): number {
  const info = getDb()
    .prepare("INSERT INTO quiz_attempts (module_id, at, mode, score, total, answers) VALUES (?, ?, ?, ?, ?, ?)")
    .run(a.module_id, now(), a.mode, a.score, a.total, JSON.stringify(a.answers));
  logActivity(a.mode === "exam" ? "quiz" : "quiz_practice", `${a.module_id}:${a.score}/${a.total}`);
  return Number(info.lastInsertRowid);
}

export function getQuizAttempt(id: number): QuizAttempt | null {
  const row = getDb().prepare("SELECT * FROM quiz_attempts WHERE id = ?").get(id) as QuizAttemptRow | undefined;
  return row ? toAttempt(row) : null;
}

export function quizAttempts(moduleId: string): QuizAttempt[] {
  const rows = getDb().prepare("SELECT * FROM quiz_attempts WHERE module_id = ? ORDER BY id DESC").all(moduleId) as QuizAttemptRow[];
  return rows.map(toAttempt);
}

/** Speichert die beste Punktzahl aus einem Prüfungsdurchlauf als Quiz-Ergebnis des Moduls. */
export function recordBestQuizScore(moduleId: string, score: number): void {
  getDb()
    .prepare(
      `INSERT INTO module_progress (module_id, quiz_score, quiz_at) VALUES (?, ?, ?)
       ON CONFLICT(module_id) DO UPDATE SET
         quiz_score = MAX(COALESCE(module_progress.quiz_score, 0), excluded.quiz_score),
         quiz_at = CASE WHEN excluded.quiz_score >= COALESCE(module_progress.quiz_score, -1) THEN excluded.quiz_at ELSE module_progress.quiz_at END`,
    )
    .run(moduleId, score, now());
}

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

export type LoginCode = { id: number; code_hash: string; created_at: string; expires_at: string; attempts: number; used_at: string | null };

export function latestLoginCode(): LoginCode | null {
  return (getDb().prepare("SELECT * FROM login_codes ORDER BY id DESC LIMIT 1").get() as LoginCode | undefined) ?? null;
}

export function countLoginCodesSince(iso: string): number {
  const row = getDb().prepare("SELECT COUNT(*) AS n FROM login_codes WHERE created_at >= ?").get(iso) as { n: number };
  return row.n;
}

/** Legt einen neuen Code an; alle älteren offenen Codes werden damit ungültig. */
export function insertLoginCode(codeHash: string, expiresAt: string): number {
  const d = getDb();
  const at = now();
  d.prepare("UPDATE login_codes SET used_at = ? WHERE used_at IS NULL").run(at);
  const info = d.prepare("INSERT INTO login_codes (code_hash, created_at, expires_at) VALUES (?, ?, ?)").run(codeHash, at, expiresAt);
  return Number(info.lastInsertRowid);
}

export function deleteLoginCode(id: number): void {
  getDb().prepare("DELETE FROM login_codes WHERE id = ?").run(id);
}

export function recordLoginCodeAttempt(id: number): void {
  getDb().prepare("UPDATE login_codes SET attempts = attempts + 1 WHERE id = ?").run(id);
}

export function markLoginCodeUsed(id: number): void {
  getDb().prepare("UPDATE login_codes SET used_at = ? WHERE id = ?").run(now(), id);
}

export function lastOpenedDoc(): string | null {
  const row = getDb().prepare("SELECT ref FROM activity WHERE kind = 'doc_opened' ORDER BY id DESC LIMIT 1").get() as
    | { ref: string }
    | undefined;
  return row?.ref ?? null;
}
