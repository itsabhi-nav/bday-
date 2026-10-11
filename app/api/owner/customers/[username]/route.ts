import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { deleteCustomerUploads } from "@/lib/upload";
import { requireSession } from "../../../_session";

/** PATCH {password?, expiresAt?, slug?} → reset password / extend expiry / relink page (owner only). */
export async function PATCH(req: Request, { params }: { params: { username: string } }) {
  const s = await requireSession();
  if (!s.ok || s.role !== "owner") return NextResponse.json({ error: "Owner only" }, { status: 403 });
  const body = (await req.json().catch(() => ({}))) as { password?: string; expiresAt?: string | null; slug?: string };
  const patch: { passHash?: string; expiresAt?: string | null; slug?: string } = {};
  if (body.password !== undefined) {
    if (body.password.length < 4) return NextResponse.json({ error: "Password must be 4+ characters" }, { status: 400 });
    patch.passHash = await hashPassword(body.password);
  }
  if (body.expiresAt !== undefined) patch.expiresAt = body.expiresAt || null;
  if (body.slug !== undefined) {
    const clean = body.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (clean.length < 3) return NextResponse.json({ error: "Page URL too short — use 3+ letters" }, { status: 400 });
    patch.slug = clean;
  }
  try {
    await getStore().updateCustomer(params.username, patch);
    const site = await getStore().getSiteByUsername(params.username);
    if (site && body.expiresAt !== undefined) {
      site.expiresAt = body.expiresAt || null;
      site.updatedAt = new Date().toISOString();
      await getStore().saveSite(site);
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

/** DELETE → wipe customer, their page AND all uploaded images (owner only). */
export async function DELETE(_req: Request, { params }: { params: { username: string } }) {
  const s = await requireSession();
  if (!s.ok || s.role !== "owner") return NextResponse.json({ error: "Owner only" }, { status: 403 });
  const site = await getStore().deleteCustomer(params.username);
  if (site) {
    try {
      await deleteCustomerUploads(site.slug);
    } catch {
      /* storage cleanup best-effort */
    }
  }
  return NextResponse.json({ ok: true });
}
