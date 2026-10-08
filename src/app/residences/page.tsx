import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { Gallery } from "@/components/Gallery";
import { PageHero } from "@/components/PageHero";
import { rooms } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Home",
  description: "Tour EllaCare’s bedrooms, accessible bathrooms, living room, dining room, kitchen and sun room.",
};

export default function ResidencesPage() {
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
      <section className="container-page pb-8">
        <Gallery rooms={rooms} />
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
