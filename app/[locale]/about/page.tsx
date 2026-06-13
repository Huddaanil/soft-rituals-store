import type { Metadata } from "next";
import Image from "next/image";
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
  return { title: `${t.about.titlePre}${t.about.titleEm}`.replace(/,\s*$/, "") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-sage-deep">
            {t.about.kicker}
          </p>
          <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
            {t.about.titlePre}
            <em className="text-rose">{t.about.titleEm}</em>
          </h1>
          <div className="mt-7 space-y-5 text-[17px] leading-7 text-ink-soft">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p>{t.about.p3}</p>
          </div>
          <Link
            href={`/${locale}/shop`}
            className="mt-9 inline-block rounded-full bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-sage-deep"
          >
            {t.about.cta}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src="/products/carved-pillar.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src="/products/succulent-box.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.about.values.map((v) => (
          <div key={v.title} className="rounded-xl border border-line bg-paper-2/50 p-6">
            <h2 className="font-display text-lg">{v.title}</h2>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
