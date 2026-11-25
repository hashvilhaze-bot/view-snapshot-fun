import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  dateLabel,
  editCms,
  formNames,
  leadsSchema,
  statuses,
  type Lead,
  type Status,
} from "@/lib/cms";
import { pageName } from "@/lib/site-pages";
import { useSave, useSection } from "@/hooks/use-operations";
import { FetchState, Module, Pager } from "@/components/admin/operations";
export const Route = createFileRoute("/admin/leads")({
  validateSearch: (search): { due?: string } => (search["due"] === "today" ? { due: "today" } : {}),
  component: Leads,
});
const fieldNames: Record<string, string> = {
  email: "דוא״ל",
  note: "הודעת המטייל",
  dates: "תקופה",
  travelers: "נוסעים",
  interests: "תחומי עניין",
  selected: "בחירות",
  considered: "מסלולים שנשקלו",
  quizAnswers: "תשובות לשאלון",
  fitScores: "התאמות",
  contextSource: "מקור הבקשה",
};
function Leads() {
  const [filter, setFilter] = useState(""),
    [due, setDue] = useState(Route.useSearch().due === "today"),
    [page, setPage] = useState(0);
  const query = useSection("leads", leadsSchema, { status: filter, due, offset: page * 30 });
  return (
    <Module title="ניהול לידים">
      <div className="ops-controls">
        <label>
          סטטוס
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(0);
            }}
          >
            <option value="">כל הסטטוסים</option>
            {Object.entries(statuses).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="ops-check">
          <input
            type="checkbox"
            checked={due}
            onChange={(e) => {
              setDue(e.target.checked);
              setPage(0);
            }}
          />
          מעקב להיום ולתאריכים שעברו
        </label>
        <button onClick={() => query.refetch()}>רענון</button>
      </div>
      <FetchState query={query} />
      {query.data && (
        <>
          {!query.data.rows.length && (
            <p className="ops-empty">
              {filter || due
                ? "אין פניות שתואמות לסינון."
                : "פניות מטופס צור קשר ומבקשות הצעה יופיעו כאן לאחר השליחה הראשונה."}
            </p>
          )}
          {query.data.rows.slice(0, 30).map((l) => (
            <LeadEditor
              key={l.id + ":" + l.version + ":" + l.delivery}
              row={l}
              staff={query.data!.staff}
              reload={async () => {
                await query.refetch();
              }}
            />
          ))}
          <Pager page={page} more={query.data.rows.length > 30} change={setPage} />
        </>
      )}
    </Module>
  );
}
function LeadEditor({
  row,
  staff,
  reload,
}: {
  row: Lead;
  staff: string[];
  reload: () => Promise<void>;
}) {
  const [status, setStatus] = useState(row.status),
    [assignee, setAssignee] = useState(row.assignee ?? ""),
    [date, setDate] = useState(row.follow_up ?? ""),
    [note, setNote] = useState("");
  const save = useSave();
  return (
    <details className="ops-lead">
      <summary>
        <strong>{row.payload["name"]}</strong>
        <span>
          {formNames[row.form]} · {dateLabel(row.created_at)}
        </span>
        <span className="ops-status">{statuses[row.status]}</span>
        {row.follow_up && <span>מעקב {dateLabel(row.follow_up)}</span>}
      </summary>
      <div className="ops-detail">
        <a href={"tel:" + row.payload["phone"]}>{row.payload["phone"]}</a>
        <dl className="ops-dl">
          <dt>עמוד הפניה</dt>
          <dd>{pageName(row.origin_page)}</dd>
          <dt>מקור הגעה</dt>
          <dd>{row.channel === "direct" ? "ישיר" : row.channel}</dd>
          {Object.entries(fieldNames)
            .filter(([k]) => row.payload[k])
            .map(([k, label]) => (
              <div key={k}>
                <dt>{label}</dt>
                <dd>{row.payload[k]}</dd>
              </div>
            ))}
        </dl>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void save.run(async () => {
              await editCms("lead", row.id, row.version, {
                status,
                assignee,
                follow_up: date,
                note,
              });
              await reload();
            });
          }}
        >
          <div className="ops-controls">
            <label>
              סטטוס הפנייה
              <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                {Object.entries(statuses).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label>
              באחריות
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                <option value="">טרם שויך</option>
                {staff.map((email) => (
                  <option key={email}>{email}</option>
                ))}
              </select>
            </label>
            <label>
              תאריך מעקב
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
          </div>
          <label>
            הוספת הערה פנימית
            <textarea
              rows={2}
              maxLength={4000}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          <button disabled={save.saving}>שמירת הפנייה</button>
        </form>
        {row.notes.length > 0 && (
          <div>
            <h3>הערות פנימיות</h3>
            {row.notes.map((n, i) => (
              <p key={i}>
                <bdi>{n.actor}</bdi> · {dateLabel(n.created_at)}
                <br />
                {n.body}
              </p>
            ))}
          </div>
        )}
        <small>
          שליחה ל־Make ·{" "}
          {row.delivery === "sent"
            ? "נמסר"
            : row.delivery === "failed"
              ? "נדרשת שליחה חוזרת"
              : "ממתין למסירה"}
        </small>
        {row.delivery === "failed" && (
          <button
            onClick={() =>
              save.run(async () => {
                await editCms("retry", row.id, 0, {});
                await reload();
              })
            }
          >
            שליחה חוזרת ל־Make
          </button>
        )}
        <p role="status">{save.message}</p>
      </div>
    </details>
  );
}
