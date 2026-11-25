import { FormVerification } from "@/components/form-verification";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { PageHero } from "@/components/page";
import { MatchPrompt } from "@/components/content-navigation";
import { CONTACT_EMAIL, CONTACT_PHONE, whatsappHref, useLeadSubmission } from "@/lib/leads";
import { managedMeta, PUBLIC_ORIGIN } from "@/lib/public-meta";
import { structuredData } from "@/lib/navigation-meta";
import portrait from "@/assets/ohad-coffee-portrait.jpg.asset.json";

export const Route = createFileRoute("/contact")({
  head: ({ match }) => ({
    ...managedMeta(
      match.context.cms,
      "צור קשר עם אוהד הרץ | השביל הזה",
      "שאלות על טרקים או על תכנון טיול אישי לנפאל? אפשר לשלוח פנייה לאוהד הרץ, לכתוב בוואטסאפ, להתקשר או לפנות בדוא״ל.",
      "/contact",
      "website",
      portrait.url,
    ),
    scripts: [
      structuredData({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        url: PUBLIC_ORIGIN + "/contact",
        name: "צור קשר עם אוהד הרץ",
        inLanguage: "he",
        mainEntity: {
          "@type": "TravelAgency",
          name: "השביל הזה",
          url: PUBLIC_ORIGIN,
          telephone: "+972" + CONTACT_PHONE.replace(/\D/g, "").slice(1),
          email: CONTACT_EMAIL,
        },
      }),
    ],
  }),
  component: Contact,
});
function Contact() {
  const { submitLead, attempt } = useLeadSubmission("contact");
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const wa = whatsappHref();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const busy = useRef(false);
  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy.current) return;
    const form = e.currentTarget;
    const fields = new FormData(form);
    const value = (key: string) => String(fields.get(key) ?? "").trim();
    if (!value("name") || !value("note")) {
      const missing = form.elements.namedItem(!value("name") ? "name" : "note") as
        HTMLInputElement | HTMLTextAreaElement;
      missing.setCustomValidity("נא למלא את השדה");
      missing.reportValidity();
      return;
    }
    const phone = value("phone");
    const digits = phone.replace(/\D/g, "");
    if (!/^[+()0-9 .-]+$/.test(phone) || digits.length < 7 || digits.length > 15) {
      const input = form.elements.namedItem("phone") as HTMLInputElement;
      input.setCustomValidity("נא להזין מספר טלפון לחזרה");
      input.reportValidity();
      return;
    }
    busy.current = true;
    setState("sending");
    try {
      const result = await submitLead(
        {
          source: "contact-page",
          name: value("name"),
          phone: value("phone"),
          note: value("note"),
          email: value("email"),
        },
        form,
      );
      setState(result === "sent" ? "sent" : "failed");
    } catch {
      setState("failed");
    } finally {
      busy.current = false;
    }
  }
  return (
    <>
      <PageHero
        kicker="צור קשר"
        title="דברו עם אוהד"
        actions={
          <div className="p-ctas">
            <a href="#contact-form" className="p-btn p-btn-primary">
              לטופס הפנייה
            </a>
            {wa && (
              <a className="p-btn p-btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">
                לכתוב לאוהד
              </a>
            )}
          </div>
        }
        lead="יש לכם שאלה על טרק, עונה או רעיון לטיול? אפשר לכתוב כאן גם אם עדיין אין לכם תאריכים או מסלול."
      />
      <div className="site-frame contact-layout">
        <section id="contact-form" className="contact-form-panel">
          <h2 className="p-h2">שליחת פנייה</h2>
          {state === "sent" ? (
            <p role="status">הפנייה נשלחה לאוהד. תודה שכתבתם.</p>
          ) : (
            <form
              method="post"
              aria-busy={state === "sending"}
              onSubmit={send}
              onInput={(e) => {
                const input = e.target as HTMLInputElement | HTMLTextAreaElement;
                input.setCustomValidity("");
                if (state === "failed") setState("idle");
              }}
            >
              <noscript>
                אפשר לפנות לאוהד בטלפון, בדוא״ל או בוואטסאפ באמצעות הקישורים בעמוד.
              </noscript>
              <fieldset disabled={!ready || state === "sending"}>
                <label>
                  שם
                  <input name="name" required autoComplete="name" maxLength={120} />
                </label>
                <label>
                  טלפון לחזרה
                  <input
                    name="phone"
                    required
                    type="tel"
                    autoComplete="tel"
                    dir="ltr"
                    minLength={7}
                    maxLength={24}
                  />
                </label>
                <label>
                  דוא״ל (רשות)
                  <input name="email" type="email" autoComplete="email" dir="ltr" maxLength={254} />
                </label>
                <label htmlFor="contact-note">מה תרצו לשאול?</label>
                <textarea id="contact-note" name="note" required maxLength={3000} rows={4} />
                <p className="contact-policy">
                  הפרטים ישמשו למענה לפנייה. <Link to="/privacy">פרטיות ופרטי הפנייה</Link>
                </p>
                <FormVerification attempt={attempt} />
                <button
                  className="p-btn p-btn-primary"
                  type="submit"
                  disabled={state === "sending"}
                >
                  {state === "sending" ? "הפנייה נשלחת…" : "שליחת הפנייה"}
                </button>
              </fieldset>
              {state === "failed" && (
                <p role="alert">הפנייה לא נשלחה. אפשר לנסות שוב או לפנות ישירות לאוהד.</p>
              )}
            </form>
          )}
        </section>
        <aside className="contact-direct">
          <img
            src={portrait.url}
            alt="אוהד הרץ בהפסקת קפה בנפאל"
            width={480}
            height={360}
            loading="lazy"
            decoding="async"
          />
          <h2 className="p-h3">פנייה ישירה לאוהד</h2>
          {wa && (
            <a className="p-link" href={wa} target="_blank" rel="noopener noreferrer">
              לכתוב לאוהד
            </a>
          )}
          <a href={"tel:" + CONTACT_PHONE.replace(/-/g, "")}>
            טלפון <bdi>{CONTACT_PHONE}</bdi>
          </a>
          <a href={"mailto:" + CONTACT_EMAIL}>
            דוא״ל <bdi>{CONTACT_EMAIL}</bdi>
          </a>
        </aside>
      </div>
      <div className="site-frame contact-match">
        <MatchPrompt />
      </div>
    </>
  );
}
