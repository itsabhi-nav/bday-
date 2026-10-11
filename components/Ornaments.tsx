"use client";

/** Tiny hand-drawn ornaments: flower doodle, torn divider, tape helper. */

export function FlowerDoodle({ className = "h-10 w-10", petal = "#C83D4D" }: { className?: string; petal?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <ellipse
          key={r}
          cx="24"
          cy="14"
          rx="6"
          ry="10"
          fill={petal}
          opacity="0.85"
          transform={`rotate(${r} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="6" fill="#F4D98B" stroke="#49312F" strokeWidth="1.5" />
      <path d="M24 30 C 24 36, 22 40, 18 44" stroke="#7A8B6F" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 39 q -5 -1 -7 3 q 5 2 7 -3" fill="#C7D1B8" />
    </svg>
  );
}

export function Sprig({ className = "h-8 w-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 32" fill="none" className={className} aria-hidden>
      <path d="M4 26 Q 40 22 76 8" stroke="#7A8B6F" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 5" />
      {[14, 30, 46, 60].map((x, i) => (
        <ellipse
          key={x}
          cx={x}
          cy={24 - i * 3}
          rx="6"
          ry="3.4"
          fill="#C7D1B8"
          transform={`rotate(${-24 + i * 8} ${x} ${24 - i * 3})`}
        />
      ))}
      <circle cx="73" cy="9" r="3.4" fill="#C83D4D" />
    </svg>
  );
}

/** Torn-paper divider between two background tones. */
export function TornDivider({ from = "#FFF9F0", to = "#F7DCE2", flip = false }: { from?: string; to?: string; flip?: boolean }) {
  return (
    <div aria-hidden className={`relative -my-px leading-[0] ${flip ? "rotate-180" : ""}`} style={{ background: from }}>
      <svg viewBox="0 0 1440 44" preserveAspectRatio="none" className="block h-[26px] w-full sm:h-[38px]">
        <path
          d="M0 44 L0 26 L48 22 L96 28 L150 18 L220 26 L300 16 L370 27 L450 20 L530 28 L610 15 L690 26 L770 19 L850 29 L930 17 L1010 27 L1090 20 L1170 28 L1250 18 L1330 26 L1390 22 L1440 27 L1440 44 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}

/** Scrolling ribbon band — instant energy. Duplicate content for a seamless loop. */
export function Marquee({
  items,
  fast = false,
  className = "bg-cherry text-ivory",
  tilt = true,
}: {
  items: string[];
  fast?: boolean;
  className?: string;
  tilt?: boolean;
}) {
  const row = (hidden: boolean) => (
    <div aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="font-display px-5 text-xl font-semibold italic tracking-wide sm:text-2xl">{t}</span>
          <span className="font-hand text-2xl">♥</span>
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden={false} className={`relative overflow-hidden ${tilt ? "-rotate-1" : ""}`}>
      <div className={`flex w-max py-2.5 shadow-photo ${fast ? "animate-marquee-fast" : "animate-marquee"} ${className}`}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/** Rotating circular-text sticker badge. */
export function StickerBadge({
  text = "HAPPY BIRTHDAY • MADE WITH LOVE • ",
  className = "h-28 w-28",
  center = "♥",
}: {
  text?: string;
  className?: string;
  center?: string;
}) {
  const id = `sticker-${text.length}-${center}`;
  return (
    <div aria-hidden className={`relative ${className}`}>
      <svg viewBox="0 0 120 120" className="animate-spin-slower absolute inset-0 h-full w-full">
        <defs>
          <path id={id} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <circle cx="60" cy="60" r="58" fill="#C83D4D" />
        <circle cx="60" cy="60" r="34" fill="#FFF9F0" />
        <text fontSize="12.5" fontWeight="700" letterSpacing="2.5" fill="#FFF9F0" fontFamily="Manrope, sans-serif">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <span className="font-hand absolute inset-0 flex items-center justify-center text-3xl text-cherry">
        {center}
      </span>
    </div>
  );
}

/** Hand-drawn scribble underline for headlines. */
export function ScribbleUnderline({ className = "w-48 sm:w-64", color = "#C83D4D" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 260 22" fill="none" className={className} aria-hidden preserveAspectRatio="none">
      <path
        d="M4 14 C 60 6, 120 18, 180 10 S 240 12, 256 8"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M30 19 C 100 14, 170 20, 230 15" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

/** Doodle arrow pointing somewhere (e.g. text → photo). */
export function DoodleArrow({ className = "h-16 w-24", color = "#C83D4D", flip = false }: { className?: string; color?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 100 64" fill="none" className={`${className} ${flip ? "-scale-x-100" : ""}`} aria-hidden>
      <path
        d="M6 8 C 40 10, 70 22, 84 50 M84 50 l-12 -3 M84 50 l2 -12"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 7"
      />
    </svg>
  );
}

/** Cinema-ticket stub — "admit one birthday girl". */
export function TicketStub({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div aria-hidden className={`flex items-stretch ${className}`}>
      <div className="rounded-l-lg border-2 border-r-0 border-dashed border-cocoa/50 bg-butter px-4 py-2.5 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em]">Admit one</p>
        <p className="font-display text-lg font-semibold leading-tight">Birthday Girl</p>
      </div>
      <div className="relative flex items-center rounded-r-lg border-2 border-cocoa/50 bg-cherry px-3">
        <span className="absolute -left-[9px] -top-[9px] h-4 w-4 rounded-full border-2 border-cocoa/50 bg-inherit" style={{ background: "var(--stub-bg, #FFF9F0)" }} />
        <p className="font-hand -rotate-90 whitespace-nowrap text-lg leading-none text-ivory">{name} ★</p>
      </div>
    </div>
  );
}

/** A few hearts drifting upward — pure romance, zero cost. */
export function FloatingHearts({ count = 7 }: { count?: number }) {
  const spots = [
    { left: "8%", size: 18, delay: "0s", dur: "9s", op: 0.45 },
    { left: "20%", size: 12, delay: "2.5s", dur: "11s", op: 0.35 },
    { left: "38%", size: 22, delay: "5s", dur: "10s", op: 0.3 },
    { left: "58%", size: 14, delay: "1.2s", dur: "12s", op: 0.4 },
    { left: "74%", size: 20, delay: "3.8s", dur: "9.5s", op: 0.35 },
    { left: "88%", size: 13, delay: "6.4s", dur: "11s", op: 0.45 },
    { left: "95%", size: 17, delay: "4.4s", dur: "10s", op: 0.3 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {spots.slice(0, count).map((s, i) => (
        <span
          key={i}
          className="animate-drift-up font-hand absolute bottom-[-4%]"
          style={{
            left: s.left,
            fontSize: s.size,
            animationDelay: s.delay,
            animationDuration: s.dur,
            ["--heart-op" as string]: s.op,
            color: i % 2 ? "#C83D4D" : "#DCA7AF",
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
