import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...nav.map((n) => n.href), "/testimonials", "/contact", "/privacy"].map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/contact" ? 0.9 : 0.7,
  }));
}
