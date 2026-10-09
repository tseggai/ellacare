import "server-only";
import { cache } from "react";
import { faqs as defaultFaqs, rooms as defaultRooms, site as defaults, type Room } from "./site";
import { getSupabaseAdmin } from "./supabase";

// Content the management team can edit in /admin. Everything falls back to the
// values in site.ts when the database has nothing, so the site never renders empty.

export type Phone = { label: string; display: string; tel: string };
export type SiteInfo = {
  name: string;
  legalName: string;
  tagline: string;
  kind: string;
  slogan: string;
  url: string;
  address: { street: string; city: string; region: string; postalCode: string };
  mapsUrl: string;
  phones: { main: Phone; cell: Phone; emergency: Phone; fax: { label: string; display: string } };
  licenseNumber: string;
};

export type BusinessSettings = {
  phones: { main: string; cell: string; emergency: string; fax: string };
  address: { street: string; city: string; region: string; postalCode: string };
  licenseNumber: string;
};
export type HomeSettings = { heroTitle: string; heroIntro: string };
export type BannerSettings = { enabled: boolean; text: string; href: string };

export const defaultBusiness: BusinessSettings = {
  phones: {
    main: defaults.phones.main.display,
    cell: defaults.phones.cell.display,
    emergency: defaults.phones.emergency.display,
    fax: defaults.phones.fax.display,
  },
  address: { ...defaults.address },
  licenseNumber: defaults.licenseNumber,
};
export const defaultHome: HomeSettings = {
  heroTitle: "A real home, with _round-the-clock_ care.",
  heroIntro: `${defaults.tagline}. Personal care, a nurse on call and three home-cooked meals a day, in a peaceful Lynnwood neighborhood.`,
};
export const defaultBanner: BannerSettings = { enabled: false, text: "", href: "" };

// "(425) 776-4026" → "+14257764026"
export function toTel(display: string): string {
  const digits = display.replace(/\D/g, "");
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

export const getSetting = cache(async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return fallback;
  const { data, error } = await supabase.from("site_settings").select("data").eq("key", key).maybeSingle();
  if (error || !data) return fallback;
  return { ...fallback, ...(data.data as Partial<T>) };
});

export const getSite = cache(async function getSite(): Promise<SiteInfo> {
  const b = await getSetting("business", defaultBusiness);
  const phones = { ...defaultBusiness.phones, ...b.phones };
  const address = { ...defaultBusiness.address, ...b.address };
  const full = `${address.street}, ${address.city}, ${address.region} ${address.postalCode}`;
  return {
    name: defaults.name,
    legalName: defaults.legalName,
    tagline: defaults.tagline,
    kind: defaults.kind,
    slogan: defaults.slogan,
    url: defaults.url,
    address,
    mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(full)}`,
    phones: {
      main: { label: "Main", display: phones.main, tel: toTel(phones.main) },
      cell: { label: "Cell", display: phones.cell, tel: toTel(phones.cell) },
      emergency: { label: "Emergency", display: phones.emergency, tel: toTel(phones.emergency) },
      fax: { label: "Fax", display: phones.fax },
    },
    licenseNumber: b.licenseNumber ?? "",
  };
});

export const getHome = cache(() => getSetting("home", defaultHome));
export const getBanner = cache(() => getSetting("banner", defaultBanner));

export type Faq = { id: string; question: string; answer: string; sort_order: number; published: boolean };

export const getFaqs = cache(async function getFaqs(includeHidden = false): Promise<Faq[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    let q = supabase.from("faqs").select("*").order("sort_order").order("created_at");
    if (!includeHidden) q = q.eq("published", true);
    const { data, error } = await q;
    if (!error && data && data.length > 0) return data as Faq[];
  }
  return defaultFaqs.map((f, i) => ({ id: `default-${i}`, question: f.q, answer: f.a, sort_order: (i + 1) * 10, published: true }));
});

export type GalleryPhoto = Room & { id: string; storage_path: string | null; sort_order: number; published: boolean };

export const getGallery = cache(async function getGallery(includeHidden = false): Promise<GalleryPhoto[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    let q = supabase.from("gallery_photos").select("*").order("sort_order").order("created_at");
    if (!includeHidden) q = q.eq("published", true);
    const { data, error } = await q;
    if (!error && data && data.length > 0) return data as GalleryPhoto[];
  }
  return defaultRooms.map((r, i) => ({ ...r, id: `default-${i}`, storage_path: null, sort_order: (i + 1) * 10, published: true }));
});

// Public URL for a file in the gallery bucket.
export function galleryPublicUrl(path: string): string {
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/gallery/${path}`;
}
