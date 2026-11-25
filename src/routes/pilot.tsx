import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/hashvil-haze-logo.png.asset.json";
import { PilotFooter } from "@/components/pilot/pilot-footer";
import { usePilotMotion } from "@/components/pilot/pilot-motion";
import { Button } from "@/components/ui/button";
import { validPilotSlug } from "@/lib/pilot/itineraries";

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

const NAV: [string, string][] = [
  ["nepal", "לגלות את נפאל"],
  ["about", "מי אנחנו"],
  ["process", "איך זה עובד"],
  ["faq", "שאלות לפני הדרך"],
];

function PilotLayout() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search });
  const trek = validPilotSlug(
    pathname.startsWith("/pilot/treks/") ? pathname.split("/").pop() : search["trek"],
  );
  usePilotMotion(pathname);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = NAV.map(([id, label]) => (
    <Link key={id} to="/pilot" hash={id} onClick={() => setOpen(false)}>
      {label}
    </Link>
  ));

  return (
    <div className="pilot" dir="rtl" lang="he">
      <header
        className="relative z-20 border-b"
        style={{ borderColor: "var(--p-line)", background: "var(--p-paper)" }}
      >
        <div className="p-wrap flex items-center justify-between gap-6 py-3">
          <Link to="/pilot" aria-label="השביל הזה — דף הבית של הפיילוט" className="shrink-0">
            <img src={logo.url} alt="השביל הזה" className="h-12 w-auto" />
          </Link>
          <nav aria-label="ניווט ראשי" className="p-nav hidden items-center gap-8 md:flex">
            {links}
          </nav>
          <div className="md:hidden">
            <Button
              variant="ghost"
              type="button"
              className="p-btn p-btn-ghost"
              style={{ minHeight: 44, padding: "8px 16px" }}
              aria-expanded={open}
              aria-controls="pilot-mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "סגירה" : "תפריט"}
            </Button>
          </div>
        </div>
        {open && (
          <nav
            id="pilot-mobile-nav"
            aria-label="ניווט ראשי"
            className="p-nav p-wrap flex flex-col gap-4 pb-6 md:hidden"
          >
            {links}
          </nav>
        )}
      </header>
      <main id="main">
        <Outlet />
      </main>
      <PilotFooter {...(trek ? { trek } : {})} />
    </div>
  );
}
