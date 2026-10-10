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
      question: z.string().trim().min(3, "The question is too short.").max(300),
      answer: z.string().trim().min(3, "The answer is too short.").max(3000),
      published: z.boolean(),
    })
    .safeParse({ ...raw, id: raw.id || undefined, published: raw.published === "on" });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "error", message: "Database not configured." };
  const { id, ...row } = parsed.data;
  if (id) {
    const { error } = await supabase.from("faqs").update(row).eq("id", id);
    if (error) return { status: "error", message: error.message };
  } else {
    // New questions go to the end of the list.
    const { data: last } = await supabase.from("faqs").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const { error } = await supabase.from("faqs").insert({ ...row, sort_order: (last?.sort_order ?? 0) + 10 });
    if (error) return { status: "error", message: error.message };
  }
  refresh();
  return { status: "saved", message: id ? "Saved." : "Question added." };
}

export async function deleteFaq(id: string): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) return { status: "error", message: "Unknown question." };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "error", message: "Database not configured." };
  const { error } = await supabase.from("faqs").delete().eq("id", parsed.data);
  if (error) return { status: "error", message: error.message };
  refresh();
  return { status: "saved", message: "Question deleted." };
}

// Persist a drag-and-drop order: position in the list becomes the sort order.
export async function reorderFaqs(ids: string[]): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.array(z.string().uuid()).max(500).safeParse(ids);
  if (!parsed.success) return { status: "error", message: "Could not save the order." };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "error", message: "Database not configured." };
  const results = await Promise.all(parsed.data.map((id, i) => supabase.from("faqs").update({ sort_order: (i + 1) * 10 }).eq("id", id)));
  const failed = results.find((r) => r.error);
  if (failed?.error) return { status: "error", message: failed.error.message };
  refresh();
  return { status: "saved", message: "Order saved." };
}
