import { Link } from "@tanstack/react-router";

import { CONTACT_EMAIL, CONTACT_PHONE, whatsappHref } from "@/lib/leads";
import { useLocale } from "@/hooks/use-locale";

export function SiteFooter() {
  const wa = whatsappHref();
  const { t } = useLocale();

  return (
    <footer className="border-t border-parchment/15 bg-summit px-6 py-12 text-parchment/80">
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-parchment">השביל הזה</p>
          <p className="mt-2.5 text-[14px] leading-relaxed text-parchment/75">
            טיולים אישיים בנפאל ובהימלאיה, שנבנים סביב מה שאתם רוצים לחוות — עם כתובת אחת מהשיחה
            הראשונה ועד החזרה הביתה.
          </p>
        </div>

        <nav className="text-[14px]" aria-label={t("footer.onSite")}>
          <p className="mb-3 font-semibold text-parchment">{t("footer.onSite")}</p>
          <ul className="space-y-2 text-parchment/75">
            <li>
              <Link to="/nepal" className="hover:text-parchment">
                {t("nav.nepal")}
              </Link>
            </li>
            <li>
              <Link to="/treks" className="hover:text-parchment">
                {t("nav.treks")}
              </Link>
            </li>
            <li>
              <Link to="/match" className="hover:text-parchment">
                {t("nav.match")}
              </Link>
            </li>
            <li>
              <Link to="/knowledge" className="hover:text-parchment">
                {t("nav.knowledge")}
              </Link>
            </li>
            <li>
              <Link to="/quote" className="hover:text-parchment">
                {t("nav.quote")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-parchment">
                {t("nav.about")}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-[14px]">
          <p className="mb-3 font-semibold text-parchment">{t("footer.talkToUs")}</p>
          <ul className="space-y-2 text-parchment/75">
            {wa && (
              <li>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-parchment"
                >
                  וואטסאפ · {CONTACT_PHONE}
                </a>
              </li>
            )}
            <li>
              <a href={`tel:${CONTACT_PHONE}`} className="hover:text-parchment">
                טלפון: {CONTACT_PHONE}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-parchment">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
          <Link
            to="/contact"
            className="mt-5 inline-block rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
          >
            בואו נדבר על השביל שלכם
          </Link>
        </div>
      </div>
    </footer>
  );
}
