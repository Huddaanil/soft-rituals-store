"use client";

import { useState, useTransition } from "react";
import { deleteProduct } from "./actions";

export default function DeleteProductButton({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm font-medium text-rose underline underline-offset-2 hover:text-ink"
      >
        Remove this product
      </button>
    );
  }

  return (
    <span className="flex items-center gap-3 text-sm">
      <span className="text-ink-soft">Remove “{name}” for good?</span>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => deleteProduct(slug))}
        className="rounded-full bg-rose px-4 py-2 font-semibold text-paper hover:opacity-90 disabled:opacity-60"
        data-testid="confirm-delete"
      >
        {pending ? "Removing…" : "Yes, remove"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-full border border-line px-4 py-2 hover:bg-paper-2"
      >
        Keep it
      </button>
    </span>
  );
}
