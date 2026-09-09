/**
 * What the visitor already told us. The site should not ask twice: the
 * questionnaire and the product pages write here, and the quote form reads it.
 * Session-scoped on purpose — nothing personal is stored beyond the tab.
 */
export type TripContext = {
  /** Where the context came from: "match" | "trek" | "experience" */
  source: string;
  /** Human-readable summary of the answers, shown back to the visitor. */
  summary?: string;
  /** Route/experience names we recommended or the visitor was looking at. */
  directions?: string[];
  /** Days available, as the visitor phrased it. */
  time?: string;
  savedAt?: string;
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
