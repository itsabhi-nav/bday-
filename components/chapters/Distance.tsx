"use client";

import Reveal from "../Reveal";
import SmartImage from "../SmartImage";
import { useSite } from "../SiteContext";

/** A free dedication block — koi bhi photo, kuch bhi text. Customer jaisa chahe bhare. */
export default function Distance() {
  const site = useSite();
  const d = site.distanceSection;

  return (
    <section aria-label={d.heading} className="relative bg-ivory px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {d.heading}
          </h2>
        </Reveal>

        {d.image && (
          <Reveal delay={0.1} className="relative mx-auto mt-10 w-full max-w-sm">
            <figure className="relative -rotate-1 bg-white p-3 pb-12 shadow-photo">
              <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" aria-hidden />
              <SmartImage
                src={d.image}
                alt={d.imageAlt || d.heading}
                className="aspect-[4/5] w-full"
                sizes="(max-width: 768px) 90vw, 400px"
              />
              {d.caption && (
                <figcaption className="font-hand absolute inset-x-0 bottom-2.5 text-center text-2xl leading-none text-cocoa">
                  {d.caption}
                </figcaption>
              )}
            </figure>
          </Reveal>
        )}

        <Reveal delay={0.15}>
          <p className="font-display mx-auto mt-8 max-w-xl text-xl italic leading-relaxed sm:text-2xl">
            “{d.body}”
          </p>
        </Reveal>
      </div>
    </section>
  );
}
