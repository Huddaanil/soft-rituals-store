import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { adminConfigured } from "@/lib/admin-auth";
import {
  adminListProducts,
  adminListCategories,
  type AdminProductRow,
} from "@/lib/supabaseAdmin";
import { logout } from "./login/actions";
import { formatMT } from "@/lib/format";
import CategoryManager from "./CategoryManager";
import { ActiveToggle } from "./AdminToggles";

export const metadata: Metadata = {
  title: "Owner panel",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ saved?: string }>;

export default async function AdminHome({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { saved } = await searchParams;

  if (!adminConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="font-display text-3xl">Owner panel not set up yet</h1>
        <p className="mt-4 text-ink-soft">
          The site owner needs to add two settings in Vercel
          (<code>ADMIN_PASSWORD</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>)
          before this panel can be used.
        </p>
      </div>
    );
  }

  let products: AdminProductRow[] = [];
  let categories: { slug: string; name: string }[] = [];
  let loadError = "";
  try {
    [products, categories] = await Promise.all([
      adminListProducts(),
      adminListCategories(),
    ]);
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Could not load the catalog.";
  }

  const byCategory = categories.map((c) => ({
    category: c,
    items: products.filter((p) => p.category === c.slug),
  }));
  const uncategorised = products.filter(
    (p) => !categories.some((c) => c.slug === p.category)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Owner panel</h1>
          <p className="mt-1 text-ink-soft">
            Manage your candles, soaps and sections. Changes go live within a
            minute.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-paper-2"
          >
            View shop
          </Link>
          <form action={logout}>
            <button className="rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-paper-2">
              Sign out
            </button>
          </form>
        </div>
      </div>

      {saved && (
        <p className="mt-6 rounded-lg border border-sage/40 bg-sage/10 px-4 py-3 text-[15px] text-sage-deep">
          Saved “{saved}”. It's live on the shop now.
        </p>
      )}
      {loadError && (
        <p className="mt-6 rounded-lg border border-rose/40 bg-rose/10 px-4 py-3 text-[15px] text-rose">
          {loadError}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/product/new"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-paper hover:bg-sage-deep"
        >
          + Add a product
        </Link>
      </div>

      {/* Products grouped by section */}
      <div className="mt-10 space-y-10">
        {byCategory.map(({ category, items }) => (
          <section key={category.slug}>
            <h2 className="font-display text-xl">
              {category.name}{" "}
              <span className="text-sm font-normal text-ink-soft">
                ({items.length})
              </span>
            </h2>
            <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
              {items.length === 0 && (
                <li className="px-4 py-5 text-sm text-ink-soft">
                  Nothing in this section yet.
                </li>
              )}
              {items.map((p) => (
                <ProductRow key={p.slug} p={p} />
              ))}
            </ul>
          </section>
        ))}

        {uncategorised.length > 0 && (
          <section>
            <h2 className="font-display text-xl text-rose">
              Needs a section ({uncategorised.length})
            </h2>
            <ul className="mt-4 divide-y divide-line rounded-xl border border-rose/30">
              {uncategorised.map((p) => (
                <ProductRow key={p.slug} p={p} />
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Sections manager */}
      <div className="mt-14">
        <h2 className="font-display text-2xl">Sections</h2>
        <p className="mt-1 text-ink-soft">
          These are the shelves your products sit on. Add a new one (e.g. a new
          soaps line) and it appears in the shop menu.
        </p>
        <CategoryManager
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        />
      </div>
    </div>
  );
}

function ProductRow({ p }: { p: AdminProductRow }) {
  return (
    <li className="flex items-center gap-4 px-4 py-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-paper-2">
        <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{p.name}</span>
          {!p.active && (
            <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-ink-soft">
              Hidden
            </span>
          )}
          {p.featured && (
            <span className="rounded-full bg-rose/15 px-2 py-0.5 text-[11px] uppercase tracking-wide text-rose">
              Featured
            </span>
          )}
        </div>
        <div className="text-sm text-ink-soft">{formatMT(p.price)}</div>
      </div>
      <ActiveToggle slug={p.slug} active={p.active} />
      <Link
        href={`/admin/product/${p.slug}`}
        className="rounded-full border border-ink px-4 py-2 text-sm font-semibold hover:bg-ink hover:text-paper"
      >
        Edit
      </Link>
    </li>
  );
}
