import "server-only";
import { getSupabaseAdmin } from "./supabase";
import { testimonials as fallback } from "./site";

export type Testimonial = {
  id: string;
  author: string;
  relation: string | null;
  quote: string;
  highlight: string | null;
};

// Published testimonials, best first. Falls back to the copy in site.ts when the
// database isn't configured (local dev) or the request fails, so the page never
// renders without a story.
export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, author, relation, quote, highlight")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) console.error("Testimonials fetch failed:", error.message);
    else if (data && data.length > 0) return data;
  }
  return fallback.map((t, i) => ({
    id: `fallback-${i}`,
    author: t.author,
    relation: t.relation ?? null,
    quote: t.quote,
    highlight: t.highlight ?? null,
  }));
}

// A short line for pull-quote cards: the highlight if set, else the first sentence.
export function pullQuote(t: Testimonial): string {
  if (t.highlight) return t.highlight;
  const first = t.quote.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? t.quote;
  return first.length > 120 ? `${first.slice(0, 117).trimEnd()}…` : first;
}
