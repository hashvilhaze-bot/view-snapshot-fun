import { Link } from "@tanstack/react-router";
import logo from "@/assets/hashvil-haze-logo.png.asset.json";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/leads";
import { treks } from "@/lib/pilot/legacy-treks";
import { PilotCtas } from "./pilot-ctas";
import { PhotoCredits } from "../renewed/photo-credits";
const HOME_LINKS: [string, string][] = [
  ["nepal", "לגלות את נפאל"],
  ["about", "מי אנחנו"],
  ["process", "איך זה עובד"],
  ["faq", "שאלות לפני הדרך"],
];
export function PilotFooter({ trek }: { trek?: string }) {
  return (
    <footer className="p-band p-footer">
      <div className="p-wrap py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link to="/pilot">
              <span className="p-footer-logo">
                <img src={logo.url} alt="השביל הזה" width={180} height={80} />
              </span>
            </Link>
            <p className="p-muted mt-5 max-w-[34ch]">
              תכנון טיול אישי בנפאל, הכנה בארץ וקשר עם אוהד עד החזרה.
            </p>
            <div className="p-on-photo mt-6">
              <PilotCtas {...(trek ? { trek } : {})} />
            </div>
          </div>
          <nav aria-label="ניווט תחתון בפיילוט">
            <h2 className="p-h3">מכאן ממשיכים</h2>
            <ul className="p-footer-links">
              <li>
                <Link to="/pilot">דף הבית</Link>
              </li>
              {HOME_LINKS.map(([hash, label]) => (
                <li key={hash}>
                  <Link to="/pilot" hash={hash}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="p-h3 mt-5">שומרים על קשר</h2>
            <p className="mt-3">
              <a href={`tel:${CONTACT_PHONE.replace(/-/g, "")}`}>
                <bdi>{CONTACT_PHONE}</bdi>
              </a>
            </p>
            <p>
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <bdi>{CONTACT_EMAIL}</bdi>
              </a>
            </p>
          </nav>
          <nav aria-label="טרקים בפיילוט">
            <h2 className="p-h3">רעיונות להליכה</h2>
            <ul className="p-footer-links">
              {treks.map((t) => (
                <li key={t.slug}>
                  <Link to="/pilot/treks/$slug" params={{ slug: t.slug }}>
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <PhotoCredits />
        <p className="p-footer-note mt-10 pt-5">פיילוט לבדיקה בלבד. הטופס אינו שולח פרטים.</p>
      </div>
    </footer>
  );
}
