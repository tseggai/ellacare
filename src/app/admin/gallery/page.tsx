import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getGallery } from "@/lib/content";
import { GalleryManager } from "./GalleryManager";

export const metadata: Metadata = { title: "Photo gallery" };

// Standard areas for an adult family home; the team can add more from the form.
const standardCategories = ["Sleeping", "Bathing", "Relaxing", "Eating & cooking", "Outdoors", "Activities", "Safety & accessibility"];

export default async function GalleryAdminPage() {
  await requireAdmin();
  const photos = await getGallery(true);
  const categories = Array.from(new Set([...standardCategories, ...photos.map((p) => p.category)]));

  return (
    <>
      <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">Photo gallery</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Photos of the home</h1>
      <p className="mt-2 max-w-2xl text-muted">
        These appear on the “Our Home” page and the home-page photo strip, in the order shown. Drag a photo to reorder; tap one to edit.
      </p>
      <div className="mt-6">
        <GalleryManager photos={photos} categories={categories} />
      </div>
    </>
  );
}
