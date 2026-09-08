import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, User as UserIcon } from "lucide-react";

import logoAsset from "@/assets/hashvil-haze-logo.png.asset.json";
import { useAuth } from "@/hooks/use-auth";

const nav = [
  { to: "/", label: "בית" },
  { to: "/nepal", label: "נפאל" },
  { to: "/treks", label: "טרקים וחוויות" },
  { to: "/match", label: "מה מתאים לי?" },
  { to: "/knowledge", label: "מרכז ידע" },
  { to: "/contact", label: "דברו איתנו" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, name, avatarUrl, signOut } = useAuth();


  return (
    <header className="sticky top-0 z-50 border-b border-brand-line/20 bg-summit/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2.5 sm:px-5">
        <Link
          to="/"
          className="-m-1 shrink-0 rounded-xl p-1"
          onClick={() => setOpen(false)}
          aria-label="השביל הזה — דף הבית"
        >
          <img
            src={logoAsset.url}
            alt="השביל הזה — מתחיל כאן"
            className="h-[68px] w-auto rounded-lg object-contain sm:h-[76px]"
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
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-parchment/80 ring-1 ring-brand-line/40 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-brand-line/20 px-4 py-2 md:hidden">
          <ul className="divide-y divide-brand-line/15">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "text-parchment" }}
                  className="block px-1 py-2.5 text-[14px] font-medium text-parchment/75"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 mb-1 flex gap-2">
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-saffron px-3 py-2.5 text-center text-[14px] font-semibold text-parchment"
            >
              בואו נדבר
            </Link>
            <Link
              to="/quote"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg px-3 py-2.5 text-center text-[14px] font-medium text-parchment/80 ring-1 ring-brand-line/40"
            >
              כבר יודעים?
            </Link>
          </div>
        </nav>
      )}

    </header>
  );
}
