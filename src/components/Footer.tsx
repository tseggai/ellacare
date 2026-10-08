import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const { address, phones } = site;
  return (
    <footer className="mt-auto bg-night pb-24 text-white/75 sm:pb-0">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo size="lg" />
          <p className="mt-5 max-w-sm text-lg leading-relaxed">
            {site.kind} in {address.city}, Washington. {site.tagline}.
          </p>
          {site.licenseNumber && <p className="mt-3 text-sm">WA DSHS license #{site.licenseNumber}</p>}
          <Link href="/contact" className="btn-light mt-8">
            Book a tour
          </Link>
        </div>

        <div className="md:col-span-4">
          <h2 className="text-sm font-bold tracking-[0.14em] text-sky uppercase">Contact</h2>
          <ul className="mt-5 space-y-3">
            {[phones.main, phones.cell, phones.emergency].map((p) => (
              <li key={p.label}>
                <a href={`tel:${p.tel}`} className="group flex items-center gap-3 hover:text-white">
                  <Phone className="h-4 w-4 text-sky" aria-hidden />
                  <span className="w-24 text-white/55">{p.label}</span>
                  <span className="font-semibold text-white">{p.display}</span>
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3">
              <span className="h-4 w-4" />
              <span className="w-24 text-white/55">{phones.fax.label}</span>
              <span>{phones.fax.display}</span>
            </li>
            <li>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-start gap-3 hover:text-white"
              >
                <MapPin className="mt-1 h-4 w-4 text-sky" aria-hidden />
                <span>
                  {address.street}
                  <br />
                  {address.city}, {address.region} {address.postalCode}
                </span>
                <ArrowUpRight className="mt-1 h-4 w-4" aria-hidden />
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-sm font-bold tracking-[0.14em] text-sky uppercase">Explore</h2>
          <ul className="mt-5 grid gap-2.5">
            {[...nav, { href: "/testimonials", label: "Family stories" }, { href: "/contact", label: "Contact & tours" }, { href: "/privacy", label: "Privacy" }].map(
              (item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-6 text-sm text-white/50">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
