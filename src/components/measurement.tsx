import { useEffect, useState } from "react";
import { Route as Root } from "@/routes/__root";
type Pixel = ((...args: unknown[]) => void) & {
  queue: unknown[][];
  callMethod?: (...args: unknown[]) => void;
  loaded: boolean;
  version: string;
  push: Pixel;
};
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: Pixel;
    _fbq?: Pixel;
  }
}
const choiceKey = "hashvil-measurement-choice";
function addScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.src = src;
  script.id = id;
  script.async = true;
  script.referrerPolicy = "strict-origin";
  document.head.append(script);
}
export function Measurement({ path }: { path: string }) {
  const cfg = Root.useRouteContext().cms.integrations;
  const [choice, setChoice] = useState("loading");
  const isPublic = !/^\/(auth|profile|admin|pilot)(\/|$)/.test(path);
  useEffect(() => {
    try {
      setChoice(localStorage.getItem(choiceKey) || "ask");
    } catch {
      setChoice("ask");
    }
  }, []);
  const save = (v: string) => {
    try {
      localStorage.setItem(choiceKey, v);
    } catch {
      /* Keep this choice for the current visit. */
    }
    setChoice(v);
  };
  useEffect(() => {
    const allowed = choice === "allow" && isPublic;
    if (cfg.ga) Object.assign(window, { ["ga-disable-" + cfg.ga]: !allowed });
    if (!allowed) {
      window.fbq?.("consent", "revoke");
      return;
    }
    if (cfg.ga) {
      if (!window.gtag) {
        window.dataLayer ??= [];
        window.gtag = function () {
          // gtag consumes the array-like arguments object used by Google’s loader.
          // eslint-disable-next-line prefer-rest-params
          window.dataLayer!.push(arguments);
        };
        window.gtag("js", new Date());
      }
      addScript("site-ga", "https://www.googletagmanager.com/gtag/js?id=" + cfg.ga);
      window.gtag("config", cfg.ga, { send_page_view: false, allow_google_signals: false });
      window.gtag("event", "page_view", {
        page_location: location.origin + path,
        page_title: document.title,
        page_referrer: document.referrer.split(/[?#]/)[0],
      });
    }
    if (cfg.pixel) {
      if (!window.fbq) {
        const pixel = ((...args: unknown[]) =>
          pixel.callMethod ? pixel.callMethod(...args) : pixel.queue.push(args)) as Pixel;
        pixel.queue = [];
        pixel.push = pixel;
        pixel.loaded = true;
        pixel.version = "2.0";
        window.fbq = window._fbq = pixel;
        pixel("set", "autoConfig", false, cfg.pixel);
        pixel("init", cfg.pixel);
        addScript("site-meta", "https://connect.facebook.net/en_US/fbevents.js");
      }
      window.fbq("consent", "grant");
      window.fbq("track", "PageView");
    }
  }, [cfg.ga, cfg.pixel, choice, isPublic, path]);
  if (!isPublic || (!cfg.ga && !cfg.pixel) || choice === "loading") return null;
  if (choice !== "ask")
    return path === "/privacy" ? (
      <button className="cms-choice" onClick={() => save("ask")}>
        שינוי העדפות מדידה
      </button>
    ) : null;
  return (
    <aside className="cms-consent" aria-label="העדפות מדידה">
      <p>
        אפשר לאפשר מדידת ביקורים באתר כדי לעזור לנו לשפר אותו.{" "}
        <a href="/privacy">פרטים על הפרטיות</a>
      </p>
      <button onClick={() => save("allow")}>לאפשר מדידה</button>
      <button onClick={() => save("deny")}>להמשיך בלי מדידה</button>
    </aside>
  );
}
