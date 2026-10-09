"use client";

import { createContext, useContext } from "react";
import type { SiteInfo } from "@/lib/content";

// Business details (phones, address) for client components. Server components
// call getSite() directly; this provider carries the same object to the browser.
const SiteContext = createContext<SiteInfo | null>(null);

export function SiteProvider({ site, children }: { site: SiteInfo; children: React.ReactNode }) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteInfo {
  const site = useContext(SiteContext);
  if (!site) throw new Error("useSite must be used inside <SiteProvider>");
  return site;
}
