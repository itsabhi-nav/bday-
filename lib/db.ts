import { promises as fs } from "fs";
import path from "path";
import type { SiteData } from "./sitedata";

/**
 * Storage layer with two backends:
 *  - Local (default): JSON files in ./data — perfect for preview/dev.
 *  - Supabase (production): set SUPABASE_URL + SUPABASE_SERVICE_KEY env vars.
 *    Zero new npm dependencies — talks to Supabase over plain fetch (REST).
 */

export interface Customer {
  username: string;
  passHash: string;
  slug: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface SiteDoc {
  slug: string;
  username: string;
  data: SiteData;
  createdAt: string;
  expiresAt: string | null;
  updatedAt: string;
}

export interface CustomerView extends Customer {
  girlName: string;
}

export interface Store {
  listCustomers(): Promise<CustomerView[]>;
  getCustomer(username: string): Promise<Customer | null>;
  createCustomer(c: Customer, site: SiteDoc): Promise<void>;
  updateCustomer(username: string, patch: Partial<Pick<Customer, "passHash" | "slug" | "expiresAt">>): Promise<void>;
  deleteCustomer(username: string): Promise<SiteDoc | null>;
  getSite(slug: string): Promise<SiteDoc | null>;
  getSiteByUsername(username: string): Promise<SiteDoc | null>;
  saveSite(site: SiteDoc): Promise<void>;
  moveSite(oldSlug: string, newSlug: string): Promise<SiteDoc | null>;
}

// ─────────────────────────── File store (local) ───────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, file), "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(value, null, 2));
}

class FileStore implements Store {
  private async customers(): Promise<Record<string, Customer>> {
    return readJson("customers.json", {});
  }
  private async sites(): Promise<Record<string, SiteDoc>> {
    return readJson("sites.json", {});
  }

  async listCustomers(): Promise<CustomerView[]> {
    const [cs, ss] = [await this.customers(), await this.sites()];
    return Object.values(cs)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((c) => ({ ...c, girlName: ss[c.slug]?.data.girlfriendName ?? "—" }));
  }
  async getCustomer(username: string) {
    return (await this.customers())[username] ?? null;
  }
  async createCustomer(c: Customer, site: SiteDoc) {
    const cs = await this.customers();
    const ss = await this.sites();
    if (cs[c.username]) throw new Error("Username already exists");
    if (ss[site.slug]) throw new Error("Page URL already taken");
    cs[c.username] = c;
    ss[site.slug] = site;
    await writeJson("customers.json", cs);
    await writeJson("sites.json", ss);
  }
  async updateCustomer(username: string, patch: Partial<Pick<Customer, "passHash" | "slug" | "expiresAt">>) {
    const cs = await this.customers();
    const c = cs[username];
    if (!c) throw new Error("Customer not found");
    const ss = await this.sites();
    if (patch.slug && patch.slug !== c.slug) {
      if (ss[patch.slug]) throw new Error("Page URL already taken");
      const site = ss[c.slug];
      delete ss[c.slug];
      if (site) {
        site.slug = patch.slug;
        site.data.slug = patch.slug;
        ss[patch.slug] = site;
      }
      await writeJson("sites.json", ss);
    }
    cs[username] = { ...c, ...patch };
    await writeJson("customers.json", cs);
  }
  async deleteCustomer(username: string) {
    const cs = await this.customers();
    const c = cs[username];
    if (!c) return null;
    const ss = await this.sites();
    const site = ss[c.slug] ?? null;
    delete ss[c.slug];
    delete cs[username];
    await writeJson("customers.json", cs);
    await writeJson("sites.json", ss);
    return site;
  }
  async getSite(slug: string) {
    return (await this.sites())[slug] ?? null;
  }
  async getSiteByUsername(username: string) {
    const c = await this.getCustomer(username);
    if (!c) return null;
    return this.getSite(c.slug);
  }
  async saveSite(site: SiteDoc) {
    const ss = await this.sites();
    ss[site.slug] = site;
    await writeJson("sites.json", ss);
  }
  async moveSite(oldSlug: string, newSlug: string) {
    const ss = await this.sites();
    const site = ss[oldSlug];
    if (!site) return null;
    if (ss[newSlug]) throw new Error("Page URL already taken");
    delete ss[oldSlug];
    site.slug = newSlug;
    site.data.slug = newSlug;
    ss[newSlug] = site;
    await writeJson("sites.json", ss);
    const cs = await this.customers();
    if (cs[site.username]) {
      cs[site.username].slug = newSlug;
      await writeJson("customers.json", cs);
    }
    return site;
  }
}

// ─────────────────────────── Supabase store (production) ───────────────────────────

