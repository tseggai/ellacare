import { Banner } from "@/components/Banner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InquiryProvider } from "@/components/inquiry/InquiryProvider";
import { MobileActionBar } from "@/components/MobileActionBar";
import { SiteProvider } from "@/components/SiteProvider";
import { getBanner, getFaqs, getSite } from "@/lib/content";

// Business details come from the admin area; re-read at most once an hour, and
// immediately after staff save a change (revalidatePath).
export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [site, banner, faqs] = await Promise.all([getSite(), getBanner(), getFaqs()]);

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

  return (
    <SiteProvider site={site}>
      <InquiryProvider faqs={faqs}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        {banner.enabled && banner.text && <Banner text={banner.text} href={banner.href} />}
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      </InquiryProvider>
    </SiteProvider>
  );
}
