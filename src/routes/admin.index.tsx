import { createFileRoute, Link } from "@tanstack/react-router";
import { adminSections } from "@/components/admin/sections";
import { overviewSchema } from "@/lib/cms";
import { useSection } from "@/hooks/use-operations";
import { FetchState, Module } from "@/components/admin/operations";
export const Route = createFileRoute("/admin/")({ component: Overview });
function Overview() {
  const q = useSection("overview", overviewSchema);
  const totals = q.data;
  return (
    <Module title="סקירת האתר">
      <FetchState query={q} />
      {totals && (
        <div className="ops-metrics">
          <div>
            <Link to="/admin/leads" search={{ due: "today" }}>
              פניות למעקב עד היום
            </Link>
            <strong>{totals.due}</strong>
          </div>
          <div>
            <span>פניות ב־30 הימים האחרונים</span>
            <strong>{totals.leads}</strong>
          </div>
          <div>
            <span>מתוכן נסגרו</span>
            <strong>{totals.won}</strong>
          </div>
          <div>
            <span>שיעור סגירה</span>
            <strong>
              {totals.leads ? Math.round((100 * totals.won) / totals.leads) + "%" : "—"}
            </strong>
          </div>
        </div>
      )}
      {["פניות", "תוכן", "ניהול"].map((group) => (
        <section className="ops-group" key={group}>
          <h3>{group}</h3>
          <div className="cms-grid">
            {adminSections.map((s) =>
              "description" in s && s.section === group ? (
                <Link key={s.to} to={s.to}>
                  <h4>{s.name}</h4>
                  <p>{s.description}</p>
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ))}
    </Module>
  );
}
