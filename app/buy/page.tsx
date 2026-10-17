"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Loader2, Lock, PartyPopper } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const PLANS = [
  {
    id: "classic",
    name: "Classic",
    price: "₹499",
    features: ["Uske naam ka private page", "Photos + letter + cake", "30 din live link", "1 free revision"],
  },
  {
    id: "deluxe",
    name: "Deluxe",
    price: "₹999",
    features: ["Classic ka sab kuch", "Saare 8 parts + hug button", "90 din live link", "Priority 24-hr delivery", "Expiry extend free"],
  },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

function BuyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [plan, setPlan] = useState<PlanId>((params.get("plan") as PlanId) || "deluxe");
  const [girlName, setGirlName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"order" | "verify" | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ username: string; password: string; slug: string } | null>(null);

  const pay = async () => {
    setError("");
    if (!girlName.trim()) return setError("Uska naam batao — page uske naam se banega.");
    if (!username.trim()) return setError("Apna username rakho (login ke liye).");
    if (password.length < 4) return setError("Password kam se kam 4 characters ka rakho.");
    setBusy("order");
    try {
      // 1. create order
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Payment shuru nahi hua");

      // 2. open Razorpay modal
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Payment page load nahi hua"));
        document.body.appendChild(script);
      });

      if (!window.Razorpay) throw new Error("Payment page load nahi hua — refresh karo.");
      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Surprise Studio",
        description: `${PLANS.find((p) => p.id === plan)?.name} birthday page`,
        order_id: order.order_id,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          setBusy("verify");
          try {
            const v = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                username,
                girlName,
                password,
              }),
            });
            const json = await v.json();
            if (!v.ok) throw new Error(json.error || "Verification failed");
            setDone({ username: json.username, password: json.password, slug: json.slug });
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(null);
          }
        },
        modal: {
          ondismiss: () => {
            setBusy(null);
            setError("Payment cancel ho gaya — kuch deduct nahi hua.");
          },
        },
        theme: { color: "#C83D4D" },
      });
      rzp.open();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6 text-cocoa">
        <div className="relative w-full max-w-md border border-cocoa/15 bg-[#FFFDF7] p-8 text-center shadow-photo">
          <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" aria-hidden />
          <PartyPopper className="mx-auto h-10 w-10 text-cherry" aria-hidden />
          <h1 className="font-display mt-3 text-4xl font-semibold">Payment ho gaya! 🎉</h1>
          <p className="mt-2 text-sm font-medium text-cocoasoft">
            Tumhara account ban gaya. Ab apni bandi ka page banao — sab kuch yahan se:
          </p>
          <div className="mt-5 space-y-2 rounded-xl bg-cream p-4 text-left text-sm font-bold">
            <p className="break-all">Login: <span className="text-cherry">/admin</span></p>
            <p>Username: <span className="text-cherry">{done.username}</span></p>
            <p>Password: <span className="text-cherry">{done.password}</span></p>
            <p className="break-all">Page: <span className="text-cherry">/{done.slug}</span></p>
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-cocoasoft">
            Ye details kahin note kar lo — dobara nahi milenge!
          </p>
          <button
            onClick={() => router.push("/admin")}
            className="shadow-scrap mt-5 w-full rounded-full bg-cherry px-6 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-ivory transition hover:bg-cherrydeep"
          >
            Ab page banao →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-10 text-cocoa sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="font-hand text-center text-3xl text-cherry">order karo</p>
        <h1 className="font-display mt-1 text-center text-4xl font-semibold sm:text-5xl">
          Pay karo, <span className="italic text-cherry">account ready</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-center text-sm font-medium text-cocoasoft">
          Payment ke baad tumhara login + page link turant mil jayega. Koi WhatsApp, koi wait — sab yahin.
        </p>

        {/* plan picker */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlan(p.id)}
              aria-pressed={plan === p.id}
              className={`relative border-2 p-6 text-left transition ${
                plan === p.id ? "border-cocoa bg-[#FFFDF7] shadow-photo" : "border-cocoa/20 bg-ivory/60"
              }`}
            >
              {plan === p.id && (
                <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-cherry text-ivory">
                  <Check className="h-4 w-4" aria-hidden />
                </span>
              )}
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cocoasoft">{p.name}</p>
              <p className="font-display mt-1 text-4xl font-semibold">{p.price}</p>
              <ul className="mt-3 space-y-1.5 text-[13px] font-medium text-cocoasoft">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cherry" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* details */}
        <div className="mt-6 space-y-4 border border-cocoa/15 bg-[#FFFDF7] p-6 shadow-photo">
          <label className="block text-sm font-bold">
            Uska naam (page uske naam se banega)
            <input
              className="mt-1.5 w-full rounded-lg border-2 border-cocoa/25 bg-ivory px-4 py-3 text-[15px] font-semibold"
              value={girlName}
              onChange={(e) => setGirlName(e.target.value)}
              placeholder="e.g. Rinki Kumari"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold">
              Tumhara username (login id)
              <input
                className="mt-1.5 w-full rounded-lg border-2 border-cocoa/25 bg-ivory px-4 py-3 text-[15px] font-semibold"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                placeholder="e.g. aarav"
              />
            </label>
            <label className="block text-sm font-bold">
              Password (login ke liye)
              <input
                type="password"
                className="mt-1.5 w-full rounded-lg border-2 border-cocoa/25 bg-ivory px-4 py-3 text-[15px] font-semibold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="4+ characters"
              />
            </label>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 bg-cherry/10 px-4 py-2.5 text-sm font-bold text-cherry">
            {error}
          </p>
        )}

        <button
          onClick={() => void pay()}
          disabled={busy !== null}
          className="shadow-scrap mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-cherry px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-ivory transition hover:bg-cherrydeep disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Lock className="h-5 w-5" aria-hidden />}
          {busy === "order" ? "Payment page khul raha…" : busy === "verify" ? "Verify ho raha…" : `Pay ${PLANS.find((p) => p.id === plan)?.price} — secure checkout`}
        </button>
        <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-cocoasoft">
          Razorpay secure payment · UPI / Card / Netbanking
        </p>
      </div>
    </main>
  );
}

export default function BuyPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-cream text-cocoa">
          <p className="font-hand text-3xl">loading…</p>
        </main>
      }
    >
      <BuyForm />
    </Suspense>
  );
}
