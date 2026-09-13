import { CONTACT_EMAIL, CONTACT_PHONE, whatsappHref } from "@/lib/leads";
import { useLocale } from "@/hooks/use-locale";

/** Simple footer: WhatsApp, phone, email. No separate contact area. */
export function SiteFooter() {
  const wa = whatsappHref();
  const { t } = useLocale();

  return (
    <footer className="border-t border-parchment/15 bg-summit px-6 py-10 text-parchment/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg font-bold text-parchment">השביל הזה</p>

        <ul className="flex flex-col gap-2 text-[14px] text-parchment/75 sm:flex-row sm:items-center sm:gap-6">
          {wa && (
            <li>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-parchment"
              >
                {t("footer.whatsapp")} · {CONTACT_PHONE}
              </a>
            </li>
          )}
          <li>
            <a href={`tel:${CONTACT_PHONE}`} className="hover:text-parchment">
              {CONTACT_PHONE}
            </a>
          </li>
          <li>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-parchment">
              {CONTACT_EMAIL}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
