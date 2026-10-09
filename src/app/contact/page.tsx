import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";
import { PhoneLink } from "@/components/PhoneLink";

export const metadata: Metadata = {
  title: "Contact & Tours",
  description: "Book a tour of EllaCare adult family home in Lynnwood, WA, request a callback, or send us a question.",
};

export default function ContactPage() {
  const { address, phones } = site;
  const query = encodeURIComponent(`${address.street}, ${address.city}, ${address.region} ${address.postalCode}`);

  return (
    <>
      <PageHero
        eyebrow="Contact & tours"
        title={
          <>
            We’d love to <span className="accent grad-text">meet you.</span>
          </>
        }
        intro="Visitors are always welcome by appointment. Tell us how we can help and we’ll take it from there."
        actions={false}
      />

      <section className="container-page grid items-start gap-6 pb-24 lg:grid-cols-[1.5fr_1fr]">
        <InquiryForm />

        <aside id="visit" className="grid scroll-mt-28 content-start gap-6">
          <div className="card p-7">
            <h2 className="text-xl font-semibold tracking-tight">Reach us directly</h2>
            <ul className="mt-5 divide-y divide-line">
              {[phones.main, phones.cell, phones.emergency].map((p) => (
                <li key={p.label}>
                  <PhoneLink {...p} className="group flex items-center justify-between gap-4 py-3.5">
                    <span className="flex items-center gap-3 text-muted">
                      <Phone className="h-4 w-4 text-brand" aria-hidden />
                      {p.label}
                    </span>
                    <span className="text-lg font-semibold text-ink group-hover:text-brand">{p.display}</span>
                  </PhoneLink>
                </li>
              ))}
              <li className="flex items-center justify-between gap-4 py-3.5">
                <span className="flex items-center gap-3 text-muted">
                  <span className="h-4 w-4" />
                  {phones.fax.label}
                </span>
                <span className="text-lg text-muted">{phones.fax.display}</span>
              </li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-4xl bg-white ring-1 ring-line">
            <iframe
              title="Map to EllaCare"
              src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`}
              className="aspect-[4/3] w-full border-0 grayscale-[30%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-6">
              <address className="flex items-start gap-3 text-lg not-italic">
                <MapPin className="mt-1.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                <span>
                  {site.legalName}
                  <br />
                  {address.street}
                  <br />
                  {address.city}, {address.region} {address.postalCode}
                </span>
              </address>
              <p className="mt-3 text-muted">A quiet residential neighborhood in the heart of Lynnwood.</p>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
              >
                Get directions <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
