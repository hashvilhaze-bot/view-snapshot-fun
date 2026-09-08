import { Link } from "@tanstack/react-router";

import { CONTACT_PLACEHOLDER } from "@/lib/content";

export function SiteFooter() {
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
          <p className="mb-2 font-medium text-parchment/80">באתר</p>
          <ul className="space-y-1.5">
            <li>
              <Link to="/nepal">נפאל</Link>
            </li>
            <li>
              <Link to="/treks">טרקים וחוויות</Link>
            </li>
            <li>
              <Link to="/match">מה מתאים לי?</Link>
            </li>
            <li>
              <Link to="/knowledge">לפני שנוסעים</Link>
            </li>
            <li>
              <Link to="/about">מי אנחנו</Link>
            </li>
          </ul>
        </div>
        <div className="text-[13px]">
          <p className="mb-2 font-medium text-parchment/80">דברו איתנו</p>
          <p>{CONTACT_PLACEHOLDER}</p>
          <Link
            to="/contact"
            className="mt-3 inline-block rounded-full bg-saffron px-4 py-2 font-medium text-parchment"
          >
            בואו נדבר
          </Link>
        </div>
      </div>
    </footer>
  );
}
