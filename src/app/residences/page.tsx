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
        title="Take a look around"
        intro="Providing a comfortable, tasteful home is at the heart of what we do. Explore our bedrooms, accessible bathrooms, and shared living, dining and outdoor spaces."
        image="/images/rooms/room-4281.jpg"
      />
      <section className="container-page py-16">
        <Gallery rooms={rooms} />
      </section>
      <CtaBand title="Photos are nice. Visiting is better." />
    </>
  );
}
