import { ArrowRight, MapPin, Phone } from "lucide-react";
import { InquiryButton } from "@/components/inquiry/InquiryButton";
import { site } from "@/lib/site";

export function CtaBand({
  title = (
    <>
      Come see EllaCare <span className="accent grad-text">for yourself.</span>
    </>
  ),
  body = "Tour the home, meet our caregivers and get your questions answered. Visits are by appointment, so book a time that suits you.",
}: {
  title?: React.ReactNode;
  body?: string;
}) {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="reveal relative isolate overflow-hidden rounded-5xl bg-night [--grad-from:var(--color-sky)] [--grad-to:#a9dcff] px-6 py-14 text-white sm:px-14 sm:py-20">
        <div
          aria-hidden
          className="absolute -top-32 -right-24 -z-10 h-96 w-96 rounded-full bg-sky/50 blur-3xl"
        />
        <div aria-hidden className="absolute -bottom-40 -left-20 -z-10 h-80 w-80 rounded-full bg-aqua/30 blur-3xl" />
        <div className="grid items-end gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="h2 max-w-2xl sm:text-6xl">{title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">{body}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <InquiryButton inquiry="tour" className="btn-light">
                Book a tour <ArrowRight className="h-4 w-4" aria-hidden />
              </InquiryButton>
              <a href={`tel:${site.phones.main.tel}`} className="btn bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/15">
                <Phone className="h-4 w-4" aria-hidden /> {site.phones.main.display}
              </a>
            </div>
          </div>
          <ul className="grid gap-3 text-white/80">
            <li className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
              <p className="text-sm font-semibold text-sky">Emergency line</p>
              <a href={`tel:${site.phones.emergency.tel}`} className="mt-1 block text-2xl font-semibold text-white">
                {site.phones.emergency.display}
              </a>
            </li>
            <li className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
              <p className="text-sm font-semibold text-sky">Visit us</p>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-start gap-2 text-lg text-white">
                <MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden />
                {site.address.street}, {site.address.city}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
