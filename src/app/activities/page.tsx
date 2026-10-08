import type { Metadata } from "next";
import { CheckList } from "@/components/CheckList";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { activities } from "@/lib/site";

export const metadata: Metadata = {
  title: "Activities",
  description: "Arts and crafts, gardening, games, movie nights, outdoor walks and celebrations at EllaCare.",
};

export default function ActivitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Activities"
        title="Days filled with connection and joy"
        intro="Daily activities encourage residents to engage with staff and each other, and they are designed to put a smile on everyone’s face."
        image="/images/rooms/room-4275.jpg"
      />
      <section className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
          <div>
            <h2 className="h2">Something for everyone</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Activities include, but are not limited to, the list here. We also host holiday and seasonal parties for
              residents and their families.
            </p>
          </div>
          <CheckList items={activities} columns={2} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
