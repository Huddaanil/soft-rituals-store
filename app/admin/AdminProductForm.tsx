"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProduct, type FormState } from "./actions";
import type { AdminProductRow } from "@/lib/supabaseAdmin";

const field =
  "mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-sage-deep";
const label = "block";
const labelText = "text-[13px] font-medium text-ink-soft";

export default function AdminProductForm({
  product,
  categories,
  isNew,
}: {
  product: AdminProductRow | null;
  categories: { slug: string; name: string }[];
  isNew: boolean;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    saveProduct,
    {}
  );
  const [preview, setPreview] = useState<string | null>(product?.image ?? null);

  return (
    <form action={formAction} className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
      <input type="hidden" name="isNew" value={isNew ? "1" : "0"} />
      {!isNew && <input type="hidden" name="slug" value={product?.slug} />}

      {/* Photo column */}
      <div>
        <span className={labelText}>Photo</span>
        <div className="relative mt-1.5 aspect-square overflow-hidden rounded-xl border border-line bg-paper-2">
          {preview ? (
            <Image src={preview} alt="" fill sizes="280px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-sm text-ink-soft">
              No photo yet
            </span>
          )}
        </div>
        <label className="mt-3 block">
          <span className="text-[13px] text-ink-soft">
            {isNew ? "Upload a photo from your phone" : "Replace the photo (optional)"}
          </span>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
            className="mt-1.5 block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-paper"
          />
        </label>
      </div>

      {/* Fields column */}
      <div className="space-y-5">
        <label className={label}>
          <span className={labelText}>Name</span>
          <input name="name" required defaultValue={product?.name ?? ""} className={field} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={label}>
            <span className={labelText}>Price (MT)</span>
            <input
              name="price"
              type="number"
              min="0"
              step="1"
              required
              inputMode="numeric"
              defaultValue={product?.price ?? ""}
              className={field}
            />
          </label>
          <label className={label}>
            <span className={labelText}>Section</span>
            <select
              name="category"
              required
              defaultValue={product?.category ?? categories[0]?.slug ?? ""}
              className={field}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={label}>
          <span className={labelText}>Short line (shown on the shop card)</span>
          <input name="short" defaultValue={product?.short ?? ""} className={field} />
        </label>

        <label className={label}>
          <span className={labelText}>
            Story — one paragraph per line
          </span>
          <textarea
            name="story"
            rows={4}
            defaultValue={(product?.story ?? []).join("\n")}
            className={field}
          />
        </label>

        <label className={label}>
          <span className={labelText}>Details — one per line</span>
          <textarea
            name="notes"
            rows={3}
            defaultValue={(product?.notes ?? []).join("\n")}
            className={field}
          />
        </label>

        <label className={label}>
          <span className={labelText}>Photo description (for accessibility)</span>
          <input name="alt" defaultValue={product?.alt ?? ""} className={field} />
        </label>

        <fieldset className="rounded-xl border border-sage/40 bg-sage/5 p-5">
          <legend className="px-2 text-sm font-semibold text-sage-deep">
            🇵🇹 Português (what Portuguese visitors see)
          </legend>
          <p className="mb-3 text-[13px] text-ink-soft">
            Leave any field empty and the English version is shown instead.
          </p>
          <label className={label}>
            <span className={labelText}>Nome</span>
            <input name="name_pt" defaultValue={product?.name_pt ?? ""} className={field} />
          </label>
          <label className="mt-3 block">
            <span className={labelText}>Frase curta (no cartão da loja)</span>
            <input name="short_pt" defaultValue={product?.short_pt ?? ""} className={field} />
          </label>
          <label className="mt-3 block">
            <span className={labelText}>História — um parágrafo por linha</span>
            <textarea
              name="story_pt"
              rows={4}
              defaultValue={(product?.story_pt ?? []).join("\n")}
              className={field}
            />
          </label>
          <label className="mt-3 block">
            <span className={labelText}>Detalhes — um por linha</span>
            <textarea
              name="notes_pt"
              rows={3}
              defaultValue={(product?.notes_pt ?? []).join("\n")}
              className={field}
            />
          </label>
          <label className="mt-3 block">
            <span className={labelText}>Descrição da foto</span>
            <input name="alt_pt" defaultValue={product?.alt_pt ?? ""} className={field} />
          </label>
        </fieldset>

        <details className="rounded-lg border border-line p-4">
          <summary className="cursor-pointer text-sm font-medium">
            Search engine text (optional)
          </summary>
          <label className="mt-3 block">
            <span className={labelText}>SEO title</span>
            <input name="seoTitle" defaultValue={product?.seo_title ?? ""} className={field} />
          </label>
          <label className="mt-3 block">
            <span className={labelText}>SEO description</span>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={product?.seo_description ?? ""}
              className={field}
            />
          </label>
          <label className="mt-3 block">
            <span className={labelText}>SEO título (PT)</span>
            <input name="seoTitle_pt" defaultValue={product?.seo_title_pt ?? ""} className={field} />
          </label>
          <label className="mt-3 block">
            <span className={labelText}>SEO descrição (PT)</span>
            <textarea
              name="seoDescription_pt"
              rows={2}
              defaultValue={product?.seo_description_pt ?? ""}
              className={field}
            />
          </label>
        </details>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              defaultChecked={product?.active ?? true}
              className="h-4 w-4"
            />
            <span className="text-sm">Show in shop</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="h-4 w-4"
            />
            <span className="text-sm">Feature on the home page</span>
          </label>
        </div>

        {state?.error && (
          <p
            role="alert"
            className="rounded-lg border border-rose/40 bg-rose/10 px-4 py-3 text-[15px] text-rose"
          >
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ink px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-paper hover:bg-sage-deep disabled:opacity-60"
          >
            {pending ? "Saving…" : isNew ? "Add product" : "Save changes"}
          </button>
          <Link
            href="/admin"
            className="rounded-full border border-line px-6 py-3.5 text-sm font-medium hover:bg-paper-2"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
