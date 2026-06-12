import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, getCategory } from "@/lib/products";
import { getProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shop handcrafted candles and soaps",
  description:
    "The full Soft Rituals collection — sculpted candles, dessert candles, gift boxes and handmade soaps from Maputo. Filter by category.",
};

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "name", label: "Name A–Z" },
] as const;

type SearchParams = Promise<{ category?: string; sort?: string }>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category, sort = "featured" } = await searchParams;
  const all = await getProducts();
  const activeCategory = category ? getCategory(category) : undefined;

  let products = activeCategory
    ? all.filter((p) => p.category === activeCategory.slug)
    : all;

  products = [...products].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return Number(b.featured ?? false) - Number(a.featured ?? false);
    }
  });

  const linkFor = (cat?: string, s?: string) => {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (s && s !== "featured") params.set("sort", s);
    const qs = params.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl">
          {activeCategory ? activeCategory.name : "All products"}
        </h1>
        <p className="mt-3 text-ink-soft">
          {activeCategory
            ? activeCategory.blurb
            : "Everything is sculpted, poured and wrapped by hand in Maputo — in small batches, never in a factory."}
        </p>
      </header>

      {/* Category filter */}
      <div className="mt-8 flex flex-wrap items-center gap-2" data-testid="category-filter">
        <Link
          href={linkFor(undefined, sort)}
          className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
            !activeCategory
              ? "border-ink bg-ink text-paper"
              : "border-line text-ink-soft hover:border-ink hover:text-ink"
          }`}
        >
          All ({all.length})
        </Link>
        {CATEGORIES.map((c) => {
          const count = all.filter((p) => p.category === c.slug).length;
          const active = activeCategory?.slug === c.slug;
          return (
            <Link
              key={c.slug}
              href={linkFor(active ? undefined : c.slug, sort)}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {c.name} ({count})
            </Link>
          );
        })}
      </div>

      {/* Sort */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-5 text-[13px]">
        <span className="uppercase tracking-[0.14em] text-ink-soft">Sort</span>
        {SORTS.map((s) => (
          <Link
            key={s.key}
            href={linkFor(activeCategory?.slug, s.key)}
            className={
              sort === s.key
                ? "font-semibold text-ink underline underline-offset-4"
                : "text-ink-soft hover:text-ink"
            }
          >
            {s.label}
          </Link>
        ))}
        <span className="ml-auto text-ink-soft" data-testid="product-count">
          {products.length} {products.length === 1 ? "product" : "products"}
        </span>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i < 4} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="py-20 text-center text-ink-soft">
          Nothing here yet — new batches arrive often.{" "}
          <Link href="/shop" className="underline">See everything</Link>.
        </p>
      )}
    </div>
  );
}
