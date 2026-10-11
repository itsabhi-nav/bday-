"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../Reveal";
import { FlowerDoodle } from "../Ornaments";
import { useSite } from "../SiteContext";

/** The pressed flower + colophon footer. */
export default function EasterEgg() {
  const site = useSite();
  const easterEgg = site.easterEgg;
  const [taps, setTaps] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [footerTaps, setFooterTaps] = useState(0);

  if (!easterEgg.enabled) return <Colophon />;

  const tapFlower = () => {
    const next = taps + 1;
    setTaps(next);
    if (next >= 5) setUnlocked(true);
  };
  const tapHeart = () => {
    const next = footerTaps + 1;
    setFooterTaps(next);
    if (next >= 3) setUnlocked(true);
  };

  return (
    <>
      <section aria-label="A tiny secret" className="bg-ivory px-6 py-20 text-center">
        <Reveal>
          <p className="font-hand mx-auto max-w-xs text-2xl leading-snug text-cocoasoft">
            {site.easterEggHint}
          </p>
          <button
            onClick={tapFlower}
            aria-label={unlocked ? "Secret already found" : `Secret flower, ${5 - taps} taps to go`}
            className="mx-auto mt-6 block rounded-full p-5 transition hover:scale-110"
          >
            <motion.span
              className="block"
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <FlowerDoodle
                className="h-10 w-10"
                petal={unlocked ? "#C83D4D" : "#DCA7AF"}
              />
            </motion.span>
          </button>
          {!unlocked && taps > 0 && taps < 5 && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cocoasoft" aria-live="polite">
              {5 - taps} more…
            </p>
          )}
        </Reveal>

        <AnimatePresence>
          {unlocked && (
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.7 }}
              className="relative mx-auto mt-6 max-w-md border border-cocoa/15 bg-cream p-8 shadow-photo"
              role="status"
              aria-live="polite"
            >
              <span className="tape tape-rose -top-3 left-1/2 -translate-x-1/2 -rotate-2" aria-hidden />
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-cherry">
                {easterEgg.secretTitle}
              </p>
              <p className="font-display mt-3 text-xl italic leading-relaxed">“{easterEgg.secretBody}”</p>
              <p className="font-hand mt-3 text-2xl text-cocoasoft">only you get to read this</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <Colophon onHeartTap={tapHeart} />
    </>
  );
}

function Colophon({ onHeartTap }: { onHeartTap?: () => void }) {
  const site = useSite();
  return (
    <footer className="border-t-2 border-dashed border-cocoa/20 bg-cream px-6 py-12 text-center">
      <FlowerDoodle className="mx-auto h-10 w-10" />
      <p className="font-display mx-auto mt-4 max-w-md text-2xl italic leading-snug">
        “I didn&apos;t just make you a birthday page. I made you a little handmade world.”
      </p>
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.28em] text-cocoasoft">
        Bound with love by {site.myName}
        <button
          onClick={onHeartTap}
          aria-label="A tiny heart, nothing to see here"
          className="font-hand ml-1.5 align-middle text-xl text-cherry transition hover:scale-125"
        >
          ♥<span className="sr-only">secret</span>
        </button>
      </p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cocoasoft/70">
        Set in Cormorant Garamond, Manrope & Caveat · Photos: temporary stand-ins
      </p>
    </footer>
  );
}
