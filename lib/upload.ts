import { promises as fs } from "fs";
import path from "path";
import { isSupabase } from "./db";

/**
 * Image storage with two backends:
 *  - Local: public/uploads/<slug>/ — served statically, zero setup.
 *  - Supabase: `uploads` bucket (same <slug>/ prefix) — set SUPABASE_URL +
 *    SUPABASE_SERVICE_KEY. Make the bucket PUBLIC so pages can load images.
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 8 * 1024 * 1024;

function extOf(name: string, type: string): string {
  const fromName = (name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) return fromName === "jpeg" ? "jpg" : fromName;
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

function sbStorage(pathname: string, init: RequestInit): Promise<Response> {
  const url = process.env.SUPABASE_URL!.replace(/\/$/, "");
  return fetch(`${url}/storage/v1/${pathname}`, {
    ...init,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
      ...(init.headers || {}),
    },
  });
}

/** Save an uploaded image. Returns the public URL to store in site data. */
export async function saveUpload(slug: string, file: File): Promise<string> {
  if (!ALLOWED.has(file.type)) throw new Error("Only JPG, PNG, WEBP or GIF images allowed");
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) throw new Error("Image must be under 8 MB");
  if (buf.length === 0) throw new Error("Empty file");

  const cleanSlug = slug.replace(/[^a-z0-9-]/g, "") || "site";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extOf(file.name, file.type)}`;

  if (isSupabase()) {
    const key = `${cleanSlug}/${name}`;
    const res = await sbStorage(`object/uploads/${key}`, {
      method: "POST",
      headers: { "Content-Type": file.type, "x-upsert": "true" },
      body: new Uint8Array(buf),
    });
    if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
    return `${process.env.SUPABASE_URL!.replace(/\/$/, "")}/storage/v1/object/public/uploads/${key}`;
  }

  const dir = path.join(UPLOAD_DIR, cleanSlug);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buf);
  return `/uploads/${cleanSlug}/${name}`;
}

/** Delete EVERYTHING a customer uploaded (called when owner deletes them). */
export async function deleteCustomerUploads(slug: string): Promise<void> {
  const cleanSlug = slug.replace(/[^a-z0-9-]/g, "") || "site";
  if (isSupabase()) {
    // list + delete all objects under the prefix
    const list = await sbStorage(`object/list/uploads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefix: cleanSlug, limit: 1000 }),
    });
    if (list.ok) {
      const items = (await list.json()) as { name: string }[];
      const keys = items.map((i) => `${cleanSlug}/${i.name}`);
      if (keys.length) {
        await sbStorage(`object/uploads`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prefixes: keys }),
        });
      }
    }
    return;
  }
  await fs.rm(path.join(UPLOAD_DIR, cleanSlug), { recursive: true, force: true });
}

/** Move uploads when a page slug changes (best-effort; old URLs may break if it fails). */
export async function moveCustomerUploads(oldSlug: string, newSlug: string): Promise<void> {
  const from = oldSlug.replace(/[^a-z0-9-]/g, "");
  const to = newSlug.replace(/[^a-z0-9-]/g, "");
  if (!from || !to || from === to) return;
  if (isSupabase()) {
    const list = await sbStorage(`object/list/uploads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefix: from, limit: 1000 }),
    });
    if (list.ok) {
      const items = (await list.json()) as { name: string }[];
      for (const i of items) {
        await sbStorage(`object/move`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bucketId: "uploads", sourceKey: `${from}/${i.name}`, destinationKey: `${to}/${i.name}` }),
        });
      }
    }
    return;
  }
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.rename(path.join(UPLOAD_DIR, from), path.join(UPLOAD_DIR, to));
  } catch {
    /* folder may not exist — fine */
  }
}
