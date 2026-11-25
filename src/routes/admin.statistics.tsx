import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Module, Period } from "@/components/admin/operations";
import { GooglePerformance } from "@/components/admin/google-performance";
import { sitePages } from "@/lib/site-pages";
export const Route = createFileRoute("/admin/statistics")({ component: Statistics });
function Statistics() {
  const [days, setDays] = useState(30);
  return (
    <Module title="סטטיסטיקות האתר" tools={<Period value={days} change={setDays} />}>
      <GooglePerformance days={days}>
        {(t) =>
          !t || (!t.ga && !t.search) ? null : (
            <div className="ops-scroll">
              <table>
                <thead>
                  <tr>
                    <th>עמוד</th>
                    <th>צפיות באתר</th>
                    <th>קליקים מחיפוש</th>
                    <th>חשיפות בחיפוש</th>
                  </tr>
                </thead>
                <tbody>
                  {sitePages
                    .slice()
                    .sort((a, b) => (t.pages[b.path]?.views ?? 0) - (t.pages[a.path]?.views ?? 0))
                    .map((p) => (
                      <tr key={p.path}>
                        <th>{p.name}</th>
                        <td>{t.ga ? (t.pages[p.path]?.views ?? 0) : "—"}</td>
                        <td>{t.search ? (t.pages[p.path]?.clicks ?? 0) : "—"}</td>
                        <td>{t.search ? (t.pages[p.path]?.impressions ?? 0) : "—"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )
        }
      </GooglePerformance>
    </Module>
  );
}
