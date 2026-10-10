"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { InquiryButton } from "@/components/inquiry/InquiryButton";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";

const allPages = [{ href: "/", label: "Home" }, ...nav, { href: "/testimonials", label: "Family stories" }, { href: "/contact", label: "Contact & tours" }];
const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));
import { useSite } from "./SiteProvider";
import { Logo } from "./Logo";
import { PhoneLink } from "@/components/PhoneLink";

export function Header() {
  const pathname = usePathname();
  const site = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const current = allPages.find((p) => p.href !== "/" && isActive(pathname, p.href))?.label;

  // Close the menu after navigating.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full pr-2 pl-3 transition-all duration-300 sm:pl-4 ${
          scrolled || open
            ? "bg-white/85 py-1 shadow-[0_10px_40px_-20px_rgb(15_23_41/0.35)] ring-1 ring-line backdrop-blur-xl"
            : "bg-transparent py-1.5"
        }`}
      >
        <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
          <Logo className={`transition-[width] duration-300 ${scrolled ? "w-20 sm:w-24" : "w-24 sm:w-[8.25rem]"}`} />
        </Link>

        {current && !open && (
          <span
            aria-hidden
            className="pointer-events-none min-w-0 flex-1 truncate text-center text-[0.9rem] font-semibold text-ink/70 lg:hidden"
          >
            {current}
          </span>
        )}

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-3.5 py-2 text-[0.975rem] font-semibold transition-colors ${
                      active ? "bg-ink text-white" : "text-ink/80 hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <PhoneLink {...site.phones.main}
            className="hidden items-center gap-2 rounded-full px-3 py-2 font-semibold text-ink hover:bg-ink/5 xl:inline-flex"
          >
            <Phone className="h-4 w-4 text-brand" aria-hidden />
            {site.phones.main.display}
          </PhoneLink>
          <InquiryButton inquiry="tour" className="btn-primary hidden min-h-11 px-5 sm:inline-flex">
            Book a tour
          </InquiryButton>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-x-4 top-[4.75rem] bottom-3 z-50 flex animate-rise flex-col overflow-y-auto rounded-4xl bg-white p-3 shadow-2xl ring-1 ring-line lg:hidden"
        >
          <nav aria-label="Main">
            <ul className="grid gap-0.5">
              {allPages.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="flex items-center justify-between rounded-2xl px-4 py-2.5 text-lg font-semibold tracking-tight hover:bg-paper aria-[current=page]:bg-sky-tint aria-[current=page]:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
            <InquiryButton inquiry="tour" className="btn-primary min-h-12 px-4" onClick={() => setOpen(false)}>
              Book a tour
            </InquiryButton>
            <PhoneLink {...site.phones.main} className="btn-ghost min-h-12 px-4">
              <Phone className="h-4 w-4 text-brand" aria-hidden /> Call
            </PhoneLink>
          </div>
        </div>
      )}
    </header>
  );
}
