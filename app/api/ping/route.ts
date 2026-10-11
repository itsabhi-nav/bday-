import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

/**
 * Keep-alive endpoint. Hit this every few days (GitHub Actions does it
 * automatically — see .github/workflows/keepalive.yml) so the free
 * Supabase project never goes to sleep.
 */
export async function GET() {
  try {
    // touch the DB so free Supabase stays awake — but reveal nothing (no counts)
    await getStore().listCustomers();
    return NextResponse.json({ ok: true, db: "awake" });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
