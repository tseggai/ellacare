"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/lib/site";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu after navigating.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <div className="bg-brand-dark text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5 text-sm">
          <span>
            {site.address.street}, {site.address.city}, {site.address.region}
          </span>
          <span className="flex gap-4">
            <a href={`tel:${site.phones.main.tel}`} className="hover:underline">
              Call {site.phones.main.display}
            </a>
            <a href={`tel:${site.phones.emergency.tel}`} className="hidden hover:underline sm:inline">
              Emergency {site.phones.emergency.display}
            </a>
          </span>
        </div>
      </div>
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link href="/" aria-label={`${site.name} home`}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-3 py-2 font-medium transition-colors hover:bg-brand-soft ${
                      active ? "text-brand" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="btn-primary hidden sm:inline-flex">
            Schedule a tour
          </Link>
          <button
            type="button"
            className="btn min-h-11 border-2 border-line px-4 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-line lg:hidden">
          <ul className="container-page grid gap-1 py-3">
            {[{ href: "/", label: "Home" }, ...nav, { href: "/contact", label: "Contact & tours" }].map(
              (item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="block rounded-lg px-3 py-3 text-lg font-medium hover:bg-brand-soft aria-[current=page]:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
