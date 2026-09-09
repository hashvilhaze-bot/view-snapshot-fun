import { useMemo } from "react";

import {
  DEFAULT_LOCALE,
  ENGLISH_ENABLED,
  LOCALE_DIR,
  resolveLocale,
  translator,
  type Locale,
  type TranslationKey,
} from "@/lib/i18n";

/**
 * Active locale + translator. While ENGLISH_ENABLED is false this always
 * returns Hebrew, so nothing partial can leak into the UI.
 */
export function useLocale(): {
  locale: Locale;
  dir: "rtl" | "ltr";
  englishAvailable: boolean;
  t: (key: TranslationKey) => string;
} {
  const locale = ENGLISH_ENABLED
    ? resolveLocale(
        typeof window === "undefined"
          ? null
          : new URLSearchParams(window.location.search).get("lang"),
      )
    : DEFAULT_LOCALE;

  const t = useMemo(() => translator(locale), [locale]);

  return { locale, dir: LOCALE_DIR[locale], englishAvailable: ENGLISH_ENABLED, t };
}
