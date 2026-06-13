"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatMT } from "@/lib/format";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";
import { placeOrder } from "@/app/checkout/actions";

const AREAS = [
  "Polana",
  "Sommerschield",
  "Coop",
  "Malhangalene",
  "Baixa",
  "Alto Maé",
  "Costa do Sol",
  "Matola",
];

export default function CheckoutForm({ locale }: { locale: Locale }) {
  const { items, subtotal, clear } = useCart();
  const { t } = useLocale();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const areaOther =
    locale === "pt" ? "Outra (diga na nota)" : "Other (tell us in the note)";

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-display text-3xl">{t.checkout.emptyTitle}</h1>
        <p className="mt-3 text-ink-soft">{t.checkout.emptyBody}</p>
        <Link
          href={`/${locale}/shop`}
          className="mt-7 inline-block rounded-full bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper hover:bg-sage-deep"
        >
          {t.checkout.emptyCta}
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const result = await placeOrder({
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        deliveryArea: String(form.get("area") ?? ""),
        note: String(form.get("note") ?? ""),
        items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        locale,
      });
      if (!result.ok) {
        setError(result.error);
        setSubmitting(false);
        return;
      }
      clear();
      if (result.redirectUrl) {
        window.location.assign(result.redirectUrl);
      } else {
        router.push(`/${locale}/order/${result.orderNumber}`);
      }
    } catch {
      setError(t.checkout.errorGeneric);
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
      <form onSubmit={onSubmit} className="space-y-6" data-testid="checkout-form">
        <h1 className="font-display text-3xl sm:text-4xl">{t.checkout.title}</h1>
        <p className="text-ink-soft">{t.checkout.intro}</p>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-[13px] font-medium uppercase tracking-[0.1em]">
              {t.checkout.name} *
            </span>
            <input
              name="name"
              required
              autoComplete="name"
              className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none focus:border-sage-deep"
              placeholder={t.checkout.namePh}
            />
          </label>
          <label className="block">
            <span className="text-[13px] font-medium uppercase tracking-[0.1em]">
              {t.checkout.phone} *
            </span>
            <input
              name="phone"
              required
              autoComplete="tel"
              inputMode="tel"
              className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none focus:border-sage-deep"
              placeholder={t.checkout.phonePh}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-[13px] font-medium uppercase tracking-[0.1em]">
            {t.checkout.email}
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none focus:border-sage-deep"
            placeholder={t.checkout.emailPh}
          />
        </label>

        <label className="block">
          <span className="text-[13px] font-medium uppercase tracking-[0.1em]">
            {t.checkout.area} *
          </span>
          <select
            name="area"
            required
            defaultValue=""
            className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none focus:border-sage-deep"
          >
            <option value="" disabled>
              {t.checkout.areaPlaceholder}
            </option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
            <option value={areaOther}>{areaOther}</option>
          </select>
        </label>

        <label className="block">
          <span className="text-[13px] font-medium uppercase tracking-[0.1em]">
            {t.checkout.note}
          </span>
          <textarea
            name="note"
            rows={3}
            className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-ink outline-none focus:border-sage-deep"
            placeholder={t.checkout.notePh}
          />
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-rose/40 bg-rose/10 px-4 py-3 text-[15px] text-rose"
            data-testid="checkout-error"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-sage-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          data-testid="place-order"
        >
          {submitting ? t.checkout.placing : t.checkout.place}
        </button>
        <p className="text-[13px] leading-5 text-ink-soft">{t.checkout.payNote}</p>
      </form>

      <aside className="h-fit rounded-2xl border border-line bg-paper-2/50 p-6 lg:sticky lg:top-24">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em]">
          {t.checkout.summaryTitle}
        </h2>
        <ul className="mt-4 divide-y divide-line">
          {items.map((i) => (
            <li key={i.slug} className="flex items-center gap-4 py-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-paper">
                <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1 text-sm">
                <div className="font-medium">{i.name}</div>
                <div className="text-ink-soft">
                  {t.checkout.qty} {i.qty}
                </div>
              </div>
              <div className="text-sm">{formatMT(i.price * i.qty)}</div>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
          <span className="text-[13px] uppercase tracking-[0.14em] text-ink-soft">
            {t.checkout.total}
          </span>
          <span className="font-display text-xl" data-testid="checkout-total">
            {formatMT(subtotal)}
          </span>
        </div>
        <p className="mt-3 text-[13px] leading-5 text-ink-soft">
          {t.checkout.deliveryFee}
        </p>
      </aside>
    </div>
  );
}
