// Vector redraw of the original EllaCare mark (a roof arc) beside the wordmark.
export function Logo({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand shadow-[0_6px_16px_-6px_rgb(53_80_212/0.7)]">
        <svg viewBox="0 0 40 24" aria-hidden="true" className="h-4 w-7 text-white">
          <path d="M1 22 C10 22 14 17 17 9 C18 6 19 2 20 2 C21 2 22 6 23 9 C26 17 30 22 39 22 Z" fill="currentColor" />
        </svg>
      </span>
      <span className={`text-[1.5rem] font-semibold tracking-[-0.04em] ${tone === "light" ? "text-white" : "text-ink"}`}>
        ella<span className={tone === "light" ? "text-peri" : "text-brand"}>care</span>
      </span>
    </span>
  );
}
