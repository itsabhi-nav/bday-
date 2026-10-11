import { createHmac, scrypt as _scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(_scrypt);

export const DEFAULT_CUSTOMER_PASSWORD = "9872";

function sessionSecret(): string {
  return process.env.SESSION_SECRET || "dev-only-secret-change-in-production";
}

export interface Session {
  username: string; // owner username or customer username
  role: "owner" | "customer";
  exp: number;
}

/** scrypt password hashing (salt:hash, hex). No dependencies. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [salt, hash] = stored.split(":");
    const derived = (await scryptAsync(password, salt, 64)) as Buffer;
    const expected = Buffer.from(hash, "hex");
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

function b64url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

export function signSession(s: Omit<Session, "exp">, daysValid = 30): string {
  const payload = b64url(JSON.stringify({ ...s, exp: Date.now() + daysValid * 864e5 }));
  const sig = createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const s = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    if (s.exp < Date.now()) return null;
    if (s.role !== "owner" && s.role !== "customer") return null;
    return s;
  } catch {
    return null;
  }
}

export function ownerCreds(): { user: string; pass: string } {
  return {
    user: process.env.OWNER_USER || "admin",
    pass: process.env.OWNER_PASS || "admin123",
  };
}

/** Constant-time string compare (no timing leaks on the owner login). */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    // still compare something to keep timing flat
    const dummy = Buffer.alloc(Math.max(ab.length, bb.length));
    timingSafeEqual(dummy, dummy);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

/** True only when a real SESSION_SECRET is configured (never ship default to prod). */
export function hasRealSecret(): boolean {
  const s = process.env.SESSION_SECRET || "";
  return s.length >= 16 && s !== "dev-only-secret-change-in-production";
}
