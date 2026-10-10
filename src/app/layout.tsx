import type { Metadata, Viewport } from "next";
import { Figtree, Instrument_Serif } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Figtree: clean, friendly and highly legible. Instrument Serif: italic accent words.
const body = Figtree({ subsets: ["latin"], variable: "--font-body" });
const accent = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-accent" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.kind} in ${site.address.city}, WA`,
    template: `%s | ${site.name}`,
  },
  description: `${site.name} is a licensed adult family home in ${site.address.city}, Washington: ${site.tagline.toLowerCase()} with 24/7 care, home-cooked meals and a warm, home-like setting.`,
  // The share image comes from src/app/opengraph-image.tsx (first gallery photo).
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f5f8fa" };

// Shared shell only: fonts and the document. The public site and the admin area
// each add their own chrome in their route-group layouts.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${accent.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
