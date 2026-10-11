# ✦ For You, On Your Birthday

A warm, editorial, scrapbook-style interactive birthday gift: invitation envelope
→ magazine cover reveal → things-I-notice → photo album timeline → pinned gallery
→ desk of unfolding notes → sealed letter → postcard interlude → gift box →
candle-blowing garden finale → hidden pressed-flower secret.

## Quick start

```bash
npm install
npm run dev
```

Personalize everything in `config/birthday.ts` (see `CUSTOMIZATION.md`).

## Stack

Next.js 14 + TypeScript + Tailwind + Framer Motion + Lucide. One shared music
player (`lib/music.ts`), canvas-free paper-confetti bursts, `next/image` with
graceful fallbacks. No backend, DB, or paid APIs.

## Verified

- [x] `npm run typecheck` + `npm run build` pass
- [x] Invitation renders in production HTML; envelope opens → confetti → story
- [x] `public/audio/our-song.mp3` served as `audio/mpeg`, full 705,977 bytes; playback starts in the opening tap gesture
- [x] All 18 Unsplash stand-ins return HTTP 200; each photo used exactly once
- [x] No cosmic/glassmorphism leftovers (`midnight`, `Starfield`, `PortalIntro` gone)
- [x] Lightbox Esc/arrows, letter Read-it-all, gift open/rewrap, candles tap/mic/relight, flower 5-tap + footer 3-tap secret
- [x] Mobile-first layouts, `prefers-reduced-motion` respected, keyboard + ARIA labels throughout
# bday-
