import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { treks } from "@/lib/content";
import { examples, STAGE_LABELS, type Stage } from "@/lib/treks/itineraries";
import { defaultContent, parseContent, type TrekContent } from "@/lib/treks/editor-content";
import { Itinerary } from "@/components/renewed/itinerary";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "ניהול מסלולים | השביל הזה" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});
function Admin() {
  const { user, loading } = useAuth();
  const userId = user?.id;
  const [access, setAccess] = useState<{ id: string; allowed: boolean; error: boolean } | null>(
    null,
  );
  const [attempt, setAttempt] = useState(0);
  const [slug, setSlug] = useState(treks[0]!.slug);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let live = true;
    if (userId)
      void supabase.rpc("can_edit_treks").then(({ data, error }) => {
        if (live) setAccess({ id: userId, allowed: data === true, error: Boolean(error) });
      });
    return () => {
      live = false;
    };
  }, [userId, attempt]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  return (
    <section className="site-frame p-section content-admin">
      <h1 className="p-h1">ניהול מסלולים</h1>
      {loading || (user && access?.id !== user.id) ? (
        <p role="status">בודקים הרשאת עריכה…</p>
      ) : !user ? (
        <>
          <p>כדי לערוך מסלולים, נכנסים עם חשבון Google שהוגדר לעריכה.</p>
          <Link className="p-btn p-btn-primary" to="/auth" search={{ next: "admin" }}>
            כניסה לאתר
          </Link>
        </>
      ) : access?.error ? (
        <>
          <p role="alert">לא הצלחנו לבדוק את ההרשאה כרגע.</p>
          <button onClick={() => setAttempt(attempt + 1)}>בדיקה חוזרת</button>
        </>
      ) : !access?.allowed ? (
        <p>החשבון המחובר אינו מורשה לערוך מסלולים.</p>
      ) : (
        <>
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
          <TrekEditor
            key={slug}
            slug={slug}
            dirty={dirty}
            setDirty={setDirty}
            setSaving={setSaving}
          />
        </>
      )}
    </section>
  );
}

type Revision = { revision: number; content: unknown; published: boolean; created_at: string };

