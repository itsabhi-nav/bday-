"use client";

import { FlowerDoodle } from "../Ornaments";
import { useSite } from "../SiteContext";

/** Sirf footer — signature line. Secret section hata diya gaya hai. */
export default function EasterEgg() {
  const site = useSite();
  return (
    <footer className="border-t-2 border-dashed border-cocoa/20 bg-cream px-6 py-10 text-center">
      <FlowerDoodle className="mx-auto h-10 w-10" />
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.28em] text-cocoasoft">
        Bound with love by {site.myName}
        <span className="font-hand ml-1.5 align-middle text-xl text-cherry" aria-hidden>
          ♥
        </span>
      </p>
    </footer>
  );
}
