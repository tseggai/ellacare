import Link from "next/link";
import { site } from "@/lib/site";

export function CtaBand({
  title = "Come see EllaCare for yourself",
  body = "We would love to show you around, introduce you to our staff and answer your questions. Visits are by appointment.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="container-page py-16">
      <div className="rounded-3xl bg-brand-dark px-6 py-12 text-center text-white sm:px-12">
        <h2 className="h2">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">{body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/contact" className="btn bg-white text-brand-dark hover:bg-brand-soft">
            Schedule a tour
          </Link>
          <a href={`tel:${site.phones.main.tel}`} className="btn border-2 border-white/60 hover:bg-white/10">
            Call {site.phones.main.display}
          </a>
        </div>
      </div>
    </section>
  );
}
