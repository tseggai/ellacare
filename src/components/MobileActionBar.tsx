import Link from "next/link";
import { site } from "@/lib/site";

// Always-visible call / tour buttons on phones, where most family members browse.
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-cream/95 p-3 backdrop-blur sm:hidden">
      <a href={`tel:${site.phones.main.tel}`} className="btn-outline">
        Call now
      </a>
      <Link href="/contact" className="btn-primary">
        Book a tour
      </Link>
    </div>
  );
}
