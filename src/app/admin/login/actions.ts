"use server";

import { headers } from "next/headers";
import { createAuthClient, isAdminEmail } from "@/lib/admin";

export type LoginState = { status: "idle" | "sent" | "error"; message?: string };

export async function sendMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email.includes("@")) return { status: "error", message: "Please enter your email address." };

  // Same reply whether or not the address is allowed, so the list can't be probed.
  const sent: LoginState = { status: "sent", message: `If ${email} is a staff address, a sign-in link is on its way.` };
  if (!isAdminEmail(email)) return sent;

  const supabase = await createAuthClient();
  if (!supabase) return { status: "error", message: "Sign-in isn’t configured yet (missing SUPABASE_PUBLISHABLE_KEY)." };

  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/admin`, shouldCreateUser: true },
  });
  if (error) {
    console.error("Magic link failed:", error.message);
    return { status: "error", message: "Couldn’t send the link right now. Please try again in a few minutes." };
  }
  return sent;
}
