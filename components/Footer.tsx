import Link from "next/link";
import { getCategories } from "@/lib/catalog";

export default async function Footer() {
  const CATEGORIES = await getCategories();
  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <div className="font-display text-xl">Soft Rituals</div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ink-soft">
            Handcrafted candles and soaps from Maputo, Mozambique.
            Small rituals, big calm.
          </p>
        </div>
        <nav aria-label="Shop">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink">
            Shop
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li>
              <Link href="/shop" className="hover:text-ink">All products</Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className="hover:text-ink">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Information">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink">
            Information
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li><Link href="/about" className="hover:text-ink">About us</Link></li>
            <li><Link href="/delivery" className="hover:text-ink">Delivery &amp; orders</Link></li>
            <li><Link href="/contact" className="hover:text-ink">Contact</Link></li>
          </ul>
        </nav>
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink">
            Find us
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li>
              <a
                href="https://instagram.com/ssoft.rituals"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                Instagram — @ssoft.rituals
              </a>
            </li>
            <li>Maputo, Mozambique</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-[13px] text-ink-soft sm:px-8">
          <span>© {new Date().getFullYear()} Soft Rituals. Handmade with love.</span>
          <span>Light. Relax. Repeat.</span>
        </div>
      </div>
    </footer>
  );
}
