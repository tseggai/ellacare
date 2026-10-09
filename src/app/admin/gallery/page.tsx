import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { getGallery } from "@/lib/content";
import { PhotoCard, UploadForm } from "./PhotoForms";

export const metadata: Metadata = { title: "Photo gallery" };

const defaultCategories = ["Sleeping", "Bathing", "Eating & cooking", "Relaxing", "Outdoors"];

export default async function GalleryAdminPage() {
  await requireAdmin();
  const photos = await getGallery(true);
  const categories = Array.from(new Set([...photos.map((p) => p.category), ...defaultCategories]));

  return (
    <>
      <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">Photo gallery</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Photos of the home</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Shown on the “Our Home” page and in the home-page photo strip, in the order below. Landscape photos around
        1600×1200 look best.
      </p>

      <section className="card mt-8 p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold">Add a photo</h2>
        <UploadForm categories={categories} />
      </section>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {photos.map((p) => (
          <PhotoCard key={p.id} photo={p} categories={categories} />
        ))}
      </ul>
    </>
  );
}
