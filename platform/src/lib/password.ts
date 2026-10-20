import "server-only";
import { scryptSync, timingSafeEqual } from "node:crypto";

/** Prüft ein Passwort gegen CAMPUS_PASSWORD_HASH im Format scrypt:<salt>:<hash>. */
export function verifyPassword(password: string): boolean {
  const stored = process.env.CAMPUS_PASSWORD_HASH ?? "";
  const [algo, salt, hashHex] = stored.split(":");
  if (algo !== "scrypt" || !salt || !hashHex) {
    throw new Error("CAMPUS_PASSWORD_HASH fehlt oder hat ein ungültiges Format.");
  }
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}

// Einfacher Schutz gegen Durchprobieren: max. 8 Fehlversuche pro 15 Minuten und IP.
const failures = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

export function isLockedOut(ip: string): boolean {
  const recent = (failures.get(ip) ?? []).filter((t) => Date.now() - t < WINDOW_MS);
  failures.set(ip, recent);
  return recent.length >= MAX_FAILURES;
}

export function recordFailure(ip: string): void {
  failures.set(ip, [...(failures.get(ip) ?? []), Date.now()]);
}

export function clearFailures(ip: string): void {
  failures.delete(ip);
}
