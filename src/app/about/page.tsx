import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/CtaBand";
import { glanceIcons } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { highlights } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: "EllaCare is a residential care home in Lynnwood, WA offering a comfortable, fulfilling lifestyle in a home environment.",
};

const icons = [glanceIcons.care, glanceIcons.meals, glanceIcons.family, glanceIcons.location];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            Care that feels <span className="accent text-brand">like family.</span>
          </>
        }
        intro="EllaCare is a residential care home designed to provide a comfortable and fulfilling lifestyle in a true home environment."
        image="/images/rooms/room-4275.jpg"
        imageAlt="EllaCare’s sun room"
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="reveal relative aspect-[4/5] overflow-hidden rounded-5xl">
            <Image src="/images/rooms/room-4308.jpg" alt="EllaCare’s dining room" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="reveal">
            <p className="eyebrow">Our story</p>
            <h2 className="h2 mt-3">
              A cheerful smile, <span className="accent text-brand">every single day.</span>
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted sm:text-xl">
              <p>
                From the moment you arrive, you’re greeted by a professional staff with a cheerful smile. Our highly
                trained caregivers meet each resident’s unique needs while respecting their independence.
              </p>
              <p>
                Along with a peaceful setting and serene surroundings, EllaCare offers daily activities that encourage
                residents to connect with our staff and with one another, designed to put a smile on everyone’s face.
              </p>
            </div>
            <blockquote className="mt-10 border-l-4 border-apricot pl-6 font-serif text-3xl leading-snug italic">
              Our commitment is all about one thing: enriching our residents’ quality of life.
            </blockquote>
          </div>
        </div>
      </section>

      <section className="container-page py-20 sm:py-28">
        <p className="eyebrow">What makes us different</p>
        <h2 className="h2 mt-3 max-w-2xl">
          Everything a home should be, <span className="accent text-brand">and more.</span>
        </h2>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => {
            const Icon = icons[i];
            return (
              <li key={h.title} className="reveal card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-peri-tint text-brand">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{h.title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-muted">{h.body}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <CtaBand />
    </>
  );
}
