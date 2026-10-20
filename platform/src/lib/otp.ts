import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import {
  countLoginCodesSince,
  deleteLoginCode,
  insertLoginCode,
  latestLoginCode,
  markLoginCodeUsed,
  recordLoginCodeAttempt,
} from "./db";

export const CODE_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const MIN_INTERVAL_MS = 60 * 1000;
const MAX_CODES_PER_HOUR = 5;

/** Codes werden nur als HMAC gespeichert; der Schlüssel ist das Sitzungsgeheimnis. */
export function hashCode(code: string): string {
  const s = process.env.CAMPUS_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("CAMPUS_SESSION_SECRET fehlt oder ist kürzer als 32 Zeichen.");
  return createHmac("sha256", s).update(code).digest("hex");
}

export type IssueResult =
  | { ok: true; id: number; code: string }
  | { ok: false; reason: "too_soon" | "too_many" };

export function issueLoginCode(): IssueResult {
  const nowMs = Date.now();
  const last = latestLoginCode();
  if (last && nowMs - Date.parse(last.created_at) < MIN_INTERVAL_MS) return { ok: false, reason: "too_soon" };
  if (countLoginCodesSince(new Date(nowMs - 60 * 60 * 1000).toISOString()) >= MAX_CODES_PER_HOUR) {
    return { ok: false, reason: "too_many" };
  }
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const id = insertLoginCode(hashCode(code), new Date(nowMs + CODE_TTL_MINUTES * 60 * 1000).toISOString());
  return { ok: true, id, code };
}

/** Für den Fall, dass die E-Mail nicht verschickt werden konnte. */
export function discardLoginCode(id: number): void {
  deleteLoginCode(id);
}

export type VerifyResult = "ok" | "invalid" | "expired" | "locked";

export function verifyLoginCode(input: string): VerifyResult {
  const c = latestLoginCode();
  if (!c || c.used_at || Date.parse(c.expires_at) < Date.now()) return "expired";
  if (c.attempts >= MAX_ATTEMPTS) return "locked";
  const actual = Buffer.from(hashCode(input), "hex");
  const expected = Buffer.from(c.code_hash, "hex");
  if (actual.length === expected.length && timingSafeEqual(actual, expected)) {
    markLoginCodeUsed(c.id);
    return "ok";
  }
  recordLoginCodeAttempt(c.id);
  return c.attempts + 1 >= MAX_ATTEMPTS ? "locked" : "invalid";
}
