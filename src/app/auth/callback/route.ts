import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient, isAdminEmail } from "@/lib/admin";

// Landing page for sign-in links. Supports two link styles:
//  - token_hash links (from the custom email template): work from any device
//  - PKCE `code` links (Supabase's default template): only in the requesting browser
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/admin";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
  const fail = (reason: string) => NextResponse.redirect(`${origin}/admin/login?error=${reason}`);

  const supabase = await createAuthClient();
  if (!supabase) return fail("link");

  const tokenHash = searchParams.get("token_hash");
  const type = (searchParams.get("type") ?? "email") as EmailOtpType;
  const code = searchParams.get("code");

  const result = tokenHash
    ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    : code
      ? await supabase.auth.exchangeCodeForSession(code)
      : null;
  if (!result || result.error || !result.data.user) return fail("link");

  if (!isAdminEmail(result.data.user.email)) {
    await supabase.auth.signOut();
    return fail("denied");
  }
  return NextResponse.redirect(`${origin}${safeNext}`);
}
