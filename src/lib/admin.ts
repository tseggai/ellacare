import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Who may sign in to /admin. Override with ADMIN_EMAILS="a@x.com,b@y.com".
const DEFAULT_ADMINS = ["tseggai@gmail.com", "besra@ellacare.com"];

export function adminEmails(): string[] {
  const env = process.env.ADMIN_EMAILS;
  const list = env ? env.split(",") : DEFAULT_ADMINS;
  return list.map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email: string | undefined | null) {
  return !!email && adminEmails().includes(email.toLowerCase());
}

export function authConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}

// Cookie-backed Supabase client for the signed-in staff member (publishable key,
// so it can only do what Supabase Auth allows that user to do).
export async function createAuthClient() {
  const cfg = authConfig();
  if (!cfg) return null;
  const cookieStore = await cookies();
  return createServerClient(cfg.url, cfg.key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: cookies are refreshed by src/proxy.ts instead.
        }
      },
    },
  });
}

export type AdminUser = { id: string; email: string };

// The signed-in user, only if their email is on the allow list.
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createAuthClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;
  return data.user && isAdminEmail(email) ? { id: data.user.id, email: email! } : null;
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
