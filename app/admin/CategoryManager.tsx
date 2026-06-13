"use client";

import { useActionState } from "react";
import { saveCategory, type FormState } from "./actions";

export default function CategoryManager({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    saveCategory,
    {}
  );

  return (
    <div className="mt-5 grid gap-6 lg:grid-cols-2">
      <ul className="flex flex-wrap gap-2 self-start">
        {categories.map((c) => (
          <li
            key={c.slug}
            className="rounded-full border border-line bg-paper-2/60 px-4 py-2 text-sm"
          >
            {c.name}
          </li>
        ))}
      </ul>

      <form
        action={formAction}
        className="rounded-xl border border-line p-5"
      >
        <h3 className="font-medium">Add a new section</h3>
        <label className="mt-3 block">
          <span className="text-[13px] text-ink-soft">Section name</span>
          <input
            name="name"
            required
            placeholder="e.g. Bath & Body"
            className="mt-1 w-full rounded-lg border border-line bg-white px-4 py-2.5 outline-none focus:border-sage-deep"
          />
        </label>
        <label className="mt-3 block">
          <span className="text-[13px] text-ink-soft">
            Short line under the title (optional)
          </span>
          <input
            name="blurb"
            placeholder="e.g. Gentle care, made by hand."
            className="mt-1 w-full rounded-lg border border-line bg-white px-4 py-2.5 outline-none focus:border-sage-deep"
          />
        </label>
        {state?.error && (
          <p role="alert" className="mt-3 text-[14px] text-rose">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="mt-4 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-paper hover:bg-sage-deep disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add section"}
        </button>
      </form>
    </div>
  );
}
