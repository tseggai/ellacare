"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { ActionState } from "../ui";

async function save(key: string, data: unknown): Promise<ActionState> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "error", message: "Database not configured." };
  const { error } = await supabase.from("site_settings").upsert({ key, data, updated_at: new Date().toISOString() });
  if (error) return { status: "error", message: error.message };
  // Every public page shows phone numbers/banner, so refresh the whole site.
  revalidatePath("/", "layout");
  return { status: "saved", message: "Saved. The website is updated." };
}

const phone = z.string().trim().regex(/^[\d\s()+.-]{7,20}$/, "Enter a phone number like (425) 776-4026.");

export async function saveBusiness(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z
    .object({
      main: phone,
      cell: phone,
      emergency: phone,
      fax: z.string().trim().max(20),
      street: z.string().trim().min(3).max(120),
      city: z.string().trim().min(2).max(60),
      region: z.string().trim().min(2).max(2).toUpperCase(),
      postalCode: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Enter a 5-digit ZIP code."),
      licenseNumber: z.string().trim().max(60),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." };
  const d = parsed.data;
  return save("business", {
    phones: { main: d.main, cell: d.cell, emergency: d.emergency, fax: d.fax },
    address: { street: d.street, city: d.city, region: d.region, postalCode: d.postalCode },
    licenseNumber: d.licenseNumber,
  });
}

export async function saveHome(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z
    .object({
      heroTitle: z.string().trim().min(5, "The headline is too short.").max(120, "Keep the headline under 120 characters."),
      heroIntro: z.string().trim().min(10).max(400, "Keep the intro under 400 characters."),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." };
  return save("home", parsed.data);
}

export async function saveBanner(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = z
    .object({
      enabled: z.coerce.boolean(),
      text: z.string().trim().max(160, "Keep the banner under 160 characters."),
      href: z
        .string()
        .trim()
        .max(300)
        .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), "Link must start with / or https://"),
    })
    .safeParse({ ...Object.fromEntries(formData), enabled: formData.get("enabled") === "on" });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." };
  if (parsed.data.enabled && !parsed.data.text) return { status: "error", message: "Add some text before turning the banner on." };
  return save("banner", parsed.data);
}
