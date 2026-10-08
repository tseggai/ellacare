// Vector redraw of the original EllaCare logo (roof arc over the wordmark).
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <svg viewBox="0 0 120 34" aria-hidden="true" className="h-4 w-14 text-sky">
        <path
          d="M2 32 C30 32 44 26 52 12 C55 6 57 2 60 2 C63 2 65 6 68 12 C76 26 90 32 118 32 Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-display text-2xl tracking-tight">
        <span className="font-bold text-ink">ella</span>
        <span className="text-brand">care</span>
      </span>
    </span>
  );
}
