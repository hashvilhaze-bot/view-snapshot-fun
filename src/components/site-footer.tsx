import { Link } from "@tanstack/react-router";

import { CONTACT_PLACEHOLDER } from "@/lib/content";
import { whatsappHref } from "@/lib/leads";
import { useLocale } from "@/hooks/use-locale";

export function SiteFooter() {
  const wa = whatsappHref();
  const { t } = useLocale();

  return (
    <footer className="border-t border-parchment/10 bg-summit px-6 py-10 text-parchment/60">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
        <div>
          <p className="font-display text-base font-bold text-parchment">השביל הזה</p>
          <p className="mt-2 text-[13px] leading-relaxed">
            טיולים אישיים בנפאל ובהימלאיה, שנבנים סביב מה שאתם רוצים לחוות.
          </p>
        </div>
        <div className="text-[13px]">
          <p className="mb-2 font-medium text-parchment/80">{t("footer.onSite")}</p>
          <ul className="space-y-1.5">
            <li>
              <Link to="/nepal">{t("nav.nepal")}</Link>
            </li>
            <li>
              <Link to="/treks">{t("nav.treks")}</Link>
            </li>
            <li>
              <Link to="/match">{t("nav.match")}</Link>
            </li>
            <li>
              <Link to="/knowledge">{t("nav.knowledge")}</Link>
            </li>
            <li>
              <Link to="/quote">{t("nav.quote")}</Link>
            </li>
            <li>
              <Link to="/about">{t("nav.about")}</Link>
            </li>
          </ul>
        </div>
        <div className="text-[13px]">
          <p className="mb-2 font-medium text-parchment/80">{t("footer.talkToUs")}</p>
          {wa ? (
            <a href={wa} target="_blank" rel="noopener noreferrer">
              {t("footer.whatsapp")}
            </a>
          ) : (
            <p>{CONTACT_PLACEHOLDER}</p>
          )}
          <Link
            to="/contact"
            className="mt-3 inline-block rounded-full bg-saffron px-4 py-2 font-medium text-parchment"
          >
            בואו נדבר על השביל שלכם
          </Link>
        </div>
      </div>
    </footer>
  );
}
