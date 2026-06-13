export const LOCALES = ["pt", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pt";

export function isLocale(value: string | undefined): value is Locale {
  return value === "pt" || value === "en";
}

export const LOCALE_LABELS: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  pt: "Português",
  en: "English",
};
