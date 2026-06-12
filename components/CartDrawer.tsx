"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatMT } from "@/lib/format";

export default function CartDrawer() {
  const { items, subtotal, isOpen, close, setQty, remove } = useCart();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        aria-label="Close cart"
        onClick={close}
        className="absolute inset-0 bg-ink/40"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-lg">Your cart</h2>
          <button
            type="button"
            onClick={close}
            className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-paper-2"
          >
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-ink-soft">Your cart is empty — the calmest it will ever be.</p>
            <Link
              href="/shop"
              onClick={close}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-paper hover:bg-sage-deep"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-4 py-5" data-testid="cart-line">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-paper-2">
                    <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm text-ink-soft">{formatMT(item.price)}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          className="px-3 py-1 text-ink hover:text-sage-deep"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm" data-testid="qty">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          className="px-3 py-1 text-ink hover:text-sage-deep"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.slug)}
                        className="text-[13px] text-ink-soft underline underline-offset-2 hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.14em] text-ink-soft">Subtotal</span>
                <span className="font-semibold" data-testid="cart-subtotal">
                  {formatMT(subtotal)}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-5 text-ink-soft">
                Delivery in Maputo is arranged after you order — we confirm
                everything personally.
              </p>
              <Link
                href="/checkout"
                onClick={close}
                className="mt-4 block rounded-full bg-ink px-6 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.12em] text-paper hover:bg-sage-deep"
                data-testid="go-to-checkout"
              >
                Go to checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
