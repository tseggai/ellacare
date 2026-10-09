"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  id: z.string().uuid().optional(),
  author: z.string().trim().min(1, "Name is required.").max(120),
  relation: z.string().trim().max(120).optional(),
  quote: z.string().trim().min(10, "The quote needs at least a sentence.").max(3000),
  highlight: z.string().trim().max(160).optional(),
  sort_order: z.coerce.number().int().min(0).max(10000).default(100),
  published: z.coerce.boolean(),
});

export type SaveState = { status: "idle" | "saved" | "error"; message?: string };

function refresh() {
  for (const p of ["/", "/testimonials", "/admin/testimonials"]) revalidatePath(p);
}

export async function saveTestimonial(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse({ ...raw, published: raw.published === "on", id: raw.id || undefined });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "error", message: "Database not configured." };

  const { id, ...values } = parsed.data;
  const row = { ...values, relation: values.relation || null, highlight: values.highlight || null };
  const { error } = id
    ? await supabase.from("testimonials").update(row).eq("id", id)
    : await supabase.from("testimonials").insert(row);
  if (error) return { status: "error", message: error.message };
  refresh();
  return { status: "saved", message: id ? "Saved." : "Added." };
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  await supabase.from("testimonials").delete().eq("id", id.data);
  refresh();
}
