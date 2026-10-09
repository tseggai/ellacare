"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { ActionState } from "../ui";

function refresh() {
  for (const p of ["/", "/admin/faqs"]) revalidatePath(p);
}

export async function saveFaq(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = z
    .object({
      id: z.string().uuid().optional(),
      question: z.string().trim().min(3, "Question is too short.").max(300),
      answer: z.string().trim().min(3, "Answer is too short.").max(3000),
      sort_order: z.coerce.number().int().min(0).max(10000).default(100),
      published: z.boolean(),
    })
    .safeParse({ ...raw, id: raw.id || undefined, published: raw.published === "on" });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "error", message: "Database not configured." };
  const { id, ...row } = parsed.data;
  const { error } = id ? await supabase.from("faqs").update(row).eq("id", id) : await supabase.from("faqs").insert(row);
  if (error) return { status: "error", message: error.message };
  refresh();
  return { status: "saved", message: id ? "Saved." : "Added." };
}

export async function deleteFaq(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  await supabase.from("faqs").delete().eq("id", id.data);
  refresh();
}
