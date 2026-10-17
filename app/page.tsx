import Link from "next/link";
import {
  Heart, Gift, Images, MailOpen, Cake, Sparkles, Link2, Lock,
  Check, ChevronDown, Eye, ShieldCheck, Clock, Smartphone,
} from "lucide-react";
import { Marquee, StickerBadge, FlowerDoodle } from "@/components/Ornaments";

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-64 sm:w-72" aria-hidden>
      <div className="absolute -left-8 top-16 h-28 w-28 rounded-full bg-blush" />
      <div className="absolute -bottom-4 right-0 h-24 w-24 rounded-full bg-butter/80" />
      <StickerBadge className="absolute -right-6 -top-8 z-10 h-24 w-24" center="★" />
      <div className="shadow-scrap relative rounded-[2rem] border-2 border-cocoa bg-ivory p-3">
        <div className="rounded-[1.5rem] border border-cocoa/15 bg-cream px-4 pb-5 pt-6 text-center">
          <p className="inline-block -rotate-2 rounded-full border-2 border-cocoa bg-butter px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em]">
            Happy Birthday!
          </p>
          <p className="font-hand mt-2 text-xl leading-none text-cherry">aaj kisi ka birthday hai</p>
          <p className="font-display mt-1 text-3xl font-semibold leading-none">
            Today is
            <br />
            <span className="italic text-cherry">all about you.</span>
          </p>
          <div className="relative mx-auto mt-4 w-36 rounded-md border border-cocoa/20 bg-[#FFFDF7] p-2 pb-5 shadow-photo">
            <div className="flex h-16 items-center justify-center rounded-sm bg-blush">
              <MailOpen className="h-6 w-6 text-cherry" />
            </div>
            <span className="absolute left-1/2 top-8 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-cherry font-hand text-lg text-ivory">
              ♥
            </span>
          </div>
          <span className="shadow-scrap-sm mx-auto mt-4 flex w-fit items-center gap-1.5 rounded-full bg-cherry px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ivory">
            <Gift className="h-3.5 w-3.5" /> Open your surprise
          </span>
          <p className="font-hand mt-2 -rotate-1 text-lg text-cocoasoft">cake, candles aur pyaar andar hai</p>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: Heart, t: "Uske naam ka page", d: "Headline se footer tak sirf uska naam, uski photos, uski kahani." },
  { icon: Images, t: "Photo album + gallery", d: "Yaadein date-wise, prints tap karke bade me dekho." },
  { icon: MailOpen, t: "Sealed love letter", d: "Envelope kholo, khat line-by-line khulta hai." },
  { icon: Gift, t: "Hug button + gift", d: "Dabao to hug pahunche, coupon scratch karke nikle." },
  { icon: Cake, t: "Cake + candles", d: "Candles bujhao (phoonk maro, mic se bhi!), wish mango." },
  { icon: Sparkles, t: "Secret flower", d: "5 baar dabane pe chhupa note — sirf uske liye." },
];

const FAQS = [
  { q: "Mujhe kya-kya dena hoga?", a: "Bas uska naam, 4-8 photos aur 2-3 yaadein (WhatsApp pe bhej do). Baaki design, letter styling, music — sab hum sambhalte hain. Chaaho to khud editor se bhi bhar sakte ho, step-by-step Hinglish me." },
  { q: "Link kaise milega?", a: "Order ke baad tumhe login milta hai. Editor me sab bharo → Save → tumhari private link ready (jaise oursite.com/rinki). Wahi link use bhejo — WhatsApp share button andar hi hai." },
  { q: "Page kitne din live rahega?", a: "Plan ke hisaab se (30/90 din). Expiry ke baad page 'expired' dikhata hai — delete nahi hota. Extend karwana ho to ek message pe ho jayega." },
  { q: "Photos safe rahengi?", a: "Haan. Page Google me nahi aata (private link hi chalti hai), aur tumhare delete bolne pe photos hamesha ke liye wipe ho jaati hain." },
  { q: "Payment kaise?", a: "UPI pe advance, phir kaam shuru. Preview pasand na aaye to revision free." },
];

