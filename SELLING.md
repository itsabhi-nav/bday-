# Selling Guide — Surprise Studio (Instagram business)

Tum ek domain se **unlimited birthday pages** bech sakte ho. Har customer ko milta hai:
 apna private page (`tumharidomain.com/rinki-kumari`), apna login, live-preview
editor, WhatsApp share. Tumhe milta hai: **boss room** (owner panel).

## 1. Pehli baar setup (5 min, free)

1. **Supabase** (free database + photo storage): supabase.com → New project →
   SQL editor me `supabase.sql` paste karke Run karo → Storage me **public**
   bucket banao naam `uploads`.
2. **Vercel**: repo import karo, ye env vars daalo:
   - `OWNER_USER=admin`, `OWNER_PASS=<strong-password>`
   - `SESSION_SECRET=<koi-lambi-random-string>`
   - `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (Project Settings → API)
   - Deploy. (Bina Supabase ke bhi chalega, par restart pe data ud jayega —
     bechne ke liye Supabase must hai.)
3. `/admin` kholo → owner login karo. Ho gaya, dukaan khul gayi.

## 1b. Supabase ko sleep se bachao (2 min, important!)

Free Supabase project **~7 din bina traffic ke pause** ho jata hai — phir
saari pages down (restore dashboard se hota hai, par customer gussa hoga).
Isliye auto keep-alive pehle se laga diya hai:

1. GitHub repo → **Settings → Secrets → Actions → New repository secret**
2. Name: `SITE_URL`, Value: tumhari live link (e.g. `https://for-ananya.vercel.app`)
3. Bas. Ab har 3 din me GitHub Actions khud `/api/ping` bajayega (jo DB ko
   chhoota hai) — project **kabhi soyega nahi**. Actions tab me "Keep Supabase
   awake" me ticks dikhengi. Manual test ke liye "Run workflow" bhi daba sakte ho.

## 2. Order aaye to kya karna hai (2 min)

**Tum sirf login dete ho — naam/URL woh khud set karta hai:**

1. Boss room (`/admin/owner`) → **New customer**:
   - Username: `aarav` (us bande ka login id — bas yehi required hai)
   - Password: default **9872** already bhara hai — chaaho to custom do
   - Girl name + Page URL: **khali chhodo** (woh khud apne editor me bharega)
   - Valid till: optional (khali = kabhi expire nahi)
2. Bande ko WhatsApp pe bhejo: **portal link + username + password**:
   ```
   Tumhara surprise studio ready hai ♥
   Link: tumharidomain.com/admin
   Username: aarav | Password: 9872
   ```
3. Woh login karke **Her name** likhta hai (e.g. Rinki Kumari) → **Auto** dabata hai
   → **Save** → uska page link ban jata hai: `tumharidomain.com/rinki-kumari`
4. Wahi link woh ladki ko bhejta hai (editor me Copy + WhatsApp buttons bane hain).
   **Ladki ko kabhi admin nahi dikhta — sirf uska surprise page.**

## 3. Expiry, password, delete

- **Expiry badhana:** customer row me date daal ke **Set**. Khali = no expiry.
  Expired page auto-delete **nahi** hota — bas "expired" card dikhta hai.
- **Password reset:** naya password likh ke **Reset** (khali chhoda to 9872).
- **Delete:** **Delete** → double confirm → uska page + DB record + **saari
  uploaded photos** hamesha ke liye wipe. Storage khali rakhne ka yahi tareeka hai.

## 4. Instagram pe bechne ke tips

- Price: ₹499–1499 per page (editor access 30 din). Demo link (`/demo`) bio me daalo.
- Har order ke liye alag username banao; password hamesha 9872 se start karo,
  customer khud badal sakta hai (Share tab me option hai).
- Photos customer khud upload karta hai (8 MB tak, JPG/PNG/WEBP) — tumhe kuch
  nahi karna.

## 5. Technical notes

- Local preview bina Supabase ke chalta hai (`./data/*.json` + `public/uploads/`) —
  ye files git me **nahi** jaati (.gitignore me hain).
- Sections (album, gallery, notes, letter…) customer khud on/off karta hai;
  numbering khud adjust ho jaati hai.
- Slug (page URL) customer editor me badal sakta hai — purana link bidding
  farewell; photos auto-move ho jaati hain.
