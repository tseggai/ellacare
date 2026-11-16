import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getGallery, getPagePhotos, pagePhotoSlots, type PagePhotoSlot } from "@/lib/content";
import { PhotoSlots } from "./PhotoSlots";

export const metadata: Metadata = { title: "Page photos" };

export default async function PagePhotosPage() {
  await requireAdmin();
  const [current, gallery] = await Promise.all([getPagePhotos(), getGallery(true)]);
  const slots = (Object.keys(pagePhotoSlots) as PagePhotoSlot[]).map((key) => ({ key, ...pagePhotoSlots[key], current: current[key] }));

  return (
    <>
      <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">Page photos</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Photos on each page</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Tap a spot to choose which gallery photo appears there. Want a photo that isn’t in the gallery yet? Add it in{" "}
        <Link href="/admin/gallery" className="font-semibold text-brand hover:underline">
          Photo gallery
        </Link>{" "}
        first.
      </p>
      <div className="mt-6">
        <PhotoSlots slots={slots} gallery={gallery.map((p) => ({ id: p.id, src: p.src, title: p.title, published: p.published }))} />
      </div>
    </>
  );
}
