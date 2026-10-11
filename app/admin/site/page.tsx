"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save, Eye, Copy, Send, LogOut, Plus, Trash2, ArrowLeft, ArrowRight,
  Check, X, ImagePlus, Lock,
} from "lucide-react";
import Journey from "@/components/Journey";
import { defaultSiteData, slugify, type SiteData } from "@/lib/sitedata";

const STEPS = [
  { id: "couple", title: "Tum dono", hint: "Naam aur date" },
  { id: "photos", title: "Photos", hint: "Uski best photos" },
  { id: "story", title: "Yaadein", hint: "Tumhari kahani" },
  { id: "notes", title: "Notes", hint: "Pyari baatein" },
  { id: "letter", title: "Letter", hint: "Dil ki baat" },
  { id: "parts", title: "Parts", hint: "Kya-kya dikhe" },
  { id: "gift", title: "Gift", hint: "Surprise + wish" },
  { id: "done", title: "Bhejo", hint: "Link share karo" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const PART_LABELS: { key: keyof SiteData["sections"]; title: string; sub: string }[] = [
  { key: "notice", title: "Things I notice", sub: "Uske baare me pyari lines" },
  { key: "timeline", title: "Story album", sub: "Date-wise yaadein" },
  { key: "gallery", title: "Photo board", sub: "Photos ki deewar" },
  { key: "reasons", title: "Notes desk", sub: "Chhote love notes" },
  { key: "letter", title: "Love letter", sub: "Lamba khat" },
  { key: "distance", title: "Distance card", sub: "Door ho to bhi paas" },
  { key: "hug", title: "Hug button", sub: "Dabao, hug pahunchegi" },
  { key: "surprise", title: "Gift box", sub: "Scratch coupon" },
  { key: "cake", title: "Cake + candles", sub: "Blow the candles" },
];

function Q({ n, title, sub, optional, children }: { n: string; title: string; sub?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-cocoa/15 bg-[#FFFDF7] p-5 shadow-photo">
      <p className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cherry font-display text-lg font-bold text-ivory">
          {n}
        </span>
        <span>
          <span className="font-display block text-xl font-semibold leading-tight">
            {title}{" "}
            {optional && <span className="text-sm font-medium text-cocoasoft">(optional)</span>}
          </span>
          {sub && <span className="block text-[13px] font-medium text-cocoasoft">{sub}</span>}
        </span>
      </p>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Label({ children, optional }: { children: string; optional?: boolean }) {
  return (
    <p className="text-sm font-bold">
      {children}{" "}
      {optional && <span className="font-medium text-cocoasoft">(optional — khali bhi chalega)</span>}
    </p>
  );
}

const inputCls =
  "w-full rounded-lg border-2 border-cocoa/25 bg-ivory px-4 py-3 text-[15px] font-semibold text-cocoa placeholder:font-medium placeholder:text-cocoasoft/60";

function BigUpload({ slug, value, onChange, title, sub }: { slug: string; value?: string; onChange: (url: string | undefined) => void; title: string; sub: string }) {
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
      if (!res.ok) throw new Error(json.error || "Upload nahi hua");
      onChange(json.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-cocoa/30 bg-ivory p-4">
      <p className="font-bold">{title}</p>
      <p className="text-[13px] font-medium text-cocoasoft">{sub}</p>
      <span className="mt-3 flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-24 w-24 rounded-lg border-2 border-cocoa/20 object-cover" />
        ) : (
          <span className="flex h-24 w-24 items-center justify-center rounded-lg bg-blush">
            <ImagePlus className="h-7 w-7 text-cocoasoft" aria-hidden />
          </span>
        )}
        <span className="flex flex-1 flex-col gap-2">
          <label className="cursor-pointer rounded-full bg-cherry px-5 py-2.5 text-center text-xs font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-cherrydeep">
            {busy ? "Upload ho raha…" : value ? "Change photo" : "Photo chuno"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={busy}
              onChange={(e) => void pick(e.target.files?.[0])}
            />
          </label>
          {value && (
            <button type="button" onClick={() => onChange(undefined)} className="text-xs font-bold text-cherry underline">
              Hatado
            </button>
          )}
        </span>
      </span>
      {err && <p className="mt-2 text-xs font-bold text-cherry">{err}</p>}
    </div>
  );
}

export default function SiteEditor() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [gate, setGate] = useState<"checking" | "ok">("checking");
  const [stepIdx, setStepIdx] = useState(0);
  const [draft, setDraft] = useState<SiteData>(() => defaultSiteData());
  const [slug, setSlug] = useState("demo");
  const [slugAuto, setSlugAuto] = useState(true);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(0);
  const [error, setError] = useState("");
  const [stepErr, setStepErr] = useState("");
  const [previewWidth, setPreviewWidth] = useState<"full" | "phone">("phone");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pw, setPw] = useState({ old: "", next: "" });
  const [pwMsg, setPwMsg] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const set = useCallback(<K extends keyof SiteData>(k: K, v: SiteData[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
  }, []);

  useEffect(() => {
    (async () => {
      const me = await fetch("/api/auth").then((r) => r.json());
      if (!me.session) {
        router.replace("/admin");
        return;
      }
      if (me.session.role === "owner") {
        router.replace("/admin/owner");
        return;
      }
      const res = await fetch("/api/site");
      if (!res.ok) {
        setError("Page load nahi hua. Refresh karo.");
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

  const save = async (silent = false): Promise<boolean> => {
    if (!silent) setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: draft, slug }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save nahi hua");
      setSlug(json.slug);
      setSavedTick((t) => t + 1);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      if (!silent) setSaving(false);
    }
  };

  const goStep = (i: number) => {
    setStepErr("");
    setStepIdx(Math.max(0, Math.min(STEPS.length - 1, i)));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = async () => {
    // Step 1 guard: her name must exist + slug auto-follows it
    if (STEPS[stepIdx].id === "couple") {
      if (!draft.girlfriendName.trim()) {
        setStepErr("Pehle uska naam to batao! Wahi poori site pe chamkega.");
        return;
      }
      if (slugAuto) setSlug(slugify(draft.girlfriendName));
    }
    await save(true);
    goStep(stepIdx + 1);
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
      setError("Copy nahi hua — link ko long-press karke copy karo.");
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
      setPwMsg("Password badal gaya ♥");
    } catch (e) {
      setPwMsg((e as Error).message);
    }
  };

  if (loading || gate !== "ok") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 text-center text-cocoa">
        <p className="font-hand text-3xl">
          {gate === "ok" ? "tumhara studio khul raha…" : "login check ho raha…"}
        </p>
        <a href="/admin" className="text-xs font-bold uppercase tracking-[0.2em] text-cherry underline">
          Login page kholo
        </a>
      </main>
    );
  }

  const step = STEPS[stepIdx].id;
  const doneCount =
    (draft.girlfriendName.trim() ? 1 : 0) +
    (draft.coverHero.src || draft.memories.some((m) => m.src) ? 1 : 0) +
    (draft.timeline.length > 0 ? 1 : 0);

  const previewBox = (
    <div
      className={`overflow-y-auto overflow-x-hidden rounded-xl border-2 border-cocoa/30 bg-ivory shadow-photo ${
        previewWidth === "phone" ? "h-[75vh] w-full max-w-[390px]" : "h-[75vh] w-full"
      }`}
    >
      <Journey data={draft} autoEnter preview />
    </div>
  );

  return (
    <main className="min-h-screen bg-cream text-cocoa" ref={topRef}>
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b-2 border-cocoa/15 bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-4 py-3">
          <p className="font-hand text-2xl text-cherry">studio</p>
          <span className="hidden text-xs font-bold uppercase tracking-[0.18em] text-cocoasoft sm:inline">
            {draft.girlfriendName || "uske liye"}
          </span>
          <span className="ml-auto flex items-center gap-2">
            {savedTick > 0 && !error && (
              <span className="flex items-center gap-1 text-xs font-bold text-green-700" role="status">
                <Check className="h-4 w-4" aria-hidden /> Saved
              </span>
            )}
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1.5 rounded-full border-2 border-cocoa px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition hover:bg-butter/60 lg:hidden"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden /> Dekho
            </button>
            <button
              onClick={() => void save()}
              disabled={saving}
              className="shadow-scrap-sm flex items-center gap-1.5 rounded-full bg-cherry px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-cherrydeep disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5" aria-hidden />
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={logout} aria-label="Log out" className="rounded-full bg-cocoa/10 p-2 transition hover:bg-cocoa/20">
              <LogOut className="h-4 w-4" aria-hidden />
            </button>
          </span>
        </div>
        {/* progress */}
        <div className="border-t border-cocoa/10 bg-ivory px-4 py-2.5">
          <div className="mx-auto flex max-w-[1400px] items-center gap-1.5 overflow-x-auto">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goStep(i)}
                aria-label={`Step ${i + 1}: ${s.title}`}
                aria-current={i === stepIdx ? "step" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  i === stepIdx
                    ? "bg-cherry text-ivory"
                    : i < stepIdx
                      ? "bg-sage/70 text-cocoa"
                      : "bg-cocoa/10 text-cocoasoft"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/15 text-[11px]">
                  {i < stepIdx ? <Check className="h-3 w-3" aria-hidden /> : i + 1}
                </span>
                {s.title}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <p role="alert" className="border-t border-cherry/30 bg-cherry/10 px-4 py-2 text-center text-sm font-bold text-cherry">
            {error}
          </p>
        )}
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-0 lg:grid-cols-[460px_1fr]">
        {/* ── wizard ── */}
        <div className="px-4 py-6 lg:pr-6">
          <p className="font-hand text-2xl text-cherry">
            Step {stepIdx + 1} of {STEPS.length} — {STEPS[stepIdx].title}
          </p>
          <h1 className="font-display mt-1 text-3xl font-semibold leading-tight sm:text-4xl">
            {step === "couple" && "Pehle batao, ye surprise kiske liye?"}
            {step === "photos" && "Uski best photos lagao"}
            {step === "story" && "Tumhari kahani likho"}
            {step === "notes" && "Chhote pyare notes"}
            {step === "letter" && "Dil ki baat, khat me"}
            {step === "parts" && "Page pe kya-kya dikhe?"}
            {step === "gift" && "Gift + aakhri wish"}
            {step === "done" && "Sab ready — use bhejo!"}
          </h1>

          {stepErr && (
            <p role="alert" className="mt-3 bg-cherry/10 px-4 py-2.5 text-sm font-bold text-cherry">
              {stepErr}
            </p>
          )}

          <div className="mt-5 space-y-4">
            {step === "couple" && (
              <>
                <Q n="1" title="Uska naam?" sub="Yehi poori site pe chamkega">
                  <input
                    className={inputCls}
                    value={draft.girlfriendName}
                    onChange={(e) => set("girlfriendName", e.target.value)}
                    placeholder="e.g. Rinki Kumari"
                  />
                </Q>
                <Q n="2" title="Tum use pyaar se kya bulate ho?" sub="Cake aur letter pe aayega">
                  <input
                    className={inputCls}
                    value={draft.girlfriendNickname}
                    onChange={(e) => set("girlfriendNickname", e.target.value)}
                    placeholder="e.g. jaan"
                  />
                </Q>
                <Q n="3" title="Tumhara naam?" sub="Neeche signature me aayega">
                  <input
                    className={inputCls}
                    value={draft.myName}
                    onChange={(e) => set("myName", e.target.value)}
                    placeholder="e.g. Aarav"
                  />
                </Q>
                <Q n="4" title="Uska birthday kab hai?" sub="Date cake pe dikhegi">
                  <input
                    className={inputCls}
                    value={draft.birthdayDate}
                    onChange={(e) => set("birthdayDate", e.target.value)}
                    placeholder="e.g. 18th October"
                  />
                </Q>
                <Q n="5" title="Page ka link?" sub="Yehi ladki ko bhejoge. Naam se khud ban jayega.">
                  <span className="flex gap-2">
                    <input
                      className={inputCls}
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                        setSlugAuto(false);
                      }}
                      placeholder="rinki-kumari"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSlug(slugify(draft.girlfriendName));
                        setSlugAuto(true);
                      }}
                      className="shrink-0 rounded-lg bg-butter px-4 text-xs font-bold uppercase"
                    >
                      Auto
                    </button>
                  </span>
                  <p className="break-all font-mono text-xs font-bold text-cherry">
                    {typeof window !== "undefined" ? `${window.location.origin}/${slug || "…"}` : `/${slug}`}
                  </p>
                </Q>
              </>
            )}

            {step === "photos" && (
              <>
                <BigUpload
                  slug={slug}
                  title="Hero photo — sabse badi wali"
                  sub="Cover pe lagegi. Smile wali best hai."
                  value={draft.coverHero.src}
                  onChange={(url) => set("coverHero", { ...draft.coverHero, src: url })}
                />
                <BigUpload
                  slug={slug}
                  title="Invitation photo — chhoti wali"
                  sub="Shuru me envelope ke paas dikhegi."
                  value={draft.coverInvite.src}
                  onChange={(url) => set("coverInvite", { ...draft.coverInvite, src: url })}
                />
                <Q n="3" title="Gallery photos" sub="Ek-ek karke add karo. Tall wali lambi print banti hai.">
                  {draft.memories.map((m, i) => (
                    <div key={i} className="space-y-2 rounded-lg border border-cocoa/15 bg-ivory p-3">
                      <span className="flex items-center justify-between">
                        <span className="font-hand text-xl text-cherry">photo {i + 1}</span>
                        <button type="button" onClick={() => set("memories", draft.memories.filter((_, j) => j !== i))} className="text-cherry" aria-label={`Photo ${i + 1} hatao`}>
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </span>
                      <BigUpload
                        slug={slug}
                        title=""
                        sub=""
                        value={m.src}
                        onChange={(url) => {
                          const next = [...draft.memories];
                          next[i] = { ...next[i], src: url };
                          set("memories", next);
                        }}
                      />
                      <input
                        className={inputCls}
                        value={m.caption}
                        onChange={(e) => {
                          const next = [...draft.memories];
                          next[i] = { ...next[i], caption: e.target.value };
                          set("memories", next);
                        }}
                        placeholder="Caption — e.g. Holi 2023"
                      />
                      <input
                        className={inputCls}
                        value={m.handwritten || ""}
                        onChange={(e) => {
                          const next = [...draft.memories];
                          next[i] = { ...next[i], handwritten: e.target.value };
                          set("memories", next);
                        }}
                        placeholder="Haath se likha note (optional)"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set("memories", [...draft.memories, { alt: "New photo", caption: "", kind: "photo" as const }])}
                    className="flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-ivory"
                  >
                    <Plus className="h-4 w-4" aria-hidden /> Photo add karo
                  </button>
                </Q>
              </>
            )}

            {step === "story" && (
              <>
                <Q n="1" title="Album pages" sub="Pehli mulakat se leke sapno tak. Jo khaali chhodo, woh? Add/hatana tumhare haath me.">
                  {draft.timeline.map((t, i) => (
                    <div key={i} className="space-y-2.5 rounded-lg border border-cocoa/15 bg-ivory p-4">
                      <span className="flex items-center justify-between">
                        <span className="font-hand text-2xl text-cherry">yaad {i + 1}</span>
                        <button type="button" onClick={() => set("timeline", draft.timeline.filter((_, j) => j !== i))} className="text-cherry" aria-label={`Yaad ${i + 1} hatao`}>
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </span>
                      <input
                        className={inputCls}
                        value={t.dateLabel}
                        onChange={(e) => {
                          const next = [...draft.timeline];
                          next[i] = { ...next[i], dateLabel: e.target.value };
                          set("timeline", next);
                        }}
                        placeholder="Kab? e.g. January 2022"
                      />
                      <input
                        className={inputCls}
                        value={t.title}
                        onChange={(e) => {
                          const next = [...draft.timeline];
                          next[i] = { ...next[i], title: e.target.value };
                          set("timeline", next);
                        }}
                        placeholder="Title — e.g. Pehli chai date"
                      />
                      <textarea
                        className={inputCls}
                        rows={2}
                        value={t.story}
                        onChange={(e) => {
                          const next = [...draft.timeline];
                          next[i] = { ...next[i], story: e.target.value };
                          set("timeline", next);
                        }}
                        placeholder="2 line me kya hua tha?"
                      />
                      <BigUpload
                        slug={slug}
                        title=""
                        sub="Photo optional hai"
                        value={t.image}
                        onChange={(url) => {
                          const next = [...draft.timeline];
                          next[i] = { ...next[i], image: url };
                          set("timeline", next);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => set("timeline", [...draft.timeline, { dateLabel: "", title: "", story: "", caption: "" }])}
                    className="flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-ivory"
                  >
                    <Plus className="h-4 w-4" aria-hidden /> Yaad add karo
                  </button>
                </Q>
              </>
            )}

            {step === "notes" && (
              <>
                <Q n="1" title="Chhote notes" sub="Ek-ek line. Ye notes ban ke bikhrenge.">
                  {draft.reasons.map((r, i) => (
                    <span key={i} className="flex items-start gap-2">
                      <span className="font-hand mt-2.5 text-2xl text-cherry">{i + 1}.</span>
                      <input
                        className={inputCls}
                        value={r}
                        onChange={(e) => {
                          const next = [...draft.reasons];
                          next[i] = e.target.value;
                          set("reasons", next);
                        }}
                        placeholder="e.g. Last bite hamesha mere liye"
                      />
                      <button type="button" onClick={() => set("reasons", draft.reasons.filter((_, j) => j !== i))} className="mt-3 text-cherry" aria-label={`Note ${i + 1} hatao`}>
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => set("reasons", [...draft.reasons, ""])}
                    className="flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-ivory"
                  >
                    <Plus className="h-4 w-4" aria-hidden /> Note add karo
                  </button>
                </Q>
                <Q n="2" title="Notes wali 2 mini photos" sub="Optional — khaali bhi chalega">
                  <span className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <BigUpload slug={slug} title="Mini A" sub="" value={draft.coverNoteA.src} onChange={(url) => set("coverNoteA", { ...draft.coverNoteA, src: url })} />
                    <BigUpload slug={slug} title="Mini B" sub="" value={draft.coverNoteB.src} onChange={(url) => set("coverNoteB", { ...draft.coverNoteB, src: url })} />
                  </span>
                </Q>
              </>
            )}

            {step === "letter" && (
              <>
                <Q n="1" title="Khat likho" sub="3 chhote paras kaafi hain. Dil se likho, lamba nahi.">
                  {draft.loveLetter.paragraphs.map((p, i) => (
                    <span key={i} className="flex items-start gap-2">
                      <textarea
                        className={inputCls}
                        rows={3}
                        value={p}
                        onChange={(e) => {
                          const next = [...draft.loveLetter.paragraphs];
                          next[i] = e.target.value;
                          set("loveLetter", { ...draft.loveLetter, paragraphs: next });
                        }}
                        placeholder={i === 0 ? "Shuru — aaj ka din, ek pyari detail…" : i === 1 ? "Beech — usme kya admire karte ho…" : "Aakhir — ek wish + ek pakka promise…"}
                      />
                      <button type="button" onClick={() => set("loveLetter", { ...draft.loveLetter, paragraphs: draft.loveLetter.paragraphs.filter((_, j) => j !== i) })} className="mt-3 text-cherry" aria-label={`Para ${i + 1} hatao`}>
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => set("loveLetter", { ...draft.loveLetter, paragraphs: [...draft.loveLetter.paragraphs, ""] })}
                    className="flex items-center gap-1.5 rounded-full bg-cocoa px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-ivory"
                  >
                    <Plus className="h-4 w-4" aria-hidden /> Para add karo
                  </button>
                </Q>
                <Q n="2" title="Sign karo" sub="Neeche tumhara naam aayega">
                  <span className="grid grid-cols-2 gap-3">
                    <input
                      className={inputCls}
                      value={draft.loveLetter.signature}
                      onChange={(e) => set("loveLetter", { ...draft.loveLetter, signature: e.target.value })}
                      placeholder="Tumhara naam"
                    />
                    <input
                      className={inputCls}
                      value={draft.loveLetter.greeting}
                      onChange={(e) => set("loveLetter", { ...draft.loveLetter, greeting: e.target.value })}
                      placeholder="Shuru — e.g. Meri pyaari…"
                    />
                  </span>
                </Q>
                <Q n="3" title="Door ho to ye line" sub="Distance card ka message">
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={draft.distanceSection.body}
                    onChange={(e) => set("distanceSection", { ...draft.distanceSection, body: e.target.value })}
                    placeholder="e.g. Kaash aaj saath hote…"
                  />
                </Q>
              </>
            )}

            {step === "parts" && (
              <Q n="1" title="Kya-kya dikhe?" sub="OFF karo to woh part gayab. Numbering khud set.">
                {PART_LABELS.map(({ key, title, sub }) => (
                  <label key={key} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-cocoa/15 bg-ivory px-4 py-3">
                    <span>
                      <span className="block text-[15px] font-bold">{title}</span>
                      <span className="block text-xs font-medium text-cocoasoft">{sub}</span>
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={draft.sections[key]}
                      aria-label={`${title} on ya off`}
                      onClick={() => set("sections", { ...draft.sections, [key]: !draft.sections[key] })}
                      className={`relative h-9 w-14 shrink-0 rounded-full transition ${draft.sections[key] ? "bg-cherry" : "bg-cocoa/25"}`}
                    >
                      <span className={`absolute top-1 h-7 w-7 rounded-full bg-ivory transition-all ${draft.sections[key] ? "left-6" : "left-1"}`} />
                    </button>
                  </label>
                ))}
              </Q>
            )}

            {step === "gift" && (
              <>
                <Q n="1" title="Gift box khulne pe?" sub="Title + 2 lines">
                  <input
                    className={inputCls}
                    value={draft.surpriseSection.revealedTitle}
                    onChange={(e) => set("surpriseSection", { ...draft.surpriseSection, revealedTitle: e.target.value })}
                    placeholder="e.g. Scratch kar. Gift tera."
                  />
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={draft.surpriseSection.revealedBody}
                    onChange={(e) => set("surpriseSection", { ...draft.surpriseSection, revealedBody: e.target.value })}
                    placeholder="Gift kya hai? 2 lines me."
                  />
                </Q>
                <Q n="2" title="Coupon pe kya likhe?" sub="Scratch karke ye niklega">
                  <input
                    className={inputCls}
                    value={draft.surpriseSection.giftNote}
                    onChange={(e) => set("surpriseSection", { ...draft.surpriseSection, giftNote: e.target.value })}
                    placeholder="e.g. WEEKEND TRIP × UNLIMITED CHAI"
                  />
                </Q>
                <Q n="3" title="Aakhri wish" sub="Cake ke baad dikhegi">
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={draft.finaleSection.wish}
                    onChange={(e) => set("finaleSection", { ...draft.finaleSection, wish: e.target.value })}
                    placeholder="e.g. Health, sapne, roz ki khushiyan…"
                  />
                  <input
                    className={inputCls}
                    value={draft.finaleSection.finalLine}
                    onChange={(e) => set("finaleSection", { ...draft.finaleSection, finalLine: e.target.value })}
                    placeholder="Aakhri line — e.g. Happy Birthday…"
                  />
                </Q>
                <Q n="4" title="Secret note" sub="Chhupa hua phool dabane pe milega" optional>
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={draft.easterEgg.secretBody}
                    onChange={(e) => set("easterEgg", { ...draft.easterEgg, secretBody: e.target.value })}
                    placeholder="Sirf uske liye secret…"
                  />
                </Q>
              </>
            )}

            {step === "done" && (
              <>
                <Q n="1" title="Pehle Save dabao" sub="Bina save ke kuch live nahi hoga!">
                  <button
                    type="button"
                    onClick={() => void save()}
                    disabled={saving}
                    className="shadow-scrap flex w-full items-center justify-center gap-2 rounded-full bg-cherry px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-ivory transition hover:bg-cherrydeep disabled:opacity-60"
                  >
                    <Save className="h-5 w-5" aria-hidden />
                    {saving ? "Saving…" : "Save — page live karo"}
                  </button>
                  {savedTick > 0 && (
                    <p className="flex items-center gap-1.5 text-sm font-bold text-green-700" role="status">
                      <Check className="h-4 w-4" aria-hidden /> Saved! Ab neeche link bhejo.
                    </p>
                  )}
                </Q>
                <Q n="2" title="Use ye link bhejo" sub="WhatsApp pe forward kar do">
                  <p className="break-all rounded-lg bg-cream px-4 py-3 font-mono text-sm font-bold text-cherry">
                    {pageUrl}
                  </p>
                  <span className="flex gap-2">
                    <button type="button" onClick={copyLink} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-cocoa px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ivory">
                      <Copy className="h-4 w-4" aria-hidden /> {copied ? "Copied!" : "Copy"}
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Tumhare liye kuch banaya hai ♥ ${pageUrl}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white"
                    >
                      <Send className="h-4 w-4" aria-hidden /> WhatsApp
                    </a>
                  </span>
                  <p className="text-[13px] font-medium text-cocoasoft">
                    {expiresAt
                      ? `Page ${new Date(expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} tak live rahega.`
                      : "Koi expiry nahi — hamesha live rahega."}
                  </p>
                </Q>
                <Q n="3" title="Password badalna ho?" sub="Usi se login hota hai">
                  <span className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input type="password" placeholder="Purana password" value={pw.old} onChange={(e) => setPw({ ...pw, old: e.target.value })} className={inputCls} autoComplete="current-password" />
                    <input type="password" placeholder="Naya password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inputCls} autoComplete="new-password" />
                  </span>
                  <button type="button" onClick={changePassword} className="flex items-center gap-1.5 rounded-full bg-butter px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em]">
                    <Lock className="h-4 w-4" aria-hidden /> Badal do
                  </button>
                  {pwMsg && <p className="text-xs font-bold text-cherry">{pwMsg}</p>}
                </Q>
              </>
            )}
          </div>

          {/* nav */}
          <div className="mt-6 flex items-center gap-3">
            {stepIdx > 0 && (
              <button
                type="button"
                onClick={() => goStep(stepIdx - 1)}
                className="flex items-center gap-1.5 rounded-full border-2 border-cocoa px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] transition hover:bg-butter/60"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Peeche
              </button>
            )}
            {stepIdx < STEPS.length - 1 && (
              <button
                type="button"
                onClick={() => void next()}
                className="shadow-scrap-sm flex flex-1 items-center justify-center gap-1.5 rounded-full bg-cherry px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-cherrydeep"
              >
                Aage: {STEPS[stepIdx + 1].title} <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
          <p className="mt-3 text-center text-xs font-semibold text-cocoasoft">
            {doneCount}/3 basics done · Aage dabate hi auto-save hota hai
          </p>
        </div>

        {/* ── live preview (desktop) ── */}
        <div className="hidden border-t-2 border-cocoa/15 px-4 py-6 lg:block lg:border-t-0">
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
                previewWidth === "phone" ? "h-[75vh] w-full max-w-[390px]" : "h-[75vh] w-full"
              }`}
            >
              <Journey data={draft} autoEnter preview />
            </div>
          </div>
        </div>
      </div>

      {/* ── mobile preview overlay ── */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-cream lg:hidden" role="dialog" aria-modal="true" aria-label="Live preview">
          <div className="flex items-center gap-2 border-b-2 border-cocoa/15 bg-ivory px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em]">Live preview</p>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="ml-auto flex items-center gap-1.5 rounded-full bg-cocoa px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ivory"
              autoFocus
            >
              <X className="h-4 w-4" aria-hidden /> Wapas edit karo
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3">
            <div className="mx-auto max-w-[430px] overflow-hidden rounded-xl border-2 border-cocoa/30 bg-ivory">
              <Journey data={draft} autoEnter preview />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
