import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "בית" },
  { to: "/nepal", label: "נפאל" },
  { to: "/treks", label: "טרקים וחוויות" },
  { to: "/match", label: "מה מתאים לי?" },
  { to: "/knowledge", label: "לפני שנוסעים" },
  { to: "/contact", label: "דברו איתנו" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-parchment/10 bg-summit/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-saffron/90 font-display text-sm font-bold text-parchment">
            ה
          </span>
          <span className="truncate font-display text-base font-bold tracking-tight text-parchment">
            השביל הזה
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.slice(1).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-parchment bg-parchment/10" }}
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-parchment/70 transition-colors hover:text-parchment"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="תפריט"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-parchment/80 ring-1 ring-parchment/20 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-parchment/10 px-5 pt-2 pb-4 md:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeProps={{ className: "text-parchment" }}
              className="block rounded-lg px-2 py-3 text-[15px] font-medium text-parchment/75"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
