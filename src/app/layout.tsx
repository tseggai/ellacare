import type { Metadata, Viewport } from "next";
import { Figtree, Instrument_Serif } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InquiryProvider } from "@/components/inquiry/InquiryProvider";
import { MobileActionBar } from "@/components/MobileActionBar";
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
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "EllaCare, Adult Family Home" }],
  },
};

export const viewport: Viewport = { themeColor: "#f5f8fa" };

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  legalName: site.legalName,
  description: `${site.kind} in ${site.address.city}, WA. ${site.tagline}.`,
  url: site.url,
  telephone: site.phones.main.tel,
  faxNumber: site.phones.fax.display,
  image: `${site.url}/images/rooms/room-4271.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: "US",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${accent.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <InquiryProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <MobileActionBar />
        </InquiryProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      </body>
    </html>
  );
}
