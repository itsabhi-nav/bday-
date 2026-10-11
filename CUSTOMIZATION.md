# ✦ For You, On Your Birthday — Customization Guide

> **Note:** `config/birthday.ts` abhi **demo content** se bhara hai (Ananya ×
> Aarav, desi memories, temporary photos) taaki overview dekha ja sake.
> Apna real content lagane ke liye neeche wale steps follow kar — sab kuch
> ek hi file me hai.
>
> Everything personal lives in **one file**: `config/birthday.ts`. Edit it, redeploy, done.

## 1. Names & dates (`siteConfig`)

```ts
girlfriendName: "Aisha",
girlfriendNickname: "my love",   // on the cake + envelope seal
myName: "Abhinav",
birthdayDate: "October 18th",
relationshipStart: "March 2023",
```

Also editable here: invitation kicker/headline, hero subline, easter-egg hint.

## 2. Photos — temporary stock, one-file swap

Every `src` in the config is currently a temporary Unsplash stand-in (all verified
stable direct URLs) so the site looks finished today. To use your real photos:

1. Drop files into `public/images/` — e.g. `memory-01.jpg` (JPG/WebP, ~1600px wide max).
2. In `config/birthday.ts`, replace any URL with your path:
   ```ts
   src: "/images/memory-01.jpg",
   ```
3. Places to swap:
   - `coverPhotos.invite / .hero / .noteA / .noteB` — invitation polaroid, hero cover, scattered notes
   - `timeline[i].image` (+ `caption`, `imageAlt`) — album pages
   - `memories[i].src` (+ `caption`, `handwritten`) — gallery prints. Set `tall: true` for portrait prints.

If an image ever fails to load, the site shows a warm blush panel with the caption — never a broken icon. Below-the-fold photos lazy-load automatically.

## 3. Music — works out of the box

`public/audio/happy-birthday.mp3` contains a bundled **Happy Birthday music-box
version** (public-domain 1893 melody — no copyright issue, use freely, ~52s loop).
It starts inside the "Open your surprise" tap, fades in, loops, never restarts
(single shared player in `lib/music.ts`).

- To use your own song: overwrite `public/audio/happy-birthday.mp3` with your file (keep the name), or change `audioConfig.src`.

- To use your own song: overwrite `public/audio/happy-birthday.mp3` with your file (keep the name), or change `audioConfig.src`.
- The pill controller (bottom-right) shows the *real* player state: play/pause, mute, volume. If the file is missing it honestly says "Music unavailable" and the site works fine without it.

## 4. Words

- `timeline` — `dateLabel`, `title`, `story` (2–3 sentences). Remove `sample: true` once rewritten; the badge disappears.
- `reasons` — add/remove freely; the desk grid + "x of N unfolded" adapt.
- `loveLetter` — `paragraphs[]`, `greeting`, `signoff`, `signature`. Reveals line-by-line with a "Read it all" button.
- `distanceSection`, `surpriseSection` (includes a redeemable gift-coupon note), `finaleSection`.
- `easterEgg` — set `enabled: false` to disable. Unlock: tap the pressed flower 5× (or footer ♥ 3×).

## 5. Run & deploy

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build && npm start   # production check
```

Deploy: push to GitHub → Vercel import (Next.js defaults, no env vars). No backend, keys, or paid services. Remote Unsplash photos need no config beyond what's already in `next.config.js`.
