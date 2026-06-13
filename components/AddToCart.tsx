"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Product } from "@/lib/products";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const { t } = useLocale();
  const [qty, setQtyState] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center rounded-full border border-ink/30">
        <button
          type="button"
          aria-label={t.product.decrease}
          onClick={() => setQtyState((q) => Math.max(1, q - 1))}
          className="px-4 py-2.5 text-lg text-ink hover:text-sage-deep"
        >
          −
        </button>
        <span className="min-w-8 text-center font-medium" data-testid="pdp-qty">
          {qty}
        </span>
        <button
          type="button"
          aria-label={t.product.increase}
          onClick={() => setQtyState((q) => Math.min(99, q + 1))}
          className="px-4 py-2.5 text-lg text-ink hover:text-sage-deep"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() =>
          add(
            {
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image,
            },
            qty
          )
        }
        className="rounded-full bg-ink px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-sage-deep"
        data-testid="add-to-cart"
      >
        {t.product.addToCart}
      </button>
    </div>
  );
}
