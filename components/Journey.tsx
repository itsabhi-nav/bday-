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
import Surprise from "@/components/chapters/Surprise";
import HugButton from "@/components/HugButton";
import CakeFinale from "@/components/chapters/CakeFinale";
import EasterEgg from "@/components/chapters/EasterEgg";
import { TornDivider, Marquee } from "@/components/Ornaments";
import { siteConfig } from "@/config/birthday";

/**
 * Orchestrator: invitation gate -> page-by-page birthday story.
 * Backgrounds flow ivory → cream → blush through torn-paper dividers,
 * like turning pages of a handmade album.
 */
export default function Journey() {
  const [entered, setEntered] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleEnter = useCallback(() => {
    setEntered(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }, []);

  useEffect(() => {
    if (!entered) return;
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [entered]);

  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  return (
    <main className="relative min-h-screen bg-ivory text-cocoa">
      {!entered && (
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
          {/* cherry reading-progress thread */}
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

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
            <HeroBirthday />
            <TornDivider from="#FFF9F0" to="#FDF1DE" />
            <WhatISee />
            <TornDivider from="#FDF1DE" to="#FFF9F0" />
            <StoryTimeline />
            <TornDivider from="#FFF9F0" to="#F7DCE2" />
            <MemoryGallery />
            <div className="bg-blush pb-10">
              <Marquee
                items={["still not over", `we love ${siteConfig.girlfriendName}`, "keep going", "best part next"]}
                className="bg-butter text-cocoa"
              />
            </div>
            <TornDivider from="#F7DCE2" to="#FFF9F0" />
            <Reasons />
            <TornDivider from="#FFF9F0" to="#FDF1DE" />
            <LoveLetter />
            <TornDivider from="#FDF1DE" to="#FFF9F0" />
            <Distance />
            <TornDivider from="#FFF9F0" to="#FDF1DE" />
            <HugButton />
            <TornDivider from="#FDF1DE" to="#F7DCE2" />
            <Surprise />
            <TornDivider from="#F7DCE2" to="#3A2422" />
            <div className="py-8" style={{ background: "#3A2422" }}>
              <Marquee
                fast
                items={["make a wish", "blow the candles", "big finale energy", `go ${siteConfig.girlfriendName}`]}
                className="bg-cherry text-ivory"
              />
            </div>
            <CakeFinale />
            <TornDivider from="#E0A05B" to="#FFF9F0" />
            <EasterEgg />
          </motion.div>

          <MusicController />
        </>
      )}
    </main>
  );
}
