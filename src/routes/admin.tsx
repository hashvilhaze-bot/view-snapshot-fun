import { adminSections } from "@/components/admin/sections";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "ניהול האתר | השביל הזה" }, { name: "robots", content: "noindex, nofollow" }],
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
  return (
    <section className="site-frame p-section content-admin">
      <h1 className="p-h1">ניהול האתר</h1>
      {loading || (user && access?.id !== user.id) ? (
        <p role="status">בודקים הרשאת עריכה…</p>
      ) : !user ? (
        <>
          <p>כדי להיכנס לניהול האתר, נכנסים עם חשבון Google שהוגדר לעריכה.</p>
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
        <p>החשבון המחובר אינו מורשה לערוך את האתר.</p>
      ) : (
        <>
          <div className="ops-shell">
            <nav className="ops-nav" aria-label="ניווט מערכת הניהול">
              {adminSections.map((s) => (
                <Link key={s.to} to={s.to} activeOptions={{ exact: true }}>
                  {s.name}
                </Link>
              ))}
            </nav>
            <div className="ops-work">
              <Outlet />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
