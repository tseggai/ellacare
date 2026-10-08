import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image?: string;
}) {
  return (
    <section className="border-b border-line bg-sand">
      <div className="container-page grid items-center gap-8 py-12 md:grid-cols-2 md:py-16">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="h1 mt-3">{title}</h1>
          {intro && <p className="mt-5 text-xl leading-relaxed text-muted">{intro}</p>}
        </div>
        {image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
            <Image src={image} alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
