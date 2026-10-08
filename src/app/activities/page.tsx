import { Brush, Flower2, Footprints, Gamepad2, Library, PartyPopper, Puzzle, Scissors, BookImage, Clapperboard } from "lucide-react";
import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { activities } from "@/lib/site";

export const metadata: Metadata = {
  title: "Activities",
  description: "Arts and crafts, gardening, games, movie nights, outdoor walks and celebrations at EllaCare.",
};

// One icon per entry in `activities`, in the same order.
const icons = [Brush, Scissors, BookImage, Puzzle, Gamepad2, Flower2, Clapperboard, Library, Footprints, PartyPopper];

export default function ActivitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Activities"
        title={
          <>
            Days filled with <span className="accent text-brand">connection and joy.</span>
          </>
        }
        intro="Daily activities encourage residents to engage with staff and each other, and they’re designed to put a smile on everyone’s face."
        image="/images/rooms/room-4275.jpg"
        imageAlt="The sun room at EllaCare"
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <p className="eyebrow">What we do together</p>
          <h2 className="h2 mt-3 max-w-2xl">
            Something for everyone, <span className="accent text-brand">every day.</span>
          </h2>
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {activities.map((a, i) => {
              const Icon = icons[i] ?? PartyPopper;
              const [name, detail] = a.split(":");
              return (
                <li key={a} className="reveal flex flex-col rounded-4xl bg-paper p-5 ring-1 ring-line sm:p-6">
                  <Icon className="h-7 w-7 text-brand" aria-hidden />
                  <span className="mt-6 text-lg leading-snug font-semibold">{name}</span>
                  {detail && <span className="mt-1 text-muted">{detail.trim()}</span>}
                </li>
              );
            })}
          </ul>
          <p className="mt-8 text-lg text-muted">
            We also host holiday and seasonal parties for residents <em>and</em> their families.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
