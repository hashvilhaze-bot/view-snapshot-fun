import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { editCms, settingsSchema, type Integrations } from "@/lib/cms";
import { useSave, useSection } from "@/hooks/use-operations";
import { FetchState, Module } from "@/components/admin/operations";
export const Route = createFileRoute("/admin/integrations")({ component: IntegrationsPage });
const fields: [keyof Integrations, string, string, string][] = [
  ["ga", "מזהה מדידה של Google Analytics", "G-XXXXXXXXXX", "G-[A-Z0-9]{4,20}"],
  ["pixel", "מזהה Meta Pixel", "מספר הפיקסל", "[0-9]{5,25}"],
  [
    "verification",
    "אימות בעלות ב־Search Console",
    "הערך מתוך תגית האימות",
    "[A-Za-z0-9_\\-]{8,160}",
  ],
  [
    "googleClient",
    "מזהה לקוח Google OAuth",
    "…apps.googleusercontent.com",
    "[A-Za-z0-9\\-]+\\.apps\\.googleusercontent\\.com",
  ],
  ["property", "מספר הנכס ב־GA4", "לדוגמה 123456789", "[0-9]{1,20}"],
  ["searchProperty", "הנכס ב־Search Console", "https://example.com/ או sc-domain:example.com", ""],
  ["turnstile", "מפתח אתר של Cloudflare Turnstile", "Site key", "[A-Za-z0-9_\\-]{10,120}"],
];
function IntegrationsPage() {
  const q = useSection("settings", settingsSchema);
  return (
    <Module title="חיבורים וכלי מדידה">
      <FetchState query={q} />
      {q.data && (
        <Settings
          key={q.data.version}
          initial={q.data.config}
          version={q.data.version}
          hasSecret={q.data.captchaSecret}
          reload={() => q.refetch()}
        />
      )}
    </Module>
  );
}
function Settings({
  initial,
  version,
  hasSecret,
  reload,
}: {
  initial: Integrations;
  version: number;
  hasSecret: boolean;
  reload: () => Promise<unknown>;
}) {
  const [config, setConfig] = useState(initial),
    [secret, setSecret] = useState(""),
    save = useSave(),
    client = useQueryClient(),
    router = useRouter();
  const field = ([key, label, hint, pattern]: (typeof fields)[number]) => (
    <label key={key}>
      {label}
      <input
        dir="ltr"
        value={config[key] ?? ""}
        placeholder={hint}
        pattern={pattern || undefined}
        onChange={(e) => setConfig({ ...config, [key]: e.target.value.trim() })}
      />
    </label>
  );
  return (
    <form
      className="ops-settings"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        void save.run(async () => {
          await editCms("settings", "integrations", version, {
            ...config,
            ...(secret ? { turnstileSecret: secret } : {}),
          });
          setSecret("");
          await client.invalidateQueries({ queryKey: ["cms-public"] });
          await router.invalidate();
          await reload();
        });
      }}
    >
      <fieldset className="ops-panel">
        <legend>מדידה באתר</legend>
        {fields.slice(0, 3).map(field)}
        <small>תגי המדידה פועלים בעמודים הציבוריים לאחר שהמבקר מאשר מדידה.</small>
      </fieldset>
      <fieldset className="ops-panel">
        <legend>דוחות Google במערכת</legend>
        {fields.slice(3, 6).map(field)}
        <details>
          <summary>איך מחברים את Google?</summary>
          <ol>
            <li>
              בפרויקט Google Cloud מפעילים את Google Analytics Data API ואת Search Console API לפי
              הכלים שבשימוש.
            </li>
            <li>
              יוצרים מזהה OAuth מסוג Web application ומוסיפים לכתובות JavaScript המאושרות את{" "}
              <bdi>{location.origin}</bdi>.
            </li>
            <li>
              מזינים כאן את המזהה ואת הנכס, שומרים ונכנסים ל״סטטיסטיקות״ עם חשבון שיש לו הרשאת
              קריאה.
            </li>
          </ol>
        </details>
      </fieldset>
      <fieldset className="ops-panel">
        <legend>אימות אנושי בטפסים</legend>
        {fields.slice(6).map(field)}
        <label>
          מפתח סודי של Turnstile
          <input
            type="password"
            dir="ltr"
            autoComplete="new-password"
            value={secret}
            maxLength={200}
            required={!!config.turnstile && !hasSecret}
            placeholder={hasSecret ? "מפתח שמור בכספת" : "Secret key"}
            onChange={(e) => setSecret(e.target.value.trim())}
          />
        </label>
        <small>
          ב־Cloudflare מוסיפים את כתובת האתר לרשימת המארחים של הווידג׳ט. מחיקת מפתח האתר מכבה את
          האימות.
        </small>
      </fieldset>
      <button disabled={save.saving}>שמירת חיבורים</button>
      <p role="status">{save.message}</p>
    </form>
  );
}
