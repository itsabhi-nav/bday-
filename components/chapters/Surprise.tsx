"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal, { ChapterLabel } from "../Reveal";
import Burst from "../Burst";
import ScratchCard from "../ScratchCard";
import { FlowerDoodle } from "../Ornaments";
import { useSite } from "../SiteContext";

/** Scene F — the gift. Kraft box, ribbon, paper flower. Untie → petal burst. */
export default function Surprise({ index = "08" }: { index?: string }) {
  const site = useSite();
  const surpriseSection = site.surpriseSection;
  const [opened, setOpened] = useState(false);
  const [burst, setBurst] = useState(false);

  const open = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => setBurst(true), 450);
  };

  return (
    <section aria-label="Birthday surprise" className="relative overflow-hidden bg-blush px-6 py-20 sm:py-28">
      <div className="relative mx-auto max-w-2xl text-center">
        <ChapterLabel index={index} title="Psst… one more thing" align="center" />
        <Reveal>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">{surpriseSection.prompt}</h2>
          <p className="font-hand mt-2 text-2xl text-cocoasoft">{surpriseSection.hint}</p>
        </Reveal>

        <div className="relative mt-12 flex flex-col items-center">
          <AnimatePresence mode="wait" initial={false}>
            {!opened ? (
              <motion.button
                key="box"
                onClick={open}
                aria-label="Untie the ribbon and open the gift"
                aria-expanded={false}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.04, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
                className="group relative"
              >
                <span aria-hidden className="absolute -inset-8 rounded-full bg-butter/50" />
                <span className="shadow-scrap relative block h-44 w-44 rounded-md border-2 border-cocoa bg-[#D9A05B] sm:h-52 sm:w-52">
                  {/* lid line */}
                  <span aria-hidden className="absolute inset-x-0 top-10 border-t-2 border-cocoa/70" />
                  {/* ribbon */}
                  <span aria-hidden className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-cherry" />
                  <span aria-hidden className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 bg-cherry" />
                  {/* bow */}
                  <span aria-hidden className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <span className="absolute -left-7 top-0 h-7 w-8 -rotate-[24deg] rounded-full border-[5px] border-cherry bg-transparent" />
                    <span className="absolute -right-7 top-0 h-7 w-8 rotate-[24deg] rounded-full border-[5px] border-cherry bg-transparent" />
                    <span className="absolute left-1/2 top-1 h-4 w-4 -translate-x-1/2 rounded-full bg-cherrydeep" />
                  </span>
                  {/* paper flower */}
                  <FlowerDoodle className="absolute -right-5 -top-7 h-12 w-12 rotate-12 transition-transform group-hover:rotate-45" />
                </span>
                <Burst fired={burst} count={30} spread={230} />
              </motion.button>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, y: 24, rotate: -1 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full border border-cocoa/15 bg-[#FFFDF7] p-8 shadow-photo sm:p-10"
                role="status"
                aria-live="polite"
              >
                <span className="tape -top-3 left-8 -rotate-6" aria-hidden />
                <span className="tape tape-rose -top-3 right-8 rotate-6" aria-hidden />
                <h3 className="font-display text-3xl font-semibold text-cherry">
                  {surpriseSection.revealedTitle}
                </h3>
                <p className="mx-auto mt-4 max-w-md text-[15px] font-medium leading-relaxed text-cocoasoft">
                  {surpriseSection.revealedBody}
                </p>
                {/* scratch coupon */}
                <ScratchCard label="Gift coupon · no expiry">
                  <p className="font-hand text-3xl leading-tight text-cherry">{surpriseSection.giftNote}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-cocoasoft">
                    Redeem: anytime · Didi excluded ♥
                  </p>
                </ScratchCard>
                <button
                  onClick={() => {
                    setOpened(false);
                    setBurst(false);
                  }}
                  className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-cocoasoft underline decoration-rose decoration-2 underline-offset-4 transition hover:text-cocoa"
                >
                  Wrap it back up
                </button>
                <Burst fired={burst} count={22} spread={200} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
