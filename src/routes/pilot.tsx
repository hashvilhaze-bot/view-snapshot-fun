import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/pilot")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
    links: [
      { rel: "stylesheet", href: "/pilot.css" },
      {
        rel: "preload",
        href: "/fonts/pompei/Pompei_Block_FS-Regular.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/pompei/Pompei_Block_FS-Black.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: PilotLayout,
});

function PilotLayout() {
  return (
    <div className="pilot" dir="rtl" lang="he">
      <header className="border-b" style={{ borderColor: "var(--p-line)" }}>
        <div className="p-wrap flex items-center justify-between gap-4 py-4">
          <Link to="/pilot" className="text-[22px] font-black no-underline" style={{ color: "inherit" }}>
            השביל הזה
          </Link>
          <span className="p-muted text-[14px]">פיילוט עיצוב · לא לפרסום</span>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="p-band">
        <div className="p-wrap py-8 text-[15px]">
          <p className="font-semibold">השביל הזה</p>
          <p className="p-muted mt-1">גרסת פיילוט לבדיקה פנימית. האתר הקיים לא השתנה.</p>
        </div>
      </footer>
    </div>
  );
}
