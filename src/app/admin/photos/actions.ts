"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { getGallery, pagePhotoSlots, type PagePhotoSlot } from "@/lib/content";
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
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "error", message: "Database not configured." };
  const { data: row } = await supabase.from("site_settings").select("data").eq("key", "page_photos").maybeSingle();
  const next = { ...((row?.data as Record<string, string>) ?? {}), [parsed.data.slot]: parsed.data.src };
  const { error } = await supabase.from("site_settings").upsert({ key: "page_photos", data: next, updated_at: new Date().toISOString() });
  if (error) return { status: "error", message: error.message };
  for (const p of ["/", "/about", "/services", "/dining", "/activities", "/admin/photos"]) revalidatePath(p);
  revalidatePath("/opengraph-image");
  return { status: "saved", message: "Saved." };
}
