import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { settingsSchema } from "@/lib/cms";
import { useSection } from "@/hooks/use-operations";
import { FetchState } from "./operations";
type OAuthReply = { access_token?: string; error?: string };
type GoogleSdk = {
  accounts: {
    oauth2: {
      initTokenClient: (options: {
        client_id: string;
        scope: string;
        callback: (r: OAuthReply) => void;
        error_callback: () => void;
      }) => { requestAccessToken: () => void };
    };
  };
};
declare global {
  interface Window {
    google?: GoogleSdk;
  }
}
export type Metrics = { views?: number; clicks?: number; impressions?: number };
type Traffic = { pages: Record<string, Metrics>; ga: boolean; search: boolean };
async function queryGoogle(url: string, token: string, body: object) {
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Google " + response.status);
  return response.json();
}
function dateAgo(n: number) {
  return new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
}
export function GooglePerformance({
  days,
  children,
}: {
  days: number;
  children: (traffic: Traffic | null) => ReactNode;
}) {
  const q = useSection("settings", settingsSchema),
    cfg = q.data?.config;
  const [sdk, setSdk] = useState<"waiting" | "ready" | "error">("waiting"),
    [token, setToken] = useState("");
  const [traffic, setTraffic] = useState<Traffic | null>(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [attempt, setAttempt] = useState(0);
  const configured = !!(cfg?.googleClient && (cfg.property || cfg.searchProperty));
  useEffect(() => {
    if (!configured) return;
    if (window.google?.accounts.oauth2) {
      setSdk("ready");
      return;
    }
    setSdk("waiting");
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => setSdk("ready");
    script.onerror = () => setSdk("error");
    document.head.append(script);
    return () => script.remove();
  }, [configured, attempt]);
  useEffect(() => {
    let active = true;
    if (!token || !cfg) return;
    const pages: Record<string, Metrics> = {};
    const errors: string[] = [];
    const ga = async () => {
      if (!cfg.property) return false;
      try {
        const result = await queryGoogle(
          "https://analyticsdata.googleapis.com/v1beta/properties/" + cfg.property + ":runReport",
          token,
          {
            dateRanges: [{ startDate: dateAgo(days), endDate: dateAgo(1) }],
            dimensions: [{ name: "pagePath" }],
            metrics: [{ name: "screenPageViews" }],
            limit: "10000",
          },
        );
        for (const r of result.rows ?? []) {
          const p = r.dimensionValues[0].value;
          pages[p] = { ...pages[p], views: Number(r.metricValues[0].value) };
        }
        return true;
      } catch {
        errors.push("Google Analytics");
        return false;
      }
    };
    const gsc = async () => {
      if (!cfg.searchProperty) return false;
      try {
        const result = await queryGoogle(
          "https://www.googleapis.com/webmasters/v3/sites/" +
            encodeURIComponent(cfg.searchProperty) +
            "/searchAnalytics/query",
          token,
          {
            startDate: dateAgo(days),
            endDate: dateAgo(1),
            dimensions: ["page"],
            rowLimit: 25000,
          },
        );
        for (const row of result.rows ?? []) {
          const p = new URL(row.keys[0]).pathname;
          const old = pages[p];
          pages[p] = {
            ...old,
            clicks: (old?.clicks ?? 0) + row.clicks,
            impressions: (old?.impressions ?? 0) + row.impressions,
          };
        }
        return true;
      } catch {
        errors.push("Search Console");
        return false;
      }
    };
    setTraffic(null);
    setBusy(true);
    setMessage("");
    void Promise.all([ga(), gsc()]).then(([ga, search]) => {
      if (active) {
        setTraffic({ ga, search, pages });
        setMessage(
          errors.length
            ? "קריאת הנתונים נכשלה עבור " + errors.join(", ") + ". בדקו הרשאות לנכס ושה־API מופעל."
            : "",
        );
        setBusy(false);
      }
    });
    return () => {
      active = false;
    };
  }, [token, cfg, days, attempt]);
  function connect() {
    if (!window.google || !cfg?.googleClient) return;
    const scope = [
      cfg.property && "https://www.googleapis.com/auth/analytics.readonly",
      cfg.searchProperty && "https://www.googleapis.com/auth/webmasters.readonly",
    ]
      .filter(Boolean)
      .join(" ");
    window.google.accounts.oauth2
      .initTokenClient({
        client_id: cfg.googleClient,
        scope,
        callback: (r) => {
          if (r.access_token) {
            setToken(r.access_token);
            setAttempt((n) => n + 1);
          } else setMessage("Google לא אישר גישה לקריאה.");
        },
        error_callback: () => setMessage("החיבור ל־Google לא הושלם."),
      })
      .requestAccessToken();
  }
  return (
    <>
      <FetchState query={q} />
      {cfg && (
        <div className="ops-panel">
          <h3>נתוני Google</h3>
          {configured ? (
            <>
              <p>
                הדוח מציג את התקופה שנבחרה עד אתמול. הכניסה מתבצעת בחשבון שיש לו הרשאת קריאה לנכס.
              </p>
              <button disabled={sdk !== "ready" || busy} onClick={connect}>
                {token ? "חיבור מחדש ל־Google" : "התחברות לנתוני Google"}
              </button>
              {sdk === "error" && (
                <button onClick={() => setAttempt((n) => n + 1)}>טעינה מחדש של החיבור</button>
              )}
            </>
          ) : (
            <p>
              כדי להציג צפיות ומיקומים בחיפוש, הגדירו את נכסי Google ואת מזהה ההתחברות.{" "}
              <Link to="/admin/integrations">להגדרות החיבור</Link>
            </p>
          )}
          {busy && <p role="status">טוענים נתונים מ־Google…</p>}
          {message && <p role="alert">{message}</p>}
        </div>
      )}
      {children(traffic)}
    </>
  );
}
