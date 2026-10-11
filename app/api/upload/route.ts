import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { saveUpload } from "@/lib/upload";
import { requireSession } from "../_session";

/** POST multipart {file, slug?} → {url}. Customers may only upload to their own page. */
export async function POST(req: Request) {
  const s = await requireSession();
  if (!s.ok) return s.res;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  let slug = (form?.get("slug") as string) || "";
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  if (s.role !== "owner") {
    const site = await getStore().getSiteByUsername(s.username);
    if (!site) return NextResponse.json({ error: "Page not found" }, { status: 404 });
    slug = site.slug; // customers always upload to their own page
  }
  if (!slug) return NextResponse.json({ error: "Missing page slug" }, { status: 400 });

  try {
    const url = await saveUpload(slug, file);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
