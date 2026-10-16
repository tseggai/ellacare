"use server";

import { redirect } from "next/navigation";
import { createAuthClient, isAdminEmail } from "@/lib/admin";

export type LoginState = { status: "idle" | "error"; email?: string; message?: string };

// Staff sign in with email + password. Passwords are issued in the Supabase
// dashboard (Authentication → Users); only allow-listed addresses can sign in.
export async function signInWithPassword(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const back: LoginState = { status: "idle", email };
  if (!email.includes("@") || password.length === 0) return { ...back, message: "Enter your email and password." };

  // Same reply whether or not the address is allowed, so the list can't be probed.
  const wrong: LoginState = { ...back, message: "That email or password is incorrect." };
  if (!isAdminEmail(email)) return wrong;

  const supabase = await createAuthClient();
  if (!supabase) return { status: "error", message: "Sign-in isn’t configured yet (missing SUPABASE_PUBLISHABLE_KEY)." };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return wrong;
  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return wrong;
  }
  redirect("/admin");
}
