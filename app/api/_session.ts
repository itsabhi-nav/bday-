import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

/** Returns the current session or a 401. Shared by all protected routes. */
export async function requireSession(): Promise<
  { ok: true; username: string; role: "owner" | "customer" } | { ok: false; res: NextResponse }
> {
  const s = verifySession(cookies().get("bsess")?.value);
  if (!s) return { ok: false, res: NextResponse.json({ error: "Login required" }, { status: 401 }) };
  return { ok: true, username: s.username, role: s.role };
}
