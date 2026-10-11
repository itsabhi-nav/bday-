import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

/**
 * Keep-alive endpoint. Hit this every few days (GitHub Actions does it
 * automatically — see .github/workflows/keepalive.yml) so the free
 * Supabase project never goes to sleep.
 */
export async function GET() {
  try {
    const customers = await getStore().listCustomers();
    return NextResponse.json({ ok: true, db: "awake", customers: customers.length });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
