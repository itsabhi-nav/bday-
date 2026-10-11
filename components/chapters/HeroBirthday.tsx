"use client";

import { motion } from "framer-motion";
import { Cake, Gift, Heart } from "lucide-react";
import SmartImage from "../SmartImage";
import Reveal, { ChapterLabel } from "../Reveal";
import { FlowerDoodle, Marquee, StickerBadge, ScribbleUnderline, DoodleArrow } from "../Ornaments";
import { useSite, usePreview } from "../SiteContext";

/** Scene A — the birthday cover. Editorial, asymmetric, portrait-forward. */
export default function HeroBirthday({ index = "01" }: { index?: string }) {
  const site = useSite();
  const preview = usePreview();
  return (
    <section aria-label="Happy birthday" className="relative overflow-hidden">
      {/* ribbon on top */}
      <div className="pt-14 sm:pt-20">
        <Marquee
          fast
          items={[`happy birthday ${site.girlfriendName}`, site.birthdayDate, "the birthday girl", "made with love"]}
          className="bg-cocoa text-butter"
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-16">
        <div className="flex items-start justify-between gap-4">
          <ChapterLabel index={index} title="The birthday girl" />
          {/* date stamp */}
          <motion.div
            initial={{ opacity: 0, rotate: 12, scale: 0.8 }}
            whileInView={{ opacity: 1, rotate: 8, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring", damping: 12 }}
            aria-label={`Birthday date: ${site.birthdayDate}`}
            className="hidden shrink-0 rounded-full border-2 border-cherry px-5 py-2 text-center sm:block"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cherry">Save the date</p>
            <p className="font-display text-lg font-semibold">{site.birthdayDate}</p>
          </motion.div>
        </div>

        <div className="mt-4 grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
          {/* headline */}
          <div>
            <Reveal>
              <h2
                className={`font-display font-semibold leading-[0.92] tracking-tight ${
                  preview ? "text-5xl" : "text-[15vw] sm:text-7xl lg:text-[5.2rem]"
                }`}
              >
                {site.heroHeadline},
                <br />
                <span className="marker italic">{site.girlfriendName}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ScribbleUnderline className="mt-3 w-56 sm:w-80" />
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-cocoasoft sm:text-lg">
                {site.heroSubline}
              </p>
            </Reveal>
            {/* fun chips */}
            <Reveal delay={0.22}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {[
                  { icon: Cake, label: "cake o'clock" },
                  { icon: Gift, label: "surprises inside" },
                  { icon: Heart, label: "100% handmade" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="shadow-scrap-sm flex -rotate-1 items-center gap-1.5 rounded-full border-2 border-cocoa bg-ivory px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] odd:rotate-1"
                  >
                    <Icon className="h-3.5 w-3.5 text-cherry" aria-hidden />
                    {label}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-[0.22em] text-cocoasoft">
                <span>{site.birthdayDate}</span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-cherry" />
                <span>Chapter one of your day</span>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-6 flex items-center gap-2">
                <p className="font-hand -rotate-1 text-2xl text-cherry">
                  ↓ keep scrolling, the good stuff is below
                </p>
                <DoodleArrow className="hidden h-12 w-20 -scale-x-100 rotate-[130deg] sm:block" />
              </div>
            </Reveal>
          </div>

          {/* portrait collage */}
          <Reveal delay={0.2} className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div aria-hidden className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-blush" />
            <div aria-hidden className="absolute -bottom-6 right-6 h-28 w-28 rounded-full bg-butter/80" />
            <FlowerDoodle className="absolute -right-3 -top-8 z-10 h-14 w-14 rotate-12" />
            <StickerBadge className="absolute -left-6 -top-10 z-10 h-24 w-24 sm:h-28 sm:w-28" center="★" />
            <motion.figure
              initial={{ rotate: 5 }}
              whileInView={{ rotate: 2.5 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative bg-white p-3 pb-14 shadow-photo"
            >
              <span className="tape -top-3 left-8 -rotate-12" aria-hidden />
              <span className="tape tape-rose -top-2 right-8 rotate-[14deg]" aria-hidden />
              <SmartImage
                src={site.coverHero.src}
                alt={site.coverHero.alt}
                priority
                className="aspect-[4/5] w-full"
                sizes="(max-width: 1024px) 90vw, 480px"
              />
              <figcaption className="font-hand absolute inset-x-0 bottom-3 text-center text-[1.7rem] leading-none text-cocoa">
                {site.coverHero.caption}
              </figcaption>
            </motion.figure>
            {/* overlapping mini print */}
            <motion.figure
              initial={{ opacity: 0, y: 24, rotate: -10 }}
              whileInView={{ opacity: 1, y: 0, rotate: -7 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.8 }}
              className="absolute -bottom-10 -left-4 w-28 bg-white p-1.5 pb-5 shadow-photo sm:-left-10 sm:w-36"
            >
              <SmartImage
                src={site.coverNoteB.src}
                alt={site.coverNoteB.alt}
                className="aspect-square w-full"
                sizes="200px"
              />
              <figcaption className="font-hand pt-1 text-center text-lg leading-none">
                {site.coverNoteB.caption}
              </figcaption>
            </motion.figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
