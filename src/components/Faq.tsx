import { Plus } from "lucide-react";
import { faqs } from "@/lib/site";

export function Faq() {
  return (
    <div className="grid gap-3">
      {faqs.map((f, i) => (
        <details key={f.q} className="group card overflow-hidden transition-shadow open:shadow-lg" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-lg font-semibold sm:px-7 [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper transition-all group-open:rotate-45 group-open:bg-brand group-open:text-white">
              <Plus className="h-4 w-4" aria-hidden />
            </span>
          </summary>
          <p className="px-6 pb-6 text-lg leading-relaxed text-muted sm:px-7">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
