import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { reportsSchema, formNames } from "@/lib/cms";
import { pageName } from "@/lib/site-pages";
import { useSection } from "@/hooks/use-operations";
import { FetchState, Module, Period } from "@/components/admin/operations";
export const Route = createFileRoute("/admin/reports")({ component: Reports });
function Reports() {
  const [days, setDays] = useState(30),
    [group, setGroup] = useState<"channel" | "form" | "origin_page">("channel");
  const q = useSection("reports", reportsSchema, { days }),
    groups = new Map<string, { leads: number; won: number }>();
  let total = 0,
    won = 0;
  for (const row of q.data ?? []) {
    const key = row[group],
      x = groups.get(key) ?? { leads: 0, won: 0 };
    x.leads += row.leads;
    x.won += row.won;
    groups.set(key, x);
    total += row.leads;
    won += row.won;
  }
  return (
    <Module title="דוח המרות" tools={<Period value={days} change={setDays} />}>
      <p>שיעור הסגירה הוא חלקן של הפניות בסטטוס ״נסגר״ מתוך הפניות שהתקבלו בתקופה שנבחרה.</p>
      <FetchState query={q} />
      {q.data && (
        <>
          <div className="ops-metrics">
            {[
              ["פניות", total],
              ["נסגרו", won],
              ["שיעור סגירה", total ? Math.round((100 * won) / total) + "%" : "—"],
            ].map(([l, v]) => (
              <div key={l}>
                <span>{l}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
          <label>
            פילוח
            <select value={group} onChange={(e) => setGroup(e.target.value as typeof group)}>
              <option value="channel">מקור הגעה</option>
              <option value="form">טופס</option>
              <option value="origin_page">עמוד מפנה</option>
            </select>
          </label>
          {groups.size ? (
            <div className="ops-scroll">
              <table>
                <thead>
                  <tr>
                    <th>מקור</th>
                    <th>פניות</th>
                    <th>נסגרו</th>
                    <th>שיעור סגירה</th>
                  </tr>
                </thead>
                <tbody>
                  {[...groups]
                    .sort((a, b) => b[1].leads - a[1].leads)
                    .map(([k, x]) => (
                      <tr key={k}>
                        <th>
                          {group === "form"
                            ? formNames[k]
                            : group === "origin_page"
                              ? pageName(k)
                              : k === "direct"
                                ? "ישיר"
                                : k}
                        </th>
                        <td>{x.leads}</td>
                        <td>{x.won}</td>
                        <td>{Math.round((100 * x.won) / x.leads)}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="ops-empty">טרם התקבלו פניות בתקופה הזאת.</p>
          )}
        </>
      )}
    </Module>
  );
}
