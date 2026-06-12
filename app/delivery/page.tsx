import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delivery & orders",
  description:
    "How Soft Rituals orders work: order online, we confirm personally, delivery across Maputo arranged with you. Payment on delivery.",
};

const FAQS = [
  {
    q: "How does ordering work?",
    a: "Add what you love to the cart and check out — it takes a minute and you don't need an account. We then confirm your order personally (usually by WhatsApp or Instagram) before anything moves, so you always talk to a human.",
  },
  {
    q: "Where do you deliver?",
    a: "Across Maputo and Matola, arranged with you after the order — we agree the day, the place and the delivery fee together. For other cities, message us first and we'll see what's possible.",
  },
  {
    q: "How do I pay?",
    a: "On delivery — cash or M-Pesa. Online card payment is coming soon; for now we keep it simple and personal.",
  },
  {
    q: "How long does it take?",
    a: "If your pieces are in stock, usually 1–3 days. If we're making a fresh batch for you, we'll tell you honestly when we confirm — handmade takes the time it takes.",
  },
  {
    q: "Can I order a gift?",
    a: "Yes — everything ships wrapped and tagged by hand. Tell us in the order note if it's a gift and we'll make sure it arrives looking like one, with no price inside.",
  },
  {
    q: "Candle care?",
    a: "First burn: let the top melt fully so it burns evenly. Trim the wick to about 5 mm before each light. Never leave a flame alone, and keep sculpted pieces out of direct sun — they're wax, and Maputo is warm.",
  },
];

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8 lg:py-20">
      <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-sage-deep">
        Delivery &amp; orders
      </p>
      <h1 className="mt-5 font-display text-4xl leading-tight">
        Simple, personal, <em className="text-rose">arranged with you.</em>
      </h1>
      <p className="mt-6 text-[17px] leading-7 text-ink-soft">
        We are a small workshop, not a warehouse — and that is your advantage.
        Every order is confirmed by a person, packed by hand and delivered the
        way you prefer.
      </p>

      <div className="mt-12 space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-xl border border-line bg-paper-2/40 px-6 py-1 open:bg-paper-2/70"
          >
            <summary className="cursor-pointer list-none py-4 font-medium marker:hidden">
              <span className="flex items-center justify-between gap-4">
                {f.q}
                <span
                  aria-hidden="true"
                  className="text-xl text-sage-deep transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="pb-5 leading-7 text-ink-soft">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-ink p-8 text-paper">
        <h2 className="font-display text-xl">Still wondering something?</h2>
        <p className="mt-2 text-paper/80">
          Message us on Instagram — we answer personally, usually the same day.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-block rounded-full bg-paper px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-paper-2"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
