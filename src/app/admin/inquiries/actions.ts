"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";

import { STATUSES, type Status } from "./status";

export async function setInquiryStatus(id: string, status: Status) {
  await requireAdmin();
  const parsed = z.object({ id: z.string().uuid(), status: z.enum(STATUSES) }).safeParse({ id, status });
  if (!parsed.success) return { ok: false as const, message: "Invalid request." };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false as const, message: "Database not configured." };
  const { error } = await supabase
    .from("inquiries")
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.id);
  if (error) return { ok: false as const, message: error.message };
  revalidatePath("/admin/inquiries");
  return { ok: true as const };
}

export async function saveInquiryNotes(formData: FormData) {
  await requireAdmin();
  const parsed = z
    .object({ id: z.string().uuid(), notes: z.string().trim().max(5000) })
    .safeParse({ id: formData.get("id"), notes: formData.get("notes") ?? "" });
  if (!parsed.success) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  await supabase
    .from("inquiries")
    .update({ notes: parsed.data.notes || null, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.id);
  revalidatePath("/admin/inquiries");
}
