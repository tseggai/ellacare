import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const { address, phones } = site;
  return (
    <footer className="mt-auto border-t border-line bg-sand pb-24 sm:pb-0">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 text-muted">
            {site.kind} in {address.city}, Washington. {site.slogan}.
          </p>
          {site.licenseNumber && (
            <p className="mt-2 text-sm text-muted">WA DSHS license #{site.licenseNumber}</p>
          )}
        </div>
        <div>
          <h2 className="font-semibold">Visit or call</h2>
          <address className="mt-3 not-italic text-muted">
            {site.legalName}
            <br />
            {address.street}
            <br />
            {address.city}, {address.region} {address.postalCode}
          </address>
          <ul className="mt-3 space-y-1 text-muted">
            {[phones.main, phones.cell, phones.emergency].map((p) => (
              <li key={p.label}>
                {p.label}:{" "}
                <a href={`tel:${p.tel}`} className="font-medium text-ink hover:text-brand">
                  {p.display}
                </a>
              </li>
            ))}
            <li>
              {phones.fax.label}: {phones.fax.display}
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold">Explore</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
            {[...nav, { href: "/contact", label: "Contact" }, { href: "/privacy", label: "Privacy" }].map(
              (item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="container-page py-4 text-sm text-muted">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
