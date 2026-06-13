import en, { type Dictionary } from "./en";
import pt from "./pt";
import { type Locale } from "./config";

const DICTS: Record<Locale, Dictionary> = { en, pt };

export function getDictionary(locale: Locale): Dictionary {
  return DICTS[locale] ?? DICTS.pt;
}

export type { Dictionary };
