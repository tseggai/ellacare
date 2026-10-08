import { Apple, ChefHat, Clock, Salad, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Dining",
  description: "Fresh, home-cooked meals every day at EllaCare, with custom menus for each resident’s tastes and dietary needs.",
};

const points = [
  { icon: ChefHat, title: "Cooked fresh daily", body: "Three home-cooked meals every day, made in our own kitchen." },
  { icon: Apple, title: "Snacks any time", body: "Nutritious snacks are always available between meals." },
  { icon: Salad, title: "Tailored menus", body: "Custom menus that promote healthy eating and suit individual preferences." },
  { icon: Users, title: "Shared at the table", body: "Meals together around the family dining table." },
];

export default function DiningPage() {
  return (
    <>
      <PageHero
        eyebrow="Dining"
        title={
          <>
            Fresh, home-cooked meals, <span className="accent text-brand">every day.</span>
          </>
        }
        intro="At EllaCare we cook fresh meals daily, offering tasty and healthy options. Custom menus meet each resident’s individual preferences."
        image="/images/rooms/room-4305.jpg"
        imageAlt="EllaCare’s kitchen"
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <ul className="grid gap-4 sm:grid-cols-2">
            {points.map(({ icon: Icon, title, body }) => (
              <li key={title} className="reveal rounded-4xl bg-paper p-7 ring-1 ring-line">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-apricot-tint text-[#a35a12]">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h2 className="mt-6 text-xl font-semibold tracking-tight">{title}</h2>
                <p className="mt-2 text-lg leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
          <div className="reveal relative aspect-[4/5] overflow-hidden rounded-5xl">
            <Image src="/images/rooms/room-4308.jpg" alt="The EllaCare dining table" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-3xl bg-white/90 p-4 backdrop-blur">
              <Clock className="h-5 w-5 text-brand" aria-hidden />
              <p className="font-semibold">Food preferences? Just ask. Menus are tailored to each resident.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Join us <span className="accent text-peri">for a visit.</span>
          </>
        }
        body="Ask about dietary needs, or come by and see our kitchen for yourself."
      />
    </>
  );
}
