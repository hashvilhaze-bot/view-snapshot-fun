import { useBlocker } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

type Revision = { revision: number; content: unknown; published: boolean; created_at: string };
export function RevisionEditor<T extends Json>({
  slug,
  defaults,
  parseContent,
  invalidMessage,
  publicPath,
  renderFields,
  renderPreview,
  onDirty,
  onSaving,
}: {
  slug: string;
  defaults: T;
  parseContent: (value: unknown) => T | null;
  invalidMessage: string;
  publicPath: string;
  renderFields: (form: T, change: (next: T) => void) => ReactNode;
  renderPreview: (form: T) => ReactNode;
  onDirty?: (dirty: boolean) => void;
  onSaving?: (saving: boolean) => void;
}) {
  const [dirty, setLocalDirty] = useState(false);
  function setDirty(value: boolean) {
    setLocalDirty(value);
    onDirty?.(value);
  }
  const [form, setForm] = useState(defaults);
  const [history, setHistory] = useState<Revision[]>([]);
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<"loading" | "ready" | "saving" | "error">("loading");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);
  const [preview, setPreview] = useState(false);
  const [conflict, setConflict] = useState(false);
  useBlocker({
    enableBeforeUnload: dirty || state === "saving",
    disabled: !dirty && state !== "saving",
    shouldBlockFn: () =>
      state === "saving" || !window.confirm("לעזוב את העורך ולוותר על השינויים שטרם נשמרו?"),
  });
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
        const source = latest ? parseContent(latest.content) : defaults;
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
  }, [slug, reload, defaults, parseContent]);
  function change(next: T) {
    setForm(next);
    setDirty(true);
    setNotice("");
  }
  async function save(publish: boolean) {
    const content = parseContent(form);
    if (!content) {
      setNotice(invalidMessage);
      return;
    }
    if (state !== "ready") return;
    setState("saving");
    onSaving?.(true);
    try {
      const { data, error } = await supabase.rpc("write_site_revision", {
        page_key: slug,
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
      setNotice(publish ? "הגרסה פורסמה באתר." : "הטיוטה נשמרה.");
    } catch {
      setNotice("לא קיבלנו אישור שמירה. אפשר לנסות שוב.");
    } finally {
      setState("ready");
      onSaving?.(false);
    }
  }
  if (state === "loading") return <p role="status">טוענים את התוכן…</p>;
  if (state === "error")
    return (
      <p role="alert">
        התוכן לא נטען.{" "}
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
        <a href={publicPath} target="_blank" rel="noopener noreferrer">
          פתיחת העמוד באתר
        </a>
      </div>
      {preview ? (
        <div className="admin-preview p-card">{renderPreview(form)}</div>
      ) : (
        <fieldset disabled={state === "saving"} className="admin-fields">
          {renderFields(form, change)}
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
              טעינת התוכן המקורי
            </button>
          </li>
        </ul>
      </details>
    </>
  );
}
