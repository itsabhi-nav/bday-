import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { moveCustomerUploads } from "@/lib/upload";
import type { SiteData } from "@/lib/sitedata";
import { requireSession } from "../_session";

/**
 * GET ?username= (owner only param) → the caller's site doc.
 * PUT {data, slug?} → save. Slug change migrates the page + uploaded images.
 */
export async function GET(req: Request) {
  const s = await requireSession();
  if (!s.ok) return s.res;
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("username") || s.username;
  if (s.role !== "owner" && target !== s.username) {
    return NextResponse.json({ error: "Not your page" }, { status: 403 });
  }
  const site = await getStore().getSiteByUsername(target);
  if (!site) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  return NextResponse.json({ site });
}

export async function PUT(req: Request) {
  const s = await requireSession();
  if (!s.ok) return s.res;
  const body = (await req.json().catch(() => ({}))) as {
    username?: string;
    data?: SiteData;
    slug?: string;
  };
  const target = body.username || s.username;
  if (s.role !== "owner" && target !== s.username) {
    return NextResponse.json({ error: "Not your page" }, { status: 403 });
  }
  if (!body.data || typeof body.data.girlfriendName !== "string") {
    return NextResponse.json({ error: "Invalid page data" }, { status: 400 });
  }
  // storage-DoS guard: a page is text + photo URLs, never megabytes
  if (JSON.stringify(body.data).length > 200 * 1024) {
    return NextResponse.json({ error: "Page data too large — shorten text" }, { status: 400 });
  }
  const store = getStore();
  const site = await store.getSiteByUsername(target);
  if (!site) return NextResponse.json({ error: "Page not found" }, { status: 404 });

  const { slugify } = await import("@/lib/sitedata");
  let newSlug = (body.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!newSlug) {
    // customer never set a URL → derive it from her name at save time
    newSlug = slugify(body.data.girlfriendName || "someone-special");
  }
  if (newSlug.length < 3) {
    return NextResponse.json({ error: "Page URL too short — use 3+ letters" }, { status: 400 });
  }

  try {
    if (newSlug !== site.slug) {
      // check BEFORE touching uploads — a taken URL must not strand moved images
      if (await store.getSite(newSlug)) {
        return NextResponse.json({ error: "Page URL already taken" }, { status: 400 });
      }
      await moveCustomerUploads(site.slug, newSlug);
      const moved = await store.moveSite(site.slug, newSlug);
      if (!moved) throw new Error("Could not move page");
      // rewrite any uploaded-image URLs that embed the old slug
      const json = JSON.stringify(moved.data).split(`/uploads/${site.slug}/`).join(`/uploads/${newSlug}/`);
      moved.data = JSON.parse(json) as SiteData;
      moved.updatedAt = new Date().toISOString();
      // merge the freshly edited data on top, keeping the new slug
      moved.data = { ...(body.data as SiteData), slug: newSlug };
      await store.saveSite(moved);
      return NextResponse.json({ ok: true, slug: newSlug });
    }
    site.data = { ...(body.data as SiteData), slug: site.slug };
    site.updatedAt = new Date().toISOString();
    await store.saveSite(site);
    return NextResponse.json({ ok: true, slug: site.slug });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
