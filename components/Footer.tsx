import Link from "next/link";
import { getCategories } from "@/lib/catalog";
import { whatsappLink, WHATSAPP_DISPLAY } from "@/lib/contact";
import { getDictionary } from "@/lib/i18n";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { headers } from "next/headers";

export default async function Footer() {
  // Footer renders inside the [locale] layout; read the active locale from
  // the request header the middleware set.
  const hdrLocale = (await headers()).get("x-locale");
  const locale: Locale = isLocale(hdrLocale ?? undefined) ? (hdrLocale as Locale) : "pt";
  const t = getDictionary(locale);
  const CATEGORIES = await getCategories(locale);
  const L = (p: string) => `/${locale}${p}`;

  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <div className="font-display text-xl">Soft Rituals</div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ink-soft">{t.footer.tagline}</p>
        </div>
        <nav aria-label="Shop">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink">
            {t.footer.shopHead}
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li>
              <Link href={L("/shop")} className="hover:text-ink">{t.footer.allProducts}</Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={L(`/shop?category=${c.slug}`)} className="hover:text-ink">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Information">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink">
            {t.footer.infoHead}
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li><Link href={L("/about")} className="hover:text-ink">{t.footer.aboutUs}</Link></li>
            <li><Link href={L("/delivery")} className="hover:text-ink">{t.footer.deliveryOrders}</Link></li>
            <li><Link href={L("/contact")} className="hover:text-ink">{t.footer.contact}</Link></li>
            <li><Link href={L("/privacy")} className="hover:text-ink">{t.footer.privacy}</Link></li>
          </ul>
        </nav>
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink">
            {t.footer.findHead}
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                WhatsApp — {WHATSAPP_DISPLAY}
              </a>
            </li>
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
            <li>{t.footer.location}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-[13px] text-ink-soft sm:px-8">
          <span>© {new Date().getFullYear()} Soft Rituals. {t.footer.rights}</span>
          <span>{t.footer.motto}</span>
        </div>
      </div>
    </footer>
  );
}
