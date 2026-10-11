/**
 * ═══════════════════════════════════════════════════════════════
 *  FOR YOU, ON YOUR BIRTHDAY — single source of truth
 * ═══════════════════════════════════════════════════════════════
 *  Ye file abhi DEMO content se bhari hai (Indian names, desi memories,
 *  temporary photos) taaki tu poora overview dekh sake.
 *
 *  Jab apna real content lagana ho:
 *    1. Photos: /public/images/ me apni photos daal (e.g. memory-01.jpg)
 *       aur neeche kisi bhi "src" ko "/images/memory-01.jpg" se replace kar.
 *    2. Naam/dates/kahaniyan: neeche hi edit kar — poori site apne aap update.
 */

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const HOLI =
  "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Holi%2C_the_color_festival.jpg/960px-Holi%2C_the_color_festival.jpg";

export const siteConfig = {
  girlfriendName: "Ananya",
  girlfriendNickname: "jaan",
  myName: "Aarav",
  birthdayDate: "18th October",
  relationshipStart: "January 2022",
  heroHeadline: "Happy Birthday",
  heroSubline: "Cutting chai, monsoon laughs, 2am Maggi — sab kuch wrap karke, sirf tere liye.",
  inviteKicker: "psst… aaj kisi ka birthday hai",
  inviteHeadlineA: "Today is",
  inviteHeadlineB: "all about you.",
  inviteSubline: "Andar ek chhoti si duniya wait kar rahi hai.",
  inviteCta: "Open your surprise",
  easterEggHint: "psst — the little pressed flower keeps a secret. tap it five times…",
};

export const audioConfig = {
  /** Bundled Happy Birthday (public-domain melody, music-box version). Replace with your own MP3 if you like. */
  src: "/audio/happy-birthday.mp3",
  title: "Happy Birthday — music-box version",
  volume: 0.7,
};

export const whatISeeLines: string[] = [
  "You smile mid-sentence. The laugh always arrives early.",
  "You save the last bite for me. Every. Single. Time.",
];

export interface TimelineItem {
  dateLabel: string;
  title: string;
  story: string;
  image?: string;
  imageAlt?: string;
  caption?: string;
  sample?: boolean;
}

export const timeline: TimelineItem[] = [
  {
    dateLabel: "January 2022",
    title: "Rohan's terrace party",
    story:
      "Fairy lights, loud Bollywood, and you stealing the last paneer tikka off my plate before saying hello. Best theft of my life.",
    image: u("1513151233558-d860c5398176"),
    imageAlt: "Confetti falling over a celebration",
    caption: "the night it all started",
  },
  {
    dateLabel: "February 2022",
    title: "The cutting-chai date",
    story:
      "Bun maska, two cutting chais, and a 40-minute auto ride neither of us wanted to end. The driver took the long route. He knew.",
    image: u("1616091216791-a5360b5fc78a"),
    imageAlt: "A warm café with flowers outside",
    caption: "bun maska + you = perfect",
  },
  {
    dateLabel: "June 2022",
    title: "The Great Pani Puri War",
    story:
      "12 all. Final round, extra teekha. You won 13–12. The Samosa Treaty was signed on a napkin: loser buys street food forever.",
    image: u("1601050690597-df0568f70950"),
    imageAlt: "Samosas with chutney",
    caption: "treaty ke gawah: ye samose",
  },
  {
    dateLabel: "2023",
    title: "Delhi–Pune, 1400 km",
    story:
      "'Bas 5 minute' calls that ended at 2am with cold chai on both sides. Distance tried its best. It lost.",
    image: u("1544787219-7f47ccb76574"),
    imageAlt: "A cup of chai with cookies",
    caption: "cold chai, warm calls",
  },
  {
    dateLabel: "Diwali 2023",
    title: "Mithai duty at her home",
    story:
      "I failed gloriously at packing dabbas. Dadi laughed, fixed them, and whispered 'yeh ladka theek hai.' Sealed with a laddu.",
    image: u("1610508500445-a4592435e27e"),
    imageAlt: "A box of Indian sweets",
    caption: "dadi-approved ✓",
  },
  {
    dateLabel: "Someday, pakka",
    title: "Agra at sunrise, just us",
    story:
      "Still on the list: Taj at sunrise, your head on my shoulder, terrible tourist photos. This year, we tick it off.",
    image: u("1548013146-72479768bada"),
    imageAlt: "Taj Mahal at sunrise",
    caption: "ticking this off together",
  },
];

export interface MemoryItem {
  src?: string;
  alt: string;
  caption: string;
  handwritten?: string;
  kind: "photo" | "video";
  tall?: boolean;
}

