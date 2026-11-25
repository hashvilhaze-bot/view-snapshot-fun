import { Link } from "@tanstack/react-router";
import { whatsappHref } from "@/lib/leads";

/** Exactly two contact actions: the pilot form and a WhatsApp chat with Ohad. */
export function PilotCtas({ trek }: { trek?: string }) {
  const wa = whatsappHref();
  return (
    <div className="p-ctas">
      <Link
        to="/pilot/quote"
        search={trek ? { trek } : { trek: undefined }}
        className="p-btn p-btn-primary"
      >
        לבקשת הצעה
      </Link>
      {wa && (
        <a href={wa} target="_blank" rel="noopener noreferrer" className="p-btn p-btn-ghost">
          לאוהד בוואטסאפ
        </a>
      )}
    </div>
  );
}
