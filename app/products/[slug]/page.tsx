import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/products";
import { getProductBySlug, getProducts, getCategoryBySlug } from "@/lib/catalog";
import { formatMT } from "@/lib/format";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle,
    description: product.seoDescription,
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = await getCategoryBySlug(product.category);
  const related = (await getProducts())
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.seoDescription,
    image: product.image,
    brand: { "@type": "Brand", name: "Soft Rituals" },
    offers: {
      "@type": "Offer",
      priceCurrency: "MZN",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-[13px] text-ink-soft" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        <span className="mx-2">/</span>
        {category && (
          <>
            <Link href={`/shop?category=${category.slug}`} className="hover:text-ink">
              {category.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper-2 lg:sticky lg:top-24">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="font-display text-3xl leading-tight sm:text-4xl" data-testid="pdp-name">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl text-ink" data-testid="pdp-price">
            {formatMT(product.price)}
          </p>
          <p className="mt-4 text-[17px] leading-7 text-ink-soft">{product.short}</p>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <div className="mt-10 space-y-5 border-t border-line pt-8">
            {product.story.map((para) => (
              <p key={para.slice(0, 32)} className="leading-7 text-ink-soft">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-paper-2 p-6">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em]">
              The details
            </h2>
            <ul className="mt-3 space-y-2 text-[15px] text-ink-soft">
              {product.notes.map((n) => (
                <li key={n} className="flex gap-2.5">
                  <span aria-hidden="true" className="text-sage-deep">—</span>
                  {n}
                </li>
              ))}
              <li className="flex gap-2.5">
                <span aria-hidden="true" className="text-sage-deep">—</span>
                Delivery in Maputo arranged personally after you order
              </li>
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="font-display text-2xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
