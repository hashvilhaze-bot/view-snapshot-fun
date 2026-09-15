import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/leads";

/** Simple footer: one phone number and an email. WhatsApp lives in the header. */
export function SiteFooter() {
  return (
    <footer className="border-t border-parchment/15 bg-summit px-6 py-10 text-parchment/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg font-bold text-parchment">השביל הזה</p>

        <ul className="flex flex-col gap-2 text-[14px] text-parchment/75 sm:flex-row sm:items-center sm:gap-6">
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
