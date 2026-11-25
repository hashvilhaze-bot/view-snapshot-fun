import { Link } from "@tanstack/react-router";
import logo from "@/assets/hashvil-haze-logo.png.asset.json";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/leads";
import { treks } from "@/lib/content";
import { ContactCtas } from "./renewed/contact-ctas";
const HOME_LINKS: [string, string][] = [
  ["nepal", "לגלות את נפאל"],
  ["about", "מי אנחנו"],
  ["process", "איך זה עובד"],
  ["faq", "שאלות לפני הדרך"],
];
export function SiteFooter({ trek }: { trek?: string }) {
  return (
    <footer className="p-band p-footer">
      <div className="p-wrap py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link to="/">
              <span className="p-footer-logo">
                <img src={logo.url} alt="השביל הזה" width={180} height={80} />
              </span>
            </Link>
            <p className="p-muted mt-5 max-w-[34ch]">
              תכנון טיול אישי בנפאל, הכנה בארץ וקשר עם אוהד עד החזרה.
            </p>
            <div className="p-on-photo mt-6">
              <ContactCtas {...(trek ? { trek } : {})} />
            </div>
          </div>
          <nav aria-label="ניווט תחתון">
            <h2 className="p-h3">מכאן ממשיכים</h2>
            <ul className="p-footer-links">
              <li>
                <Link to="/">דף הבית</Link>
              </li>
              <li>
                <Link to="/treks">כל הטרקים</Link>
              </li>
              <li>
                <Link to="/knowledge">מרכז הידע</Link>
              </li>
              <li>
                <Link to="/experiences">חוויות בנפאל</Link>
              </li>
              {HOME_LINKS.map(([hash, label]) => (
                <li key={hash}>
                  <Link to="/" hash={hash}>
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
          <nav aria-label="טרקים">
            <h2 className="p-h3">רעיונות להליכה</h2>
            <ul className="p-footer-links">
              {treks.map((t) => (
                <li key={t.slug}>
                  <Link to="/treks/$slug" params={{ slug: t.slug }}>
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
