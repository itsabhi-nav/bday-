"use client";

import { createContext, useContext } from "react";
import type { SiteData } from "@/lib/sitedata";
import { defaultSiteData } from "@/lib/sitedata";

const SiteContext = createContext<SiteData>(defaultSiteData());

/** Wraps a page so every chapter reads the same customer data = live preview = public page. */
export function SiteProvider({ data, children }: { data: SiteData; children: React.ReactNode }) {
  return <SiteContext.Provider value={data}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteData {
  return useContext(SiteContext);
}
