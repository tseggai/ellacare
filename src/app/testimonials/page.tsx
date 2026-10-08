import { Quote } from "lucide-react";
import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { getTestimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "Family Stories",
  description: "What families say about life at EllaCare adult family home in Lynnwood, WA.",
};

// Re-check the database for new stories at most once an hour.
export const revalidate = 3600;

export default async function TestimonialsPage() {
  const stories = await getTestimonials();

  return (
    <>
      <PageHero
        eyebrow="Family stories"
        title={
          <>
            Those who know us <span className="accent grad-text">love us.</span>
          </>
        }
        intro="In their own words: what residents’ families have told us about life at EllaCare."
      />

      <section className="container-page pb-8">
        <ul className="grid gap-5 lg:grid-cols-2">
          {stories.map((t, i) => (
            <li
              key={t.id}
              className={`reveal rounded-4xl p-8 sm:p-10 ${
                i === 0
                  ? "bg-night text-white [--grad-from:var(--color-sky)] [--grad-to:var(--color-sage)] lg:col-span-2"
                  : "card"
              }`}
            >
              <Quote className={`h-8 w-8 ${i === 0 ? "text-sky" : "text-sage"}`} aria-hidden />
              {t.highlight && (
                <p className={`mt-4 font-serif text-3xl leading-tight italic sm:text-4xl ${i === 0 ? "grad-text" : "text-brand"}`}>
                  “{t.highlight}”
                </p>
              )}
              <blockquote className={`mt-4 text-lg leading-relaxed sm:text-xl ${i === 0 ? "text-white/85" : "text-muted"}`}>
                {t.quote}
              </blockquote>
              <p className="mt-6 text-lg">
                <span className="font-semibold">{t.author}</span>
                {t.relation && <span className={i === 0 ? "text-white/60" : "text-muted"}> · {t.relation}</span>}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        title={
          <>
            Come write the <span className="accent grad-text">next story.</span>
          </>
        }
        body="See the home, meet the people, and decide for yourself. Visits are by appointment."
      />
    </>
  );
}
