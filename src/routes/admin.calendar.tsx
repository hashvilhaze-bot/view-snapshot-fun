import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { articles } from "@/lib/content";
import { calendarSchema, editCms } from "@/lib/cms";
import { GooglePerformance } from "@/components/admin/google-performance";
import { useSave, useSection } from "@/hooks/use-operations";
import { FetchState, Module, Period } from "@/components/admin/operations";
export const Route = createFileRoute("/admin/calendar")({ component: Calendar });
function Calendar() {
  const [days, setDays] = useState(30),
    q = useSection("calendar", calendarSchema, { days });
  return (
    <Module title="יומן תוכן" tools={<Period value={days} change={setDays} />}>
      <p>
        לכל מאמר מוצגים תאריך הפרסום, פניות שהגיעו ממנו וביצועים בתקופה הנבחרת. אפשר להשלים תאריך
        חסר מתוך תיעוד הפרסום שלכם.
      </p>
      <FetchState query={q} />
      <GooglePerformance days={days}>
        {(t) =>
          q.data && (
            <div className="ops-scroll">
              <table>
                <thead>
                  <tr>
                    <th>מאמר</th>
                    <th>תאריך פרסום</th>
                    <th>פניות</th>
                    <th>צפיות</th>
                    <th>קליקים מחיפוש</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => {
                    const p = "/knowledge/" + a.slug;
                    return (
                      <tr key={p}>
                        <th>
                          <a href={p}>{a.title}</a>
                        </th>
                        <td>
                          <PublicationDate
                            key={q.data!.dates[p] ?? ""}
                            path={p}
                            saved={q.data!.dates[p] ?? ""}
                            reload={() => q.refetch()}
                          />
                        </td>
                        <td>{q.data!.leads[p] ?? 0}</td>
                        <td>{t?.ga ? (t.pages[p]?.views ?? 0) : "—"}</td>
                        <td>{t?.search ? (t.pages[p]?.clicks ?? 0) : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        }
      </GooglePerformance>
    </Module>
  );
}
function PublicationDate({
  path,
  saved,
  reload,
}: {
  path: string;
  saved: string;
  reload: () => Promise<unknown>;
}) {
  const [date, setDate] = useState(saved),
    save = useSave();
  return (
    <div>
      <input
        aria-label={"תאריך פרסום " + path}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      {date && date !== saved && (
        <button
          disabled={save.saving}
          onClick={() =>
            save.run(async () => {
              await editCms("calendar", path, 0, { date, previous: saved });
              await reload();
            })
          }
        >
          שמירת התאריך
        </button>
      )}
      <small role="status">{save.message}</small>
    </div>
  );
}
