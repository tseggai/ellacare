import Image from "next/image";

// The EllaCare logo (roof + wordmark, tagline cropped). The gradient reads well
// on both light and dark backgrounds, so one asset serves header and footer.
export function Logo({ className = "", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const h = size === "lg" ? 72 : 52;
  return (
    <Image
      src="/images/logo.png"
      alt="EllaCare"
      width={Math.round(h * (631 / 455))}
      height={h}
      priority
      className={`h-auto ${size === "lg" ? "w-[6.25rem]" : "w-[5.5rem]"} ${className}`}
    />
  );
}
