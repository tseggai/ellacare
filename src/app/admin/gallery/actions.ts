"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { galleryPublicUrl } from "@/lib/content";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { ActionState } from "../ui";

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

function refresh() {
  for (const p of ["/", "/residences", "/admin/gallery"]) revalidatePath(p);
}

const meta = z.object({
  title: z.string().trim().min(1, "Give the photo a short name.").max(120),
  category: z.string().trim().min(1, "Choose a category.").max(60),
  published: z.boolean(),
});

export async function uploadPhoto(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { status: "error", message: "Choose a photo to upload." };
  const ext = TYPES[file.type];
  if (!ext) return { status: "error", message: "Please upload a JPG, PNG or WebP image." };
  if (file.size > MAX_BYTES) return { status: "error", message: "That file is over 10 MB. Please use a smaller image." };

  const raw = Object.fromEntries(formData);
  const parsed = meta.safeParse({ ...raw, published: raw.published === "on" });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "error", message: "Database not configured." };

  // New photos go to the end of the gallery.
  const { data: last } = await supabase.from("gallery_photos").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const sort_order = (last?.sort_order ?? 0) + 10;

  const slug = parsed.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) || "photo";
  const path = `${Date.now()}-${slug}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("gallery")
    .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, cacheControl: "31536000" });
  if (upErr) return { status: "error", message: `Upload failed: ${upErr.message}` };

  const { error } = await supabase
    .from("gallery_photos")
    .insert({ ...parsed.data, sort_order, src: galleryPublicUrl(path), storage_path: path });
  if (error) {
    await supabase.storage.from("gallery").remove([path]);
    return { status: "error", message: error.message };
  }
  refresh();
  return { status: "saved", message: "Photo added." };
}

export async function savePhoto(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = meta.extend({ id: z.string().uuid() }).safeParse({ ...raw, published: raw.published === "on" });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "error", message: "Database not configured." };
  const { id, ...row } = parsed.data;
  const { error } = await supabase.from("gallery_photos").update(row).eq("id", id);
  if (error) return { status: "error", message: error.message };
  refresh();
  return { status: "saved", message: "Saved." };
}

export async function deletePhoto(id: string): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) return { status: "error", message: "Unknown photo." };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "error", message: "Database not configured." };
  const { data } = await supabase.from("gallery_photos").select("storage_path").eq("id", parsed.data).maybeSingle();
  const { error } = await supabase.from("gallery_photos").delete().eq("id", parsed.data);
  if (error) return { status: "error", message: error.message };
  if (data?.storage_path) await supabase.storage.from("gallery").remove([data.storage_path]);
  refresh();
  return { status: "saved", message: "Photo deleted." };
}

// Persist a drag-and-drop order: position in the list becomes the sort order.
export async function reorderPhotos(ids: string[]): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.array(z.string().uuid()).max(500).safeParse(ids);
  if (!parsed.success) return { status: "error", message: "Could not save the order." };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "error", message: "Database not configured." };
  const results = await Promise.all(
    parsed.data.map((id, i) => supabase.from("gallery_photos").update({ sort_order: (i + 1) * 10 }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { status: "error", message: failed.error.message };
  refresh();
  return { status: "saved", message: "Order saved." };
}
