import { ArrowUpRight, Navigation, Phone, Siren } from "lucide-react";
import type { Metadata } from "next";
import { CheckList } from "@/components/CheckList";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";
import { InquiryForm } from "./InquiryForm";

export const metadata: Metadata = {
  title: "Contact & Tours",
  description: "Book a tour of EllaCare adult family home in Lynnwood, WA, call us, or send a question.",
};

export default function ContactPage() {
  const { address, phones } = site;
  const query = encodeURIComponent(`${address.street}, ${address.city}, ${address.region} ${address.postalCode}`);

  const quick = [
    { href: `tel:${phones.main.tel}`, icon: Phone, label: "Call us", value: phones.main.display, hint: `or cell ${phones.cell.display}`, primary: true },
    { href: `tel:${phones.emergency.tel}`, icon: Siren, label: "Emergency line", value: phones.emergency.display, hint: "For urgent matters" },
    { href: site.mapsUrl, icon: Navigation, label: "Get directions", value: `${address.street}`, hint: `${address.city}, ${address.region} ${address.postalCode}`, external: true },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact & tours"
        title={
          <>
            We’d love to <span className="accent grad-text">meet you.</span>
          </>
        }
        intro="Visitors are always welcome by appointment. Call us now, or book a tour below and we’ll confirm a time."
        actions={false}
      />

      <section className="container-page">
        <ul className="grid gap-3 sm:grid-cols-3">
          {quick.map(({ href, icon: Icon, label, value, hint, primary, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                className={`group flex h-full items-start gap-4 rounded-4xl p-6 transition-all hover:-translate-y-0.5 ${
                  primary ? "bg-brand text-white shadow-[0_16px_40px_-16px_rgb(43_118_176/0.7)]" : "card hover:shadow-lg"
                }`}
              >
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${primary ? "bg-white/15" : "bg-sky-tint text-brand"}`}>
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-semibold ${primary ? "text-white/75" : "text-muted"}`}>{label}</span>
                  <span className="block text-xl font-semibold tracking-tight">{value}</span>
                  <span className={`block ${primary ? "text-white/75" : "text-muted"}`}>{hint}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page grid items-start gap-6 py-12 pb-24 lg:grid-cols-[1.5fr_1fr]">
        <InquiryForm />

        <aside id="visit" className="grid scroll-mt-28 content-start gap-6">
          <div className="overflow-hidden rounded-4xl bg-white ring-1 ring-line">
            <iframe
              title="Map to EllaCare"
              src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`}
              className="aspect-[4/3] w-full border-0 grayscale-[30%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-6">
              <p className="text-sm font-semibold text-muted">Find us</p>
              <address className="mt-1 text-lg not-italic">
                {site.legalName}
                <br />
                {address.street}, {address.city}, {address.region} {address.postalCode}
              </address>
              <p className="mt-2 text-muted">A quiet residential neighborhood in the heart of Lynnwood.</p>
            </div>
          </div>
          <div className="rounded-4xl bg-night p-7 text-white">
            <h2 className="text-xl font-semibold tracking-tight">What to expect on your tour</h2>
            <div className="mt-5">
              <CheckList
                tone="dark"
                items={[
                  "See bedrooms, bathrooms and shared spaces",
                  "Meet our caregivers",
                  "Talk through care needs and enrollment",
                  "Get all your questions answered",
                ]}
              />
            </div>
            <p className="mt-6 text-white/60">Fax: {phones.fax.display}</p>
          </div>
        </aside>
      </section>
    </>
  );
}
