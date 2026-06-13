"use client";

import { useActionState, useState, useTransition } from "react";
import { saveCategory, deleteCategory, type FormState } from "./actions";

function CategoryChip({ slug, name }: { slug: string; name: string }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  return (
    <li className="flex items-center gap-2 rounded-full border border-line bg-paper-2/60 py-2 pl-4 pr-2 text-sm">
      <span>{name}</span>
      <button
        type="button"
        aria-label={`Remove the ${name} section`}
        title={err ?? "Remove this section"}
        disabled={pending}
        onClick={() => {
          setErr(null);
          start(async () => {
            try {
              await deleteCategory(slug);
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Could not remove.");
            }
          });
        }}
        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
          err ? "bg-rose text-paper" : "bg-ink/10 text-ink-soft hover:bg-ink hover:text-paper"
        } disabled:opacity-50`}
      >
        ×
      </button>
    </li>
  );
}

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
          <CategoryChip key={c.slug} slug={c.slug} name={c.name} />
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
        <div className="mt-3 grid gap-3 rounded-lg border border-sage/40 bg-sage/5 p-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-[13px] text-sage-deep">🇵🇹 Nome (PT)</span>
            <input
              name="name_pt"
              placeholder="ex. Banho & Corpo"
              className="mt-1 w-full rounded-lg border border-line bg-white px-4 py-2.5 outline-none focus:border-sage-deep"
            />
          </label>
          <label className="block">
            <span className="text-[13px] text-sage-deep">🇵🇹 Frase (PT)</span>
            <input
              name="blurb_pt"
              placeholder="ex. Cuidado suave, feito à mão."
              className="mt-1 w-full rounded-lg border border-line bg-white px-4 py-2.5 outline-none focus:border-sage-deep"
            />
          </label>
        </div>
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
