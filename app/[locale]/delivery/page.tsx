import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "pt");
  return { title: t.delivery.kicker, description: t.delivery.intro };
}

export default async function DeliveryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8 lg:py-20">
      <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-sage-deep">
        {t.delivery.kicker}
      </p>
      <h1 className="mt-5 font-display text-4xl leading-tight">
        {t.delivery.titlePre}
        <em className="text-rose">{t.delivery.titleEm}</em>
      </h1>
      <p className="mt-6 text-[17px] leading-7 text-ink-soft">{t.delivery.intro}</p>

      <div className="mt-12 space-y-3">
        {t.delivery.faqs.map((f) => (
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
        <h2 className="font-display text-xl">{t.delivery.stillTitle}</h2>
        <p className="mt-2 text-paper/80">{t.delivery.stillBody}</p>
        <Link
          href={`/${locale}/contact`}
          className="mt-5 inline-block rounded-full bg-paper px-7 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink hover:bg-paper-2"
        >
          {t.delivery.contactCta}
        </Link>
      </div>
    </div>
  );
}
