import "server-only";
import fs from "node:fs";
import path from "node:path";
import { load as parseYaml } from "js-yaml";

export type Task = { id: string; title: string; hours?: number };
export type Module = {
  id: string;
  title: string;
  weeks: string;
  project?: boolean;
  skript?: string;
  aufgaben?: string;
  quiz?: string;
  tasks: Task[];
};
export type Semester = { id: string; title: string; weeks: string; goal: string; modules: Module[] };
export type Curriculum = { title: string; start: string; weeks_total: number; semesters: Semester[] };

export const contentDir = path.resolve(process.env.CONTENT_DIR ?? "..");

export function loadCurriculum(): Curriculum {
  const raw = fs.readFileSync(path.join(contentDir, "curriculum.yaml"), "utf8");
  const data = parseYaml(raw) as Curriculum;
  // js-yaml liest Datumswerte als Date-Objekt
  const start = (data.start as unknown) instanceof Date ? (data.start as unknown as Date).toISOString().slice(0, 10) : String(data.start);
  return { ...data, start };
}

export function allModules(c: Curriculum): (Module & { semesterId: string })[] {
  return c.semesters.flatMap((s) => s.modules.map((m) => ({ ...m, semesterId: s.id })));
}

/** Ein Modul ist freigeschaltet, sobald sein Aufgabenblatt im Repo liegt. */
export function isReleased(m: Module): boolean {
  return !!m.aufgaben && fileExists(m.aufgaben);
}

export function fileExists(rel: string): boolean {
  const abs = safeResolve(rel);
  return !!abs && fs.existsSync(abs);
}

/** Löst einen Repo-Pfad auf und verhindert Ausbrüche aus dem Inhaltsordner. */
export function safeResolve(rel: string): string | null {
  const abs = path.resolve(contentDir, rel);
  if (abs !== contentDir && !abs.startsWith(contentDir + path.sep)) return null;
  return abs;
}

export function readDoc(rel: string): string | null {
  if (!rel.endsWith(".md")) return null;
  const abs = safeResolve(rel);
  if (!abs || !fs.existsSync(abs) || !fs.statSync(abs).isFile()) return null;
  return fs.readFileSync(abs, "utf8");
}

/** Studienwoche ab Startdatum (1-basiert); 0 = vor dem offiziellen Start. */
export function currentWeek(c: Curriculum, now = new Date()): number {
  const start = new Date(c.start + "T00:00:00");
  const diffDays = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  if (diffDays < 0) return 0;
  return Math.min(c.weeks_total, Math.floor(diffDays / 7) + 1);
}

export function daysUntilStart(c: Curriculum, now = new Date()): number {
  const start = new Date(c.start + "T00:00:00");
  return Math.ceil((start.getTime() - now.getTime()) / 86_400_000);
}

/** «2–3» → [2, 3], «1» → [1, 1] */
export function weekRange(weeks: string): [number, number] {
  const parts = weeks.split(/[–-]/).map((p) => parseInt(p.trim(), 10));
  return [parts[0], parts[1] ?? parts[0]];
}
