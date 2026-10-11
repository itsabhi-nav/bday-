"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import Reveal, { ChapterLabel } from "./Reveal";
import Burst from "./Burst";
import { usePrefersReducedMotion } from "@/hooks/useMedia";

const KEY = "hugs-delivered";

/** Hug Delivery Service — press the heart, a hug flies to her. Counter persists. */
export default function HugButton() {
  const [count, setCount] = useState(0);
  const [bursts, setBursts] = useState<number[]>([]);
  const [pops, setPops] = useState<number[]>([]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    try {
      const v = Number(window.localStorage.getItem(KEY));
      if (Number.isFinite(v) && v > 0) setCount(v);
    } catch {
      /* private mode — counter just won't persist */
    }
  }, []);

  const hug = () => {
    const next = count + 1;
    setCount(next);
    try {
      window.localStorage.setItem(KEY, String(next));
    } catch {
      /* ignore */
    }
    if (reduced) return;
    const id = Date.now();
    setBursts((b) => [...b.slice(-2), id]);
    setPops((p) => [...p.slice(-4), id]);
    setTimeout(() => {
      setBursts((b) => b.filter((x) => x !== id));
      setPops((p) => p.filter((x) => x !== id));
    }, 1800);
  };

  return (
    <section aria-label="Hug delivery service" className="relative overflow-hidden bg-cream px-6 py-20 text-center sm:py-24">
      <div className="relative mx-auto max-w-xl">
        <ChapterLabel index="7½" title="Hug break" align="center" />
        <Reveal>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">
            Hug <span className="marker italic">delivery</span>
          </h2>
          <p className="font-hand mt-2 text-2xl text-cocoasoft">dabaa. hug pahunch jayegi.</p>
        </Reveal>

        <Reveal delay={0.1} className="relative mt-10 flex justify-center">
          <div className="relative">
            {bursts.map((id) => (
              <Burst key={id} fired count={22} spread={190} />
            ))}
            {/* floating +1 chips */}
            <AnimatePresence>
              {pops.map((id) => (
                <motion.span
                  key={`p${id}`}
                  aria-hidden
                  className="font-hand pointer-events-none absolute left-1/2 top-0 z-20 text-2xl text-cherry"
                  initial={{ opacity: 0, x: "-50%", y: 10, scale: 0.7 }}
                  animate={{ opacity: [0, 1, 1, 0], y: -90, scale: 1.15 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                >
                  +1 hug ♥
                </motion.span>
              ))}
            </AnimatePresence>
            <motion.button
              onClick={hug}
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.05, rotate: -3 }}
              aria-label={`Send a hug. ${count} hugs delivered so far.`}
              className="shadow-scrap relative flex h-40 w-40 items-center justify-center rounded-full border-2 border-cocoa bg-cherry text-ivory sm:h-48 sm:w-48"
            >
              <span aria-hidden className="animate-ping-soft absolute inset-0 rounded-full bg-cherry" />
              <Heart className="relative h-16 w-16 fill-ivory sm:h-20 sm:w-20" aria-hidden />
            </motion.button>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p
            className="mx-auto mt-8 inline-block -rotate-1 border-2 border-dashed border-cherry/60 bg-ivory px-5 py-2 text-xs font-bold uppercase tracking-[0.2em]"
            role="status"
            aria-live="polite"
          >
            {count} hug{count === 1 ? "" : "s"} delivered
          </p>
        </Reveal>
      </div>
    </section>
  );
}
