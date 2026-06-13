"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="text-[13px] font-medium uppercase tracking-[0.1em]">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none focus:border-sage-deep"
          placeholder="Enter the owner password"
        />
      </label>
      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-rose/40 bg-rose/10 px-4 py-3 text-[15px] text-rose"
        >
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ink px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-paper hover:bg-sage-deep disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
