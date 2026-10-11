"use client";

import { createContext, useContext } from "react";
import type { SiteData } from "@/lib/sitedata";
import { defaultSiteData } from "@/lib/sitedata";

const SiteContext = createContext<SiteData>(defaultSiteData());
const PreviewContext = createContext<boolean>(false);

/** Wraps a page so every chapter reads the same customer data = live preview = public page. */
export function SiteProvider({
  data,
  preview = false,
  children,
}: {
  data: SiteData;
  preview?: boolean;
  children: React.ReactNode;
}) {
  return (
    <SiteContext.Provider value={data}>
      <PreviewContext.Provider value={preview}>{children}</PreviewContext.Provider>
    </SiteContext.Provider>
  );
}

export function useSite(): SiteData {
  return useContext(SiteContext);
}

/** True inside the editor's narrow live-preview pane (viewport units lie there). */
export function usePreview(): boolean {
  return useContext(PreviewContext);
}
