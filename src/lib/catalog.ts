/**
 * Unified catalog (Match 2.0 + Quote direct selection).
 *
 * ADDITIVE ON PURPOSE: this module derives one shared item shape from the
 * existing `treks` and `experiences` arrays in content.ts. Nothing in
 * content.ts is renamed, moved or removed, so every existing page keeps
 * reading the same data it always did.
 *
 * The only new information here is *classification* (interest tags, category,
 * whether the item has a real physical component) plus duration where the
 * existing content already states it. Nothing factual is invented: where the
 * content does not state a duration, `totalDaysMin` stays undefined and the
 * item is simply never removed by the duration hard filter.
 */

import { experiences, treks, type Experience, type Trek } from "@/lib/content";

export type CatalogKind = "trek" | "experience";

/** Interest tags used by the Match question "מה מעניין אתכם". */
export const INTEREST_TAGS = [
  "הרים וטרקים",
  "תרבות וערים",
  "כפרים ואנשים",
  "טבע רגוע ומנוחה",
  "יוגה ובריאות",
  "מים ואדרנלין",
  "חיות וג׳ונגל",
] as const;

export type InterestTag = (typeof INTEREST_TAGS)[number];

/** Content worlds used to organise the Experiences gateway. */
export const EXPERIENCE_CATEGORIES = [
  "ערים ותרבות",
  "כפרים ואנשים",
  "טבע רגוע ויוגה",
  "מים ואדרנלין",
  "טבע וחיות",
] as const;

export type ExperienceCategory = (typeof EXPERIENCE_CATEGORIES)[number];

export type CatalogItem = {
  kind: CatalogKind;
  slug: string;
  name: string;
  teaser: string;
  /** Short line under the name on cards. */
  meta: string;
  interests: InterestTag[];
  /** 1–3. For treks this is the existing `effort`. Undefined = unknown. */
  intensity?: 1 | 2 | 3 | undefined;
  /** Days needed in Nepal, only where the content states it. */
  totalDaysMin?: number | undefined;
  /** true when the item has a meaningful physical component. */
  physical: boolean;
  /** Only set for experiences. */
  category?: ExperienceCategory | undefined;
};

/** Interest tags per trek, read off the existing `character` / `fit` text. */
const TREK_INTERESTS: Record<string, InterestTag[]> = {
  "pokhara-hills": ["הרים וטרקים", "כפרים ואנשים"],
  "poon-hill": ["הרים וטרקים"],
  "mardi-himal": ["הרים וטרקים"],
  "langtang-valley": ["הרים וטרקים", "כפרים ואנשים"],
  "annapurna-base-camp": ["הרים וטרקים"],
  "annapurna-circuit": ["הרים וטרקים", "כפרים ואנשים"],
  "everest-base-camp": ["הרים וטרקים"],
  "manaslu-circuit": ["הרים וטרקים", "כפרים ואנשים"],
};

type ExperienceMeta = {
  category: ExperienceCategory;
  interests: InterestTag[];
  physical: boolean;
  /** Only where the existing content states a number of days. */
  totalDaysMin?: number;
  /** Only where the existing content states an intensity. */
  intensity?: 1 | 2 | 3;
};

const EXPERIENCE_META: Record<string, ExperienceMeta> = {
  kathmandu: {
    category: "ערים ותרבות",
    interests: ["תרבות וערים"],
    physical: false,
    totalDaysMin: 2,
    intensity: 1,
  },
  pokhara: {
    category: "ערים ותרבות",
    interests: ["תרבות וערים", "טבע רגוע ומנוחה"],
    physical: false,
    intensity: 1,
  },
  villages: {
    category: "כפרים ואנשים",
    interests: ["כפרים ואנשים"],
    physical: true,
    intensity: 1,
  },
  "yoga-rest": {
    category: "טבע רגוע ויוגה",
    interests: ["יוגה ובריאות", "טבע רגוע ומנוחה"],
    physical: false,
    totalDaysMin: 2,
    intensity: 1,
  },
  rafting: {
    category: "מים ואדרנלין",
    interests: ["מים ואדרנלין"],
    physical: true,
    totalDaysMin: 1,
    intensity: 2,
  },
  chitwan: {
    category: "טבע וחיות",
    interests: ["חיות וג׳ונגל", "טבע רגוע ומנוחה"],
    physical: false,
    totalDaysMin: 2,
    intensity: 1,
  },
};

export function trekToItem(t: Trek): CatalogItem {
  return {
    kind: "trek",
    slug: t.slug,
    name: t.name,
    teaser: t.teaser,
    meta: `${t.days} · ${t.altitude} · ${t.effortLabel}`,
    interests: TREK_INTERESTS[t.slug] ?? ["הרים וטרקים"],
    intensity: t.effort,
    totalDaysMin: t.totalDaysMin,
    physical: true,
  };
}

export function experienceToItem(e: Experience): CatalogItem {
  const meta = EXPERIENCE_META[e.slug];
  return {
    kind: "experience",
    slug: e.slug,
    name: e.name,
    teaser: e.teaser,
    meta: e.kicker,
    interests: meta?.interests ?? [],
    intensity: meta?.intensity,
    totalDaysMin: meta?.totalDaysMin,
    physical: meta?.physical ?? false,
    category: meta?.category,
  };
}

export const trekItems: CatalogItem[] = treks.map(trekToItem);
export const experienceItems: CatalogItem[] = experiences.map(experienceToItem);

/** The unified pool Match 2.0 and the Quote picker both work on. */
export const catalog: CatalogItem[] = [...trekItems, ...experienceItems];

export function findCatalogItem(kind: CatalogKind, slug: string): CatalogItem | undefined {
  return catalog.find((i) => i.kind === kind && i.slug === slug);
}

/** Experiences grouped by content world. Empty categories are simply absent. */
export function experiencesByCategory(): { category: ExperienceCategory; items: CatalogItem[] }[] {
  return EXPERIENCE_CATEGORIES.map((category) => ({
    category,
    items: experienceItems.filter((i) => i.category === category),
  })).filter((g) => g.items.length > 0);
}
