import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { getProducts, getCategories, getCategoryBySlug } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "pt");
  return { title: t.shop.allTitle, description: t.shop.allBlurb };
}

type SearchParams = Promise<{ category?: string; sort?: string }>;

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const t = getDictionary(lc);
  const { category, sort = "featured" } = await searchParams;

  const [all, CATEGORIES] = await Promise.all([
    getProducts(lc),
    getCategories(lc),
  ]);
  const activeCategory = category ? await getCategoryBySlug(category, lc) : undefined;

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
    const p = new URLSearchParams();
    if (cat) p.set("category", cat);
    if (s && s !== "featured") p.set("sort", s);
    const qs = p.toString();
    return qs ? `/${lc}/shop?${qs}` : `/${lc}/shop`;
  };

  const SORTS = [
    { key: "featured", label: t.shop.sortFeatured },
    { key: "price-asc", label: t.shop.sortPriceAsc },
    { key: "price-desc", label: t.shop.sortPriceDesc },
    { key: "name", label: t.shop.sortName },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:py-16">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl">
          {activeCategory ? activeCategory.name : t.shop.allTitle}
        </h1>
        <p className="mt-3 text-ink-soft">
          {activeCategory ? activeCategory.blurb : t.shop.allBlurb}
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-2" data-testid="category-filter">
        <Link
          href={linkFor(undefined, sort)}
          className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
            !activeCategory
              ? "border-ink bg-ink text-paper"
              : "border-line text-ink-soft hover:border-ink hover:text-ink"
          }`}
        >
          {t.shop.all} ({all.length})
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

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-5 text-[13px]">
        <span className="uppercase tracking-[0.14em] text-ink-soft">{t.shop.sort}</span>
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
          {products.length}{" "}
          {products.length === 1 ? t.shop.productOne : t.shop.productMany}
        </span>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} locale={lc} priority={i < 4} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="py-20 text-center text-ink-soft">
          {t.shop.emptyPre}
          <Link href={`/${lc}/shop`} className="underline">
            {t.shop.emptyLink}
          </Link>
          .
        </p>
      )}
    </div>
  );
}
