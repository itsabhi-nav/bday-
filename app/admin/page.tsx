"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  // already logged in? skip the form, go straight in
  useEffect(() => {
    (async () => {
      try {
        const me = await fetch("/api/auth").then((r) => r.json());
        if (me.session?.role === "owner") router.replace("/admin/owner");
        else if (me.session) router.replace("/admin/site");
        else setChecking(false);
      } catch {
        setChecking(false);
      }
    })();
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");
      router.push(json.redirect);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 text-cocoa">
      {checking ? (
        <p className="font-hand text-3xl">checking login…</p>
      ) : (
      <form
        onSubmit={submit}
        className="relative w-full max-w-sm border border-cocoa/15 bg-[#FFFDF7] p-8 shadow-photo"
      >
        <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" aria-hidden />
        <p className="font-hand text-center text-3xl text-cherry">psst… this way in</p>
        <h1 className="font-display mt-1 text-center text-3xl font-semibold">Studio Login</h1>
        <label className="mt-6 block text-xs font-bold uppercase tracking-[0.18em]">
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="mt-1.5 w-full rounded-md border-2 border-cocoa/25 bg-ivory px-3 py-2.5 text-sm font-semibold normal-case tracking-normal"
            placeholder="e.g. aarav"
          />
        </label>
        <label className="mt-4 block text-xs font-bold uppercase tracking-[0.18em]">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-md border-2 border-cocoa/25 bg-ivory px-3 py-2.5 text-sm normal-case tracking-normal"
            placeholder="••••"
          />
        </label>
        {error && (
          <p role="alert" className="mt-3 bg-cherry/10 px-3 py-2 text-sm font-bold text-cherry">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="shadow-scrap-sm mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-cherry px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-ivory transition hover:bg-cherrydeep disabled:opacity-60"
        >
          <Lock className="h-4 w-4" aria-hidden />
          {busy ? "Opening…" : "Open my studio"}
        </button>
        <p className="mt-4 text-center text-xs font-medium text-cocoasoft">
          Ordered a surprise? Login details are on your receipt.
        </p>
      </form>
      )}
    </main>
  );
}
