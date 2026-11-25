import { createFileRoute, Link } from "@tanstack/react-router";
import { treks } from "@/lib/content";

export const Route = createFileRoute("/admin/")({ component: AdminOverview });
function AdminOverview() {
  return (
    <div className="cms-grid">
      <Link to="/admin/home">
        <h2 className="p-h3">עריכת דף הבית</h2>
        <p>כותרת הפתיחה, הטקסט שמלווה אותה ותצוגה מקדימה של ההירו.</p>
      </Link>
      <Link to="/admin/treks">
        <h2 className="p-h3">עריכת מסלולים</h2>
        <p>תיאורים, גבהים וחלוקת הימים ב־{treks.length} הטרקים שבאתר.</p>
      </Link>
    </div>
  );
}
