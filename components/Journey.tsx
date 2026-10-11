"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InvitationIntro from "@/components/InvitationIntro";
import MusicController from "@/components/MusicController";
import HeroBirthday from "@/components/chapters/HeroBirthday";
import WhatISee from "@/components/chapters/WhatISee";
import StoryTimeline from "@/components/chapters/StoryTimeline";
import MemoryGallery from "@/components/chapters/MemoryGallery";
import Reasons from "@/components/chapters/Reasons";
import LoveLetter from "@/components/chapters/LoveLetter";
import Distance from "@/components/chapters/Distance";
import HugButton from "@/components/HugButton";
import Surprise from "@/components/chapters/Surprise";
import CakeFinale from "@/components/chapters/CakeFinale";
import EasterEgg from "@/components/chapters/EasterEgg";
import { TornDivider, Marquee } from "@/components/Ornaments";
import { SiteProvider } from "@/components/SiteContext";
import { defaultSiteData, type SiteData } from "@/lib/sitedata";

interface Props {
  /** Customer data. Defaults to the demo story. */
  data?: SiteData;
  /** Skip the invitation gate (used by the editor's live preview). */
  autoEnter?: boolean;
  /** Preview mode: no music controller, no scroll-locking, no fixed rails. */
  preview?: boolean;
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/**
 * Orchestrator: invitation gate -> page-by-page birthday story.
 * Chapters render only if enabled in data.sections, numbered in order —
 * so every customer's page has its own shape.
 */
export default function Journey({ data, autoEnter = false, preview = false }: Props) {
  const site = data ?? defaultSiteData();
  const [entered, setEntered] = useState(autoEnter);
  const [progress, setProgress] = useState(0);

  const handleEnter = useCallback(() => {
    setEntered(true);
    if (!preview) requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }, [preview]);

  useEffect(() => {
    if (!entered || preview) return;
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [entered, preview]);

  useEffect(() => {
    if (preview) return;
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered, preview]);

  let n = 0;
  const nx = () => pad(++n);
  const s = site.sections;

  return (
    <SiteProvider data={site} preview={preview}>
      <main className="relative min-h-screen bg-ivory text-cocoa">
        {!entered && !preview && (
          <button
            onClick={handleEnter}
            className="fixed left-4 top-4 z-[60] rounded-full border border-cocoa/20 bg-ivory/95 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-cocoasoft shadow-photo transition hover:text-cocoa"
          >
            Skip intro →
          </button>
        )}

        <AnimatePresence>{!entered && <InvitationIntro onEnter={handleEnter} />}</AnimatePresence>

        {entered && (
          <>
            {!preview && (
              <div
                className="fixed left-0 top-0 z-40 h-1 w-full bg-cocoa/10"
                role="progressbar"
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Story progress"
              >
                <div className="h-full bg-cherry transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
              </div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
              <HeroBirthday index={nx()} />
              <TornDivider from="#FFF9F0" to="#FDF1DE" />
              {s.notice && (
                <>
                  <WhatISee index={nx()} />
                  <TornDivider from="#FDF1DE" to="#FFF9F0" />
                </>
              )}
              {s.timeline && (
                <>
                  <StoryTimeline index={nx()} />
                  <TornDivider from="#FFF9F0" to="#F7DCE2" />
                </>
              )}
              {s.gallery && (
                <>
                  <MemoryGallery index={nx()} />
                  <div className="bg-blush pb-10">
                    <Marquee
                      items={["still not over", `we love ${site.girlfriendName}`, "keep going", "best part next"]}
                      className="bg-butter text-cocoa"
                    />
                  </div>
                  <TornDivider from="#F7DCE2" to="#FFF9F0" />
                </>
              )}
              {s.reasons && (
                <>
                  <Reasons index={nx()} />
                  <TornDivider from="#FFF9F0" to="#FDF1DE" />
                </>
              )}
              {s.letter && (
                <>
                  <LoveLetter index={nx()} />
                  <TornDivider from="#FDF1DE" to="#FFF9F0" />
                </>
              )}
              {s.distance && (
                <>
                  <Distance index={nx()} />
                  <TornDivider from="#FFF9F0" to="#FDF1DE" />
                </>
              )}
              {s.hug && (
                <>
                  <HugButton />
                  <TornDivider from="#FDF1DE" to="#F7DCE2" />
                </>
              )}
              {s.surprise && (
                <>
                  <Surprise index={nx()} />
                  <TornDivider from="#F7DCE2" to="#3A2422" />
                </>
              )}
              {s.cake && (
                <>
                  <div className="py-8" style={{ background: "#3A2422" }}>
                    <Marquee
                      fast
                      items={["make a wish", "blow the candles", "big finale energy", `go ${site.girlfriendName}`]}
                      className="bg-cherry text-ivory"
                    />
                  </div>
                  <CakeFinale index={nx()} />
                  <TornDivider from="#E0A05B" to="#FFF9F0" />
                </>
              )}
              <EasterEgg />
            </motion.div>

            {!preview && <MusicController />}
          </>
        )}
      </main>
    </SiteProvider>
  );
}
