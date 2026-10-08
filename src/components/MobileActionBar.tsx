"use client";

import { CalendarCheck, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

// Persistent call / tour actions: a bottom bar on phones, a floating pill on desktop
// that appears once the visitor scrolls past the first screen.
export function MobileActionBar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/contact") return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden">
        <a href={`tel:${site.phones.main.tel}`} className="btn-ghost min-h-12">
          <Phone className="h-4 w-4" aria-hidden /> Call
        </a>
        <Link href="/contact" className="btn-primary min-h-12">
          <CalendarCheck className="h-4 w-4" aria-hidden /> Book a tour
        </Link>
      </div>

      <div
        className={`fixed right-6 bottom-6 z-40 hidden items-center gap-1 rounded-full bg-night p-1.5 shadow-2xl transition-all duration-300 sm:flex ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        aria-hidden={!show}
      >
        <a
          href={`tel:${site.phones.main.tel}`}
          tabIndex={show ? 0 : -1}
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-semibold text-white hover:bg-white/10"
        >
          <Phone className="h-4 w-4 text-peri" aria-hidden /> {site.phones.main.display}
        </a>
        <Link href="/contact" tabIndex={show ? 0 : -1} className="btn-light min-h-11 px-5">
          Book a tour
        </Link>
      </div>
    </>
  );
}
