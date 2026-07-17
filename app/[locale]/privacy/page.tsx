import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { whatsappLink, WHATSAPP_DISPLAY } from "@/lib/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "pt");
  return { title: t.privacy.kicker, description: t.privacy.sections[0].p };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8 lg:py-24">
      <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-sage-deep">
        {t.privacy.kicker}
      </p>
      <h1 className="mt-5 font-display text-4xl leading-tight">{t.privacy.title}</h1>
      <p className="mt-3 text-[13px] text-ink-soft">{t.privacy.updated}</p>

      <div className="mt-10 space-y-8">
        {t.privacy.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em]">
              {s.h}
            </h2>
            <p className="mt-2 leading-7 text-ink-soft">{s.p}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-4">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-sage-deep px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-paper hover:bg-ink"
        >
          WhatsApp — {WHATSAPP_DISPLAY}
        </a>
        <Link
          href={`/${locale}/contact`}
          className="rounded-full border border-line px-6 py-3 text-[13px] font-medium hover:bg-paper-2"
        >
          {t.privacy.contactCta}
        </Link>
      </div>
    </div>
  );
}