function sbEnv(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export function isSupabase(): boolean {
  return sbEnv() !== null;
}

async function sb<T>(table: string, init: RequestInit & { query?: string } = {}): Promise<T> {
  const env = sbEnv();
  if (!env) throw new Error("Supabase not configured");
  const res = await fetch(`${env.url}/rest/v1/${table}${init.query ?? ""}`, {
    ...init,
    headers: {
      apikey: env.key,
      Authorization: `Bearer ${env.key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`DB error: ${await res.text()}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

const rowToCustomer = (r: Record<string, string | null>): Customer => ({
  username: r.username as string,
  passHash: r.pass_hash as string,
  slug: r.slug as string,
  createdAt: r.created_at as string,
  expiresAt: r.expires_at,
});

const rowToSite = (r: Record<string, unknown>): SiteDoc => ({
  slug: r.slug as string,
  username: r.username as string,
  data: r.data as SiteData,
  createdAt: r.created_at as string,
  expiresAt: (r.expires_at as string | null) ?? null,
  updatedAt: r.updated_at as string,
});

class SupabaseStore implements Store {
  async listCustomers(): Promise<CustomerView[]> {
    const rows = await sb<Record<string, string>[]>("customers", { query: "?select=*&order=created_at.desc" });
    const sites = await sb<Record<string, unknown>[]>("sites", { query: "?select=slug,data" });
    const names: Record<string, string> = {};
    for (const s of sites) names[s.slug as string] = (s.data as SiteData)?.girlfriendName ?? "—";
    return rows.map((r) => ({ ...rowToCustomer(r), girlName: names[r.slug] ?? "—" }));
  }
  async getCustomer(username: string) {
    const rows = await sb<Record<string, string>[]>("customers", {
      query: `?select=*&username=eq.${encodeURIComponent(username)}`,
    });
    return rows[0] ? rowToCustomer(rows[0]) : null;
  }
  async createCustomer(c: Customer, site: SiteDoc) {
    if (await this.getCustomer(c.username)) throw new Error("Username already exists");
    if (await this.getSite(site.slug)) throw new Error("Page URL already taken");
    await sb("customers", {
      method: "POST",
      body: JSON.stringify({
        username: c.username,
        pass_hash: c.passHash,
        slug: c.slug,
        created_at: c.createdAt,
        expires_at: c.expiresAt,
      }),
    });
    await sb("sites", {
      method: "POST",
      body: JSON.stringify({
        slug: site.slug,
        username: site.username,
        data: site.data,
        created_at: site.createdAt,
        expires_at: site.expiresAt,
        updated_at: site.updatedAt,
      }),
    });
  }
  async updateCustomer(username: string, patch: Partial<Pick<Customer, "passHash" | "slug" | "expiresAt">>) {
    const body: Record<string, unknown> = {};
    if (patch.passHash !== undefined) body.pass_hash = patch.passHash;
    if (patch.expiresAt !== undefined) body.expires_at = patch.expiresAt;
    if (patch.slug !== undefined) {
      if (await this.getSite(patch.slug)) throw new Error("Page URL already taken");
      body.slug = patch.slug;
      const site = await this.getSiteByUsername(username);
      if (site) {
        await sb("sites", {
          method: "PATCH",
          query: `?slug=eq.${encodeURIComponent(site.slug)}`,
          body: JSON.stringify({ slug: patch.slug }),
        });
        site.slug = patch.slug;
        site.data.slug = patch.slug;
        await this.saveSite(site);
      }
    }
    if (Object.keys(body).length) {
      await sb("customers", {
        method: "PATCH",
        query: `?username=eq.${encodeURIComponent(username)}`,
        body: JSON.stringify(body),
      });
    }
  }
  async deleteCustomer(username: string) {
    const site = await this.getSiteByUsername(username);
    if (site) {
      await sb("sites", { method: "DELETE", query: `?slug=eq.${encodeURIComponent(site.slug)}` });
    }
    await sb("customers", { method: "DELETE", query: `?username=eq.${encodeURIComponent(username)}` });
    return site;
  }
  async getSite(slug: string) {
    const rows = await sb<Record<string, unknown>[]>("sites", {
      query: `?select=*&slug=eq.${encodeURIComponent(slug)}`,
    });
    return rows[0] ? rowToSite(rows[0]) : null;
  }
  async getSiteByUsername(username: string) {
    const c = await this.getCustomer(username);
    if (!c) return null;
    return this.getSite(c.slug);
  }
  async saveSite(site: SiteDoc) {
    await sb("sites", {
      method: "PATCH",
      query: `?slug=eq.${encodeURIComponent(site.slug)}`,
      body: JSON.stringify({ data: site.data, expires_at: site.expiresAt, updated_at: site.updatedAt }),
    });
  }
  async moveSite(oldSlug: string, newSlug: string) {
    const site = await this.getSite(oldSlug);
    if (!site) return null;
    if (await this.getSite(newSlug)) throw new Error("Page URL already taken");
    site.slug = newSlug;
    site.data.slug = newSlug;
    await sb("sites", { method: "POST", body: JSON.stringify({ ...site, data: site.data }) });
    await sb("sites", { method: "DELETE", query: `?slug=eq.${encodeURIComponent(oldSlug)}` });
    const c = await this.getCustomer(site.username);
    if (c) await this.updateCustomer(site.username, { slug: newSlug });
    return site;
  }
}

let store: Store | null = null;
/** Single store instance — Supabase in production, local JSON files otherwise. */
export function getStore(): Store {
  if (!store) store = isSupabase() ? new SupabaseStore() : new FileStore();
  return store;
}
