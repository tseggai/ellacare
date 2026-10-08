import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";
import { InquiryForm } from "./InquiryForm";

export const metadata: Metadata = {
  title: "Contact & Tours",
  description: "Schedule a tour of EllaCare adult family home in Lynnwood, WA, or send us a question.",
};

export default function ContactPage() {
  const { address, phones } = site;
  const query = encodeURIComponent(`${address.street}, ${address.city}, ${address.region} ${address.postalCode}`);
  return (
    <>
      <PageHero
        eyebrow="Contact & tours"
        title="We’d love to meet you"
        intro="EllaCare is in a quiet residential neighborhood in the heart of Lynnwood. Visitors are always welcome. Request a time below or give us a call."
      />
      <section className="container-page grid gap-10 py-16 lg:grid-cols-[3fr_2fr]">
        <InquiryForm />
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-line">
            <h2 className="font-display text-2xl font-semibold">Call us</h2>
            <ul className="mt-4 space-y-3 text-lg">
              {[phones.main, phones.cell, phones.emergency].map((p) => (
                <li key={p.label} className="flex justify-between gap-4">
                  <span className="text-muted">{p.label}</span>
                  <a href={`tel:${p.tel}`} className="font-semibold text-brand hover:underline">
                    {p.display}
                  </a>
                </li>
              ))}
              <li className="flex justify-between gap-4">
                <span className="text-muted">{phones.fax.label}</span>
                <span>{phones.fax.display}</span>
              </li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
            <iframe
              title="Map to EllaCare"
              src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`}
              className="aspect-[4/3] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-6">
              <address className="text-lg not-italic">
                {site.legalName}
                <br />
                {address.street}
                <br />
                {address.city}, {address.region} {address.postalCode}
              </address>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4">
                Get directions
              </a>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
