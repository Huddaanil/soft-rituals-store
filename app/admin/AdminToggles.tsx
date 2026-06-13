"use client";

import { useState, useTransition } from "react";
import { setProductActive } from "./actions";

export function ActiveToggle({
  slug,
  active,
}: {
  slug: string;
  active: boolean;
}) {
  const [on, setOn] = useState(active);
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const next = !on;
          setOn(next);
          try {
            await setProductActive(slug, next);
          } catch {
            setOn(!next); // revert on failure
          }
        })
      }
      aria-pressed={on}
      title={on ? "Showing in shop — click to hide" : "Hidden — click to show"}
      className={`hidden shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-[13px] font-medium sm:inline-flex ${
        on
          ? "border-sage/50 text-sage-deep"
          : "border-line text-ink-soft"
      } disabled:opacity-50`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-2.5 w-2.5 rounded-full ${
          on ? "bg-sage-deep" : "bg-ink/30"
        }`}
      />
      {on ? "Visible" : "Hidden"}
    </button>
  );
}
