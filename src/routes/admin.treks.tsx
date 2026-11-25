import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { treks } from "@/lib/content";
import { examples, STAGE_LABELS, type Stage } from "@/lib/treks/itineraries";
import { defaultContent, parseContent, type TrekContent } from "@/lib/treks/editor-content";
import { Itinerary } from "@/components/renewed/itinerary";
import { RevisionEditor } from "@/components/admin/revision-editor";

export const Route = createFileRoute("/admin/treks")({ component: TreksAdmin });
function TreksAdmin() {
  const [slug, setSlug] = useState(treks[0]!.slug);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const defaults = useMemo(() => defaultContent(examples[slug]!), [slug]);
  return (
    <div className="cms-module">
      <h2 className="p-h2">עריכת מסלולים</h2>
      <label>
        בחירת מסלול
        <select
          value={slug}
          disabled={saving}
          onChange={(e) => {
            if (!dirty || window.confirm("לעבור למסלול אחר ולוותר על השינויים שטרם נשמרו?")) {
              setDirty(false);
              setSlug(e.target.value);
            }
          }}
        >
          {treks.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <RevisionEditor
        key={slug}
        slug={slug}
        defaults={defaults}
        parseContent={parseContent}
        invalidMessage="צריך למלא תיאור, גובה, הסבר על משך המסלול ונקודות יציאה, סיום ותיאור לכל יום."
        publicPath={"/treks/" + slug}
        onDirty={setDirty}
        onSaving={setSaving}
        renderFields={(form, change) => <TrekFields form={form} change={change} />}
        renderPreview={(form) => (
          <article>
            <h3 className="p-h2">{treks.find((t) => t.slug === slug)?.name}</h3>
            <p>{form.description}</p>
            <p>{form.altitude}</p>
            <p>{form.difference}</p>
            <Itinerary stages={form.stages} />
          </article>
        )}
      />
    </div>
  );
}
function TrekFields({ form, change }: { form: TrekContent; change: (next: TrekContent) => void }) {
  function stageChange(i: number, patch: Partial<Stage>) {
    change({ ...form, stages: form.stages.map((s, n) => (n === i ? { ...s, ...patch } : s)) });
  }
  function move(i: number, offset: number) {
    const stages = [...form.stages];
    const item = stages.splice(i, 1)[0];
    if (item) {
      stages.splice(i + offset, 0, item);
      change({ ...form, stages });
    }
  }
  return (
    <>
      <div>
        <label htmlFor="trek-description">תיאור קצר</label>
        <textarea
          id="trek-description"
          value={form.description}
          onChange={(e) => change({ ...form, description: e.target.value })}
        />
      </div>
      <label>
        הנקודה הגבוהה במסלול
        <input
          value={form.altitude}
          onChange={(e) => change({ ...form, altitude: e.target.value })}
        />
      </label>
      <div>
        <label htmlFor="trek-duration">משך המסלול וחלוקת הימים</label>
        <textarea
          id="trek-duration"
          value={form.difference}
          onChange={(e) => change({ ...form, difference: e.target.value })}
        />
      </div>
      <h2 className="p-h2">ימי המסלול</h2>
      {form.stages.map((day, i) => (
        <details className="admin-stage" key={day.id}>
          <summary>
            יום {i + 1} · {day.start} ← {day.end}
          </summary>
          <div className="admin-fields">
            <label>
              נקודת יציאה
              <input
                value={day.start}
                onChange={(e) => stageChange(i, { start: e.target.value })}
              />
            </label>
            <label>
              נקודת סיום
              <input value={day.end} onChange={(e) => stageChange(i, { end: e.target.value })} />
            </label>
            <label>
              סוג היום
              <select
                value={day.kind}
                onChange={(e) => stageChange(i, { kind: e.target.value as Stage["kind"] })}
              >
                {Object.entries(STAGE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              משך משוער
              <input value={day.time} onChange={(e) => stageChange(i, { time: e.target.value })} />
            </label>
            <div>
              <label htmlFor={"stage-story-" + day.id}>תיאור היום</label>
              <textarea
                id={"stage-story-" + day.id}
                value={day.story}
                onChange={(e) => stageChange(i, { story: e.target.value })}
              />
            </div>
            <div className="admin-actions">
              <button disabled={i === 0} onClick={() => move(i, -1)}>
                הזזה ליום קודם
              </button>
              <button disabled={i === form.stages.length - 1} onClick={() => move(i, 1)}>
                הזזה ליום הבא
              </button>
              <button
                disabled={form.stages.length === 1}
                onClick={() => change({ ...form, stages: form.stages.filter((_, n) => i !== n) })}
              >
                הסרת היום מהעריכה
              </button>
            </div>
          </div>
        </details>
      ))}
      <button
        disabled={form.stages.length >= 65}
        onClick={() =>
          change({
            ...form,
            stages: [
              ...form.stages,
              {
                id: crypto.randomUUID(),
                kind: "walk",
                start: "",
                end: "",
                time: "",
                story: "",
              },
            ],
          })
        }
      >
        הוספת יום
      </button>
    </>
  );
}
