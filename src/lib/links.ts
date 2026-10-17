// Special banner link value: open the site-wide "Book a tour" form instead of navigating.
export const TOUR_LINK = "#tour";

// Turn whatever staff typed into the banner's link field into something a browser can open:
// "/contact" stays a page, "(425) 776-4026" becomes a tel: link, an email becomes mailto:,
// "ellacare.com/contact" gets https://. Empty stays empty.
export function normalizeLink(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  if (/^(https?:\/\/|tel:|mailto:|sms:)/i.test(v) || v.startsWith("/") || v.startsWith("#")) return v;
  const digits = v.replace(/\D/g, "");
  if (digits.length >= 7 && /^[\d\s().+-]+$/.test(v)) return `tel:${digits.length === 10 ? "+1" + digits : "+" + digits}`;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`;
  return `https://${v}`;
}
