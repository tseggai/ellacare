"use client";

import { Loader2, MailCheck } from "lucide-react";
import { useActionState } from "react";
import { sendCode, verifyCode, type LoginState } from "./actions";

const initial: LoginState = { status: "idle" };
const field =
  "block w-full rounded-2xl bg-paper px-4 py-3.5 text-lg ring-1 ring-line focus:bg-white focus:ring-2 focus:ring-brand focus:outline-none";

export function LoginForm() {
  const [sendState, sendAction, sending] = useActionState(sendCode, initial);
  const [verifyState, verifyAction, verifying] = useActionState(verifyCode, initial);

  // Once a code has been requested, show the code form (verify errors keep it open).
  const email = verifyState.email ?? sendState.email;
  if (email && sendState.status === "sent" && verifyState.status !== "error") {
    return (
      <div className="mt-8">
        <div role="status" className="flex gap-3 rounded-2xl bg-sky-tint p-5">
          <MailCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand" aria-hidden />
          <div>
            <p className="font-semibold">Check your email</p>
            <p className="mt-1 text-muted">
              If <strong>{email}</strong> is a staff address, we’ve sent a 6-digit code. Enter it below, or tap the link
              in the email on this device.
            </p>
          </div>
        </div>
        <form action={verifyAction} className="mt-5 space-y-4">
          <input type="hidden" name="email" value={email} />
          <div>
            <label htmlFor="token" className="mb-2 block font-semibold">
              6-digit code
            </label>
            <input
              id="token"
              name="token"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={8}
              required
              autoFocus
              placeholder="123456"
              className={`${field} text-center text-2xl tracking-[0.4em]`}
            />
          </div>
          {verifyState.message && (
            <p role="alert" className="font-medium text-red-700">
              {verifyState.message}
            </p>
          )}
          <button type="submit" disabled={verifying} className="btn-primary w-full disabled:opacity-60">
            {verifying && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {verifying ? "Checking…" : "Sign in"}
          </button>
        </form>
        <form action={sendAction} className="mt-4 text-center">
          <input type="hidden" name="email" value={email} />
          <button type="submit" disabled={sending} className="text-sm font-semibold text-brand hover:underline disabled:opacity-60">
            {sending ? "Sending…" : "Send a new code"}
          </button>
        </form>
      </div>
    );
  }

  const error = verifyState.status === "error" ? verifyState.message : sendState.status === "error" ? sendState.message : null;

  return (
    <form action={sendAction} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block font-semibold">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required autoFocus defaultValue={email} className={field} />
      </div>
      {error && (
        <p role="alert" className="font-medium text-red-700">
          {error}
        </p>
      )}
      <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
        {sending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {sending ? "Sending…" : "Email me a sign-in code"}
      </button>
    </form>
  );
}
