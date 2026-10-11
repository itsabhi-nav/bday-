"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, RotateCcw } from "lucide-react";
import Reveal from "../Reveal";
import Burst from "../Burst";
import { FlowerDoodle } from "../Ornaments";
import { useSite } from "../SiteContext";
import { usePrefersReducedMotion } from "@/hooks/useMedia";

const CANDLE_COUNT = 5;
const CANDLE_COLORS = ["#C83D4D", "#DCA7AF", "#7A8B6F", "#E0A93E", "#A02C3C"];

/** Scene G — the finale. A warm evening garden party, not a galaxy. */
export default function CakeFinale() {
  const site = useSite();
  const finaleSection = site.finaleSection;
  const [lit, setLit] = useState<boolean[]>(Array(CANDLE_COUNT).fill(true));
  const [celebrating, setCelebrating] = useState(false);
  const [burst, setBurst] = useState(false);
  const [listening, setListening] = useState(false);
  const reduced = usePrefersReducedMotion();
  const streamRef = useRef<MediaStream | null>(null);

  const litCount = lit.filter(Boolean).length;

  useEffect(() => {
    if (litCount === 0 && !celebrating) {
      const t = setTimeout(() => {
        setCelebrating(true);
        setBurst(true);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [litCount, celebrating]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const blowOut = (i: number) => {
    setLit((prev) => {
      const next = [...prev];
      next[i] = false;
      return next;
    });
  };

  const blowAll = () => {
    if (reduced) {
      setLit(Array(CANDLE_COUNT).fill(false));
      setCelebrating(true);
      setBurst(true);
      return;
    }
    lit.forEach((isLit, i) => {
      if (isLit) setTimeout(() => blowOut(i), i * 260);
    });
  };

  const relight = () => {
    setLit(Array(CANDLE_COUNT).fill(true));
    setCelebrating(false);
    setBurst(false);
  };

  /** Optional mic blow detection — never required. */
  const tryMicBlow = async () => {
    if (listening) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setListening(true);
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let loudFrames = 0;
      const cleanup = () => {
        setListening(false);
        stream.getTracks().forEach((t) => t.stop());
        ctx.close().catch(() => {});
      };
      const check = () => {
        setLit((prev) => {
          if (!prev.some(Boolean)) {
            cleanup();
            return prev;
          }
          return prev;
        });
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        if (rms > 0.18) {
          loudFrames++;
          if (loudFrames > 4) {
            setLit((prev) => {
              const idx = prev.findIndex(Boolean);
              if (idx === -1) return prev;
              const next = [...prev];
              next[idx] = false;
              return next;
            });
            loudFrames = 0;
          }
        } else {
          loudFrames = 0;
        }
        if (streamRef.current) requestAnimationFrame(check);
        else setListening(false);
      };
      setTimeout(() => {
        if (streamRef.current) cleanup();
      }, 30000);
      check();
    } catch {
      setListening(false);
    }
  };

  return (
    <section aria-label="Make a wish" className="relative overflow-hidden px-6 py-20 sm:py-28" style={{ background: "linear-gradient(180deg, #3A2422 0%, #6B3A30 45%, #C83D4D 78%, #E0A05B 100%)" }}>
      {/* string lights */}
      <div aria-hidden className="absolute inset-x-0 top-0">
        <svg viewBox="0 0 800 70" preserveAspectRatio="none" className="h-14 w-full">
          <path d="M0 8 Q 400 60 800 8" stroke="#FFF9F0" strokeOpacity="0.5" strokeWidth="2" fill="none" />
        </svg>
        <div className="absolute inset-x-0 top-0 flex justify-around px-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="block h-2.5 w-2.5 rounded-full bg-butter"
              style={{ boxShadow: "0 0 12px 3px rgba(244,217,139,0.8)", marginTop: `${10 + (i % 3) * 7}px` }}
            />
          ))}
        </div>
      </div>
      <FlowerDoodle petal="#F7DCE2" className="absolute left-6 top-24 h-12 w-12 -rotate-12 opacity-80" />
      <FlowerDoodle petal="#F4D98B" className="absolute right-6 top-40 h-10 w-10 rotate-12 opacity-80" />

      <div className="relative mx-auto max-w-2xl pt-10 text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold text-ivory sm:text-6xl">{finaleSection.heading}</h2>
          <p className="mt-3 text-sm font-semibold text-ivory/80">
            {litCount > 0 ? `${finaleSection.instruction} (${litCount} still glowing)` : "All out. Beautiful."}
          </p>
        </Reveal>

        {/* cake */}
        <Reveal delay={0.1} className="mt-10">
          <div className="relative mx-auto w-fit" role="group" aria-label={`${litCount} candles lit`}>
            <div className="flex items-end justify-center gap-3 sm:gap-5">
              {lit.map((isLit, i) => (
                <button
                  key={i}
                  onClick={() => blowOut(i)}
                  aria-label={isLit ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
                  aria-pressed={!isLit}
                  className="group flex flex-col items-center rounded-lg p-1"
                >
                  <span className="flex h-10 items-end justify-center">
                    {isLit ? (
                      <span className="flame relative block">
                        <span
                          className="block h-6 w-4 rounded-full"
                          style={{
                            background:
                              "radial-gradient(circle at 50% 70%, #fff 0%, #ffe9a8 35%, #ff9d3c 65%, rgba(255,80,20,0) 100%)",
                            boxShadow: "0 0 18px rgba(255,180,80,0.95)",
                          }}
                        />
                      </span>
                    ) : (
                      <span className="block h-4 w-px bg-ivory/30" aria-hidden />
                    )}
                  </span>
                  <span
                    className="mt-1 block h-16 w-3.5 rounded-full border border-cocoa/30 sm:h-20"
                    style={{
                      background: `repeating-linear-gradient(45deg, ${CANDLE_COLORS[i % CANDLE_COLORS.length]} 0 6px, #FFFDF7 6px 12px)`,
                    }}
                    aria-hidden
                  />
                </button>
              ))}
            </div>

            {/* warm illustrated cake */}
            <div className="relative mx-auto mt-0 w-64 sm:w-80" aria-hidden>
              <div className="absolute -top-6 left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-full bg-butter/30 blur-md" />
              <div className="relative mx-auto h-20 w-4/5 rounded-t-2xl border-x-2 border-t-2 border-cocoa bg-[#FFFDF7]">
                <div className="absolute inset-x-2 top-0 flex justify-around">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <span key={j} className="block h-5 w-5 rounded-b-full bg-cherry/80" />
                  ))}
                </div>
                <p className="font-hand absolute inset-x-0 top-8 text-center text-2xl text-cherry">yum</p>
              </div>
              <div className="relative mx-auto h-24 w-full rounded-t-xl border-2 border-b-0 border-cocoa bg-blush">
                <div className="absolute inset-x-2 top-0 flex justify-around">
                  {Array.from({ length: 12 }).map((_, j) => (
                    <span key={j} className="block h-6 w-6 rounded-b-full bg-[#FFFDF7]" />
                  ))}
                </div>
                <span className="font-hand absolute left-1/2 top-1/2 -translate-x-1/2 text-2xl text-cocoa">
                  {site.girlfriendNickname !== "[NICKNAME]" ? site.girlfriendNickname : "for you"}
                </span>
              </div>
              <div className="mx-auto h-3.5 w-[108%] -translate-x-[3.7%] rounded-full border-2 border-cocoa bg-butter" />
            </div>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={blowAll}
            disabled={litCount === 0}
            className="shadow-scrap-sm flex items-center gap-2 rounded-full bg-ivory px-6 py-3 text-sm font-bold text-cocoa transition hover:bg-butter disabled:opacity-50"
          >
            <Wind className="h-4 w-4" aria-hidden />
            {litCount === 0 ? "All candles out" : "Blow them all out"}
          </button>
          <button
            onClick={tryMicBlow}
            disabled={listening || litCount === 0}
            className="rounded-full border border-ivory/50 px-5 py-3 text-sm font-bold text-ivory transition hover:bg-ivory/15 disabled:opacity-50"
            title="Optional: use your microphone to blow out the candles"
          >
            {listening ? "Listening… blow now!" : "Try blowing (mic, optional)"}
          </button>
          {celebrating && (
            <button
              onClick={relight}
              className="flex items-center gap-2 rounded-full border border-ivory/50 px-5 py-3 text-sm font-bold text-ivory transition hover:bg-ivory/15"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Relight
            </button>
          )}
        </div>

        <AnimatePresence>
          {celebrating && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="relative mt-12 border border-cocoa/15 bg-ivory p-8 text-center shadow-photo sm:p-10"
              role="status"
              aria-live="polite"
            >
              <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-2" aria-hidden />
              <h3 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Happy Birthday,
                <br />
                <span className="marker italic">{site.girlfriendName}</span>
              </h3>
              <p className="font-display mx-auto mt-5 max-w-lg text-xl italic leading-relaxed">
                “{finaleSection.wish}”
              </p>
              <p className="mx-auto mt-4 max-w-lg text-[15px] font-medium leading-relaxed text-cocoasoft">
                {finaleSection.finalLine}
              </p>
              <p className="font-hand mt-6 -rotate-2 text-4xl text-cherry">— {site.myName}</p>
              <Burst fired={burst} count={34} spread={260} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
