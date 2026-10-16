"use client";

import { KeyRound, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { signInWithPassword, type LoginState } from "./actions";

const initial: LoginState = { status: "idle" };
const field =
  "block w-full rounded-2xl bg-paper px-4 py-3.5 text-lg ring-1 ring-line focus:bg-white focus:ring-2 focus:ring-brand focus:outline-none";

export function LoginForm() {
  const [state, action, pending] = useActionState(signInWithPassword, initial);
  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block font-semibold">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required autoFocus defaultValue={state.email} className={field} />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block font-semibold">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={field} />
      </div>
      {state.message && (
        <p role="alert" className="font-medium text-red-700">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <KeyRound className="h-4 w-4" aria-hidden />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-muted">Forgotten your password? Ask the office to reset it.</p>
    </form>
  );
}
