import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { formatMT } from "@/lib/format";

export const metadata: Metadata = { robots: { index: false } };

type LastOrder = {
  number: string;
  name: string;
  total: number;
  payment: string;
  items: { name: string; qty: number; price: number }[];
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; number: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const { locale, number } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const t = getDictionary(lc);
  const { paid } = await searchParams;

  let order: LastOrder | null = null;
  try {
    const raw = (await cookies()).get("sr_last_order")?.value;
    if (raw) {
      const parsed = JSON.parse(raw) as LastOrder;
      if (parsed.number === number) order = parsed;
    }
  } catch {
    // cookie unreadable — show the generic confirmation
  }

  const firstName = order ? order.name.split(" ")[0] : "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-8 lg:py-24">
      <div
        aria-hidden="true"
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage/15 text-3xl"
      >
        🕯️
      </div>
      <h1 className="mt-6 font-display text-4xl leading-tight" data-testid="order-thanks">
        {t.order.thanks}
        {firstName ? `, ${firstName}` : ""}.
      </h1>
      <p className="mt-4 text-[17px] leading-7 text-ink-soft">
        {paid === "1" ? t.order.receivedPaid : t.order.received}
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-paper-2/50 p-6 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
            {t.order.orderNumber}
          </span>
          <span className="font-mono font-semibold" data-testid="order-number">
            {number}
          </span>
        </div>
        {order && (
          <>
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {order.items.map((i) => (
                <li key={i.name} className="flex justify-between py-3 text-sm">
                  <span>
                    {i.name} <span className="text-ink-soft">× {i.qty}</span>
                  </span>
                  <span>{formatMT(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-line pt-4 font-medium">
              <span>{t.order.total}</span>
              <span>{formatMT(order.total)}</span>
            </div>
            <p className="mt-3 text-[13px] text-ink-soft">
              {order.payment === "pay_on_delivery"
                ? t.order.payOnDelivery
                : t.order.payCard}
            </p>
          </>
        )}
      </div>

      <p className="mt-6 text-[15px] text-ink-soft">
        {t.order.keepNumberPre}
        <a
          href="https://instagram.com/ssoft.rituals"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-ink"
        >
          {t.order.keepNumberLink}
        </a>
        .
      </p>

      <Link
        href={`/${lc}/shop`}
        className="mt-9 inline-block rounded-full bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper hover:bg-sage-deep"
      >
        {t.order.keepBrowsing}
      </Link>
    </div>
  );
}
