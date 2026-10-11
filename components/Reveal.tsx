"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

/** Soft paper-like scroll reveal used across chapters. */
export default function Reveal({ children, delay = 0, y = 28, className = "", once = true }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Small editorial chapter marker: "No. 02 — Title". Aligns left by default. */
export function ChapterLabel({
  index,
  title,
  align = "left",
  tone = "dark",
}: {
  index: string;
  title: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  const line = tone === "dark" ? "bg-cocoa/30" : "bg-ivory/40";
  const text = tone === "dark" ? "text-cherry" : "text-butter";
  return (
    <Reveal
      className={`mb-5 flex items-center gap-3 ${align === "center" ? "justify-center" : "justify-start"}`}
    >
      <span className={`h-px w-8 ${line}`} aria-hidden />
      <span className={`text-[11px] font-bold uppercase tracking-[0.3em] ${text}`}>
        No. {index} — {title}
      </span>
      {align === "center" && <span className={`h-px w-8 ${line}`} aria-hidden />}
    </Reveal>
  );
}
