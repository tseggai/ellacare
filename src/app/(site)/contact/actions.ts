"use server";

import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";

const schema = z
  .object({
    type: z.enum(["tour", "question", "callback"]),
    name: z.string().trim().min(1, "Please enter your name.").max(200),
    email: z.string().trim().email("Please enter a valid email address.").max(320).optional(),
    phone: z.string().trim().max(40).optional(),
    relationship: z.string().trim().max(100).optional(),
    preferred_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    care_needs: z.string().trim().max(2000).optional(),
    message: z.string().trim().max(5000).optional(),
  })
  .superRefine((data, ctx) => {
    // A callback needs a phone number; tours and questions need an email.
    if (data.type === "callback") {
      if ((data.phone?.replace(/\D/g, "").length ?? 0) < 7) {
        ctx.addIssue({ code: "custom", path: ["phone"], message: "Please enter a phone number we can call." });
      }
    } else if (!data.email) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "Please enter your email address." });
    }
  });

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  // Echoed back so the form can repopulate after React resets it.
  values?: Record<string, string>;
};

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Honeypot: real visitors never see or fill this field.
  if (formData.get("company")) return { status: "success" };

  const raw: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && value.trim() !== "") raw[key] = value;
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors, values: raw };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("Inquiry not saved: SUPABASE_URL / SUPABASE_SECRET_KEY are not set.");
    return {
      status: "error",
      message: "Sorry, our form is temporarily unavailable. Please call us instead.",
      values: raw,
    };
  }

  const { error } = await supabase.from("inquiries").insert(parsed.data);
  if (error) {
    console.error("Inquiry insert failed:", error.message);
    return {
      status: "error",
      message: "Sorry, something went wrong. Please try again or call us.",
      values: raw,
    };
  }

  await notify(parsed.data).catch((err) => console.error("Inquiry email failed:", err));

  return { status: "success" };
}

async function notify(data: z.infer<typeof schema>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const lines = Object.entries(data).map(([k, v]) => `${k}: ${v}`);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.INQUIRY_FROM_EMAIL ?? "EllaCare Website <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      ...(data.email && { reply_to: data.email }),
      subject: `New ${{ tour: "tour request", question: "question", callback: "callback request" }[data.type]} from ${data.name}`,
      text: lines.join("\n"),
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}
