import {
  siteConfig,
  whatISeeLines,
  timeline,
  memories,
  coverPhotos,
  loveLetter,
  distanceSection,
  finaleSection,
  easterEgg,
  type TimelineItem,
  type MemoryItem,
} from "@/config/birthday";

export type { TimelineItem, MemoryItem };

export interface PhotoRef {
  src?: string;
  alt: string;
  caption: string;
}

export interface Sections {
  notice: boolean;
  timeline: boolean;
  gallery: boolean;
  letter: boolean;
  distance: boolean;
  hug: boolean;
  cake: boolean;
}

/** Everything one customer's page needs. Stored as JSON in the database. */
export interface SiteData {
  slug: string;
  girlfriendName: string;
  girlfriendNickname: string;
  myName: string;
  birthdayDate: string;
  relationshipStart: string;
  heroHeadline: string;
  heroSubline: string;
  inviteKicker: string;
  inviteHeadlineA: string;
  inviteHeadlineB: string;
  inviteSubline: string;
  inviteCta: string;
  easterEggHint: string;
  sections: Sections;
  whatISeeLines: string[];
  timeline: TimelineItem[];
  memories: MemoryItem[];
  coverInvite: PhotoRef;
  coverHero: PhotoRef;
  loveLetter: typeof loveLetter;
  distanceSection: typeof distanceSection;
  finaleSection: typeof finaleSection;
  easterEgg: typeof easterEgg;
}

export const DEFAULT_SECTIONS: Sections = {
  notice: true,
  timeline: true,
  gallery: true,
  letter: true,
  distance: true,
  hug: true,
  cake: true,
};

/** Demo defaults = what's in config/birthday.ts right now. */
export function defaultSiteData(slug = "demo", girlName?: string): SiteData {
  return {
    slug,
    girlfriendName: girlName ?? siteConfig.girlfriendName,
    girlfriendNickname: siteConfig.girlfriendNickname,
    myName: siteConfig.myName,
    birthdayDate: siteConfig.birthdayDate,
    relationshipStart: siteConfig.relationshipStart,
    heroHeadline: siteConfig.heroHeadline,
    heroSubline: siteConfig.heroSubline,
    inviteKicker: siteConfig.inviteKicker,
    inviteHeadlineA: siteConfig.inviteHeadlineA,
    inviteHeadlineB: siteConfig.inviteHeadlineB,
    inviteSubline: siteConfig.inviteSubline,
    inviteCta: siteConfig.inviteCta,
    easterEggHint: siteConfig.easterEggHint,
    sections: { ...DEFAULT_SECTIONS },
    whatISeeLines: [...whatISeeLines],
    // demo me sirf 2 yaadein — baaki customer khud add karega
    timeline: timeline.slice(0, 2).map((t) => ({ ...t })),
    memories: memories.map((m) => ({ ...m })),
    coverInvite: { ...coverPhotos.invite },
    coverHero: { ...coverPhotos.hero },
    loveLetter: JSON.parse(JSON.stringify(loveLetter)),
    distanceSection: { ...distanceSection },
    finaleSection: { ...finaleSection },
    easterEgg: { ...easterEgg },
  };
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "someone-special";
}
