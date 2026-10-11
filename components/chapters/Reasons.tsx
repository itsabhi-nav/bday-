"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SmartImage from "../SmartImage";
import Reveal, { ChapterLabel } from "../Reveal";
import { FlowerDoodle } from "../Ornaments";
import { useSite } from "../SiteContext";

/**
 * Scene B — things I adore. Notes, cutouts and mini-prints scattered like a
 * desk mid-scrapbook. Each unfolds its message on tap.
 */
const TILTS = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];

export default function Reasons({ index = "05" }: { index?: string }) {
  const site = useSite();
  const reasons = site.reasons;
  const [opened, setOpened] = useState<Set<number>>(new Set());
  const [focused, setFocused] = useState<number | null>(null);

  const open = (i: number) => {
    setOpened((prev) => new Set(prev).add(i));
    setFocused(i);
  };

  return (
    <section aria-label="Things I adore about you" className="relative overflow-hidden bg-ivory px-6 py-20 sm:py-28">
      <FlowerDoodle className="absolute left-8 top-16 h-12 w-12 -rotate-12 opacity-70" aria-hidden />
      <FlowerDoodle petal="#DCA7AF" className="absolute bottom-24 right-8 h-14 w-14 rotate-12 opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <ChapterLabel index={index} title="Things I adore" align="center" />
          <Reveal>
            <h2 className="font-display text-4xl font-semibold leading-[1.02] sm:text-6xl">
              A desk full of <span className="marker italic">little notes</span>
            </h2>
            <p className="mt-4 text-[15px] font-medium text-cocoasoft">
              I kept leaving you notes. Here&apos;s where they all ended up — tap one to unfold it.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className="mx-auto mt-5 inline-block -rotate-1 border-2 border-dashed border-cherry/60 bg-cream px-5 py-2 text-xs font-bold uppercase tracking-[0.2em]"
              aria-live="polite"
              role="status"
            >
              {opened.size} of {reasons.length} unfolded
            </p>
          </Reveal>
        </div>

        {/* scattered desk */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3" role="list">
          {reasons.map((r, i) => {
            const isOpen = opened.has(i);
            const showMiniPrint = i === 2 || i === 6;
            const photo = i === 2 ? site.coverNoteA : site.coverNoteB;
            return (
              <motion.button
                key={i}
                role="listitem"
                onClick={() => open(i)}
                aria-label={isOpen ? `Re-read note ${i + 1}` : `Unfold note ${i + 1}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.07 }}
                whileHover={{ rotate: 0, y: -5 }}
                className={`relative min-h-44 p-4 text-left shadow-photo transition-shadow hover:shadow-scrap sm:min-h-52 sm:p-5 ${TILTS[i % TILTS.length]} ${
                  i % 4 === 1 ? "lined-paper" : "bg-[#FFFDF7]"
                } ${i % 5 === 4 ? "bg-butter/50" : ""}`}
              >
                <span className="font-hand text-xl leading-none text-cherry">no. {i + 1}</span>
                {showMiniPrint ? (
                  <span className="mt-2 block border border-cocoa/10 bg-white p-1">
                    <SmartImage src={photo.src} alt={photo.alt} className="aspect-square w-full" sizes="300px" />
                    <span className="font-hand block py-0.5 text-center text-lg leading-tight">{photo.caption}</span>
                  </span>
                ) : (
                  <span className="mt-2 block">
                    {isOpen ? (
                      <span className="font-display block text-[17px] italic leading-snug sm:text-lg">“{r}”</span>
                    ) : (
                      <span>
                        <span className="block h-2 w-11/12 rounded bg-blush" />
                        <span className="mt-2 block h-2 w-3/4 rounded bg-cream" />
                        <span className="mt-2 block h-2 w-5/6 rounded bg-cream" />
                        <span className="font-hand mt-3 block rotate-[-2deg] text-xl text-cocoasoft">
                          unfold me →
                        </span>
                      </span>
                    )}
                  </span>
                )}
                {isOpen && !showMiniPrint && (
                  <span className="mt-2 inline-block bg-sage/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em]">
                    unfolded ♥
                  </span>
                )}
                {showMiniPrint && !isOpen && (
                  <span className="font-hand mt-1 block text-center text-xl text-cocoasoft">open me →</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* reading dialog */}
        <AnimatePresence>
          {focused !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/70 p-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFocused(null)}
              role="dialog"
              aria-modal="true"
              aria-label={`Note ${focused + 1}`}
            >
              <motion.div
                initial={{ rotate: -3, scale: 0.94, y: 18 }}
                animate={{ rotate: -1, scale: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="lined-paper relative w-full max-w-md p-8 shadow-photo sm:p-10"
              >
                <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" aria-hidden />
                <p className="font-hand text-2xl text-cherry">note no. {focused + 1}</p>
                <p className="font-display mt-3 text-2xl italic leading-snug">“{reasons[focused]}”</p>
                <button
                  onClick={() => setFocused(null)}
                  className="shadow-scrap-sm mt-7 flex items-center gap-2 rounded-full bg-cherry px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-ivory transition hover:bg-cherrydeep"
                  aria-label="Close note"
                  autoFocus
                >
                  <X className="h-4 w-4" aria-hidden /> Tuck it back
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
