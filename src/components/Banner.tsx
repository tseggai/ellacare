import { ArrowRight, Megaphone } from "lucide-react";
import Link from "next/link";
import { normalizeLink } from "@/lib/content";

// Site-wide announcement strip, switched on from Admin → Site settings.
export function Banner({ text, href }: { text: string; href?: string }) {
  const to = normalizeLink(href ?? "");
  const inner = (
    <span className="container-page flex items-center justify-center gap-2 py-2 text-center text-sm font-semibold">
      <Megaphone className="h-4 w-4 shrink-0 text-sky" aria-hidden />
      <span>{text}</span>
      {to && <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />}
    </span>
  );
  const cls = "block hover:bg-night-2";
  return (
    <div className="bg-night text-white">
      {!to ? (
        inner
      ) : to.startsWith("/") || to.startsWith("#") ? (
        <Link href={to} className={cls}>
          {inner}
        </Link>
      ) : (
        <a href={to} className={cls} {...(to.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {inner}
        </a>
      )}
    </div>
  );
}
