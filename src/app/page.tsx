import { ArrowRight, ArrowUpRight, Phone, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { InquiryButton } from "@/components/inquiry/InquiryButton";
import { CallbackForm } from "@/components/CallbackForm";
import { CheckList } from "@/components/CheckList";
import { CtaBand } from "@/components/CtaBand";
import { Faq, FaqJsonLd } from "@/components/Faq";
import { glanceIcons } from "@/components/Icons";
import { SectionHeading } from "@/components/SectionHeading";
import { activities, basicServices, glance, rooms, site, trustPoints } from "@/lib/site";
import { getTestimonials, pullQuote } from "@/lib/testimonials";

const steps = [
  { title: "Reach out", body: "Call, or request a tour or callback online. We’ll answer your questions and find a time that works." },
  { title: "Visit and meet us", body: "Tour the home, meet our caregivers and talk through your loved one’s needs together." },
  { title: "Settle in", body: "Our interactive enrollment process makes sure EllaCare is the right fit, then we help with the move." },
];

// Testimonials come from Supabase; re-check for new ones at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const stories = await getTestimonials();
  const featured = stories[0];
  const more = stories.slice(1, 3);
  const tour = rooms.filter((r) => r.title !== "Living room");

  return (
    <>
      <FaqJsonLd />

      {/* ───────────── Hero ───────────── */}
      <section className="container-page relative pt-6 pb-16 sm:pt-10 lg:pb-24">
        <div aria-hidden className="grad-bg absolute top-0 -left-40 -z-10 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl" />
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="animate-rise">
            <span className="chip">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-leaf" />
              </span>
              {site.kind} · {site.address.city}, WA
            </span>
            <h1 className="display mt-6">
              A real home, with <span className="accent grad-text">round-the-clock</span> care.
            </h1>
            <p className="lead mt-6 max-w-xl">
              {site.tagline}. Personal care, a nurse on call and three home-cooked meals a day, in a peaceful
              Lynnwood neighborhood.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <InquiryButton inquiry="tour" className="btn-primary">
                Book a tour <ArrowRight className="h-4 w-4" aria-hidden />
              </InquiryButton>
              <a href={`tel:${site.phones.main.tel}`} className="btn-ghost">
                <Phone className="h-4 w-4 text-brand" aria-hidden /> Call {site.phones.main.display}
              </a>
            </div>

            <div className="card mt-8 max-w-xl p-4 sm:p-5">
              <p className="mb-3 font-semibold">
                Prefer we call you? <span className="font-normal text-muted">Leave your number.</span>
              </p>
              <CallbackForm />
            </div>
          </div>

          {/* Photo collage */}
          <div className="relative animate-rise [animation-delay:150ms]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-5xl sm:aspect-[5/5] lg:aspect-[4/5]">
              <Image
                src="/images/rooms/room-4271.jpg"
                alt="EllaCare’s bright living room"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/40 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-3 w-[min(19rem,80%)] animate-float rounded-3xl bg-white p-5 shadow-[0_24px_60px_-24px_rgb(15_23_41/0.45)] ring-1 ring-line sm:-left-8">
              <Quote className="h-6 w-6 text-aqua" aria-hidden />
              <p className="mt-2 font-serif text-xl leading-snug italic">“{pullQuote(featured)}”</p>
              <p className="mt-2 text-sm font-semibold text-muted">
                {featured.author}{featured.relation ? `, ${featured.relation.toLowerCase()}` : ""}
              </p>
            </div>

            <div className="absolute top-5 right-5 hidden rounded-2xl bg-white/90 px-4 py-3 shadow-lg ring-1 ring-line backdrop-blur sm:block">
              <p className="text-xs font-bold tracking-wider text-muted uppercase">Nurse on call</p>
              <p className="text-2xl font-semibold tracking-tight">24 / 7</p>
            </div>
          </div>
        </div>

        <ul className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 text-[1.0625rem] font-semibold text-ink/80">
          {trustPoints.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────── At a glance ───────────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="At a glance"
            title={
              <>
                Everything you need to know, <span className="accent grad-text">in one place.</span>
              </>
            }
            intro="The questions families ask us first. Tap any card for the details."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {glance.map((g, i) => {
              const Icon = glanceIcons[g.key];
              const featured = i === 0;
              return (
                <li key={g.key} className="reveal">
                  <Link
                    href={g.href}
                    className={`group relative flex h-full flex-col rounded-4xl p-6 transition-all sm:p-7 duration-300 hover:-translate-y-1 ${
                      featured
                        ? "bg-night text-white hover:shadow-[0_24px_50px_-20px_rgb(17_27_69/0.6)]"
                        : "bg-paper ring-1 ring-line hover:bg-white hover:shadow-[0_24px_50px_-24px_rgb(15_23_41/0.3)]"
                    }`}
                  >
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-2xl ${
                        featured ? "bg-white/10 text-sky" : "bg-white text-brand ring-1 ring-line"
                      }`}
                    >
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:mt-8">{g.title}</h3>
                    <p className={`mt-2 text-lg leading-relaxed ${featured ? "text-white/70" : "text-muted"}`}>{g.body}</p>
                    <ArrowUpRight
                      className={`absolute top-7 right-7 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        featured ? "text-sky" : "text-muted"
                      }`}
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ───────────── Home tour ───────────── */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Take a look inside"
            title={
              <>
                Comfortable, tasteful and <span className="accent grad-text">truly home-like.</span>
              </>
            }
            action={
              <Link href="/residences" className="btn-ghost self-start">
                See every room <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            }
          />
        </div>
        <ul
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:px-6 lg:px-[max(2rem,calc((100vw_-_80rem)/2_+_2rem))]"
          aria-label="Photos of the home"
        >
          {tour.map((r, i) => (
            <li
              key={r.src}
              className={`relative shrink-0 snap-start overflow-hidden rounded-4xl ${
                i % 3 === 0 ? "aspect-[4/5] w-[78vw] sm:w-[22rem]" : "aspect-[4/5] w-[70vw] sm:w-[19rem]"
              }`}
            >
              <Image src={r.src} alt={r.title} fill sizes="(min-width: 640px) 22rem, 78vw" className="object-cover" />
              <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-sm font-semibold backdrop-blur">
                {r.title}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────── Daily life bento ───────────── */}
      <section className="container-page pb-20 sm:pb-28">
        <SectionHeading
          eyebrow="Daily life"
          title={
            <>
              Days filled with care, good food <span className="accent grad-text">and good company.</span>
            </>
          }
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-6">
          <div className="reveal card p-8 lg:col-span-3 lg:row-span-2 sm:p-10">
            <h3 className="text-2xl font-semibold tracking-tight">Everyday care</h3>
            <p className="mt-2 text-lg text-muted">
              Highly trained staff who meet each resident’s unique needs while respecting their independence.
            </p>
            <div className="mt-8">
              <CheckList items={basicServices} />
            </div>
            <Link href="/services" className="mt-8 inline-flex items-center gap-2 font-semibold text-brand hover:gap-3">
              All care & services <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <Link
            href="/dining"
            className="reveal group relative isolate min-h-72 overflow-hidden rounded-4xl p-8 text-white lg:col-span-3"
          >
            <Image
              src="/images/rooms/room-4305.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 via-night/30 to-transparent" />
            <div className="flex h-full flex-col justify-end">
              <p className="text-sm font-bold tracking-[0.14em] text-aqua uppercase">Dining</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight">3 home-cooked meals, every day</h3>
              <p className="mt-2 text-lg text-white/80">Plus snacks any time and menus tailored to each resident.</p>
            </div>
          </Link>

          <Link
            href="/activities"
            className="reveal group rounded-4xl bg-aqua-tint p-8 ring-1 ring-aqua/40 lg:col-span-3"
          >
            <p className="text-sm font-bold tracking-[0.14em] text-brand uppercase">Activities</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight">Something for everyone</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {activities.slice(0, 8).map((a) => (
                <li key={a} className="rounded-full bg-white px-3.5 py-1.5 text-[0.95rem] font-semibold ring-1 ring-aqua/40">
                  {a.split(":")[0]}
                </li>
              ))}
              <li className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[0.95rem] font-semibold text-brand group-hover:gap-2">
                and more <ArrowRight className="h-4 w-4" aria-hidden />
              </li>
            </ul>
          </Link>
        </div>
      </section>

      {/* ───────────── Testimonials ───────────── */}
      <section
        id="testimonials"
        className="bg-night py-20 text-white sm:py-28 [--grad-from:var(--color-sky)] [--grad-to:#a9dcff]"
      >
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-center">
            <div className="reveal">
              <p className="text-sm font-bold tracking-[0.14em] text-sky uppercase">Those who know us love us</p>
              <p className="mt-6 font-serif text-5xl leading-[1.05] italic sm:text-6xl">
                <span className="grad-text">“{pullQuote(featured)}”</span>
              </p>
              <p className="mt-6 text-lg">
                <span className="font-semibold">{featured.author}</span>
                {featured.relation && <span className="text-white/60"> · {featured.relation}</span>}
              </p>
            </div>
            <figure className="reveal relative rounded-4xl bg-white/5 p-8 ring-1 ring-white/10 sm:p-10">
              <Quote className="h-10 w-10 text-sky" aria-hidden />
              <blockquote className="mt-4 text-lg leading-relaxed text-white/85 sm:text-xl">{featured.quote}</blockquote>
            </figure>
          </div>

          {more.length > 0 && (
            <ul className="mt-6 grid gap-6 lg:grid-cols-2">
              {more.map((t) => (
                <li key={t.id} className="reveal rounded-4xl bg-white/5 p-8 ring-1 ring-white/10">
                  <p className="font-serif text-2xl leading-snug italic">“{pullQuote(t)}”</p>
                  <p className="mt-4 line-clamp-4 text-white/75">{t.quote}</p>
                  <p className="mt-4 font-semibold">
                    {t.author}
                    {t.relation && <span className="font-normal text-white/60"> · {t.relation}</span>}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10 flex justify-center">
            <Link href="/testimonials" className="btn-light">
              {stories.length > 1 ? "Read all family stories" : "Read the full story"} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section className="container-page py-20 sm:py-28">
        <SectionHeading
          align="center"
          eyebrow="Getting started"
          title={
            <>
              Three simple steps to <span className="accent grad-text">peace of mind.</span>
            </>
          }
        />
        <ol className="relative mt-14 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="reveal card relative p-8">
              <span className="font-serif text-6xl leading-none text-brand italic">0{i + 1}</span>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-lg leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex justify-center">
          <InquiryButton inquiry="tour" className="btn-primary">
            Start with a tour <ArrowRight className="h-4 w-4" aria-hidden />
          </InquiryButton>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">FAQ</p>
            <h2 className="h2 mt-3">
              Questions? <span className="accent grad-text">We have answers.</span>
            </h2>
            <p className="lead mt-4">Can’t find what you’re looking for? Our team is happy to help.</p>
            <a href={`tel:${site.phones.main.tel}`} className="btn-ghost mt-8">
              <Phone className="h-4 w-4 text-brand" aria-hidden /> {site.phones.main.display}
            </a>
          </div>
          <Faq />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
