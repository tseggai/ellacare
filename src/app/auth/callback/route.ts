import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient, isAdminEmail } from "@/lib/admin";

// Magic-link landing: exchanges the code in the email link for a session cookie.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";

  const supabase = await createAuthClient();
  if (!code || !supabase) return NextResponse.redirect(`${origin}/admin/login?error=link`);

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/admin/login?error=link`);

  if (!isAdminEmail(data.user?.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/admin/login?error=denied`);
  }
  return NextResponse.redirect(`${origin}${safeNext}`);
}
