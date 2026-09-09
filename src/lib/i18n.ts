/**
 * Language infrastructure.
 *
 * Hebrew (RTL) is and stays the default. English (LTR) plumbing is complete —
 * locale type, direction, dictionary, resolver, document attributes — but it is
 * intentionally NOT exposed in the UI: `ENGLISH_ENABLED` is false, so no
 * language switcher renders and `?lang=en` is ignored. This avoids shipping a
 * half-translated site. When the English copy is ready, flip ENGLISH_ENABLED to
 * true and fill the `en` side of the dictionary.
 */

export type Locale = "he" | "en";

export const DEFAULT_LOCALE: Locale = "he";

/** Flip to true only when the full English copy exists. */
export const ENGLISH_ENABLED = false;

export const LOCALES: Locale[] = ["he", "en"];

export const LOCALE_DIR: Record<Locale, "rtl" | "ltr"> = { he: "rtl", en: "ltr" };

export const LOCALE_LABEL: Record<Locale, string> = { he: "עברית", en: "English" };

/** UI shell strings. Page content lives in content.ts and is Hebrew-only for now. */
export const dictionary = {
  he: {
    "nav.home": "בית",
    "nav.nepal": "נפאל",
    "nav.treks": "טרקים ומסלולים",
    "nav.match": "מה מתאים לי?",
    "nav.knowledge": "מרכז ידע",
    "nav.contact": "דברו איתנו",
    "nav.quote": "בקשת הצעה",
    "nav.about": "מי אנחנו",
    "auth.signIn": "התחברות",
    "auth.signOut": "התנתקות",
    "auth.profile": "האזור האישי",
    "cta.talk": "בואו נדבר",
    "cta.knowAlready": "כבר יודעים?",
    "footer.onSite": "באתר",
    "footer.talkToUs": "דברו איתנו",
    "footer.whatsapp": "וואטסאפ",
  },
  en: {
    "nav.home": "Home",
    "nav.nepal": "Nepal",
    "nav.treks": "Treks and routes",
    "nav.match": "What suits me?",
    "nav.knowledge": "Knowledge hub",
    "nav.contact": "Talk to us",
    "nav.quote": "Request a quote",
    "nav.about": "About us",
    "auth.signIn": "Sign in",
    "auth.signOut": "Sign out",
    "auth.profile": "My area",
    "cta.talk": "Let's talk",
    "cta.knowAlready": "Already know?",
    "footer.onSite": "On this site",
    "footer.talkToUs": "Talk to us",
    "footer.whatsapp": "WhatsApp",
  },
} as const;

export type TranslationKey = keyof (typeof dictionary)["he"];

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "he" || value === "en";
}

/**
 * The active locale. Always Hebrew while English is disabled, so SSR and the
 * client never disagree.
 */
export function resolveLocale(requested?: string | null): Locale {
  if (!ENGLISH_ENABLED) return DEFAULT_LOCALE;
  return isLocale(requested) ? requested : DEFAULT_LOCALE;
}

export function translate(locale: Locale, key: TranslationKey): string {
  return dictionary[locale][key] ?? dictionary[DEFAULT_LOCALE][key];
}

/** Convenience translator bound to one locale. */
export function translator(locale: Locale) {
  return (key: TranslationKey) => translate(locale, key);
}

export function documentAttrs(locale: Locale) {
  return { lang: locale, dir: LOCALE_DIR[locale] };
}
