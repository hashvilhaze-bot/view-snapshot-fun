import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { historySchema, staffSchema, statuses, type Status } from "@/lib/cms";
import { pageName } from "@/lib/site-pages";
import { useSection } from "@/hooks/use-operations";
import { FetchState, Module, Pager } from "@/components/admin/operations";
const actions: Record<string, string> = {
  publish: "פרסום תוכן",
  draft: "שמירת טיוטה",
  calendar: "עריכת תאריך פרסום",
  lead: "עדכון פנייה",
  seo: "עדכון SEO",
  settings: "עדכון חיבורים",
  retry: "שליחה חוזרת ל־Make",
};
export const Route = createFileRoute("/admin/history")({ component: History });
function History() {
  const team = useSection("staff", staffSchema);
  const [page, setPage] = useState(0),
    [actor, setActor] = useState(""),
    q = useSection("history", historySchema, { offset: page * 50, actor });
  return (
    <Module title="יומן שינויים">
      <label>
        חשבון מנהל
        <select
          value={actor}
          onChange={(e) => {
            setActor(e.target.value);
            setPage(0);
          }}
        >
          <option value="">כל המנהלים</option>
          {(team.data ?? []).map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </label>
      <FetchState query={q} />
      {q.data && (
        <>
          {q.data.length ? (
            <div className="ops-scroll">
              <table>
                <thead>
                  <tr>
                    <th>מועד</th>
                    <th>מנהל</th>
                    <th>פעולה</th>
                    <th>פריט</th>
                    <th>פרטי השינוי</th>
                  </tr>
                </thead>
                <tbody>
                  {q.data.slice(0, 50).map((r, i) => (
                    <tr key={i}>
                      <td>
                        {new Date(r.created_at).toLocaleString("he-IL", {
                          timeZone: "Asia/Jerusalem",
                        })}
                      </td>
                      <td>
                        <bdi>{r.actor}</bdi>
                      </td>
                      <td>{actions[r.action] ?? r.action}</td>
                      <td>
                        {r.action === "lead" || r.action === "retry"
                          ? "פנייה " + r.target.slice(0, 8)
                          : r.action === "settings"
                            ? "הגדרות האתר"
                            : pageName(r.target)}
                      </td>
                      <td>
                        {r.detail.replace(/status:(\w+)/g, (_, s: Status) => statuses[s] ?? s) ||
                          "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="ops-empty">כאן יופיעו השינויים שהמנהלים ישמרו במערכת.</p>
          )}
          <Pager page={page} more={q.data.length > 50} change={setPage} />
        </>
      )}
    </Module>
  );
}
