/**
 * Match 2.0 scoring, over the unified catalog (treks + experiences).
 *
 * Hard filter: total days needed vs. days available. Items whose duration is
 * not stated in the content are never filtered out — we do not guess.
 *
 * Soft score (weights per spec, normalised over the components that are
 * actually relevant to the item and were actually answered):
 *   pace / intensity   30%
 *   interests          30%
 *   fitness            25%
 *   trek experience    15%
 *
 * Fitness and trek experience are NEVER hard filters.
 */

import { catalog, type CatalogItem } from "@/lib/catalog";

export const PACE_OPTIONS = ["רגוע", "מאוזן", "מאתגר"] as const;
export const FITNESS_OPTIONS = ["בכושר בסיסי", "בכושר סביר", "בכושר טוב"] as const;
export const EXPERIENCE_OPTIONS = ["אין כמעט", "כמה ימי הליכה", "טרקים ארוכים"] as const;
export const TIME_OPTIONS = ["עד שבוע", "כשבוע וחצי", "שבועיים", "שלושה שבועות ויותר"] as const;

export const TIME_DAYS: Record<string, number> = {
  "עד שבוע": 7,
  "כשבוע וחצי": 11,
  שבועיים: 14,
  "שלושה שבועות ויותר": 21,
};

const LEVEL: Record<string, 1 | 2 | 3> = {
  רגוע: 1,
  מאוזן: 2,
  מאתגר: 3,
  "בכושר בסיסי": 1,
  "בכושר סביר": 2,
  "בכושר טוב": 3,
  "אין כמעט": 1,
  "כמה ימי הליכה": 2,
  "טרקים ארוכים": 3,
};

export type MatchAnswers = {
  time?: string | undefined;
  pace?: string | undefined;
  interests: string[];
  fitness?: string | undefined;
  trekExperience?: string | undefined;
};

export type MatchResult = {
  item: CatalogItem;
  /** 0–1 */
  score: number;
  reasons: string[];
};

/** Results below this are not shown. Configurable in one place, on purpose. */
export const MATCH_THRESHOLD = 0.45;
export const MATCH_MAX_RESULTS = 4;

export function daysBudget(answers: MatchAnswers): number | null {
  return answers.time ? (TIME_DAYS[answers.time] ?? null) : null;
}

/** True when the answers make the fitness question worth asking. */
export function needsFitnessQuestion(answers: MatchAnswers): boolean {
  return answers.interests.some((i) => i === "הרים וטרקים" || i === "מים ואדרנלין");
}

/** True when the answers make the trek-experience question worth asking. */
export function needsTrekQuestion(answers: MatchAnswers): boolean {
  return answers.interests.includes("הרים וטרקים");
}

function closeness(a: number, b: number): number {
  return 1 - Math.min(2, Math.abs(a - b)) / 2;
}

/** Capability questions: being stronger than needed is fine, weaker costs. */
function capability(level: number, demand: number): number {
  return 1 - Math.min(2, Math.max(0, demand - level)) / 2;
}

export function scoreItem(item: CatalogItem, answers: MatchAnswers): MatchResult | null {
  const budget = daysBudget(answers);
  if (budget !== null && item.totalDaysMin !== undefined && item.totalDaysMin > budget) return null;

  const parts: { weight: number; value: number }[] = [];
  const reasons: string[] = [];

  const pace = answers.pace ? LEVEL[answers.pace] : undefined;
  if (pace !== undefined && item.intensity !== undefined) {
    const value = closeness(pace, item.intensity);
    parts.push({ weight: 0.3, value });
    if (value >= 0.75) reasons.push(`הקצב כאן מתאים למה שסימנתם (${answers.pace}).`);
  }

  if (answers.interests.length > 0 && item.interests.length > 0) {
    const hits = item.interests.filter((t) => answers.interests.includes(t));
    // Tuning: an item that touches none of the stated interests is not a match,
    // however close its pace happens to be. Keeps a relaxed, non-trek answer
    // from being answered with treks.
    if (hits.length === 0) return null;
    parts.push({ weight: 0.3, value: hits.length / answers.interests.length });
    reasons.push(`נוגע במה שסימנתם: ${hits.join(", ")}.`);
  }

  const fitness = answers.fitness ? LEVEL[answers.fitness] : undefined;
  if (fitness !== undefined && item.physical && item.intensity !== undefined) {
    const value = capability(fitness, item.intensity);
    parts.push({ weight: 0.25, value });
    if (value < 0.75) reasons.push("דורש יותר כושר ממה שסימנתם — שווה לדבר על זה.");
  }

  const exp = answers.trekExperience ? LEVEL[answers.trekExperience] : undefined;
  if (exp !== undefined && item.kind === "trek" && item.intensity !== undefined) {
    const value = capability(exp, item.intensity);
    parts.push({ weight: 0.15, value });
    if (value < 0.75) reasons.push("מסלול שדורש יותר ניסיון ממה שסימנתם.");
  }

  if (parts.length === 0) return { item, score: 0, reasons: [] };

  const totalWeight = parts.reduce((s, p) => s + p.weight, 0);
  const score = parts.reduce((s, p) => s + p.weight * p.value, 0) / totalWeight;

  if (budget !== null && item.totalDaysMin !== undefined) {
    reasons.unshift(`נכנס לימים שיש לכם: בסביבות ${item.totalDaysMin} ימים בנפאל.`);
  }

  return { item, score, reasons: reasons.slice(0, 3) };
}

export function runMatch(answers: MatchAnswers): {
  results: MatchResult[];
  filteredOut: CatalogItem[];
} {
  const budget = daysBudget(answers);
  const filteredOut =
    budget === null
      ? []
      : catalog.filter((i) => i.totalDaysMin !== undefined && i.totalDaysMin > budget);

  const results = catalog
    .map((i) => scoreItem(i, answers))
    .filter((r): r is MatchResult => r !== null && r.score >= MATCH_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, MATCH_MAX_RESULTS);

  return { results, filteredOut };
}