export const memories: MemoryItem[] = [
  {
    src: HOLI,
    alt: "Ananya playing with Holi colours, smiling",
    caption: "Holi 2023 — gulaal suited you",
    handwritten: "meri rang-birangi jaan",
    kind: "photo",
    tall: true,
  },
  {
    src: u("1470071459604-3b5ec3a7fe05", 800),
    alt: "Misty green mountains at sunrise",
    caption: "Coorg plan — pending since 2023",
    handwritten: "iss saal pakka!",
    kind: "photo",
  },
  {
    src: u("1464349095431-e9a21285b5f3", 800),
    alt: "A birthday cake with a sparkler",
    caption: "Last year ka cake — is saal bigger",
    handwritten: "make it a good one",
    kind: "photo",
    tall: true,
  },
  {
    src: u("1589301760014-d929f3979dbc", 800),
    alt: "Idli with chutney on a banana leaf",
    caption: "Your ghar ka khana > five-star",
    handwritten: "ek plate aur, please",
    kind: "photo",
  },
  {
    src: u("1470252649378-9c29740c9fa8", 1200),
    alt: "Sunset over a quiet field",
    caption: "Same sky, two cities — our thing",
    handwritten: "look up today",
    kind: "photo",
  },
  {
    src: u("1606800052052-a08af7148866", 800),
    alt: "Two wedding rings",
    caption: "Manifesting. Slowly. Surely.",
    handwritten: "someday…",
    kind: "photo",
    tall: true,
  },
  {
    src: u("1622122201714-77da0ca8e5d2", 800),
    alt: "An evening gown by the sea — Goa dreams",
    caption: "Goa plan v4.0 — this December?",
    handwritten: "beach + you = sorted",
    kind: "photo",
  },
  {
    src: u("1509358271058-acd22cc93898", 800),
    alt: "Indian spices in spoons",
    caption: "Your rasoi experiments (most survived)",
    handwritten: "chef jaan",
    kind: "photo",
  },
];

/** Photos for the invitation + hero cover + scattered notes (temporary stand-ins). */
export const coverPhotos = {
  invite: {
    src: u("1583391733956-3750e0ff4e8b", 600),
    alt: "Ananya dancing in a white sharara",
    caption: "it's you. it's always you.",
  },
  hero: {
    src: u("1623091410901-00e2d268901f", 1000),
    alt: "Ananya smiling naturally",
    caption: "the birthday girl, in her element",
  },
  noteA: {
    src: u("1617627143750-d86bc21e42bb", 600),
    alt: "Ananya in a saree with temple jewellery",
    caption: "that look you do",
  },
  noteB: {
    src: u("1618721405821-80ebc4b63d26", 600),
    alt: "Ananya on a cozy evening at home",
    caption: "trouble (the cute kind)",
  },
};

export const reasons: string[] = [
  "You save the last bite for me. Always.",
  "You defeat auto drivers. The meter surrenders.",
  "Your 2am Maggi fixes everything.",
  "You laugh at full volume. No holding back.",
  "You remember everyone's chai order.",
  "Kitchen + Kishore Kumar = your dance floor.",
  "Your patience with dadi. I want to learn it.",
  "No exit without khana, sweater, lecture.",
  "Home is wherever you are, jaan.",
];

export const loveLetter = {
  heading: "Ek khat, sirf tere naam.",
  greeting: "Meri pyaari Ananya,",
  paragraphs: [
    "Happy birthday, jaan. Cake se pehle, two minutes — ye khat padh le. Teen raaton me likha, do baar delete kiya. Phir samjha: bada nahi, apna hona chahiye.",
    "Thank you — 'bas 5 minute' wali calls ke liye, bukhaar me dadi ke nuskhe ke liye, meri besuri driving-singing ko 'cute' bolne ke liye. Tu ordinary Tuesday ko festival bana deti hai.",
    "Iss saal bas itna: health, sapne, roz ki chhoti khushiyan — aur Agra sunrise, pakka. Aur mera promise: last bite hamesha teri. Forever. Pakka.",
  ],
  signoff: "With all my heart,",
  signature: "Aarav",
};

export const distanceSection = {
  heading: "If you were here right now",
  body: "Bas ek wish: tere saath cake kaatna, candles bujhate hue teri smile dekhna. Tab tak — ye dhaaga pakad ke rakh. Delhi se Pune, it leads back to me.",
  fromLabel: "you, in Delhi",
  toLabel: "me, in Pune",
};

export const surpriseSection = {
  prompt: "One last little surprise.",
  hint: "Untie the ribbon",
  revealedTitle: "Scratch kar. Gift tera.",
  revealedBody: "Neeche coupon chhupa hai — ghis ke nikaal. Hint: isme mountains, momos aur Kesariya hai.",
  giftNote: "WEEKEND TRIP × UNLIMITED CHAI × 1 SLOW DANCE",
};

export const finaleSection = {
  heading: "Make a wish",
  instruction: "Tap each candle to blow it out — or use the button below.",
  wish: "Health, sapne, trips jo finally ho jayein, aur roz ki chhoti khushiyan. Starting today.",
  finalLine: "Happy Birthday, Ananya. The universe made you — and led you to me.",
};

export const easterEgg = {
  /** Set enabled:false to disable. Trigger: tap the pressed flower 5 times (or the footer heart 3 times). */
  enabled: true,
  secretTitle: "You found it.",
  secretBody:
    "Code word: 'extra masala'. Bolte hi 2am Maggi hazir, no questions asked. Aur haan — pehli auto ride me meter ₹87 tha, aur tune rock-paper-scissors jaan-boojh ke haara tha. I know, jaan. I always knew.",
};
