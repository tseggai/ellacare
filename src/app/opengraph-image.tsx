import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getGallery, getHome, getSite } from "@/lib/content";

// Social-sharing image (Open Graph / Twitter card): the first photo in the
// gallery with the logo and headline over it. Reorder the gallery in the admin
// to change it; the image is regenerated at most once an hour.
export const alt = "EllaCare, Adult Family Home in Lynnwood, WA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

const FALLBACK_PHOTO = "/images/rooms/room-4271.jpg";

async function toDataUrl(src: string): Promise<string> {
  if (src.startsWith("http")) {
    const res = await fetch(src);
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${res.headers.get("content-type") ?? "image/jpeg"};base64,${buf.toString("base64")}`;
  }
  const buf = await readFile(path.join(process.cwd(), "public", src));
  const mime = src.endsWith(".png") ? "image/png" : src.endsWith(".webp") ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export default async function OpenGraphImage() {
  const [rooms, site, home] = await Promise.all([getGallery(), getSite(), getHome()]);
  const photoSrc = rooms[0]?.src ?? FALLBACK_PHOTO;
  const [photo, logo] = await Promise.all([
    toDataUrl(photoSrc).catch(() => toDataUrl(FALLBACK_PHOTO)),
    toDataUrl("/brand/logo-horizontal-white.png"),
  ]);
  const headline = home.heroTitle.replace(/_/g, "");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: "#111b45" }}>
        <img src={photo} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, rgba(17,27,69,0) 0%, rgba(17,27,69,0) 42%, rgba(17,27,69,0.78) 75%, rgba(17,27,69,0.95) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            bottom: 56,
            display: "flex",
            flexDirection: "column",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          <img src={logo} alt="" style={{ width: 340, objectFit: "contain" }} />
          <div style={{ marginTop: 26, fontSize: 54, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.05, maxWidth: 900 }}>{headline}</div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, fontSize: 26, opacity: 0.92 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#4caf6d" }} />
            {site.kind} · {site.address.city}, {site.address.region} · {site.phones.main.display}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
