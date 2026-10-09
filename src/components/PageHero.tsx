import { ChevronRight, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { InquiryButton } from "@/components/inquiry/InquiryButton";
import { getSite } from "@/lib/content";
import { PhoneLink } from "@/components/PhoneLink";

export async function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
  actions = true,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  image?: string;
  imageAlt?: string;
  actions?: boolean;
}) {
  const site = await getSite();
  return (
    <section className="container-page pt-8 pb-12 sm:pt-12 sm:pb-16">
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-sm font-semibold text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden />
        <span className="text-ink">{eyebrow}</span>
      </nav>
      <div className={`grid items-end gap-10 ${image ? "lg:grid-cols-[1.1fr_1fr]" : ""}`}>
        <div className="animate-rise">
          <h1 className="display max-w-4xl">{title}</h1>
          {intro && <p className="lead mt-6 max-w-2xl">{intro}</p>}
          {actions && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <InquiryButton inquiry="tour" className="btn-primary">
                Book a tour
              </InquiryButton>
              <PhoneLink {...site.phones.main} className="btn-ghost">
                <Phone className="h-4 w-4" aria-hidden /> {site.phones.main.display}
              </PhoneLink>
            </div>
          )}
        </div>
        {image && (
          <div className="relative aspect-[4/3] animate-rise overflow-hidden rounded-5xl [animation-delay:120ms]">
            <Image src={image} alt={imageAlt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
