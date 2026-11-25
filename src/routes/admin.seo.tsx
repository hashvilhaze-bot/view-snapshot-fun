import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { editCms, pageSettingsSchema, type Seo } from "@/lib/cms";
import { sitePages } from "@/lib/site-pages";
import { PUBLIC_ORIGIN } from "@/lib/public-meta";
import { useSave, useSection } from "@/hooks/use-operations";
import { FetchState, Module } from "@/components/admin/operations";
export const Route = createFileRoute("/admin/seo")({ component: SeoPage });
async function getDefaults(path: string) {
  const response = await fetch(path, {
    headers: { Accept: "text/html" },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Page unavailable");
  const doc = new DOMParser().parseFromString(await response.text(), "text/html");
  const field = (name: string) => {
    const tag = doc.querySelector('meta[property="og:' + name + '"]');
    return tag?.getAttribute("data-default") || tag?.getAttribute("content") || "";
  };
  return {
    title: field("title"),
    description: field("description"),
    image: field("image"),
    heading: doc.querySelector("h1")?.textContent?.trim() ?? "",
  };
}
function SeoPage() {
  const [path, setPath] = useState("/"),
    [dirty, setDirty] = useState(false);
  const q = useSection("seo", pageSettingsSchema, { path }),
    defaults = useQuery({
      queryKey: ["page-defaults", path],
      queryFn: () => getDefaults(path),
      staleTime: 60000,
    });
  return (
    <Module title="ניהול SEO">
      <label>
        עמוד או מאמר
        <select
          value={path}
          onChange={(e) => {
            if (!dirty || window.confirm("לעבור לעמוד אחר ולוותר על השינויים שטרם נשמרו?")) {
              setDirty(false);
              setPath(e.target.value);
            }
          }}
        >
          {sitePages.map((p) => (
            <option key={p.path} value={p.path}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <FetchState query={q} />
      <FetchState query={defaults} />
      {q.data && defaults.data && (
        <SeoEditor
          key={path + q.data.version}
          path={path}
          initial={q.data.config}
          version={q.data.version}
          defaults={defaults.data}
          dirty={setDirty}
          reload={() => q.refetch()}
        />
      )}
    </Module>
  );
}
function SeoEditor({
  path,
  initial,
  version,
  defaults,
  dirty,
  reload,
}: {
  path: string;
  initial: Seo;
  version: number;
  defaults: Awaited<ReturnType<typeof getDefaults>>;
  dirty: (v: boolean) => void;
  reload: () => Promise<unknown>;
}) {
  const [form, setForm] = useState(initial),
    save = useSave(),
    client = useQueryClient(),
    router = useRouter();
  const title = form.title || defaults.title,
    description = form.description || defaults.description,
    image = form.image || defaults.image,
    focus = form.focus?.trim();
  const update = (next: Seo) => {
    setForm(next);
    dirty(true);
  };
  const checks = [
    { ok: title.length >= 25 && title.length <= 60, txt: "כותרת ברורה באורך של כ־25 עד 60 תווים" },
    {
      ok: description.length >= 70 && description.length <= 160,
      txt: "תיאור שמסביר מה מחכה לקורא, באורך של כ־70 עד 160 תווים",
    },
    { ok: !!image, txt: "תמונה לתצוגת השיתוף" },
    ...(focus
      ? [
          { ok: title.includes(focus), txt: "ביטוי המיקוד מופיע בכותרת" },
          { ok: description.includes(focus), txt: "ביטוי המיקוד מופיע בתיאור" },
        ]
      : []),
  ];
  return (
    <div className="ops-split">
      <form
        className="ops-panel"
        onSubmit={(e) => {
          e.preventDefault();
          void save.run(async () => {
            await editCms("seo", path, version, form);
            dirty(false);
            await client.invalidateQueries({ queryKey: ["cms-public"] });
            await router.invalidate();
            await reload();
          });
        }}
      >
        <label>
          ביטוי מיקוד
          <input
            value={form.focus ?? ""}
            maxLength={100}
            onChange={(e) => update({ ...form, focus: e.target.value })}
          />
        </label>
        <label>
          כותרת לחיפוש · {title.length} תווים
          <input
            value={form.title ?? ""}
            maxLength={130}
            placeholder={defaults.title}
            onChange={(e) => update({ ...form, title: e.target.value })}
          />
        </label>
        <label>
          תיאור · {description.length} תווים
          <textarea
            value={form.description ?? ""}
            maxLength={400}
            placeholder={defaults.description}
            onChange={(e) => update({ ...form, description: e.target.value })}
          />
        </label>
        <label>
          כתובת תמונת השיתוף
          <input
            dir="ltr"
            type="url"
            pattern="https://.+"
            value={form.image ?? ""}
            placeholder={defaults.image}
            onChange={(e) => update({ ...form, image: e.target.value })}
          />
        </label>
        <label className="ops-check">
          <input
            type="checkbox"
            checked={!!form.noindex}
            onChange={(e) => update({ ...form, noindex: e.target.checked })}
          />
          להסתיר את העמוד ממנועי חיפוש ולהסיר אותו ממפת האתר
        </label>
        <small>שדה ריק משתמש בברירת המחדל של העמוד.</small>
        <button disabled={save.saving}>שמירת הגדרות SEO</button>
        <p role="status">{save.message}</p>
      </form>
      <aside className="ops-panel">
        <h3>תצוגה משוערת בגוגל</h3>
        <div className="ops-snippet">
          <small dir="ltr">{new URL(path, PUBLIC_ORIGIN).href}</small>
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
        <h3>שיתוף ברשתות</h3>
        <div className="ops-social">
          {/^https:\/\//.test(image) && <img src={image} alt="" referrerPolicy="no-referrer" />}
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
        <h3>המלצות לשיפור</h3>
        <ul>
          {checks.map((c) => (
            <li key={c.txt}>
              {c.ok ? "✓" : "כדאי לבדוק"} · {c.txt}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
