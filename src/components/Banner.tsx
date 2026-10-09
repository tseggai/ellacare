import { ArrowRight, Megaphone } from "lucide-react";
import Link from "next/link";

// Site-wide announcement strip, switched on from Admin → Site settings.
export function Banner({ text, href }: { text: string; href?: string }) {
  const inner = (
    <span className="container-page flex items-center justify-center gap-2 py-2 text-center text-sm font-semibold">
      <Megaphone className="h-4 w-4 shrink-0 text-sky" aria-hidden />
      <span>{text}</span>
      {href && <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />}
    </span>
  );
  return (
    <div className="bg-night text-white">
      {href ? (
        <Link href={href} className="block hover:bg-night-2">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
