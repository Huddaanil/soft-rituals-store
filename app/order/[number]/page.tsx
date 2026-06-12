import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { formatMT } from "@/lib/format";

export const metadata: Metadata = {
  title: "Order received",
  robots: { index: false },
};

type Params = Promise<{ number: string }>;
type SearchParams = Promise<{ paid?: string }>;

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
  params: Params;
  searchParams: SearchParams;
}) {
  const { number } = await params;
  const { paid } = await searchParams;

  let order: LastOrder | null = null;
  try {
    const raw = (await cookies()).get("sr_last_order")?.value;
    if (raw) {
      const parsed = JSON.parse(raw) as LastOrder;
      if (parsed.number === number) order = parsed;
    }
  } catch {
    // cookie unreadable — fall through to the generic confirmation
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-8 lg:py-24">
      <div
        aria-hidden="true"
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage/15 text-3xl"
      >
        🕯️
      </div>
      <h1 className="mt-6 font-display text-4xl leading-tight" data-testid="order-thanks">
        Thank you{order ? `, ${order.name.split(" ")[0]}` : ""}.
      </h1>
      <p className="mt-4 text-[17px] leading-7 text-ink-soft">
        Your order is in{paid === "1" ? " and your payment went through" : ""}.
        We'll confirm everything personally — usually within the day — and
        arrange delivery with you.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-paper-2/50 p-6 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
            Order number
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
              <span>Total</span>
              <span>{formatMT(order.total)}</span>
            </div>
            <p className="mt-3 text-[13px] text-ink-soft">
              {order.payment === "pay_on_delivery"
                ? "Payment on delivery — cash or M-Pesa. Delivery fee arranged with you."
                : "Payment by card. Delivery fee arranged with you."}
            </p>
          </>
        )}
      </div>

      <p className="mt-6 text-[15px] text-ink-soft">
        Keep this number — and if you'd like anything changed, just{" "}
        <a
          href="https://instagram.com/ssoft.rituals"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-ink"
        >
          DM us on Instagram
        </a>
        .
      </p>

      <Link
        href="/shop"
        className="mt-9 inline-block rounded-full bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper hover:bg-sage-deep"
      >
        Keep browsing
      </Link>
    </div>
  );
}
