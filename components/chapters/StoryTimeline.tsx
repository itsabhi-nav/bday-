"use client";

import { motion } from "framer-motion";
import SmartImage from "../SmartImage";
import Reveal from "../Reveal";
import { useSite } from "../SiteContext";

/**
 * Scene C — the album. Journal entries taped to the page, joined by a
 * dashed twine spine. Alternating sides on desktop, single column on mobile.
 */
export default function StoryTimeline() {
  const site = useSite();
  return (
    <section aria-label="Our story" className="relative bg-ivory px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <h2 className="font-display max-w-xl text-4xl font-semibold leading-[1.02] sm:text-6xl">
              Pages from <span className="marker-rose italic">our album</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-hand max-w-[220px] rotate-2 text-2xl leading-tight text-cocoasoft">
              every ticket stub, every late-night call…
            </p>
          </Reveal>
        </div>

        <ol className="relative mt-14">
          {/* twine spine */}
          <span
            aria-hidden
            className="absolute bottom-6 left-[13px] top-6 border-l-2 border-dashed border-rose sm:left-1/2"
          />
          {site.timeline.map((m, i) => {
            const left = i % 2 === 0;
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 0.7 }}
                className={`relative mb-10 pl-10 sm:mb-14 sm:w-[calc(50%-28px)] sm:pl-0 ${
                  left ? "sm:mr-auto sm:pr-2" : "sm:ml-auto sm:pl-2"
                }`}
              >
                {/* knot on the twine */}
                <span
                  aria-hidden
                  className={`absolute top-7 flex h-7 w-7 items-center justify-center rounded-full border-2 border-cherry bg-ivory max-sm:left-0 ${
                    left ? "sm:-right-[14px]" : "sm:-left-[14px]"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-cherry" />
                </span>

                <article
                  className={`relative rotate-[0.4deg] border border-cocoa/15 bg-[#FFFDF7] p-5 shadow-photo sm:p-6 ${
                    i % 2 ? "-rotate-[0.6deg]" : ""
                  }`}
                >
                  {/* rubber-stamp date */}
                  <p className="inline-block -rotate-2 border-2 border-sage px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5F7355]">
                    {m.dateLabel}
                  </p>
                  <h3 className="font-display mt-3 text-2xl font-semibold leading-tight">{m.title}</h3>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed text-cocoasoft">{m.story}</p>
                  {m.sample && (
                    <p className="mt-3 inline-block bg-butter/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
                      Sample — replace with your memory
                    </p>
                  )}
                  {m.image && (
                    <figure className="relative mt-4">
                      <span className="tape tape-sage -top-3 left-6 z-10 -rotate-6" aria-hidden />
                      <SmartImage
                        src={m.image}
                        alt={m.imageAlt ?? m.title}
                        className="aspect-[16/10] w-full border border-cocoa/10"
                        sizes="(max-width: 768px) 90vw, 460px"
                      />
                      {m.caption && (
                        <figcaption className="font-hand mt-2 -rotate-1 text-xl leading-none text-cocoasoft">
                          {m.caption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </article>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
