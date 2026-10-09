"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthClient, isAdminEmail } from "@/lib/admin";

export type LoginState = { status: "idle" | "sent" | "error"; email?: string; message?: string };

export async function sendCode(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email.includes("@")) return { status: "error", message: "Please enter your email address." };

  // Same reply whether or not the address is allowed, so the list can't be probed.
  const sent: LoginState = { status: "sent", email };
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
    console.error("Sign-in email failed:", error.message);
    const limited = /rate|limit/i.test(error.message);
    return {
      status: "error",
      message: limited
        ? "Too many sign-in emails in the last hour. Please wait a little and try again."
        : "Couldn’t send the email right now. Please try again in a few minutes.",
    };
  }
  return sent;
}

// The 6-digit code from the email works from any device, unlike a link, which
// must be opened in the browser that requested it.
export async function verifyCode(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const token = String(formData.get("token") ?? "").replace(/\D/g, "");
  const back: LoginState = { status: "sent", email };
  if (token.length < 6) return { ...back, message: "Enter the 6-digit code from the email." };

  const supabase = await createAuthClient();
  if (!supabase) return { status: "error", message: "Sign-in isn’t configured yet." };

  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error || !data.user) return { ...back, message: "That code is wrong or has expired. Request a new one." };
  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { status: "error", message: "That email address isn’t on the staff list." };
  }
  redirect("/admin");
}
