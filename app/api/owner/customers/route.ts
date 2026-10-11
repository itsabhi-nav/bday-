import { NextResponse } from "next/server";
import { hashPassword, DEFAULT_CUSTOMER_PASSWORD } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { defaultSiteData, slugify } from "@/lib/sitedata";
import { deleteCustomerUploads } from "@/lib/upload";
import { requireSession } from "../../_session";

/** GET → list all customers (owner only). */
export async function GET() {
  const s = await requireSession();
  if (!s.ok || s.role !== "owner") return NextResponse.json({ error: "Owner only" }, { status: 403 });
  const customers = await getStore().listCustomers();
  // never send password hashes to the browser — owner doesn't need them
  return NextResponse.json({
    customers: customers.map(({ passHash: _omit, ...c }) => c),
  });
}

/** POST {username, password?, girlName?, slug?, expiresAt?} → create customer + page. */
export async function POST(req: Request) {
  const s = await requireSession();
  if (!s.ok || s.role !== "owner") return NextResponse.json({ error: "Owner only" }, { status: 403 });
  const body = (await req.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
    girlName?: string;
    slug?: string;
    expiresAt?: string | null;
  };
  const username = (body.username || "").trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
  if (!username) return NextResponse.json({ error: "Username required (letters, numbers, - _)" }, { status: 400 });
  // Girl name + page URL are OPTIONAL here — the customer sets them himself
  // in his editor (that's when /her-name URL forms). Default slug = username
  // so multiple blank customers never collide.
  const girlName = (body.girlName || "").trim() || "Someone Special";
  const givenSlug = (body.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const slug = givenSlug || ((body.girlName || "").trim() ? slugify(girlName) : username);
  if (slug.length < 3) {
    return NextResponse.json({ error: "Page URL too short — use 3+ letters (e.g. rinki-kumari)" }, { status: 400 });
  }
  const password = body.password || DEFAULT_CUSTOMER_PASSWORD;
  if (password.length < 4) return NextResponse.json({ error: "Password must be 4+ characters" }, { status: 400 });

  const now = new Date().toISOString();
  const data = defaultSiteData(slug, girlName);
  try {
    await getStore().createCustomer(
      { username, passHash: await hashPassword(password), slug, createdAt: now, expiresAt: body.expiresAt ?? null },
      { slug, username, data, createdAt: now, expiresAt: body.expiresAt ?? null, updatedAt: now }
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  return NextResponse.json({ ok: true, username, slug });
}
