# ✦ Surprise Studio — sellable birthday pages

One domain, unlimited private birthday pages: `yourdomain.com/her-name`.
Each customer gets a login + live-preview editor; you get the boss room.

- **Live demo:** `/demo` · **Studio home:** `/` · **Login:** `/admin`
- **Boss room:** `/admin/owner` — create accounts (default password `9872`),
  set/extend expiry, reset passwords, delete (wipes page + photos).
- **Customer editor:** `/admin/site` — edit everything with same-to-same live
  preview, section toggles, photo uploads, copy-link + WhatsApp share.

## Quick start

```bash
npm install
npm run dev          # local preview (JSON files in ./data, uploads in public/uploads)
```

## Production (required for selling)

1. Run `supabase.sql` in Supabase SQL editor + create public `uploads` bucket.
2. Set env (see `.env.example`): `OWNER_USER`, `OWNER_PASS`, `SESSION_SECRET`,
   `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`.
3. Deploy on Vercel. Full selling playbook: `SELLING.md`.

## Verified

- [x] `typecheck` + `build` pass (12 routes)
- [x] Owner login → create customer → `/rinki-kumari` live with her name
- [x] Customer login → edit + toggle section OFF → live page reflects (DOM-checked)
- [x] Photo upload stored + served; expiry shows expired card; extend revives
- [x] Delete wipes page (404), uploads folder, DB rows; login rejected after
- [x] No auto-delete anywhere — expiry only gates viewing, owner controls deletion
