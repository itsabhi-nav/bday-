"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Copy, LogOut, ExternalLink, KeyRound, CalendarClock, Send } from "lucide-react";
import { slugify } from "@/lib/sitedata";

interface Customer {
  username: string;
  slug: string;
  girlName: string;
  createdAt: string;
  expiresAt: string | null;
}

interface CreatedCreds {
  username: string;
  password: string;
  slug: string;
  named: boolean;
}

/** True once the customer has set her name (i.e. her page link is meaningful). */
function isNamed(c: { girlName: string }): boolean {
  return !!c.girlName && c.girlName !== "Someone Special";
}

function loginText(origin: string, username: string, password: string): string {
  return `Tumhara surprise studio ready hai ♥\nLogin: ${origin}/admin\nUsername: ${username}\nPassword: ${password}\nAndar her name set karke Save dabana — tab uska page link banega!`;
}

export default function OwnerDashboard() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", girlName: "", slug: "", password: "9872", expiresAt: "" });
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<CreatedCreds | null>(null);
  const [expiryEdits, setExpiryEdits] = useState<Record<string, string>>({});
  const [pwEdits, setPwEdits] = useState<Record<string, string>>({});
  const [busyUser, setBusyUser] = useState("");
  const [me, setMe] = useState("");
  const [secure, setSecure] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/owner/customers");
    if (res.status === 403 || res.status === 401) {
      router.replace("/admin");
      return;
    }
    const json = await res.json();
    setCustomers(json.customers || []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void load();
    (async () => {
      try {
        const me = await fetch("/api/auth").then((r) => r.json());
        if (me.session) setMe(me.session.username);
        if (me.secure === false) setSecure(false);
      } catch {
        /* ignore */
      }
    })();
  }, [load]);

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin");
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setCreated(null);
    const password = form.password || "9872";
    try {
      const res = await fetch("/api/owner/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          girlName: form.girlName,
          slug: form.slug || undefined,
          password,
          expiresAt: form.expiresAt || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setCreated({
        username: form.username,
        password,
        slug: json.slug,
        named: !!form.girlName.trim(),
      });
      setForm({ username: "", girlName: "", slug: "", password: "9872", expiresAt: "" });
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const saveExpiry = async (username: string) => {
    setBusyUser(username);
    setError("");
    try {
      const v = expiryEdits[username];
      const res = await fetch(`/api/owner/customers/${username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiresAt: v || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyUser("");
    }
  };

  const resetPassword = async (username: string) => {
    const pw = pwEdits[username] || "9872";
    if (!window.confirm(`Set ${username}'s password to "${pw}"?`)) return;
    setBusyUser(username);
    setError("");
    try {
      const res = await fetch(`/api/owner/customers/${username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setPwEdits((p) => ({ ...p, [username]: "" }));
      alert(`Done. ${username} / ${pw}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyUser("");
    }
  };

  const remove = async (c: Customer) => {
    if (!window.confirm(`Delete ${c.username} (${c.girlName})?\n\nThis wipes their page AND all uploaded photos forever.`)) return;
    if (!window.confirm("Pakka? This cannot be undone.")) return;
    setBusyUser(c.username);
    setError("");
    try {
      await fetch(`/api/owner/customers/${c.username}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyUser("");
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream text-cocoa">
        <p className="font-hand text-3xl">opening the boss room…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8 text-cocoa sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center gap-3">
          <div>
            <p className="font-hand text-2xl text-cherry">boss room</p>
            <h1 className="font-display text-4xl font-semibold">Customers</h1>
            {me && (
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cocoasoft">
                logged in as {me}
              </p>
            )}
          </div>
          <button onClick={logout} className="ml-auto flex items-center gap-1.5 rounded-full bg-cocoa/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition hover:bg-cocoa/20">
            <LogOut className="h-4 w-4" aria-hidden /> Out
          </button>
        </header>

        {!secure && (
          <p role="alert" className="mt-4 border-2 border-dashed border-cherry/60 bg-cherry/10 px-4 py-3 text-sm font-bold text-cherry">
            SESSION_SECRET set nahi hai! Vercel → Settings → Environment Variables me
            lambi random string dalo, warna koi bhi login bana sakta hai.
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 bg-cherry/10 px-4 py-2 text-sm font-bold text-cherry">
            {error}
          </p>
        )}

        {/* create */}
        <form onSubmit={create} className="relative mt-6 border border-cocoa/15 bg-[#FFFDF7] p-6 shadow-photo">
          <span className="tape -top-3 left-8 -rotate-6" aria-hidden />
          <h2 className="font-display text-2xl font-semibold">New customer</h2>
          <p className="mt-1 text-[13px] font-medium text-cocoasoft">
            Sirf <b>username + password</b> do — baaki (ladki ka naam, page URL) woh khud apne editor me set karega. Tabhi uska URL banega.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <label className="text-xs font-bold uppercase tracking-[0.14em]">
              Username (login)
              <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "") })} placeholder="aarav" className="mt-1 w-full rounded-md border-2 border-cocoa/25 bg-ivory px-3 py-2 text-sm normal-case tracking-normal" />
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.14em]">
              Girl name (optional)
              <input value={form.girlName} onChange={(e) => {
                const g = e.target.value;
                setForm((f) => ({ ...f, girlName: g, slug: f.slug || slugify(g) }));
              }} placeholder="Rinki Kumari" className="mt-1 w-full rounded-md border-2 border-cocoa/25 bg-ivory px-3 py-2 text-sm normal-case tracking-normal" />
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.14em]">
              Page URL (optional)
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} placeholder="auto: username" className="mt-1 w-full rounded-md border-2 border-cocoa/25 bg-ivory px-3 py-2 text-sm normal-case tracking-normal" />
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.14em]">
              Password (default 9872)
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="9872" className="mt-1 w-full rounded-md border-2 border-cocoa/25 bg-ivory px-3 py-2 text-sm normal-case tracking-normal" />
            </label>
            <label className="text-xs font-bold uppercase tracking-[0.14em]">
              Valid till (optional)
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="mt-1 w-full rounded-md border-2 border-cocoa/25 bg-ivory px-3 py-2 text-sm normal-case tracking-normal" />
            </label>
          </div>
          <button type="submit" disabled={creating} className="shadow-scrap-sm mt-4 flex items-center gap-1.5 rounded-full bg-cherry px-6 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-ivory transition hover:bg-cherrydeep disabled:opacity-60">
            <Plus className="h-4 w-4" aria-hidden /> {creating ? "Creating…" : "Create + get link"}
          </button>
          {created && (
            <div className="mt-4 border-2 border-dashed border-cherry/60 bg-butter/30 p-4" role="status">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cherry">
                Bande ko YE bhejo (admin login — ladki wala link nahi!)
              </p>
              <p className="mt-2 whitespace-pre-line break-all font-mono text-[13px] font-bold">
                {loginText(window.location.origin, created.username, created.password)}
              </p>
              <span className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void copy(loginText(window.location.origin, created.username, created.password))}
                  className="flex items-center gap-1 rounded-full bg-cocoa px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ivory"
                >
                  <Copy className="h-3 w-3" aria-hidden /> Copy login
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(loginText(window.location.origin, created.username, created.password))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-full bg-[#25D366] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white"
                >
                  <Send className="h-3 w-3" aria-hidden /> WhatsApp login
                </a>
              </span>
              <p className="mt-2 text-xs font-medium text-cocoasoft">
                {created.named
                  ? `Girl page (after he saves): ${window.location.origin}/${created.slug}`
                  : "Girl page link tab banega jab woh editor me naam set karke Save dabayega."}
              </p>
            </div>
          )}
        </form>

        {/* list */}
        <div className="mt-8 space-y-4">
          {customers.length === 0 && (
            <p className="border border-dashed border-cocoa/30 p-8 text-center font-hand text-2xl text-cocoasoft">
              no customers yet — create the first one above ↑
            </p>
          )}
          {customers.map((c) => {
            const expired = c.expiresAt && new Date(c.expiresAt).getTime() < Date.now();
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const named = isNamed(c);
            const girlLink = `${origin}/${c.slug}`;
            return (
              <article key={c.username} className="border border-cocoa/15 bg-[#FFFDF7] p-5 shadow-photo">
                <span className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-2xl font-semibold">
                    {named ? c.girlName : `@${c.username}`}
                  </h3>
                  {!named && (
                    <span className="rounded-full bg-butter px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                      naam not set yet
                    </span>
                  )}
                  {expired && (
                    <span className="rounded-full bg-cherry px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ivory">
                      Expired
                    </span>
                  )}
                  <span className="ml-auto flex flex-wrap gap-2">
                    {named ? (
                      <>
                        <a href={`/${c.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-full bg-cream px-3 py-1.5 text-[11px] font-bold uppercase transition hover:bg-butter" title="Open her page">
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Girl page
                        </a>
                        <button onClick={() => void copy(girlLink)} className="flex items-center gap-1 rounded-full bg-cream px-3 py-1.5 text-[11px] font-bold uppercase transition hover:bg-butter" title="Copy her page link">
                          <Copy className="h-3.5 w-3.5" aria-hidden /> Girl link
                        </button>
                      </>
                    ) : (
                      <span className="rounded-full bg-cocoa/10 px-3 py-1.5 text-[11px] font-bold uppercase text-cocoasoft" title="Girl link tab banega jab woh naam set karega">
                        Girl link: not set yet
                      </span>
                    )}
                    <button
                      onClick={() => void copy(`${origin}/admin (user: ${c.username})`)}
                      className="flex items-center gap-1 rounded-full bg-sage/60 px-3 py-1.5 text-[11px] font-bold uppercase transition hover:bg-sage"
                      title="Copy admin portal link + username (password wahi jo banate time diya tha)"
                    >
                      <KeyRound className="h-3.5 w-3.5" aria-hidden /> Admin login
                    </button>
                    <button onClick={() => void remove(c)} disabled={busyUser === c.username} className="flex items-center gap-1 rounded-full bg-cherry/10 px-3 py-1.5 text-[11px] font-bold uppercase text-cherry transition hover:bg-cherry hover:text-ivory disabled:opacity-50" title="Delete everything">
                      <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
                    </button>
                  </span>
                </span>
                <p className="mt-1 break-all font-mono text-xs font-bold text-cocoasoft">
                  user: {c.username} · page: {named ? `/${c.slug}` : "—"} · since {new Date(c.createdAt).toLocaleDateString("en-IN")}
                </p>
                <p className="mt-1 text-[11px] font-medium text-cocoasoft">
                  Password: banate time wala{!named ? " (default 9872)" : ""} — bhool gaye to neeche Reset.
                </p>
                <span className="mt-3 grid gap-2 sm:grid-cols-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                    <CalendarClock className="h-4 w-4 shrink-0 text-cherry" aria-hidden />
                    <input
                      type="date"
                      value={expiryEdits[c.username] ?? (c.expiresAt ? c.expiresAt.slice(0, 10) : "")}
                      onChange={(e) => setExpiryEdits((m) => ({ ...m, [c.username]: e.target.value }))}
                      className="w-full rounded-md border-2 border-cocoa/25 bg-ivory px-2 py-1.5 text-xs normal-case"
                    />
                    <button onClick={() => void saveExpiry(c.username)} disabled={busyUser === c.username} className="shrink-0 rounded-full bg-sage px-3 py-1.5 text-[11px] uppercase">
                      Set
                    </button>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                    <KeyRound className="h-4 w-4 shrink-0 text-cherry" aria-hidden />
                    <input
                      placeholder="new password (blank = 9872)"
                      value={pwEdits[c.username] ?? ""}
                      onChange={(e) => setPwEdits((m) => ({ ...m, [c.username]: e.target.value }))}
                      className="w-full rounded-md border-2 border-cocoa/25 bg-ivory px-2 py-1.5 text-xs normal-case"
                    />
                    <button onClick={() => void resetPassword(c.username)} disabled={busyUser === c.username} className="shrink-0 rounded-full bg-butter px-3 py-1.5 text-[11px] uppercase">
                      Reset
                    </button>
                  </label>
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
