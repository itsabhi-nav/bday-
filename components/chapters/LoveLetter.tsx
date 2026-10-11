"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import Reveal, { ChapterLabel } from "../Reveal";
import { useSite } from "../SiteContext";
import { usePrefersReducedMotion } from "@/hooks/useMedia";

/** Scene E — the letter. Quiet ivory moment, wax-sealed envelope, lined paper. */
export default function LoveLetter({ index = "06" }: { index?: string }) {
  const site = useSite();
  const loveLetter = site.loveLetter;
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const reduced = usePrefersReducedMotion();
  const letterRef = useRef<HTMLDivElement>(null);

  const total = loveLetter.paragraphs.length;
  const visible = showAll || reduced ? total : count;

  useEffect(() => {
    if (!open || showAll || reduced) return;
    const t = setInterval(() => {
      setCount((c) => {
        if (c >= total) {
          clearInterval(t);
          return c;
        }
        return c + 1;
      });
    }, 2000);
    return () => clearInterval(t);
  }, [open, showAll, reduced, total]);

  useEffect(() => {
    if (open) {
      setCount(reduced ? total : 1);
      setTimeout(
        () => letterRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }),
        350
      );
    }
  }, [open, reduced, total]);

  return (
    <section aria-label="A letter for you" className="relative bg-cream px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <ChapterLabel index={index} title="Sealed with a kiss" align="center" />
        <Reveal>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">{loveLetter.heading}</h2>
        </Reveal>

        {!open ? (
          <Reveal delay={0.1} className="mt-12">
            <motion.button
              onClick={() => setOpen(true)}
              whileHover={{ y: -5, rotate: -1 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Open the letter"
              className="group relative mx-auto block w-72 sm:w-80"
            >
              <span className="relative block rounded-md border border-cocoa/20 bg-[#FFFDF7] p-8 pb-10 shadow-photo">
                <span aria-hidden className="stitch absolute inset-2 rounded" />
                <span className="font-hand block rotate-[-3deg] text-4xl text-cocoa">a letter</span>
                <span className="font-hand block rotate-[-3deg] text-4xl text-cherry">for you</span>
                <span className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-cherry font-hand text-2xl text-ivory transition-transform group-hover:scale-110 group-hover:rotate-12">
                  ♥
                </span>
              </span>
              <span className="shadow-scrap mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-cocoa px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-ivory transition group-hover:bg-cherry">
                <BookOpen className="h-4 w-4" aria-hidden /> Open the letter
              </span>
            </motion.button>
          </Reveal>
        ) : (
          <div
            ref={letterRef}
            role="article"
            aria-label="Personal love letter"
            tabIndex={-1}
            className="lined-paper mt-12 scroll-mt-24 p-8 text-left shadow-photo sm:p-12"
          >
            <p className="font-display text-xl italic text-cherry">{loveLetter.greeting}</p>
            <div className="mt-6 space-y-6">
              <AnimatePresence initial={false}>
                {loveLetter.paragraphs.slice(0, visible).map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="font-display text-xl leading-[32px]"
                  >
                    {p}
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
            {visible >= total && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
                <p className="text-sm font-semibold text-cocoasoft">{loveLetter.signoff}</p>
                <p className="font-hand mt-1 -rotate-2 text-5xl text-cherry">{loveLetter.signature}</p>
              </motion.div>
            )}
            {!showAll && visible < total && !reduced && (
              <button
                onClick={() => setShowAll(true)}
                className="shadow-scrap-sm mt-8 rounded-full bg-cocoa px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-ivory transition hover:bg-cherry"
              >
                Read it all →
              </button>
            )}
            <span className="sr-only" aria-live="polite">
              Paragraph {visible} of {total} revealed.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
