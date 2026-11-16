"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { getGallery, pagePhotoSlots, type PagePhotoSlot } from "@/lib/content";
import { storeGalleryPhoto } from "@/lib/gallery-upload";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { ActionState } from "../ui";

const slotKeys = Object.keys(pagePhotoSlots) as [PagePhotoSlot, ...PagePhotoSlot[]];

// Point one spot on the site at a gallery photo (or "" to go back to the default).
export async function setPagePhoto(slot: PagePhotoSlot, src: string): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.object({ slot: z.enum(slotKeys), src: z.string().max(1000) }).safeParse({ slot, src });
  if (!parsed.success) return { status: "error", message: "Unknown photo spot." };
  if (parsed.data.src) {
    const gallery = await getGallery(true);
    if (!gallery.some((p) => p.src === parsed.data.src)) return { status: "error", message: "Choose a photo from the gallery." };
  }
  return assign(parsed.data.slot, parsed.data.src);
}

// Upload a brand-new photo and use it for this spot. It joins the gallery as a
// hidden photo, so it doesn't appear on "Our Home" unless staff publish it there.
export async function uploadPagePhoto(slot: PagePhotoSlot, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.enum(slotKeys).safeParse(slot);
  if (!parsed.success) return { status: "error", message: "Unknown photo spot." };
  const res = await storeGalleryPhoto({
    file: formData.get("file"),
    title: pagePhotoSlots[parsed.data].label,
    category: "Page photos",
    published: false,
  });
  if (!res.ok) return { status: "error", message: res.message };
  revalidatePath("/admin/gallery");
  return assign(parsed.data, res.photo.src);
}

async function assign(slot: PagePhotoSlot, src: string): Promise<ActionState> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "error", message: "Database not configured." };
  const { data: row } = await supabase.from("site_settings").select("data").eq("key", "page_photos").maybeSingle();
  const next = { ...((row?.data as Record<string, string>) ?? {}), [slot]: src };
  const { error } = await supabase.from("site_settings").upsert({ key: "page_photos", data: next, updated_at: new Date().toISOString() });
  if (error) return { status: "error", message: error.message };
  for (const p of ["/", "/about", "/services", "/dining", "/activities", "/admin/photos"]) revalidatePath(p);
  revalidatePath("/opengraph-image");
  return { status: "saved", message: "Saved." };
}
