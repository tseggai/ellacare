import { Check } from "lucide-react";

export function CheckList({ items, columns = 1, tone = "light" }: { items: readonly string[]; columns?: 1 | 2; tone?: "light" | "dark" }) {
  return (
    <ul className={`grid gap-x-8 gap-y-3.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-lg leading-snug">
          <span
            className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
              tone === "dark" ? "bg-peri/20 text-peri" : "bg-peri-tint text-brand"
            }`}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
