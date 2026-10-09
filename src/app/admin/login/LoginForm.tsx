"use client";

import { Loader2, MailCheck } from "lucide-react";
import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "./actions";

const initial: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(sendMagicLink, initial);

  if (state.status === "sent") {
    return (
      <div role="status" className="mt-8 flex gap-3 rounded-2xl bg-sky-tint p-5">
        <MailCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand" aria-hidden />
        <div>
          <p className="font-semibold">Check your email</p>
          <p className="mt-1 text-muted">{state.message} The link works once and expires after an hour.</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          className="block w-full rounded-2xl bg-paper px-4 py-3.5 text-lg ring-1 ring-line focus:bg-white focus:ring-2 focus:ring-brand focus:outline-none"
        />
      </div>
      {state.status === "error" && (
        <p role="alert" className="font-medium text-red-700">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
