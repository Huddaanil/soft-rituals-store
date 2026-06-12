import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatMT } from "@/lib/format";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      data-testid="product-card"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-paper-2">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-base leading-snug">{product.name}</h3>
        <span className="shrink-0 text-sm text-ink-soft">{formatMT(product.price)}</span>
      </div>
      <p className="mt-1 text-[13.5px] leading-5 text-ink-soft">{product.short}</p>
    </Link>
  );
}
