/**
 * What the visitor already told us. The site should not ask twice: Match, the
 * comparison screen and the product pages write here, and the quote form reads
 * it. Session-scoped on purpose — nothing personal is stored beyond the tab.
 */

export type TripSource =
  | "match"
  | "direct-selection"
  | "trek-page"
  | "experience-page"
  | "comparison";

/** One thing the visitor actually chose. */
export type SelectedItem = {
  kind: "trek" | "experience";
  slug: string;
  name: string;
};

export type TripContext = {
  /** Where the context came from. */
  source: TripSource | string;
  /** What the visitor actually selected — never auto-filled from suggestions. */
  selected?: SelectedItem[] | undefined;
  /** Match suggestions the visitor did NOT pick. Context only. */
  considered?: string[] | undefined;
  /** Raw match answers, passed along with the lead. */
  matchAnswers?: Record<string, string> | undefined;
  /** Fit score per suggested item, as computed by Match. */
  fitScores?: { name: string; score: number }[] | undefined;
  /** Human-readable summary of the answers, shown back to the visitor. */
  summary?: string | undefined;
  /** Route/experience names we recommended or the visitor was looking at. */
  directions?: string[] | undefined;
  /** Days available, as the visitor phrased it. */
  time?: string | undefined;
  savedAt?: string | undefined;
};

const KEY = "hashvil:trip-context";

export function saveTripContext(ctx: TripContext) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...ctx, savedAt: new Date().toISOString() }));
  } catch {
    /* private mode — the form simply starts empty */
  }
}

export function readTripContext(): TripContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TripContext) : null;
  } catch {
    return null;
  }
}

export function clearTripContext() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
