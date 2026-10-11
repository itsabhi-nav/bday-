"use client";

import Reveal from "../Reveal";
import { useSite } from "../SiteContext";

/** Quiet interlude — "things I notice": big numerals, alternating rhythm. */
export default function WhatISee() {
  const site = useSite();
  return (
    <section id="see" aria-label="Things I notice about you" className="relative bg-cream px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="font-display max-w-2xl text-4xl font-semibold leading-[1.02] sm:text-6xl">
            You, through <span className="italic text-cherry">my eyes</span>
          </h2>
        </Reveal>
        <ol className="mt-12 space-y-2">
          {site.whatISeeLines.map((line, i) => (
            <Reveal key={i} delay={0.05}>
              <li
                className={`flex gap-5 border-t border-cocoa/15 py-7 sm:gap-8 ${
                  i % 2 === 1 ? "sm:flex-row-reverse sm:text-right" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="font-display shrink-0 text-5xl font-semibold text-rose/70 sm:text-6xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <blockquote className="font-display max-w-xl text-xl italic leading-snug sm:text-2xl">
                  “{line}”
                </blockquote>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal>
          <p className="font-hand mt-8 -rotate-1 text-2xl text-cocoasoft">
            …and about a hundred more I ran out of page for.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
