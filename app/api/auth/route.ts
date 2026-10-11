import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signSession, verifyPassword, ownerCreds } from "@/lib/auth";
import { getStore } from "@/lib/db";

const COOKIE = "bsess";

function setSession(res: NextResponse, value: string) {
  res.cookies.set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 86400,
  });
}

/** POST {username, password} → sets session cookie, returns {role, redirect}. */
export async function POST(req: Request) {
  const { username, password } = (await req.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };
  const u = (username || "").trim();
  if (!u || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  // owner first
  const owner = ownerCreds();
  if (u === owner.user && password === owner.pass) {
    const res = NextResponse.json({ role: "owner", redirect: "/admin/owner" });
    setSession(res, signSession({ username: u, role: "owner" }));
    return res;
  }

  // then customers
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
  res.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

/** Who am I? Used by admin pages to route owner vs customer. */
export async function GET() {
  const token = cookies().get(COOKIE)?.value;
  const { verifySession } = await import("@/lib/auth");
  const s = verifySession(token);
  if (!s) return NextResponse.json({ session: null });
  return NextResponse.json({ session: { username: s.username, role: s.role } });
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
