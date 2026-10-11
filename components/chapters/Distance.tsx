"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal, { ChapterLabel } from "../Reveal";
import { distanceSection } from "@/config/birthday";

/** Warm postcard interlude — two stamped cards joined by twine that draws on scroll. */
export default function Distance() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const draw = useTransform(scrollYProgress, [0.25, 0.75], [0, 1]);

  return (
    <section aria-label="If you were here right now" className="relative bg-ivory px-6 py-20 sm:py-28">
      <div ref={ref} className="mx-auto max-w-4xl text-center">
        <ChapterLabel index="07" title="Across the miles" align="center" />
        <Reveal>
          <h2 className="font-display mx-auto max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
            {distanceSection.heading}
          </h2>
        </Reveal>

        <div className="relative mx-auto mt-10 max-w-2xl" aria-hidden>
          <svg viewBox="0 0 600 120" className="h-28 w-full sm:h-32" fill="none">
            <motion.path
              d="M70 90 C 200 10, 400 10, 530 90"
              stroke="#C83D4D"
              strokeWidth="2.5"
              strokeDasharray="8 7"
              strokeLinecap="round"
              style={{ pathLength: draw }}
            />
          </svg>
          <div className="flex items-start justify-between px-2 sm:px-8">
            <div className="w-32 -rotate-3 border border-cocoa/15 bg-[#FFFDF7] p-2 pb-6 shadow-photo sm:w-40">
              <div className="flex h-16 items-center justify-center bg-blush sm:h-20">
                <span className="font-hand text-2xl text-cherry">you</span>
              </div>
              <p className="mt-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-cocoasoft">
                {distanceSection.fromLabel}
              </p>
            </div>
            <div className="w-32 rotate-3 border border-cocoa/15 bg-[#FFFDF7] p-2 pb-6 shadow-photo sm:w-40">
              <div className="flex h-16 items-center justify-center bg-sage/60 sm:h-20">
                <span className="font-hand text-2xl text-cocoa">me</span>
              </div>
              <p className="mt-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-cocoasoft">
                {distanceSection.toLabel}
              </p>
            </div>
          </div>
        </div>

        <Reveal delay={0.1}>
          <p className="font-display mx-auto mt-10 max-w-xl text-xl italic leading-relaxed sm:text-2xl">
            “{distanceSection.body}”
          </p>
        </Reveal>
      </div>
    </section>
  );
}