export default function StudioHome() {
  return (
    <main className="min-h-screen bg-ivory text-cocoa">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b-2 border-cocoa/10 bg-ivory/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6" aria-label="Main">
          <Link href="/" className="font-hand text-3xl text-cherry">
            surprise studio ♥
          </Link>
          <span className="ml-auto hidden items-center gap-5 text-xs font-bold uppercase tracking-[0.16em] sm:flex">
            <a href="#how" className="transition hover:text-cherry">How it works</a>
            <a href="#inside" className="transition hover:text-cherry">Inside</a>
            <a href="#pricing" className="transition hover:text-cherry">Plans</a>
            <a href="#faq" className="transition hover:text-cherry">FAQ</a>
          </span>
          <span className="ml-auto flex gap-2 sm:ml-4">
            <Link href="/demo" className="rounded-full border-2 border-cocoa px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition hover:bg-butter/60">
              Demo
            </Link>
            <Link href="/admin" className="flex items-center gap-1.5 rounded-full bg-cocoa px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-cherry">
              <Lock className="h-3.5 w-3.5" aria-hidden /> Login
            </Link>
          </span>
        </nav>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden px-4 pb-14 pt-12 sm:px-6 sm:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 35% at 85% 15%, rgba(247,220,226,0.8), transparent 65%), radial-gradient(ellipse 40% 30% at 10% 85%, rgba(244,217,139,0.45), transparent 60%)",
          }}
        />
        <FlowerDoodle className="animate-sway absolute left-6 top-24 hidden h-14 w-14 md:block" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="shadow-scrap-sm inline-flex -rotate-1 items-center gap-2 rounded-full border-2 border-cocoa bg-butter px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]">
              <Cake className="h-4 w-4 text-cherry" aria-hidden /> Birthday gift studio
            </p>
            <h1 className="font-display mt-5 text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">
              Uske birthday pe,
              <br />
              sirf ek <span className="marker italic">link</span> bhejo.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-[15px] font-medium leading-relaxed text-cocoasoft sm:text-base lg:mx-0">
              Uski photos, uski yaadein, uska letter, uska cake — sab kuch ek
              private surprise page me. Kholegi to lagega kisi ne poori duniya
              sirf uske liye saja di.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                href="/demo"
                className="shadow-scrap btn-shine flex items-center gap-2 rounded-full bg-cherry px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-ivory transition hover:-translate-y-0.5 hover:bg-cherrydeep"
              >
                <Eye className="h-4 w-4" aria-hidden /> Live demo dekho
              </Link>
              <a
                href="#pricing"
                className="shadow-scrap-sm rounded-full border-2 border-cocoa bg-ivory px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] transition hover:bg-butter/60"
              >
                Plans dekho
              </a>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-[0.16em] text-cocoasoft lg:justify-start">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-cherry" aria-hidden /> Private link</span>
              <span className="flex items-center gap-1.5"><Smartphone className="h-4 w-4 text-cherry" aria-hidden /> Phone-first</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-cherry" aria-hidden /> 48-hr delivery</span>
            </div>
          </div>
          <PhoneMockup />
        </div>
      </section>

      <Marquee items={["happy birthday", "uske naam ka page", "photos + letter + cake", "private link", "order today"]} />

      {/* how it works */}
      <section id="how" className="scroll-mt-20 bg-ivory px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="font-hand text-center text-3xl text-cherry">itna easy hai</p>
          <h2 className="font-display mt-2 text-center text-4xl font-semibold sm:text-5xl">
            Order se surprise tak — <span className="italic text-cherry">3 steps</span>
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { n: "1", t: "Pay karo online", d: "UPI / card se ₹499 ya ₹999. Account turant ban jata hai — koi wait nahi." },
              { n: "2", t: "Page banao", d: "Apne login se editor kholo — naam, photos, letter, sab step-by-step Hinglish me." },
              { n: "3", t: "Link bhejo", d: "Birthday wale din uska private link forward karo. Reaction ka video bhejna mat bhoolna!" },
            ].map((s) => (
              <div key={s.n} className="relative border border-cocoa/15 bg-[#FFFDF7] p-6 shadow-photo">
                <span className="font-display text-6xl font-semibold text-rose/60">{s.n}</span>
                <h3 className="font-display mt-1 text-2xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-cocoasoft">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* inside */}
      <section id="inside" className="scroll-mt-20 bg-cream px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-hand text-center text-3xl text-cherry">andar kya-kya hai</p>
          <h2 className="font-display mx-auto mt-2 max-w-xl text-center text-4xl font-semibold sm:text-5xl">
            Ek page me <span className="marker italic">poora celebration</span>
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, t, d }) => (
              <div key={t} className="border border-cocoa/15 bg-[#FFFDF7] p-6 shadow-photo transition hover:-translate-y-1">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blush">
                  <Icon className="h-5 w-5 text-cherry" aria-hidden />
                </span>
                <h3 className="font-display mt-3 text-xl font-semibold">{t}</h3>
                <p className="mt-1 text-sm font-medium leading-relaxed text-cocoasoft">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/demo" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cherry underline decoration-rose decoration-2 underline-offset-4 hover:text-cherrydeep">
              <Eye className="h-4 w-4" aria-hidden /> Sab kuch live demo me khud chalake dekho
            </Link>
          </div>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="scroll-mt-20 bg-ivory px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="font-hand text-center text-3xl text-cherry">seedhe-saade plans</p>
          <h2 className="font-display mt-2 text-center text-4xl font-semibold sm:text-5xl">
            Kitne ka <span className="italic text-cherry">padega?</span>
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="border border-cocoa/15 bg-[#FFFDF7] p-8 shadow-photo">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cocoasoft">Classic</p>
              <p className="font-display mt-2 text-5xl font-semibold">₹499</p>
              <ul className="mt-5 space-y-2.5 text-sm font-medium">
                {["Uske naam ka private page", "Photos + letter + cake", "30 din live link", "1 free revision"].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cherry" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/buy?plan=classic" className="shadow-scrap-sm mt-7 flex items-center justify-center gap-2 rounded-full border-2 border-cocoa bg-ivory px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] transition hover:bg-butter/60">
                <Lock className="h-4 w-4" aria-hidden /> Classic — pay ₹499
              </Link>
            </div>
            <div className="relative rotate-1 border-2 border-cocoa bg-[#FFFDF7] p-8 shadow-photo">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-cherry px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ivory">
                Most loved
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cherry">Deluxe</p>
              <p className="font-display mt-2 text-5xl font-semibold">₹999</p>
              <ul className="mt-5 space-y-2.5 text-sm font-medium">
                {["Classic ka sab kuch", "Saare 8 parts + hug button", "90 din live link", "Priority 24-hr delivery", "Expiry extend free"].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cherry" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/buy?plan=deluxe" className="shadow-scrap mt-7 flex items-center justify-center gap-2 rounded-full bg-cherry px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-ivory transition hover:bg-cherrydeep">
                <Lock className="h-4 w-4" aria-hidden /> Deluxe — pay ₹999
              </Link>
            </div>
          </div>
          <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-cocoasoft">
            Payment UPI pe · Preview ke baad hi final
          </p>
        </div>
      </section>

      {/* faq */}
      <section id="faq" className="scroll-mt-20 bg-cream px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <p className="font-hand text-center text-3xl text-cherry">sawaal-jawaab</p>
          <h2 className="font-display mt-2 text-center text-4xl font-semibold sm:text-5xl">FAQ</h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group border border-cocoa/15 bg-[#FFFDF7] px-5 py-4 shadow-photo">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display text-lg font-semibold">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-cherry transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-2 text-sm font-medium leading-relaxed text-cocoasoft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* final cta */}
      <section className="bg-ivory px-4 py-16 text-center sm:px-6 sm:py-20">
        <FlowerDoodle className="mx-auto h-12 w-12" />
        <h2 className="font-display mx-auto mt-4 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
          Uska birthday <span className="marker italic">unforgettable</span> banao
        </h2>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/demo" className="shadow-scrap btn-shine flex items-center gap-2 rounded-full bg-cherry px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-ivory transition hover:-translate-y-0.5 hover:bg-cherrydeep">
            <Gift className="h-4 w-4" aria-hidden /> Pehle demo dekho
          </Link>
          <Link href="/admin" className="flex items-center gap-2 rounded-full border-2 border-cocoa bg-ivory px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] transition hover:bg-butter/60">
            <Link2 className="h-4 w-4" aria-hidden /> Mera login
          </Link>
        </div>
      </section>

      <footer className="border-t-2 border-dashed border-cocoa/20 bg-cream px-6 py-10 text-center">
        <p className="font-hand text-3xl text-cherry">surprise studio ♥</p>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-cocoasoft">
          Handmade birthday pages · Made in India
        </p>
      </footer>
    </main>
  );
}
