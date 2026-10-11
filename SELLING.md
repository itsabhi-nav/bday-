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

## 2. Order aaye to kya karna hai (2 min)

1. Boss room (`/admin/owner`) → **New customer**:
   - Username: `aarav` (customer ka login id)
   - Girl name: `Rinki Kumari` (page URL auto: `rinki-kumari`)
   - Password: default **9872** already bhara hai — chaaho to custom do
   - Valid till: optional (khali = kabhi expire nahi)
2. **Create + get link** dabao → page link copy karo.
3. Customer ko WhatsApp pe bhejo: **page link + username + password (9872)**.
4. Customer `/admin` me login karke apni photos, naam, stories, letter sab
   edit karta hai — **right side live preview** me same-to-same dikhta hai.
5. **Save** dabate hi `tumharidomain.com/rinki-kumari` live. Wahi link woh
   ladki ko bhejta hai (editor me Copy + WhatsApp buttons bane hain).

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
