"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

export default function Header() {
  const { count, open } = useCart();
  const { locale, t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const L = (p: string) => `/${locale}${p}`;

  const NAV = [
    { href: L("/shop"), label: t.nav.shop },
    { href: L("/about"), label: t.nav.about },
    { href: L("/delivery"), label: t.nav.delivery },
    { href: L("/contact"), label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          href={L("")}
          className="font-display text-xl tracking-wide text-ink"
          onClick={() => setMenuOpen(false)}
        >
          Soft&nbsp;Rituals
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button
            type="button"
            onClick={open}
            className="relative rounded-full border border-ink px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-paper"
            aria-label={t.nav.cart}
          >
            {t.nav.cart}
            <span
              className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-paper"
              data-testid="cart-count"
            >
              {count}
            </span>
          </button>
          <button
            type="button"
            className="md:hidden rounded-md border border-line p-2 text-ink"
            aria-expanded={menuOpen}
            aria-label={t.nav.menu}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-line bg-paper px-4 py-3 md:hidden" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium uppercase tracking-[0.14em] text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
