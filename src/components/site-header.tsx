import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import logoAsset from "@/assets/hashvil-haze-logo.png.asset.json";

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
    <header className="sticky top-0 z-50 border-b border-brand-line/20 bg-summit/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-2">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)} aria-label="השביל הזה — דף הבית">
          <img
            src={logoAsset.url}
            alt="השביל הזה — מתחיל כאן"
            className="h-14 w-auto rounded-sm object-contain sm:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.slice(1).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-parchment bg-brand-sky/15" }}
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
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-parchment/80 ring-1 ring-brand-line/40 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-brand-line/20 px-5 pt-2 pb-4 md:hidden">
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
