import Link from "next/link";
import { Heart, Wand2, Link2, Lock } from "lucide-react";

export default function StudioHome() {
  return (
    <main className="min-h-screen bg-ivory text-cocoa">
      <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-24">
        <p className="font-hand text-3xl text-cherry">surprise studio</p>
        <h1 className="font-display mt-4 text-5xl font-semibold leading-[1.02] sm:text-7xl">
          A birthday gift,
          <br />
          <span className="marker italic">handmade online</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[15px] font-medium leading-relaxed text-cocoasoft">
          We build a personal birthday world for someone you love — their name,
          photos, stories, letter and cake. Delivered as one private link.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/demo"
            className="shadow-scrap rounded-full bg-cherry px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-ivory transition hover:-translate-y-0.5 hover:bg-cherrydeep"
          >
            See a live demo
          </Link>
          <Link
            href="/admin"
            className="shadow-scrap-sm rounded-full border-2 border-cocoa bg-ivory px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] transition hover:bg-butter/60"
          >
            <Lock className="mr-1.5 inline h-4 w-4" aria-hidden />
            Customer login
          </Link>
        </div>

        <div className="mx-auto mt-14 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
          {[
            { icon: Wand2, t: "Made for one person", d: "Her name, photos & stories — nothing generic." },
            { icon: Link2, t: "One private link", d: "yourdomain.com/her-name. Send on WhatsApp." },
            { icon: Heart, t: "Interactive surprises", d: "Hugs, scratch gifts, candles & secrets." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="border border-cocoa/15 bg-[#FFFDF7] p-5 shadow-photo">
              <Icon className="h-5 w-5 text-cherry" aria-hidden />
              <p className="font-display mt-2 text-lg font-semibold leading-tight">{t}</p>
              <p className="mt-1 text-[13px] font-medium text-cocoasoft">{d}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-cocoasoft">
          Ordered one? Your login details are on your receipt ♥
        </p>
      </div>
    </main>
  );
}
