export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-6 ${
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={align === "center" ? "max-w-3xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="h2 mt-3">{title}</h2>
        {intro && <p className="lead mt-4">{intro}</p>}
      </div>
      {action}
    </div>
  );
}
