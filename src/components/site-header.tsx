import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X, User as UserIcon } from "lucide-react";

import { WhatsappIcon } from "@/components/whatsapp-icon";

import logoAsset from "@/assets/hashvil-haze-logo.png.asset.json";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { destinations } from "@/lib/destinations";
import type { TranslationKey } from "@/lib/i18n";
import { whatsappHref } from "@/lib/leads";

/** Main nav. Destinations are one clean entry, so new ones don't crowd the bar. */
const nav: { to: string; key: TranslationKey }[] = [
  { to: "/treks", key: "nav.treks" },
  { to: "/knowledge", key: "nav.knowledge" },
  { to: "/about", key: "nav.about" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);
  const { user, name, avatarUrl, signOut } = useAuth();
  const { t } = useLocale();
  const wa = whatsappHref();

  useEffect(() => {
    if (!destOpen) return;
    const onDown = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setDestOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDestOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [destOpen]);

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
            alt="השביל הזה — מסעות בהתאמה אישית בהימלאיה"
            className="h-[80px] w-auto rounded-lg object-contain sm:h-[92px]"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <div className="relative" ref={destRef}>
            <button
              type="button"
              aria-expanded={destOpen}
              aria-haspopup="true"
              onClick={() => setDestOpen((v) => !v)}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium text-parchment/70 transition-colors hover:text-parchment"
            >
              {t("nav.destinations")}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {destOpen && (
              <div className="absolute end-0 mt-1 w-56 overflow-hidden rounded-2xl border border-brand-line/25 bg-summit/98 py-1.5 shadow-xl backdrop-blur-md">
                <Link
                  to="/destinations"
                  onClick={() => setDestOpen(false)}
                  className="block px-4 py-2 text-[13px] font-semibold text-parchment/85 hover:bg-brand-sky/15"
                >
                  {t("nav.allDestinations")}
                </Link>
                <div className="my-1 border-t border-brand-line/20" />
                {destinations.map((d) => (
                  <Link
                    key={d.slug}
                    to={d.to}
                    onClick={() => setDestOpen(false)}
                    className="block px-4 py-2 text-[13px] text-parchment/75 hover:bg-brand-sky/15 hover:text-parchment"
                  >
                    {d.name}
                    <span className="mt-0.5 block text-[11px] text-parchment/45">{d.character}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-parchment bg-brand-sky/15" }}
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-parchment/70 transition-colors hover:text-parchment"
            >
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="וואטסאפ"
              title="וואטסאפ"
              className="grid h-9 w-9 place-items-center rounded-full text-parchment/60 ring-1 ring-brand-line/30 transition-colors hover:text-parchment"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          )}
          <Link
            to={user ? "/profile" : "/auth"}
            aria-label={user ? t("auth.profile") : t("auth.signIn")}
            title={user ? (name ?? t("auth.profile")) : t("auth.signIn")}
            className="grid h-9 w-9 place-items-center rounded-full text-parchment/60 ring-1 ring-brand-line/30 transition-colors hover:text-parchment"
          >
            {user && avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <UserIcon className="h-4 w-4" />
            )}
          </Link>
        </div>

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
            <li>
              <Link
                to="/"
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-parchment" }}
                className="block px-1 py-2.5 text-[14px] font-medium text-parchment/75"
              >
                {t("nav.home")}
              </Link>
            </li>
            <li className="py-2">
              <Link
                to="/destinations"
                onClick={() => setOpen(false)}
                className="block px-1 py-1 text-[14px] font-semibold text-parchment/85"
              >
                {t("nav.destinations")}
              </Link>
              <ul className="mt-1 ms-3 space-y-1 border-s border-brand-line/25 ps-3">
                {destinations.map((d) => (
                  <li key={d.slug}>
                    <Link
                      to={d.to}
                      onClick={() => setOpen(false)}
                      className="block py-1.5 text-[14px] text-parchment/70"
                    >
                      {d.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "text-parchment" }}
                  className="block px-1 py-2.5 text-[14px] font-medium text-parchment/75"
                >
                  {t(n.key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 mb-1 flex gap-2">
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-saffron px-3 py-2.5 text-center text-[14px] font-semibold text-parchment"
              >
                <MessageCircle className="h-4 w-4" />
                וואטסאפ
              </a>
            )}
            <Link
              to="/quote"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg px-3 py-2.5 text-center text-[14px] font-medium text-parchment/80 ring-1 ring-brand-line/40"
            >
              {t("cta.knowAlready")}
            </Link>
          </div>
          <div className="mb-2 flex gap-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg px-3 py-2.5 text-center text-[14px] font-medium text-parchment/80 ring-1 ring-brand-line/40"
                >
                  {t("auth.profile")}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                  className="flex-1 rounded-lg px-3 py-2.5 text-center text-[14px] font-medium text-parchment/70 ring-1 ring-brand-line/40"
                >
                  {t("auth.signOut")}
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg px-3 py-2.5 text-center text-[14px] font-medium text-parchment/80 ring-1 ring-brand-line/40"
              >
                {t("auth.signIn")}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
