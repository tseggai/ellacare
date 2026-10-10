import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { Gallery } from "@/components/Gallery";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { getGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Home",
  description: "Tour EllaCare’s bedrooms, accessible bathrooms, living room, dining room, kitchen and sun room.",
};

export default async function ResidencesPage() {
  const rooms = await getGallery();
  return (
    <>
      <PageHero
        eyebrow="Our home"
        title={
          <>
            Take a look <span className="accent grad-text">around.</span>
          </>
        }
        intro="Providing a home atmosphere that is comfortable and tasteful is our core mission. Explore our relaxing, eating and cooking, sleeping, bathing and outdoor spaces."
      />
      <section className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Photo gallery"
            title={
              <>
                Every room, <span className="accent grad-text">at a glance.</span>
              </>
            }
            intro="Filter by area, or scroll through the whole home."
          />
          <div className="mt-10">
            <Gallery rooms={rooms} />
          </div>
        </div>
      </section>
      <CtaBand
        title={
          <>
            Photos are nice. <span className="accent grad-text">Visiting is better.</span>
          </>
        }
      />
    </>
  );
}
