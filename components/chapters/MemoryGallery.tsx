"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SmartImage from "../SmartImage";
import Reveal, { ChapterLabel } from "../Reveal";
import { useSite } from "../SiteContext";

/**
 * Scene D — the photo drawer. A masonry-style collage of mixed sizes and
 * small rotations, like prints spread on a table. Tap to open the lightbox.
 */
export default function MemoryGallery({ index = "04" }: { index?: string }) {
  const site = useSite();
  const memories = site.memories;
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setLightbox((v) => (v === null ? v : (v + 1) % memories.length));
      if (e.key === "ArrowLeft")
        setLightbox((v) => (v === null ? v : (v - 1 + memories.length) % memories.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const tilts = ["rotate-[1.5deg]", "-rotate-[1.2deg]", "rotate-[0.6deg]", "-rotate-[2deg]", "rotate-[1deg]", "-rotate-[0.8deg]", "rotate-[2deg]", "-rotate-[1.5deg]"];

  return (
    <section aria-label="Photo gallery" className="relative bg-blush px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <ChapterLabel index={index} title="Small moments, big meaning" />
            <Reveal>
              <h2 className="font-display max-w-xl text-4xl font-semibold leading-[1.02] sm:text-6xl">
                Pinned to <span className="italic text-cherry">the board</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="font-hand max-w-[230px] -rotate-2 text-2xl leading-tight text-cocoasoft">
              tap any print to hold it closer…
            </p>
          </Reveal>
        </div>

        <div className="mt-12 columns-2 gap-5 sm:columns-3 [&>*]:mb-5" role="list" aria-label="Memory photos">
          {memories.map((m, i) => (
            <motion.button
              key={i}
              role="listitem"
              onClick={() => setLightbox(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              aria-label={`Open photo: ${m.caption}`}
              className={`block w-full break-inside-avoid bg-white p-2 pb-3 text-left shadow-photo transition-shadow hover:shadow-scrap ${tilts[i % tilts.length]}`}
            >
              <SmartImage
                src={m.src}
                alt={m.alt}
                caption={m.caption}
                className={`w-full ${m.tall ? "aspect-[3/4]" : "aspect-square"}`}
                sizes="(max-width: 768px) 45vw, 380px"
              />
              <span className="block px-1 pt-2 text-[13px] font-semibold leading-snug">{m.caption}</span>
              {m.handwritten && (
                <span className="font-hand block px-1 text-xl leading-tight text-cherry">{m.handwritten}</span>
              )}
            </motion.button>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-cocoasoft">
            Temporary photos — swap in your own via <span className="text-cherry">config/birthday.ts</span>
          </p>
        </Reveal>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/80 p-4 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo viewer: ${memories[lightbox].caption}`}
          >
            <motion.figure
              initial={{ scale: 0.92, rotate: -2, y: 20 }}
              animate={{ scale: 1, rotate: 0.5, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 24, stiffness: 240 }}
              className="relative max-h-[88vh] w-full max-w-lg bg-white p-3 pb-4 shadow-photo"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="tape -top-3 left-10 z-10 -rotate-6" aria-hidden />
              <SmartImage
                src={memories[lightbox].src}
                alt={memories[lightbox].alt}
                caption={memories[lightbox].caption}
                className="max-h-[58vh] min-h-56 w-full"
                imgClassName="object-contain bg-cream"
                sizes="90vw"
              />
              <figcaption className="px-1 pt-3">
                <span className="block text-sm font-semibold">{memories[lightbox].caption}</span>
                {memories[lightbox].handwritten && (
                  <span className="font-hand block text-2xl text-cherry">{memories[lightbox].handwritten}</span>
                )}
              </figcaption>
              <div className="flex items-center justify-between px-1 pt-2">
                <span className="text-xs font-bold text-cocoasoft">
                  {lightbox + 1} / {memories.length}
                </span>
                <span className="flex gap-2">
                  <button
                    onClick={() => setLightbox((lightbox - 1 + memories.length) % memories.length)}
                    className="rounded-full bg-cream px-4 py-2 text-sm font-bold transition hover:bg-butter"
                    aria-label="Previous photo"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setLightbox((lightbox + 1) % memories.length)}
                    className="rounded-full bg-cream px-4 py-2 text-sm font-bold transition hover:bg-butter"
                    aria-label="Next photo"
                  >
                    →
                  </button>
                  <button
                    onClick={close}
                    className="flex items-center gap-1.5 rounded-full bg-cocoa px-4 py-2 text-sm font-bold text-ivory transition hover:bg-cherry"
                    aria-label="Close photo viewer"
                    autoFocus
                  >
                    <X className="h-4 w-4" aria-hidden /> Close
                  </button>
                </span>
              </div>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
