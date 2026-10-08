import Image from "next/image";
import Link from "next/link";
import { CheckList } from "@/components/CheckList";
import { CtaBand } from "@/components/CtaBand";
import { Faq, FaqJsonLd } from "@/components/Faq";
import { basicServices, highlights, rooms, site, testimonials } from "@/lib/site";

const steps = [
  { title: "Reach out", body: "Call us or request a tour online. We will answer your questions and find a time that works." },
  { title: "Visit and meet us", body: "Tour the home, meet our caregivers and talk through your loved one’s needs together." },
  { title: "Settle in", body: "Our interactive enrollment process makes sure EllaCare is the right fit, then we help with the move." },
];

export default function Home() {
  const preview = rooms.filter((r) => ["Kitchen", "Dining room", "Bedroom one"].includes(r.title));

  return (
    <>
      <FaqJsonLd />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/images/rooms/room-4271.jpg"
          alt="The bright living room at EllaCare"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/10" />
        <div className="container-page py-24 text-white sm:py-32">
          <p className="text-sm font-semibold tracking-widest text-sky uppercase">
            {site.kind} · {site.address.city}, WA
          </p>
          <h1 className="h1 mt-4 max-w-2xl sm:text-6xl">A home away from home.</h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-white/90">
            {site.tagline}. Personal, round-the-clock care with home-cooked meals in a peaceful Lynnwood
            neighborhood.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Schedule a tour
            </Link>
            <a href={`tel:${site.phones.main.tel}`} className="btn border-2 border-white/70 hover:bg-white/10">
              Call {site.phones.main.display}
            </a>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container-page py-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <li key={h.title} className="rounded-2xl bg-white p-6 ring-1 ring-line">
              <h2 className="font-display text-xl font-semibold">{h.title}</h2>
              <p className="mt-2 leading-relaxed text-muted">{h.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Home preview */}
      <section className="bg-sand py-16">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Our home</p>
              <h2 className="h2 mt-2">Comfortable, tasteful and truly home-like</h2>
            </div>
            <Link href="/residences" className="btn-outline self-start">
              See every room
            </Link>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {preview.map((r) => (
              <li key={r.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={r.src} alt={r.title} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold">
                  {r.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="container-page grid items-center gap-12 py-16 md:grid-cols-2">
        <div>
          <p className="eyebrow">Everyday care</p>
          <h2 className="h2 mt-2">Everything your loved one needs, under one roof</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Our highly trained staff meets each resident’s unique needs while respecting their independence.
          </p>
          <div className="mt-8">
            <CheckList items={basicServices} />
          </div>
          <Link href="/services" className="btn-outline mt-8">
            Care & services
          </Link>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="/images/rooms/room-4281.jpg"
            alt="A furnished bedroom at EllaCare"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Testimonial */}
      <section id="testimonials" className="scroll-mt-32 bg-brand-dark py-16 text-white">
        <div className="container-page max-w-4xl">
          <p className="text-sm font-semibold tracking-widest text-sky uppercase">Those who know us love us</p>
          {testimonials.map((t) => (
            <figure key={t.author} className="mt-6">
              <blockquote className="font-display text-xl leading-relaxed sm:text-2xl">“{t.quote}”</blockquote>
              <figcaption className="mt-6 text-lg">
                <span className="font-semibold">{t.author}</span>
                <span className="text-white/70"> · {t.relation}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Getting started */}
      <section className="container-page py-16">
        <p className="eyebrow">Getting started</p>
        <h2 className="h2 mt-2">Three simple steps</h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl bg-white p-6 ring-1 ring-line">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft font-display text-lg font-bold text-brand">
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="container-page max-w-4xl pb-4">
        <h2 className="h2 mb-8">Common questions</h2>
        <Faq />
      </section>

      <CtaBand />
    </>
  );
}
