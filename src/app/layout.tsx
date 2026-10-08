import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Fraunces } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileActionBar } from "@/components/MobileActionBar";
import { site } from "@/lib/site";
import "./globals.css";

// Atkinson Hyperlegible was designed for low-vision readers.
const body = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});
const heading = Fraunces({ subsets: ["latin"], variable: "--font-heading" });

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
    images: [{ url: "/images/rooms/room-4271.jpg", width: 1024, height: 680, alt: "EllaCare living room" }],
  },
};

export const viewport: Viewport = { themeColor: "#263d8a" };

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
    <html lang="en" className={`${body.variable} ${heading.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      </body>
    </html>
  );
}
