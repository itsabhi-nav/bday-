"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMedia";

/**
 * Scratch card — ghis ke gift nikaal. Canvas cover wipes away under the
 * finger; auto-reveals past ~45%. Falls back to tap-to-reveal.
 */
export default function ScratchCard({ children, label }: { children: React.ReactNode; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);
  const reduced = usePrefersReducedMotion();

  // paint the cover once sized
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || revealed) return;
    const paint = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(r.width * dpr));
      canvas.height = Math.max(1, Math.floor(r.height * dpr));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      // cherry foil
      ctx.fillStyle = "#C83D4D";
      ctx.fillRect(0, 0, r.width, r.height);
      // diagonal sheen stripes
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      for (let x = -r.height; x < r.width + r.height; x += 26) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 12, 0);
        ctx.lineTo(x + 12 - r.height, r.height);
        ctx.lineTo(x - r.height, r.height);
        ctx.fill();
      }
      // dashed inner frame + label
      ctx.strokeStyle = "rgba(255,249,240,0.85)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 7]);
      ctx.strokeRect(12, 12, r.width - 24, r.height - 24);
      ctx.setLineDash([]);
      ctx.fillStyle = "#FFF9F0";
      ctx.textAlign = "center";
      ctx.font = "700 15px Manrope, sans-serif";
      ctx.fillText(label.toUpperCase(), r.width / 2, r.height / 2 - 4);
      ctx.font = "28px Caveat, cursive";
      ctx.fillText("ghis mujhe ♥", r.width / 2, r.height / 2 + 28);
    };
    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, [label, revealed]);

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc((clientX - r.left) * dpr, (clientY - r.top) * dpr, 24 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const measure = () => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    try {
      const step = 14;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      let total = 0;
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          total++;
          if (data[(y * canvas.width + x) * 4 + 3] < 40) clear++;
        }
      }
      if (total > 0 && clear / total > 0.45) setRevealed(true);
    } catch {
      /* canvas tainted — leave covered, tap still works */
    }
  };

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto mt-7 max-w-md overflow-hidden rounded-md border-2 border-cocoa bg-butter/40"
      role="group"
      aria-label="Scratch card gift coupon"
    >
      {/* the prize underneath */}
      <div className="px-6 py-7" aria-live="polite">
        {children}
      </div>
      {/* foil cover */}
      {!revealed && !reduced && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-crosshair"
          style={{ touchAction: "none" }}
          onPointerDown={(e) => {
            drawing.current = true;
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            scratchAt(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            scratchAt(e.clientX, e.clientY);
            measure();
          }}
          onPointerUp={() => {
            drawing.current = false;
            measure();
          }}
          onPointerCancel={() => {
            drawing.current = false;
          }}
        />
      )}
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className={`absolute bottom-2 right-2 rounded-full bg-cocoa/85 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-ivory transition hover:bg-cherry ${reduced ? "left-2" : ""}`}
          aria-label="Reveal the coupon without scratching"
        >
          {reduced ? "Tap to reveal" : "Cheating? tap"}
        </button>
      )}
    </div>
  );
}
