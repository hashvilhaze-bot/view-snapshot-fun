import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/hashvil-haze-logo.png.asset.json";
import { useLocale } from "@/hooks/use-locale";
import { destinations } from "@/lib/destinations";
import { whatsappHref } from "@/lib/leads";

const links = [
  ["/treks", "nav.treks"],
  ["/experiences", "nav.experiences"],
  ["/knowledge", "nav.knowledge"],
  ["/about", "nav.about"],
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return <Navigation key={pathname} pathname={pathname} />;
}

function Navigation({ pathname }: { pathname: string }) {
  const { t } = useLocale();
  const wa = whatsappHref();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [destOpen, setDestOpen] = useState<"hover" | "pinned" | null>(null);
  const header = useRef<HTMLElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    if (mobileOpen) navigation.current?.querySelector("a")?.focus({ preventScroll: true });
  }, [mobileOpen]);

  function close() {
    setMobileOpen(false);
    setDestOpen(null);
  }

  useEffect(() => {
    if (!mobileOpen && !destOpen) return;
    function outside(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;
      if (!header.current?.contains(event.target)) close();
      else if (!group.current?.contains(event.target)) setDestOpen(null);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (destOpen) {
        setDestOpen(null);
        trigger.current?.focus();
      } else if (mobileOpen) {
        setMobileOpen(false);
        mobileToggle.current?.focus();
      }
    }
    const media = window.matchMedia("(min-width: 64rem)");
    media.addEventListener("change", close);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      media.removeEventListener("change", close);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [mobileOpen, destOpen]);

  return (
    <header
      ref={header}
      className="site-header"
      onBlur={(event) => {
        if (mobileOpen && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget))
          close();
      }}
    >
      <div className="site-frame site-nav-bar">
        <Link to="/" aria-label="השביל הזה, דף הבית" onClick={close} className="site-brand">
          <img src={logo.url} alt="השביל הזה" width={160} height={72} />
        </Link>
        <nav
          ref={navigation}
          id="site-navigation"
          aria-label="ניווט ראשי"
          className="site-nav"
          data-mobile-open={mobileOpen}
        >
          <Link to="/" activeOptions={{ exact: true }} className="site-nav-link" onClick={close}>
            {t("nav.home")}
          </Link>
          <div
            ref={group}
            className="dest-nav"
            onPointerEnter={(event) => {
              if (
                event.pointerType === "mouse" &&
                window.matchMedia("(min-width: 64rem) and (hover: hover)").matches
              )
                setDestOpen((open) => open ?? "hover");
            }}
            onPointerLeave={() =>
              setDestOpen((open) =>
                open === "hover" && !group.current?.contains(document.activeElement) ? null : open,
              )
            }
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setDestOpen(null);
            }}
          >
            <button
              ref={trigger}
              type="button"
              className="site-nav-link"
              aria-expanded={!!destOpen}
              aria-controls="site-destinations"
              data-current={pathname === "/nepal" || pathname.startsWith("/destinations")}
              onClick={() => setDestOpen((open) => (open === "pinned" ? null : "pinned"))}
            >
              {t("nav.destinations")}
            </button>
            <div id="site-destinations" hidden={!destOpen} className="dest-popover">
              <div className="dest-card">
                {destinations.map((d) => (
                  <Link key={d.slug} to={d.to} onClick={close} className="dest-option">
                    <div>
                      <strong>{d.name}</strong>
                      <span>{d.character}</span>
                    </div>
                    <img
                      src={"/nav/" + d.slug + ".webp"}
                      alt=""
                      width={104}
                      height={68}
                      loading="lazy"
                    />
                  </Link>
                ))}
                <Link
                  to="/destinations"
                  activeOptions={{ exact: true }}
                  className="dest-all"
                  onClick={close}
                >
                  {t("nav.allDestinations")}
                </Link>
              </div>
            </div>
          </div>
          {links.map(([to, key]) => (
            <Link key={to} to={to} className="site-nav-link" onClick={close}>
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="site-header-actions">
          {wa && (
            <a className="site-contact" href={wa} target="_blank" rel="noopener noreferrer">
              {t("cta.writeOhad")}
            </a>
          )}
          <button
            type="button"
            ref={mobileToggle}
            className="site-menu-toggle"
            aria-expanded={mobileOpen}
            aria-controls="site-navigation"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setDestOpen(null);
            }}
          >
            {mobileOpen ? t("nav.close") : t("nav.menu")}
          </button>
        </div>
      </div>
    </header>
  );
}
