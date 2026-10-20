// Wird von Middleware (Edge) und Server-Code genutzt: nur Web-APIs verwenden.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "campus_session";
export const SESSION_DAYS = 30;

function secret(): Uint8Array {
  const s = process.env.CAMPUS_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("CAMPUS_SESSION_SECRET fehlt oder ist kürzer als 32 Zeichen.");
  return new TextEncoder().encode(s);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ sub: "student" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}
