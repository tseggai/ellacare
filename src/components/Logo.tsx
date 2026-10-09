import Image from "next/image";

// Official horizontal logo. `mark` drops the "ADULT FAMILY HOME" tagline, which is
// illegible at header size; `tone="light"` is the white version for dark backgrounds.
export function Logo({
  className = "",
  tone = "color",
  variant = "mark",
}: {
  className?: string;
  tone?: "color" | "light";
  variant?: "mark" | "full";
}) {
  const src =
    variant === "full"
      ? tone === "light"
        ? "/brand/logo-horizontal-white.png"
        : "/brand/logo-horizontal.png"
      : tone === "light"
        ? "/brand/logo-horizontal-mark-white.png"
        : "/brand/logo-horizontal-mark.png";
  // Intrinsic sizes keep the aspect ratio; width is set by the className.
  const [w, h] = variant === "full" ? [1580, 666] : [1580, 480];
  return <Image src={src} alt="EllaCare" width={w} height={h} priority className={`h-auto ${className}`} />;
}
