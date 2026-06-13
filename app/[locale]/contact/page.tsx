import type { Metadata } from "next";
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
  return { title: t.contact.kicker, description: t.contact.body };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-8 lg:py-24">
      <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-sage-deep">
        {t.contact.kicker}
      </p>
      <h1 className="mt-5 font-display text-4xl leading-tight">
        {t.contact.titlePre}
        <em className="text-rose">{t.contact.titleEm}</em>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-[17px] leading-7 text-ink-soft">
        {t.contact.body}
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="https://instagram.com/ssoft.rituals"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-sage-deep"
          data-testid="contact-instagram"
        >
          {t.contact.dmCta}
        </a>
      </div>

      <div className="mx-auto mt-16 grid max-w-xl gap-4 text-left sm:grid-cols-2">
        <div className="rounded-xl border border-line p-6">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em]">
            {t.contact.whereTitle}
          </h2>
          <p className="mt-2 text-ink-soft">{t.contact.whereBody}</p>
        </div>
        <div className="rounded-xl border border-line p-6">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.16em]">
            {t.contact.whenTitle}
          </h2>
          <p className="mt-2 text-ink-soft">{t.contact.whenBody}</p>
        </div>
      </div>
    </div>
  );
}
