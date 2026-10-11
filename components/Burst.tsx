"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMedia";

const PALETTE = ["#C83D4D", "#F4D98B", "#DCA7AF", "#C7D1B8", "#F7DCE2", "#A02C3C"];

interface Piece {
  x: number;
  y: number;
  rot: number;
  size: number;
  color: string;
  round: boolean;
  delay: number;
}

/**
 * Tactile paper-confetti burst in the site palette. Fires once when `fired`
 * becomes true; renders nothing afterwards. Disabled under reduced motion.
 */
export default function Burst({
  fired,
  count = 26,
  spread = 220,
}: {
  fired: boolean;
  count?: number;
  spread?: number;
}) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!fired || reduced) return;
    const arr: Piece[] = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const dist = spread * (0.5 + Math.random() * 0.7);
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 60,
        rot: Math.random() * 540 - 270,
        size: 5 + Math.random() * 8,
        color: PALETTE[i % PALETTE.length],
        round: i % 3 === 0,
        delay: Math.random() * 0.12,
      };
    });
    setPieces(arr);
    const t = setTimeout(() => setPieces([]), 2400);
    return () => clearTimeout(t);
  }, [fired, count, spread, reduced]);

  if (!fired || reduced || pieces.length === 0) return null;

  return (
    <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-30">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            width: p.size,
            height: p.round ? p.size : p.size * 0.6,
            background: p.color,
            borderRadius: p.round ? "50%" : "1.5px",
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y + 140, opacity: 0, rotate: p.rot }}
          transition={{ duration: 1.7, delay: p.delay, ease: [0.15, 0.6, 0.45, 1] }}
        />
      ))}
    </span>
  );
}
