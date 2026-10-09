import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getAdminUser } from "@/lib/admin";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Staff sign-in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getAdminUser()) redirect("/admin/inquiries");
  const { error } = await searchParams;
  const notice =
    error === "denied"
      ? "That email address isn’t on the staff list."
      : error === "link"
        ? "That sign-in link has expired or was already used. Request a new one."
        : null;

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <Logo className="w-36" />
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">Staff sign-in</h1>
        <p className="mt-2 text-muted">Enter your work email and we’ll send you a one-time sign-in link.</p>
        {notice && (
          <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 font-medium text-red-800">
            {notice}
          </p>
        )}
        <LoginForm />
      </div>
    </section>
  );
}
