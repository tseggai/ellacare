import "server-only";
import { galleryPublicUrl } from "@/lib/content";
import { getSupabaseAdmin } from "@/lib/supabase";

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export type StoredPhoto = { id: string; src: string };

// Upload an image to the gallery bucket and add a gallery_photos row for it.
// Shared by the Photo gallery and Page photos admin pages.
export async function storeGalleryPhoto(opts: {
  file: unknown;
  title: string;
  category: string;
  published: boolean;
}): Promise<{ ok: true; photo: StoredPhoto } | { ok: false; message: string }> {
  const { file } = opts;
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose a photo to upload." };
  const ext = TYPES[file.type];
  if (!ext) return { ok: false, message: "Please upload a JPG, PNG or WebP image." };
  if (file.size > MAX_BYTES) return { ok: false, message: "That file is over 10 MB. Please use a smaller image." };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, message: "Database not configured." };

  // New photos go to the end of the gallery.
  const { data: last } = await supabase.from("gallery_photos").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const sort_order = (last?.sort_order ?? 0) + 10;

  const slug = opts.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) || "photo";
  const path = `${Date.now()}-${slug}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("gallery")
    .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, cacheControl: "31536000" });
  if (upErr) return { ok: false, message: `Upload failed: ${upErr.message}` };

  const src = galleryPublicUrl(path);
  const { data, error } = await supabase
    .from("gallery_photos")
    .insert({ title: opts.title, category: opts.category, published: opts.published, sort_order, src, storage_path: path })
    .select("id")
    .single();
  if (error || !data) {
    await supabase.storage.from("gallery").remove([path]);
    return { ok: false, message: error?.message ?? "Could not save the photo." };
  }
  return { ok: true, photo: { id: data.id as string, src } };
}
