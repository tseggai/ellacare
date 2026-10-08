import type { Metadata } from "next";
import Image from "next/image";
import { CheckList } from "@/components/CheckList";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Dining",
  description: "Fresh, home-cooked meals every day at EllaCare, with custom menus for each resident’s tastes and dietary needs.",
};

export default function DiningPage() {
  return (
    <>
      <PageHero
        eyebrow="Dining"
        title="Fresh, home-cooked meals every day"
        intro="At EllaCare we cook fresh meals daily, offering tasty and healthy options. Custom menus promote healthy eating and meet each resident’s individual preferences."
        image="/images/rooms/room-4305.jpg"
      />
      <section className="container-page grid items-center gap-12 py-16 md:grid-cols-2">
        <div>
          <h2 className="h2">Mealtimes that feel like home</h2>
          <div className="mt-8">
            <CheckList
              items={[
                "Three home-cooked meals a day",
                "Nutritious snacks available any time",
                "Menus tailored to individual tastes",
                "Special diets accommodated",
                "Shared meals around the family dining table",
              ]}
            />
          </div>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
          <Image src="/images/rooms/room-4308.jpg" alt="The EllaCare dining table" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>
      <CtaBand title="Join us for a meal" body="Ask about dietary needs, or come by and see our kitchen for yourself." />
    </>
  );
}
