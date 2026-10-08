import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { highlights } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: "EllaCare is a residential care home in Lynnwood, WA offering a comfortable, fulfilling lifestyle in a home environment.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About EllaCare"
        title="Care that feels like family"
        intro="EllaCare is a residential care home designed to provide a comfortable and fulfilling lifestyle in a true home environment."
        image="/images/rooms/room-4275.jpg"
      />
      <section className="container-page grid gap-12 py-16 md:grid-cols-[3fr_2fr]">
        <div className="prose-page">
          <p>
            From the moment you arrive, you are greeted by a professional staff with a cheerful smile. Our highly
            trained caregivers meet each resident’s unique needs while respecting their independence.
          </p>
          <p>
            Along with a peaceful setting and serene surroundings, EllaCare offers daily activities that encourage
            residents to connect with our staff and with one another, and they are designed to put a smile on your
            face.
          </p>
          <p>
            Our genuine commitment to outstanding service, a well-trained and caring staff, home-style meals and rich
            daily activities is all about one thing: enriching our residents’ quality of life.
          </p>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
          <Image src="/images/rooms/room-4308.jpg" alt="EllaCare’s dining room" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
        </div>
      </section>
      <section className="bg-sand py-16">
        <div className="container-page">
          <h2 className="h2">What makes us different</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {highlights.map((h) => (
              <li key={h.title} className="rounded-2xl bg-white p-6 ring-1 ring-line">
                <h3 className="font-display text-xl font-semibold">{h.title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-muted">{h.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
