"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Gift } from "lucide-react";
import SmartImage from "./SmartImage";
import Burst from "./Burst";
import { FlowerDoodle, Marquee, StickerBadge, ScribbleUnderline, TicketStub, FloatingHearts } from "./Ornaments";
import { playMusic } from "@/lib/music";
import { useSite } from "./SiteContext";

interface Props {
  onEnter: () => void;
}

/** Jhandiyan (bunting) across the top — instant birthday. */
function Bunting() {
  const colors = ["#C83D4D", "#F4D98B", "#C7D1B8", "#DCA7AF", "#F7DCE2"];
  const flags = Array.from({ length: 18 });
  return (
    <svg viewBox="0 0 900 70" preserveAspectRatio="xMidYMin meet" className="pointer-events-none absolute inset-x-0 top-0 h-16 w-full sm:h-20" aria-hidden>
      <path d="M0 0 Q 450 58 900 0" stroke="#49312F" strokeWidth="2.5" fill="none" opacity="0.6" />
      {flags.map((_, i) => {
        const x = 20 + (i * 860) / (flags.length - 1);
        // point on the curve (approx): y = 58 * sin(pi * t)^0.8-ish; simple parabola approx
        const t = i / (flags.length - 1);
        const y = 58 * 4 * t * (1 - t) * 0.92;
        return (
          <polygon
            key={i}
            points={`${x - 13},${y + 3} ${x + 13},${y + 3} ${x},${y + 30}`}
            fill={colors[i % colors.length]}
            stroke="#49312F"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
}

/** Balloon bunch. */
function Balloons({ className = "" }: { className?: string }) {
  const balloons = [
    { cx: 30, cy: 42, fill: "#C83D4D", d: "0s" },
    { cx: 62, cy: 30, fill: "#E0A93E", d: "1.2s" },
    { cx: 92, cy: 46, fill: "#7A8B6F", d: "0.6s" },
  ];
  return (
    <svg viewBox="0 0 120 110" className={className} aria-hidden>
      {balloons.map((b, i) => (
        <g key={i} className="animate-floaty" style={{ animationDelay: b.d }}>
          <path d={`M60 108 Q 58 ${b.cy + 24} ${b.cx} ${b.cy + 14}`} stroke="#49312F" strokeWidth="1.5" fill="none" opacity="0.6" />
          <ellipse cx={b.cx} cy={b.cy} rx="17" ry="21" fill={b.fill} opacity="0.92" />
          <ellipse cx={b.cx - 5} cy={b.cy - 7} rx="5" ry="8" fill="#FFF9F0" opacity="0.35" />
          <polygon points={`${b.cx - 4},${b.cy + 21} ${b.cx + 4},${b.cy + 21} ${b.cx},${b.cy + 27}`} fill={b.fill} />
        </g>
      ))}
      <circle cx="60" cy="104" r="3.5" fill="#49312F" />
    </svg>
  );
}

/** Mini birthday cake with candles. */
function MiniCake({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      {/* candles */}
      {[42, 60, 78].map((x) => (
        <g key={x}>
          <rect x={x - 3} y={18} width="6" height="20" rx="2" fill="#FFFDF7" stroke="#49312F" strokeWidth="1.5" />
          <ellipse cx={x} cy={12} rx="4.5" ry="6.5" fill="#FFB340" />
          <ellipse cx={x} cy={14} rx="2" ry="3.5" fill="#FFF3C4" />
        </g>
      ))}
      {/* top tier */}
      <rect x="30" y="38" width="60" height="24" rx="4" fill="#F7DCE2" stroke="#49312F" strokeWidth="2" />
      {/* bottom tier */}
      <rect x="18" y="62" width="84" height="26" rx="5" fill="#C83D4D" stroke="#49312F" strokeWidth="2" />
      {[28, 44, 60, 76, 92].map((x) => (
        <circle key={x} cx={x} cy="70" r="3" fill="#F4D98B" />
      ))}
      {/* plate */}
      <ellipse cx="60" cy="92" rx="52" ry="6" fill="#F4D98B" stroke="#49312F" strokeWidth="2" />
    </svg>
  );
}

/**
 * The invitation — a birthday door, not a generic card.
 * Envelope IS the button. Music starts inside the same tap gesture.
 */
export default function InvitationIntro({ onEnter }: Props) {
  const site = useSite();
  const [stage, setStage] = useState<"idle" | "opening">("idle");
  const [burst, setBurst] = useState(false);
  const reduce = useReducedMotion();

  const open = () => {
    if (stage !== "idle") return;
    // Start music INSIDE the user gesture — this is what makes it play.
    void playMusic().catch(() => {});
    if (reduce) {
      setTimeout(onEnter, 150);
      return;
    }
    setStage("opening");
    setTimeout(() => setBurst(true), 750);
    setTimeout(onEnter, 1750);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && stage === "idle") open();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const opening = stage === "opening";

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-ivory"
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      role="dialog"
      aria-label="Birthday invitation"
    >
      {/* faint paper texture wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 85% 10%, rgba(247,220,226,0.7), transparent 65%), radial-gradient(ellipse 45% 35% at 8% 90%, rgba(244,217,139,0.4), transparent 60%)",
        }}
      />
      <Bunting />
      <FloatingHearts count={7} />
      {/* corner doodles */}
      <FlowerDoodle className="animate-sway absolute bottom-24 left-5 h-12 w-12 sm:h-16 sm:w-16" aria-hidden />
      <FlowerDoodle petal="#DCA7AF" className="animate-sway absolute bottom-10 right-6 h-10 w-10" aria-hidden />

      <div className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col items-center justify-center gap-10 px-6 pb-12 pt-24 sm:pt-28 lg:flex-row lg:gap-6 lg:px-12">
        {/* ——— headline block ——— */}
        <div className="max-w-xl flex-1 text-center lg:text-left">
          {/* birthday badge */}
          <motion.div
            initial={{ opacity: 0, y: -12, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="flex justify-center lg:justify-start"
          >
            <span className="shadow-scrap-sm flex items-center gap-2 rounded-full border-2 border-cocoa bg-butter px-5 py-2 text-xs font-bold uppercase tracking-[0.22em]">
              <MiniCake className="h-7 w-8" aria-hidden />
              Happy Birthday!
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-hand mt-3 text-2xl text-cherry sm:text-3xl"
          >
            {site.inviteKicker}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mt-3 text-[17vw] font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.6rem]"
          >
            {site.inviteHeadlineA}
            <br />
            <span className="italic text-cherry">{site.inviteHeadlineB}</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="mt-2 flex origin-left justify-center lg:justify-start"
          >
            <ScribbleUnderline className="w-52 sm:w-72" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mx-auto mt-5 max-w-sm text-[15px] font-medium leading-relaxed text-cocoasoft lg:mx-0"
          >
            {site.inviteSubline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-9 flex flex-col items-center gap-3 lg:items-start"
          >
            <button
              onClick={open}
              aria-label="Open your surprise and begin the birthday celebration"
              className="btn-shine group relative flex items-center gap-3 rounded-full border-2 border-cocoa bg-cherry px-10 py-5 text-base font-bold uppercase tracking-[0.18em] text-ivory transition-all hover:-translate-y-1 hover:bg-cherrydeep active:translate-y-0"
              style={{ boxShadow: "5px 5px 0 #49312F, 0 0 44px rgba(200,61,77,0.5)" }}
            >
              <span aria-hidden className="animate-ping-soft absolute inset-0 rounded-full bg-cherry" />
              <Gift className="relative h-6 w-6 transition-transform group-hover:-rotate-12 group-hover:scale-110" aria-hidden />
              <span className="relative">{site.inviteCta}</span>
            </button>
            <p className="font-hand -rotate-1 text-xl text-cocoasoft">
              cake, candles aur dher saara pyaar andar hai
            </p>
          </motion.div>
        </div>

        {/* ——— envelope composition ——— */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-sm flex-1 lg:max-w-md"
        >
          {/* butter sun behind */}
          <div aria-hidden className="absolute -right-6 -top-8 h-36 w-36 rounded-full bg-butter/70" />
          <Balloons className="animate-floaty absolute -top-16 right-0 z-10 h-28 w-32 sm:h-32 sm:w-36" />
          {/* tucked polaroid */}
          <div
            aria-hidden
            className="absolute -left-2 top-16 w-32 -rotate-[9deg] bg-white p-1.5 pb-6 shadow-photo sm:w-40"
          >
            <SmartImage
              src={site.coverInvite.src}
              alt=""
              className="aspect-[4/5] w-full"
              sizes="200px"
            />
          </div>
          {/* spinning sticker */}
          <div aria-hidden className="absolute -right-2 top-24 z-10 sm:right-2">
            <StickerBadge className="animate-wobble h-24 w-24 sm:h-28 sm:w-28" />
          </div>
          {/* ticket stub tucked under envelope */}
          <div aria-hidden className="absolute -bottom-2 left-0 z-10 hidden -rotate-6 sm:block">
            <TicketStub name={site.girlfriendName} />
          </div>

          {/* the envelope button */}
          <button
            onClick={open}
            aria-label="Open the envelope"
            className="animate-floaty relative mx-auto mt-10 block w-72 sm:w-80"
            style={{ ["--float-rot" as string]: "1.5deg" }}
          >
            <span className="relative block overflow-visible rounded-lg border border-cocoa/25 bg-cream shadow-photo">
              {/* letter peeking */}
              <motion.span
                aria-hidden
                className="absolute inset-x-5 top-3 rounded-sm border border-cocoa/15 bg-[#FFFDF7] px-4 pb-8 pt-3 text-left"
                animate={opening ? { y: -72, rotate: -2 } : { y: 6 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-hand block text-2xl leading-tight text-cherry">
                  for {site.girlfriendName}
                </span>
                <span className="mt-1 block h-1.5 w-3/4 rounded bg-blush" />
                <span className="mt-1.5 block h-1.5 w-full rounded bg-cream" />
                <span className="mt-1.5 block h-1.5 w-5/6 rounded bg-cream" />
              </motion.span>

              {/* envelope body */}
              <span className="relative block h-48 overflow-hidden rounded-lg bg-cream sm:h-52">
                {/* side folds */}
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 46%, rgba(73,49,47,0.08) 46.5%, transparent 47%), linear-gradient(245deg, transparent 46%, rgba(73,49,47,0.08) 46.5%, transparent 47%)",
                  }}
                />
                <span aria-hidden className="stitch absolute inset-2.5 rounded-md" />
              </span>

              {/* flap */}
              <motion.span
                aria-hidden
                className="absolute inset-x-0 top-0 h-24 origin-top"
                style={{
                  background: "#F3E3C6",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  backfaceVisibility: "hidden",
                }}
                animate={opening ? { rotateX: -162, zIndex: 0 } : { rotateX: 0 }}
                transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
              />

              {/* wax seal */}
              <motion.span
                aria-hidden
                className="absolute left-1/2 top-[4.4rem] flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-cherry font-hand text-2xl text-ivory shadow-photo"
                animate={opening ? { scale: 0, rotate: 40 } : { scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                ♥
              </motion.span>
            </span>
            <Burst fired={burst} count={30} spread={240} />
          </button>

          {/* mini cake in front */}
          <div aria-hidden className="relative z-10 mx-auto -mt-4 w-fit rotate-2">
            <MiniCake className="h-20 w-24 drop-shadow-[0_6px_10px_rgba(73,49,47,0.3)] sm:h-24 sm:w-28" />
          </div>

          <p className="font-hand mt-3 -rotate-2 text-center text-2xl text-cocoasoft">
            go on — open it
          </p>
        </motion.div>
      </div>

      {/* ribbon band along the bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="relative pb-8"
      >
        <Marquee
          items={[`happy birthday ${site.girlfriendName}`, "cake, candles aur pyaar", "open me", "today is all about you"]}
        />
      </motion.div>

      {/* opening veil */}
      <AnimatePresence>
        {opening && (
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-butter/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
