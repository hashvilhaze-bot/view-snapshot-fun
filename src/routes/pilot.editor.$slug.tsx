import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PilotItinerary, usePilotStages } from "@/components/pilot/pilot-itinerary";
import {
  examples,
  storageKey,
  STAGE_LABELS,
  type Stage,
  type StageKind,
} from "@/lib/pilot/itineraries";
import { treks } from "@/lib/content";
export const Route = createFileRoute("/pilot/editor/$slug")({
  loader: ({ params }) => {
    const trek = treks.find((t) => t.slug === params.slug);
    const example = examples[params.slug];
    if (!trek || !example) throw notFound();
    return { trek, example };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `עורך דוגמה · ${loaderData?.trek.name ?? "מסלול"} | השביל הזה` },
      { name: "description", content: "עורך מקומי לדוגמת המסלול בפיילוט, ללא שינוי בתוכן האתר." },
      { property: "og:title", content: `עורך דוגמה · ${loaderData?.trek.name ?? "מסלול"}` },
      { property: "og:description", content: "עריכת דוגמת מסלול מקומית בלבד." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PilotEditor,
});
function PilotEditor() {
  const { trek, example } = Route.useLoaderData();
  return <Editor key={trek.slug} slug={trek.slug} name={trek.name} defaults={example.stages} />;
}
function Editor({ slug, name, defaults }: { slug: string; name: string; defaults: Stage[] }) {
  const { stages, setStages, ready } = usePilotStages(slug, defaults);
  const [notice, setNotice] = useState("");
  function edit(id: string, key: keyof Stage, value: string) {
    setStages((old) => old.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
    setNotice("יש שינויים שלא נשמרו.");
  }
  function move(i: number, delta: number) {
    setStages((old) => {
      const a = [...old];
      const item = a[i];
      if (!item || i + delta < 0 || i + delta >= a.length) return old;
      a.splice(i, 1);
      a.splice(i + delta, 0, item);
      return a;
    });
    setNotice("יש שינויים שלא נשמרו.");
  }
  function save() {
    try {
      localStorage.setItem(storageKey(slug), JSON.stringify(stages));
      setNotice("נשמר בדפדפן הזה בלבד.");
    } catch {
      setNotice("הדפדפן לא מאפשר שמירה מקומית.");
    }
  }
  function reset() {
    try {
      localStorage.removeItem(storageKey(slug));
      setStages(defaults);
      setNotice("ברירת המחדל שוחזרה.");
    } catch {
      setNotice("לא ניתן לשנות את השמירה בדפדפן.");
    }
  }
  return (
    <section className="p-section">
      <div className="p-wrap">
        <p className="p-kicker">עורך דוגמה מקומי</p>
        <h1 className="p-h2">{name}</h1>
        <p className="p-notice mt-5">
          השינויים נשמרים רק בדפדפן הזה ולמסלול הזה. הם לא משנים את האתר, לא נשלחים לאוהד ולא
          מחליפים תוכנית טיול.
        </p>
        <nav aria-label="בחירת מסלול לעריכה" className="p-trek-links mt-5">
          {treks.map((t) => (
            <Link
              key={t.slug}
              to="/pilot/editor/$slug"
              params={{ slug: t.slug }}
              aria-current={t.slug === slug ? "page" : undefined}
            >
              {t.name}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button className="p-btn p-btn-primary" onClick={save} disabled={!ready}>
            <Save />
            שמירה מקומית
          </Button>
          <Button variant="ghost" className="p-btn p-btn-ghost" onClick={reset} disabled={!ready}>
            <RotateCcw />
            שחזור ברירת מחדל
          </Button>
          <Button
            variant="ghost"
            className="p-btn p-btn-ghost"
            onClick={() => {
              setStages((a) => [
                ...a,
                { id: crypto.randomUUID(), start: "", end: "", kind: "walk", time: "", story: "" },
              ]);
              setNotice("נוסף יום לעריכה.");
            }}
            disabled={!ready || stages.length >= 60}
          >
            <Plus />
            הוספת יום
          </Button>
        </div>
        <p role="status" className="p-muted mt-3">
          {notice}
        </p>
        <div className="p-editor-grid mt-8">
          {stages.map((s, i) => (
            <fieldset key={s.id} className="p-card p-5">
              <legend className="font-semibold px-2">יום {i + 1}</legend>
              <div className="flex gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`העברת יום ${i + 1} למעלה`}
                  title="העברה למעלה"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  <ArrowUp />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`העברת יום ${i + 1} למטה`}
                  title="העברה למטה"
                  disabled={i === stages.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`מחיקת יום ${i + 1}`}
                  title="מחיקת יום"
                  disabled={stages.length === 1}
                  onClick={() => {
                    setStages((a) => a.filter((x) => x.id !== s.id));
                    setNotice("יש שינויים שלא נשמרו.");
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
              {(["start", "end", "time"] as const).map((k) => (
                <label key={k} className="p-label block mb-3">
                  {{ start: "התחלה", end: "סיום", time: "זמן משוער (אפשר להשאיר ריק)" }[k]}
                  <input
                    className="p-field"
                    value={s[k]}
                    onChange={(e) => edit(s.id, k, e.target.value)}
                  />
                </label>
              ))}
              <label className="p-label block mb-3">
                סוג היום
                <select
                  className="p-field"
                  value={s.kind}
                  onChange={(e) => edit(s.id, "kind", e.target.value as StageKind)}
                >
                  {Object.entries(STAGE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="p-label block">
                סיפור היום
                <textarea
                  className="p-field"
                  rows={3}
                  value={s.story}
                  onChange={(e) => edit(s.id, "story", e.target.value)}
                />
              </label>
            </fieldset>
          ))}
        </div>
        <h2 className="p-h2 mt-12">התרשים שלכם</h2>
        <PilotItinerary stages={stages} />
        <Link to="/pilot/treks/$slug" params={{ slug }} className="p-link">
          לעמוד המסלול
        </Link>
        <details className="p-rule mt-10">
          <summary>שדות לתבנית ניהול עתידית</summary>
          <p>
            מסלול: מזהה קבוע (slug), גרסה, כתובת מקור ותאריך בדיקה. יום: מזהה קבוע, סדר, התחלה,
            סיום, סוג, זמן משוער וסיפור קצר. זמן יכול להישאר ריק כאשר אין מקור מבוסס. הסדר נקבע לפי
            מיקום היום ברשימה.
          </p>
        </details>
      </div>
    </section>
  );
}