function TrekEditor({
  slug,
  dirty,
  setDirty,
  setSaving,
}: {
  slug: string;
  dirty: boolean;
  setDirty: (d: boolean) => void;
  setSaving: (s: boolean) => void;
}) {
  const defaults = defaultContent(examples[slug]!);
  const [form, setForm] = useState(defaults);
  const [history, setHistory] = useState<Revision[]>([]);
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<"loading" | "ready" | "saving" | "error">("loading");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);
  const [preview, setPreview] = useState(false);
  const [conflict, setConflict] = useState(false);
  useEffect(() => {
    let live = true;
    void supabase
      .from("trek_revisions")
      .select("revision,content,published,created_at")
      .eq("slug", slug)
      .order("revision", { ascending: false })
      .limit(35)
      .then(({ data, error }) => {
        if (!live) return;
        if (error) {
          setState("error");
          return;
        }
        const rows = data ?? [];
        const latest = rows[0];
        const source = latest ? parseContent(latest.content) : defaultContent(examples[slug]!);
        if (!source) {
          setState("error");
          return;
        }
        setForm(source);
        setHistory(rows);
        setRevision(latest?.revision ?? 0);
        setConflict(false);
        setState("ready");
      });
    return () => {
      live = false;
    };
  }, [slug, reload]);
  function change(next: TrekContent) {
    setForm(next);
    setDirty(true);
    setNotice("");
  }
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
  async function save(publish: boolean) {
    const content = parseContent(form);
    if (!content) {
      setNotice("צריך למלא תיאור, גובה, הסבר על משך המסלול ונקודות יציאה, סיום ותיאור לכל יום.");
      return;
    }
    if (state !== "ready") return;
    setState("saving");
    setSaving(true);
    try {
      const { data, error } = await supabase.rpc("write_trek_revision", {
        trek_slug: slug,
        expected_revision: revision,
        page_content: content,
        publish_now: publish,
      });
      if (error || typeof data !== "number") {
        if (error?.code === "40001") {
          setConflict(true);
          setNotice(
            "נשמרה גרסה חדשה בחשבון אחר. התוכן שלך מוצג כאן, ואפשר להעתיק אותו לפני טעינת הגרסה החדשה.",
          );
        } else setNotice("השמירה לא הושלמה. השינויים עדיין נמצאים בטופס.");
        return;
      }
      setRevision(data);
      setHistory((old) =>
        [
          { revision: data, published: publish, content, created_at: new Date().toISOString() },
          ...old,
        ].slice(0, 35),
      );
      setDirty(false);
      setNotice(publish ? "הגרסה פורסמה בעמוד המסלול." : "הטיוטה נשמרה.");
    } catch {
      setNotice("לא קיבלנו אישור שמירה. אפשר לנסות שוב.");
    } finally {
      setState("ready");
      setSaving(false);
    }
  }
  if (state === "loading") return <p role="status">טוענים את המסלול…</p>;
  if (state === "error")
    return (
      <p role="alert">
        המסלול לא נטען.{" "}
        <button
          onClick={() => {
            setState("loading");
            setReload(reload + 1);
          }}
        >
          לנסות שוב
        </button>
      </p>
    );
  function restore(content: unknown) {
    const next = parseContent(content);
    if (next) {
      change(next);
      setNotice("הגרסה נטענה לעורך. אפשר לבדוק אותה לפני השמירה או הפרסום.");
    }
  }
  return (
    <>
      <div className="admin-actions">
        <button type="button" aria-pressed={preview} onClick={() => setPreview(!preview)}>
          {preview ? "חזרה לעריכה" : "תצוגה מקדימה"}
        </button>
        <Link to="/treks/$slug" params={{ slug }} target="_blank" rel="noopener noreferrer">
          פתיחת העמוד באתר
        </Link>
      </div>
      {preview ? (
        <article className="p-card admin-preview">
          <h2 className="p-h2">{treks.find((t) => t.slug === slug)?.name}</h2>
          <p>{form.description}</p>
          <p>{form.altitude}</p>
          <p>{form.difference}</p>
          <Itinerary stages={form.stages} />
        </article>
      ) : (
        <fieldset disabled={state === "saving"} className="admin-fields">
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
                  <input
                    value={day.end}
                    onChange={(e) => stageChange(i, { end: e.target.value })}
                  />
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
                  <input
                    value={day.time}
                    onChange={(e) => stageChange(i, { time: e.target.value })}
                  />
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
                    onClick={() =>
                      change({ ...form, stages: form.stages.filter((_, n) => i !== n) })
                    }
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
        </fieldset>
      )}
      <div className="admin-actions">
        <button
          disabled={state === "saving" || conflict || !dirty}
          onClick={() => void save(false)}
        >
          שמירת טיוטה
        </button>
        <button
          className="p-btn p-btn-primary"
          disabled={state === "saving" || conflict || (!dirty && history[0]?.published !== false)}
          onClick={() => void save(true)}
        >
          פרסום באתר
        </button>
      </div>
      <p role="status">{notice || (dirty ? "יש שינויים שטרם נשמרו." : "")}</p>
      {conflict && (
        <button
          onClick={() => {
            setDirty(false);
            setState("loading");
            setReload(reload + 1);
            setNotice("");
          }}
        >
          טעינת הגרסה החדשה
        </button>
      )}
      <details className="admin-stage">
        <summary>גרסאות קודמות</summary>
        <ul>
          {history.map((r) => (
            <li key={r.revision}>
              <button disabled={state === "saving"} onClick={() => restore(r.content)}>
                טעינת גרסה {r.revision} · {r.published ? "פורסמה" : "טיוטה"} ·{" "}
                {new Date(r.created_at).toLocaleDateString("he-IL")}
              </button>
            </li>
          ))}
          <li>
            <button disabled={state === "saving"} onClick={() => restore(defaults)}>
              טעינת המסלול המקורי
            </button>
          </li>
        </ul>
      </details>
    </>
  );
}
