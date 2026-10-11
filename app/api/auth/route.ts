import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signSession, verifyPassword, ownerCreds, safeEqual, hasRealSecret } from "@/lib/auth";
import { getStore } from "@/lib/db";

const COOKIE = "bsess";

// ── brute-force guard: max 10 login tries per IP per 10 minutes ──
const attempts = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (attempts.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  attempts.set(ip, list);
  if (attempts.size > 5000) attempts.clear(); // memory hygiene
  return list.length > 10;
}

function cookieFlags(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function setSession(res: NextResponse, value: string) {
  res.cookies.set(COOKIE, value, cookieFlags(30 * 86400));
}

/** POST {username, password} → sets session cookie, returns {role, redirect}. */
export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many tries — 10 minute ruko, phir try karo" },
      { status: 429 }
    );
  }

  const { username, password } = (await req.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };
  const u = (username || "").trim();
  if (!u || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  // owner first (constant-time compare)
  const owner = ownerCreds();
  if (safeEqual(u, owner.user) && safeEqual(password, owner.pass)) {
    const res = NextResponse.json({ role: "owner", redirect: "/admin/owner" });
    setSession(res, signSession({ username: u, role: "owner" }));
    return res;
  }

  // then customers — same error message either way (no username guessing)
  const customer = await getStore().getCustomer(u);
  if (customer && (await verifyPassword(password, customer.passHash))) {
    const res = NextResponse.json({ role: "customer", redirect: "/admin/site" });
    setSession(res, signSession({ username: u, role: "customer" }));
    return res;
  }

  return NextResponse.json({ error: "Wrong username or password" }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", cookieFlags(0));
  return res;
}

/** Who am I? Used by admin pages to route owner vs customer. */
export async function GET() {
  const token = cookies().get(COOKIE)?.value;
  const { verifySession } = await import("@/lib/auth");
  const s = verifySession(token);
  if (!s) return NextResponse.json({ session: null, secure: hasRealSecret() });
  return NextResponse.json({
    session: { username: s.username, role: s.role },
    secure: hasRealSecret(),
  });
}

/** PATCH {oldPassword?, newPassword} → customer changes own password (owner: no old needed, pass username). */
export async function PATCH(req: Request) {
  const token = cookies().get(COOKIE)?.value;
  const { verifySession } = await import("@/lib/auth");
  const s = verifySession(token);
  if (!s) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as {
    username?: string;
    oldPassword?: string;
    newPassword?: string;
  };
  if (!body.newPassword || body.newPassword.length < 4) {
    return NextResponse.json({ error: "New password must be 4+ characters" }, { status: 400 });
  }
  const target = s.role === "owner" ? body.username || s.username : s.username;
  const store = getStore();
  if (s.role === "owner" && target === ownerCreds().user) {
    return NextResponse.json({ error: "Owner password lives in server env, not here" }, { status: 400 });
  }
  const customer = await store.getCustomer(target);
  if (!customer) return NextResponse.json({ error: "Account not found" }, { status: 404 });
  if (s.role !== "owner") {
    if (!(await verifyPassword(body.oldPassword || "", customer.passHash))) {
      return NextResponse.json({ error: "Current password is wrong" }, { status: 403 });
    }
  }
  const { hashPassword } = await import("@/lib/auth");
  await store.updateCustomer(target, { passHash: await hashPassword(body.newPassword) });
  return NextResponse.json({ ok: true });
}
