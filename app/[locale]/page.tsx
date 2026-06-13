import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { getProducts, getCategories } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export const revalidate = 300;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);
  const [products, categories] = await Promise.all([
    getProducts(locale as Locale),
    getCategories(locale as Locale),
  ]);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const categoryImage = (slug: string) =>
    products.find((p) => p.category === slug)?.image ?? "/hero.jpg";
  const L = (p: string) => `/${locale}${p}`;

  return (
    <>
      {/* HERO */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-16 sm:px-8 lg:py-24 lg:pr-16">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-sage-deep">
              {t.hero.kicker}
            </p>
            <h1 className="mt-5 font-display text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
              {t.hero.titleLine1}
              <br />
              <em className="text-rose">{t.hero.titleEm}</em>
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-7 text-ink-soft">
              {t.hero.body}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href={L("/shop")}
                className="rounded-full bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-sage-deep"
                data-testid="hero-cta"
              >
                {t.hero.shopCta}
              </Link>
              <Link
                href={L("/about")}
                className="rounded-full border border-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-paper-2"
              >
                {t.hero.storyCta}
              </Link>
            </div>
          </div>
          <div className="relative min-h-[420px] lg:min-h-[620px]">
            <Image
              src="/hero.jpg"
              alt={t.hero.kicker}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-20">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl sm:text-3xl">{t.home.browseTitle}</h2>
          <Link
            href={L("/shop")}
            className="text-sm font-medium text-sage-deep underline underline-offset-4 hover:text-ink"
          >
            {t.home.viewAll}
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={L(`/shop?category=${c.slug}`)}
              className="group block"
              data-testid="category-tile"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper-2">
                <Image
                  src={categoryImage(c.slug)}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 pt-12">
                  <div className="font-display text-lg text-paper">{c.name}</div>
                  <div className="mt-0.5 text-[12.5px] leading-4 text-paper/85">{c.blurb}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="border-y border-line bg-paper-2/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-20">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl sm:text-3xl">{t.home.featuredTitle}</h2>
            <Link
              href={L("/shop")}
              className="text-sm font-medium text-sage-deep underline underline-offset-4 hover:text-ink"
            >
              {t.home.shopAll}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} locale={locale as Locale} />
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-8 lg:py-28">
        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-sage-deep">
          {t.home.ideaKicker}
        </p>
        <h2 className="mt-5 font-display text-3xl leading-snug sm:text-4xl">
          {t.home.ideaTitlePre}
          <em className="text-rose">{t.home.ideaTitleEm}</em>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-7 text-ink-soft">
          {t.home.ideaBody}
        </p>
        <Link
          href={L("/about")}
          className="mt-8 inline-block rounded-full border border-ink px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          {t.home.ideaCta}
        </Link>
      </section>
    </>
  );
}
