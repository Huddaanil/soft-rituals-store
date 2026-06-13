"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// Swap the leading /pt or /en segment for the target locale, keeping the
// rest of the path and the query string, so the toggle stays on the same page.
function swapLocale(pathname: string, target: Locale): string {
  const parts = pathname.split("/");
  if (parts[1] === "pt" || parts[1] === "en") {
    parts[1] = target;
    return parts.join("/") || `/${target}`;
  }
  return `/${target}${pathname === "/" ? "" : pathname}`;
}

export default function LanguageToggle() {
  const { locale } = useLocale();
  const pathname = usePathname() || `/${locale}`;
  const search = useSearchParams();
  const qs = search.toString();

  return (
    <div
      className="flex items-center rounded-full border border-current/40 text-[12px] font-semibold"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        const href = `${swapLocale(pathname, l)}${qs ? `?${qs}` : ""}`;
        return (
          <Link
            key={l}
            href={href}
            aria-current={active ? "true" : undefined}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              active ? "bg-ink text-paper" : "opacity-70 hover:opacity-100"
            }`}
          >
            {LOCALE_LABELS[l]}
          </Link>
        );
      })}
    </div>
  );
}
