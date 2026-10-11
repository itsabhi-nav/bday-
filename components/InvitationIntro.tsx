"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MailOpen } from "lucide-react";
import SmartImage from "./SmartImage";
import Burst from "./Burst";
import { FlowerDoodle, Sprig, Marquee, StickerBadge, ScribbleUnderline, TicketStub, FloatingHearts } from "./Ornaments";
import { playMusic } from "@/lib/music";
import { useSite } from "./SiteContext";

interface Props {
  onEnter: () => void;
}

/**
 * The invitation — a warm editorial opening, not a portal.
 * The envelope IS the button. Music starts inside the same tap gesture.
 */
export default function InvitationIntro({ onEnter }: Props) {
  const site = useSite();
  const [stage, setStage] = useState<"idle" | "opening" | "gone">("idle");
  const [burst, setBurst] = useState(false);
  const reduce = useReducedMotion();

  const open = (withMusic: boolean) => {
    if (stage !== "idle") return;
    // Start music INSIDE the user gesture — this is what makes it play.
    if (withMusic) void playMusic().catch(() => {});
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
      if (e.key === "Enter" && stage === "idle") open(true);
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
      <FloatingHearts count={7} />
      {/* corner doodles */}
      <FlowerDoodle className="animate-sway absolute left-5 top-6 h-12 w-12 sm:h-16 sm:w-16" aria-hidden />
      <Sprig className="absolute bottom-8 left-6 hidden h-8 w-24 sm:block" aria-hidden />
      <FlowerDoodle petal="#DCA7AF" className="animate-sway absolute bottom-10 right-6 h-10 w-10" aria-hidden />

      {/* postage stamp */}
      <div
        aria-hidden
        className="absolute right-5 top-5 hidden rotate-6 border border-cocoa/20 bg-sage/60 p-1.5 sm:block"
      >
        <div className="stitch px-3 py-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cocoa">Postage</p>
          <p className="font-hand text-xl leading-none text-cherry">with love</p>
        </div>
      </div>

      <div className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col items-center justify-center gap-10 px-6 py-12 lg:flex-row lg:gap-6 lg:px-12">
        {/* ——— headline block ——— */}
        <div className="max-w-xl flex-1 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="font-hand text-2xl text-cherry sm:text-3xl"
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
            className="mt-2 origin-left"
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
            className="mt-8 flex flex-col items-center gap-3 lg:items-start"
          >
            <button
              onClick={() => open(true)}
              aria-label="Open your surprise and begin"
              className="shadow-scrap btn-shine group relative flex items-center gap-2.5 rounded-full bg-cherry px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-ivory transition-all hover:-translate-y-0.5 hover:bg-cherrydeep active:translate-y-0 active:shadow-none"
            >
              <span aria-hidden className="animate-ping-soft absolute inset-0 rounded-full bg-cherry" />
              <MailOpen className="relative h-4 w-4 transition-transform group-hover:-rotate-12" aria-hidden />
              <span className="relative">{site.inviteCta}</span>
            </button>
            <button
              onClick={() => open(false)}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoasoft underline decoration-rose decoration-2 underline-offset-4 transition hover:text-cocoa"
            >
              Continue quietly, no music
            </button>
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
          <div aria-hidden className="absolute -right-2 top-2 z-10 sm:right-2">
            <StickerBadge className="animate-wobble h-24 w-24 sm:h-28 sm:w-28" />
          </div>
          {/* ticket stub tucked under envelope */}
          <div aria-hidden className="absolute -bottom-2 left-0 z-10 hidden -rotate-6 sm:block">
            <TicketStub name={site.girlfriendName} />
          </div>

          {/* the envelope button */}
          <button
            onClick={() => open(true)}
            aria-label="Open the envelope"
            className="animate-floaty relative mx-auto block w-72 sm:w-80"
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

          <p className="font-hand mt-5 -rotate-2 text-center text-2xl text-cocoasoft">
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
          items={[`happy birthday ${site.girlfriendName}`, "a surprise made with love", "open me", "today is all about you"]}
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
