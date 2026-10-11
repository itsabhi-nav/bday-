"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, Copy, Send, LogOut, Plus, Trash2, ImagePlus } from "lucide-react";
import Journey from "@/components/Journey";
import { defaultSiteData, slugify, type SiteData } from "@/lib/sitedata";

const TABS = [
  "Profile",
  "Sections",
  "Story",
  "Photos",
  "Notes",
  "Letter",
  "Gift & Finale",
  "Share",
] as const;

type Tab = (typeof TABS)[number];

const SECTION_LABELS: { key: keyof SiteData["sections"]; label: string }[] = [
  { key: "notice", label: "Things I notice" },
  { key: "timeline", label: "Our story album" },
  { key: "gallery", label: "Photo board" },
  { key: "reasons", label: "Desk of notes" },
  { key: "letter", label: "Love letter" },
  { key: "distance", label: "Across the miles" },
  { key: "hug", label: "Hug delivery" },
  { key: "surprise", label: "Gift surprise" },
  { key: "cake", label: "Cake finale" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-[0.16em]">
      {label}
      <div className="mt-1.5 normal-case tracking-normal">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-md border-2 border-cocoa/25 bg-ivory px-3 py-2 text-sm font-semibold text-cocoa";

function PhotoUpload({ slug, value, onChange, label }: { slug: string; value?: string; onChange: (url: string | undefined) => void; label: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (f: File | undefined) => {
    if (!f) return;
    setBusy(true);
    setErr("");
    try {
      const form = new FormData();
      form.append("file", f);
      form.append("slug", slug);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onChange(json.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-[0.16em]">{label}</span>
      <div className="mt-1.5 flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-16 w-16 rounded-md border border-cocoa/20 object-cover" />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-md bg-blush text-xs font-bold text-cocoasoft">
            empty
          </span>
        )}
        <span className="flex flex-col gap-1.5">
          <label className="cursor-pointer rounded-full bg-cocoa px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-cherry">
            {busy ? "Uploading…" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={busy}
              onChange={(e) => void pick(e.target.files?.[0])}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="text-[11px] font-bold uppercase tracking-[0.14em] text-cherry underline"
            >
              Remove
            </button>
          )}
        </span>
      </div>
      {err && <p className="mt-1 text-xs font-bold text-cherry">{err}</p>}
      {!value && (
        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-cocoasoft">
          <ImagePlus className="h-3 w-3" aria-hidden /> JPG/PNG/WEBP, under 8 MB
        </p>
      )}
    </div>
  );
}

export default function SiteEditor() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [gate, setGate] = useState<"checking" | "ok">("checking");
  const [tab, setTab] = useState<Tab>("Profile");
  const [draft, setDraft] = useState<SiteData>(() => defaultSiteData());
  const [slug, setSlug] = useState("demo");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(0);
  const [error, setError] = useState("");
  const [previewWidth, setPreviewWidth] = useState<"full" | "phone">("phone");
  const [copied, setCopied] = useState(false);
  const [pw, setPw] = useState({ old: "", next: "" });
  const [pwMsg, setPwMsg] = useState("");

  const set = useCallback(<K extends keyof SiteData>(k: K, v: SiteData[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
  }, []);

  useEffect(() => {
    (async () => {
      const me = await fetch("/api/auth").then((r) => r.json());
      if (!me.session) {
        // not logged in at all → must login first (username + password)
        router.replace("/admin");
        return;
      }
      if (me.session.role === "owner") {
        // owner has no editable page → boss room is their home
        router.replace("/admin/owner");
        return;
      }
      const res = await fetch("/api/site");
      if (!res.ok) {
        setError("Could not load your page.");
        setLoading(false);
        return;
      }
      const { site } = await res.json();
      setDraft(site.data);
      setSlug(site.slug);
      setExpiresAt(site.expiresAt);
      setGate("ok");
      setLoading(false);
    })();
  }, [router]);

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: draft, slug }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setSlug(json.slug);
      setSavedTick((t) => t + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin");
  };

  const pageUrl = typeof window !== "undefined" ? `${window.location.origin}/${slug}` : `/${slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed — long-press the link instead.");
    }
  };

  const changePassword = async () => {
    setPwMsg("");
    try {
      const res = await fetch("/api/auth", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: pw.old, newPassword: pw.next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setPw({ old: "", next: "" });
      setPwMsg("Password changed ♥");
    } catch (e) {
      setPwMsg((e as Error).message);
    }
  };

  if (loading || gate !== "ok") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 text-center text-cocoa">
        <p className="font-hand text-3xl">
          {gate === "ok" ? "opening your studio…" : "login check ho raha hai…"}
        </p>
        <a href="/admin" className="text-xs font-bold uppercase tracking-[0.2em] text-cherry underline">
          Login page kholo
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-cocoa">
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b-2 border-cocoa/15 bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3">
          <p className="font-hand text-2xl text-cherry">studio</p>
          <span className="hidden text-xs font-bold uppercase tracking-[0.18em] text-cocoasoft sm:inline">
            {draft.girlfriendName || "her page"}
          </span>
          <span className="ml-auto flex items-center gap-2">
            {savedTick > 0 && !error && (
              <span className="text-xs font-bold text-green-700" role="status">
                Saved ✓
              </span>
            )}
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border-2 border-cocoa px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition hover:bg-butter/60"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden /> View live
            </a>
            <button
              onClick={save}
              disabled={saving}
              className="shadow-scrap-sm flex items-center gap-1.5 rounded-full bg-cherry px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-cherrydeep disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5" aria-hidden />
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={logout}
              aria-label="Log out"
              className="rounded-full bg-cocoa/10 p-2 transition hover:bg-cocoa/20"
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </button>
          </span>
        </div>
        {error && (
          <p role="alert" className="border-t border-cherry/30 bg-cherry/10 px-4 py-2 text-center text-sm font-bold text-cherry">
            {error}
          </p>
        )}
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-0 lg:grid-cols-[440px_1fr]">
        {/* ── form ── */}
        <div className="border-cocoa/15 px-4 py-6 lg:border-r lg:pr-6">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Editor sections">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition ${
                  tab === t ? "bg-cocoa text-ivory" : "bg-ivory text-cocoasoft hover:bg-butter/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-5">
            {tab === "Profile" && (
              <>
                <Field label="Her name">
                  <input className={inputCls} value={draft.girlfriendName} onChange={(e) => {
                    set("girlfriendName", e.target.value);
                    setSlug((s) => (s === slugify(draft.girlfriendName) || !s ? slugify(e.target.value) : s));
                  }} />
                </Field>
                <Field label="Page URL (yourdomain.com/…)">
                  <span className="flex gap-2">
                    <input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} />
                    <button type="button" onClick={() => setSlug(slugify(draft.girlfriendName))} className="shrink-0 rounded-md bg-butter px-3 text-xs font-bold uppercase" title="Regenerate from her name">
                      Auto
                    </button>
                  </span>
                  <p className="mt-1 text-[11px] font-medium text-cocoasoft">
                    Uski naam se Auto dabao → Save → yehi uska link ban jayega. Share tab se bhejo.
                  </p>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nickname">
                    <input className={inputCls} value={draft.girlfriendNickname} onChange={(e) => set("girlfriendNickname", e.target.value)} />
                  </Field>
                  <Field label="Your name">
                    <input className={inputCls} value={draft.myName} onChange={(e) => set("myName", e.target.value)} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Birthday date">
                    <input className={inputCls} value={draft.birthdayDate} onChange={(e) => set("birthdayDate", e.target.value)} />
                  </Field>
                  <Field label="Since (relationship)">
                    <input className={inputCls} value={draft.relationshipStart} onChange={(e) => set("relationshipStart", e.target.value)} />
                  </Field>
                </div>
                <Field label="Hero headline">
                  <input className={inputCls} value={draft.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} />
                </Field>
                <Field label="Hero subline">
                  <textarea className={inputCls} rows={2} value={draft.heroSubline} onChange={(e) => set("heroSubline", e.target.value)} />
                </Field>
                <Field label="Invitation kicker">
                  <input className={inputCls} value={draft.inviteKicker} onChange={(e) => set("inviteKicker", e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Invite line 1">
                    <input className={inputCls} value={draft.inviteHeadlineA} onChange={(e) => set("inviteHeadlineA", e.target.value)} />
                  </Field>
                  <Field label="Invite line 2">
                    <input className={inputCls} value={draft.inviteHeadlineB} onChange={(e) => set("inviteHeadlineB", e.target.value)} />
                  </Field>
                </div>
                <Field label="Invitation subline">
                  <input className={inputCls} value={draft.inviteSubline} onChange={(e) => set("inviteSubline", e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Cover photo (hero)">
                    <PhotoUpload slug={slug} value={draft.coverHero.src} onChange={(url) => set("coverHero", { ...draft.coverHero, src: url })} label="" />
                  </Field>
                  <Field label="Invitation photo">
                    <PhotoUpload slug={slug} value={draft.coverInvite.src} onChange={(url) => set("coverInvite", { ...draft.coverInvite, src: url })} label="" />
                  </Field>
                </div>
              </>
            )}

            {tab === "Sections" && (
              <>
                <p className="text-sm font-medium text-cocoasoft">
                  Pick what her page shows. Unpicked sections vanish — numbering adjusts itself.
                </p>
                {SECTION_LABELS.map(({ key, label }) => (
                  <label key={key} className="flex cursor-pointer items-center justify-between rounded-md border border-cocoa/15 bg-[#FFFDF7] px-4 py-3">
                    <span className="text-sm font-bold">{label}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={draft.sections[key]}
                      onClick={() => set("sections", { ...draft.sections, [key]: !draft.sections[key] })}
                      className={`relative h-7 w-12 rounded-full transition ${draft.sections[key] ? "bg-cherry" : "bg-cocoa/25"}`}
                    >
                      <span className={`absolute top-1 h-5 w-5 rounded-full bg-ivory transition-all ${draft.sections[key] ? "left-6" : "left-1"}`} />
                    </button>
                  </label>
                ))}
              </>
            )}

            {tab === "Story" && (
              <>
                <p className="text-sm font-medium text-cocoasoft">Album pages, in order. Add, edit, remove.</p>
                {draft.timeline.map((t, i) => (
                  <div key={i} className="space-y-3 rounded-md border border-cocoa/15 bg-[#FFFDF7] p-4">
                    <span className="flex items-center justify-between">
                      <span className="font-hand text-xl text-cherry">page {i + 1}</span>
                      <button type="button" onClick={() => set("timeline", draft.timeline.filter((_, j) => j !== i))} className="text-cherry" aria-label={`Remove story page ${i + 1}`}>
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </span>
                    <Field label="Date label">
                      <input className={inputCls} value={t.dateLabel} onChange={(e) => {
                        const next = [...draft.timeline];
                        next[i] = { ...next[i], dateLabel: e.target.value };
                        set("timeline", next);
                      }} />
                    </Field>
                    <Field label="Title">
                      <input className={inputCls} value={t.title} onChange={(e) => {
                        const next = [...draft.timeline];
                        next[i] = { ...next[i], title: e.target.value };
                        set("timeline", next);
                      }} />
                    </Field>
                    <Field label="Story (1–2 lines)">
                      <textarea className={inputCls} rows={2} value={t.story} onChange={(e) => {
                        const next = [...draft.timeline];
                        next[i] = { ...next[i], story: e.target.value };
                        set("timeline", next);
                      }} />
                    </Field>
                    <Field label="Caption">
                      <input className={inputCls} value={t.caption || ""} onChange={(e) => {
                        const next = [...draft.timeline];
                        next[i] = { ...next[i], caption: e.target.value };
                        set("timeline", next);
                      }} />
                    </Field>
                    <PhotoUpload slug={slug} value={t.image} onChange={(url) => {
                      const next = [...draft.timeline];
                      next[i] = { ...next[i], image: url };
                      set("timeline", next);
                    }} label="Photo" />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => set("timeline", [...draft.timeline, { dateLabel: "", title: "New memory", story: "", caption: "" }])}
                  className="flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ivory"
                >
                  <Plus className="h-4 w-4" aria-hidden /> Add page
                </button>
              </>
            )}

            {tab === "Photos" && (
              <>
                <p className="text-sm font-medium text-cocoasoft">Gallery prints. Upload hers to replace stand-ins.</p>
                {draft.memories.map((m, i) => (
                  <div key={i} className="space-y-3 rounded-md border border-cocoa/15 bg-[#FFFDF7] p-4">
                    <span className="flex items-center justify-between">
                      <span className="font-hand text-xl text-cherry">print {i + 1}</span>
                      <button type="button" onClick={() => set("memories", draft.memories.filter((_, j) => j !== i))} className="text-cherry" aria-label={`Remove photo ${i + 1}`}>
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </span>
                    <PhotoUpload slug={slug} value={m.src} onChange={(url) => {
                      const next = [...draft.memories];
                      next[i] = { ...next[i], src: url };
                      set("memories", next);
                    }} label="Photo" />
                    <Field label="Caption">
                      <input className={inputCls} value={m.caption} onChange={(e) => {
                        const next = [...draft.memories];
                        next[i] = { ...next[i], caption: e.target.value };
                        set("memories", next);
                      }} />
                    </Field>
                    <Field label="Handwritten note">
                      <input className={inputCls} value={m.handwritten || ""} onChange={(e) => {
                        const next = [...draft.memories];
                        next[i] = { ...next[i], handwritten: e.target.value };
                        set("memories", next);
                      }} />
                    </Field>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]">
                      <input type="checkbox" checked={!!m.tall} onChange={(e) => {
                        const next = [...draft.memories];
                        next[i] = { ...next[i], tall: e.target.checked };
                        set("memories", next);
                      }} className="h-4 w-4 accent-[#C83D4D]" />
                      Tall print
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => set("memories", [...draft.memories, { alt: "New photo", caption: "New caption", kind: "photo" as const }])}
                  className="flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ivory"
                >
                  <Plus className="h-4 w-4" aria-hidden /> Add print
                </button>
              </>
            )}

            {tab === "Notes" && (
              <>
                <p className="text-sm font-medium text-cocoasoft">One-liners for the desk of notes.</p>
                {draft.reasons.map((r, i) => (
                  <span key={i} className="flex items-start gap-2">
                    <span className="font-hand mt-2 text-xl text-cherry">{i + 1}.</span>
                    <input className={inputCls} value={r} onChange={(e) => {
                      const next = [...draft.reasons];
                      next[i] = e.target.value;
                      set("reasons", next);
                    }} />
                    <button type="button" onClick={() => set("reasons", draft.reasons.filter((_, j) => j !== i))} className="mt-2.5 text-cherry" aria-label={`Remove note ${i + 1}`}>
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => set("reasons", [...draft.reasons, "New reason"])}
                  className="flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ivory"
                >
                  <Plus className="h-4 w-4" aria-hidden /> Add note
                </button>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <PhotoUpload slug={slug} value={draft.coverNoteA.src} onChange={(url) => set("coverNoteA", { ...draft.coverNoteA, src: url })} label="Mini print A" />
                  <PhotoUpload slug={slug} value={draft.coverNoteB.src} onChange={(url) => set("coverNoteB", { ...draft.coverNoteB, src: url })} label="Mini print B" />
                </div>
              </>
            )}

            {tab === "Letter" && (
              <>
                <Field label="Heading">
                  <input className={inputCls} value={draft.loveLetter.heading} onChange={(e) => set("loveLetter", { ...draft.loveLetter, heading: e.target.value })} />
                </Field>
                <Field label="Greeting">
                  <input className={inputCls} value={draft.loveLetter.greeting} onChange={(e) => set("loveLetter", { ...draft.loveLetter, greeting: e.target.value })} />
                </Field>
                {draft.loveLetter.paragraphs.map((p, i) => (
                  <span key={i} className="flex items-start gap-2">
                    <textarea className={inputCls} rows={2} value={p} onChange={(e) => {
                      const next = [...draft.loveLetter.paragraphs];
                      next[i] = e.target.value;
                      set("loveLetter", { ...draft.loveLetter, paragraphs: next });
                    }} />
                    <button type="button" onClick={() => set("loveLetter", { ...draft.loveLetter, paragraphs: draft.loveLetter.paragraphs.filter((_, j) => j !== i) })} className="mt-2.5 text-cherry" aria-label={`Remove paragraph ${i + 1}`}>
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => set("loveLetter", { ...draft.loveLetter, paragraphs: [...draft.loveLetter.paragraphs, "New paragraph"] })}
                  className="flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ivory"
                >
                  <Plus className="h-4 w-4" aria-hidden /> Add paragraph
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Sign-off">
                    <input className={inputCls} value={draft.loveLetter.signoff} onChange={(e) => set("loveLetter", { ...draft.loveLetter, signoff: e.target.value })} />
                  </Field>
                  <Field label="Signature">
                    <input className={inputCls} value={draft.loveLetter.signature} onChange={(e) => set("loveLetter", { ...draft.loveLetter, signature: e.target.value })} />
                  </Field>
                </div>
                <Field label="Distance heading">
                  <input className={inputCls} value={draft.distanceSection.heading} onChange={(e) => set("distanceSection", { ...draft.distanceSection, heading: e.target.value })} />
                </Field>
                <Field label="Distance message">
                  <textarea className={inputCls} rows={2} value={draft.distanceSection.body} onChange={(e) => set("distanceSection", { ...draft.distanceSection, body: e.target.value })} />
                </Field>
              </>
            )}

            {tab === "Gift & Finale" && (
              <>
                <Field label="Surprise title">
                  <input className={inputCls} value={draft.surpriseSection.revealedTitle} onChange={(e) => set("surpriseSection", { ...draft.surpriseSection, revealedTitle: e.target.value })} />
                </Field>
                <Field label="Surprise message">
                  <textarea className={inputCls} rows={2} value={draft.surpriseSection.revealedBody} onChange={(e) => set("surpriseSection", { ...draft.surpriseSection, revealedBody: e.target.value })} />
                </Field>
                <Field label="Coupon text (scratch card prize)">
                  <input className={inputCls} value={draft.surpriseSection.giftNote} onChange={(e) => set("surpriseSection", { ...draft.surpriseSection, giftNote: e.target.value })} />
                </Field>
                <Field label="Final wish">
                  <textarea className={inputCls} rows={2} value={draft.finaleSection.wish} onChange={(e) => set("finaleSection", { ...draft.finaleSection, wish: e.target.value })} />
                </Field>
                <Field label="Final line">
                  <input className={inputCls} value={draft.finaleSection.finalLine} onChange={(e) => set("finaleSection", { ...draft.finaleSection, finalLine: e.target.value })} />
                </Field>
                <Field label="Secret note (flower easter egg)">
                  <textarea className={inputCls} rows={2} value={draft.easterEgg.secretBody} onChange={(e) => set("easterEgg", { ...draft.easterEgg, secretBody: e.target.value })} />
                </Field>
              </>
            )}

            {tab === "Share" && (
              <>
                <div className="rounded-md border border-cocoa/15 bg-[#FFFDF7] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cherry">Her private link</p>
                  <p className="mt-2 break-all font-mono text-sm font-bold">{pageUrl}</p>
                  <span className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={copyLink} className="flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ivory">
                      <Copy className="h-3.5 w-3.5" aria-hidden /> {copied ? "Copied!" : "Copy link"}
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`For you ♥ ${pageUrl}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white"
                    >
                      <Send className="h-3.5 w-3.5" aria-hidden /> WhatsApp
                    </a>
                  </span>
                  <p className="mt-3 text-xs font-medium text-cocoasoft">
                    Save first, then share — she always sees the latest saved version.
                  </p>
                </div>
                <div className="rounded-md border border-cocoa/15 bg-[#FFFDF7] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em]">Page access</p>
                  <p className="mt-1 text-xs font-medium text-cocoasoft">
                    {expiresAt ? `Valid till ${new Date(expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : "No expiry set — stays live."}
                  </p>
                  <span className="mt-3 grid grid-cols-2 gap-2">
                    <input type="password" placeholder="Current password" value={pw.old} onChange={(e) => setPw({ ...pw, old: e.target.value })} className={inputCls} autoComplete="current-password" />
                    <input type="password" placeholder="New password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inputCls} autoComplete="new-password" />
                  </span>
                  <button type="button" onClick={changePassword} className="mt-3 rounded-full bg-butter px-5 py-2 text-xs font-bold uppercase tracking-[0.14em]">
                    Change password
                  </button>
                  {pwMsg && <p className="mt-2 text-xs font-bold text-cherry">{pwMsg}</p>}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── live preview ── */}
        <div className="border-t-2 border-cocoa/15 px-4 py-6 lg:border-t-0">
          <span className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em]">
              <Eye className="mr-1.5 inline h-4 w-4" aria-hidden />
              Live preview — same-to-same
            </p>
            <span className="flex gap-1 rounded-full bg-cocoa/10 p-1">
              {(["phone", "full"] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setPreviewWidth(w)}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${previewWidth === w ? "bg-cocoa text-ivory" : "text-cocoasoft"}`}
                >
                  {w === "phone" ? "Phone" : "Desktop"}
                </button>
              ))}
            </span>
          </span>
          <div className="mt-4 flex justify-center">
            <div
              className={`overflow-y-auto overflow-x-hidden rounded-xl border-2 border-cocoa/30 bg-ivory shadow-photo ${
                previewWidth === "phone" ? "h-[78vh] w-full max-w-[390px]" : "h-[78vh] w-full"
              }`}
            >
              <Journey data={draft} autoEnter preview />
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-cocoasoft">
            Editing updates this instantly · Save makes it live
          </p>
        </div>
      </div>
    </main>
  );
}
