import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { treks } from "@/lib/pilot/legacy-treks";
import { validPilotSlug } from "@/lib/pilot/itineraries";
import { Button } from "@/components/ui/button";

type Search = { trek?: string | undefined };

export const Route = createFileRoute("/pilot/quote")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    trek: validPilotSlug(s["trek"]),
  }),
  head: () => ({
    meta: [
      { title: "פיילוט · בקשת הצעה | השביל הזה" },
      { name: "description", content: "הדמיית טופס בקשת הצעה. שום פרט לא נשלח." },
      { property: "og:title", content: "פיילוט · בקשת הצעה" },
      { property: "og:description", content: "הדמיית טופס בקשת הצעה." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PilotQuote,
});

type Form = {
  name: string;
  phone: string;
  email: string;
  when: string;
  group: string;
  note: string;
};
const EMPTY: Form = { name: "", phone: "", email: "", when: "", group: "", note: "" };

export function validatePilotForm(f: Form): Partial<Record<keyof Form, string>> {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.name.trim().length < 2) e.name = "נא לכתוב שם.";
  if (!/^0\d{1,2}-?\d{7}$|^\+?972-?\d{8,9}$/.test(f.phone.replace(/\s/g, "")))
    e.phone = "נא לכתוב מספר טלפון תקין, למשל 050-1234567.";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = "כתובת האימייל לא נראית תקינה.";
  return e;
}

const LABELS: Record<keyof Form, string> = {
  name: "שם",
  phone: "טלפון",
  email: "אימייל",
  when: "מתי תרצו לנסוע",
  group: "מי נוסע",
  note: "משהו נוסף",
};

function PilotQuote() {
  const search = Route.useSearch();
  return (
    <PilotQuoteForm key={search.trek ?? "direct"} {...(search.trek ? { slug: search.trek } : {})} />
  );
}

function PilotQuoteForm({ slug }: { slug?: string }) {
  const preset = treks.find((t) => t.slug === slug);
  const [keepTrek, setKeepTrek] = useState(true);
  const selected = preset && keepTrek ? preset : undefined;
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [done, setDone] = useState(false);

  const set =
    (k: keyof Form) =>
    (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: ev.target.value }));

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validatePilotForm(form);
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setDone(true); // Simulation only: nothing leaves the browser.
  }

  const notice = (
    <p className="p-notice" role="note">
      <strong>זו הדמיה.</strong> הטופס בפיילוט לא שולח דבר — לא לאוהד, לא לוואטסאפ ולא למערכת כלשהי.
    </p>
  );

  if (done) {
    return (
      <section className="p-section">
        <div className="p-wrap p-read">
          {notice}
          <h1 className="p-h2 mt-6" tabIndex={-1}>
            כך הייתה נראית הפנייה שלכם
          </h1>
          <dl className="p-card m-0 mt-6 divide-y p-0" style={{ borderColor: "var(--p-line)" }}>
            <div className="px-5 py-3">
              <dt className="p-muted text-[14px]">מה בחרתם</dt>
              <dd className="m-0 font-semibold">
                {selected ? `טרק: ${selected.name}` : "עוד לא נבחר מסלול"}
              </dd>
            </div>
            {(Object.keys(LABELS) as (keyof Form)[])
              .filter((k) => form[k])
              .map((k) => (
                <div key={k} className="px-5 py-3">
                  <dt className="p-muted text-[14px]">{LABELS[k]}</dt>
                  <dd className="m-0 font-semibold">{form[k]}</dd>
                </div>
              ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              variant="ghost"
              type="button"
              className="p-btn p-btn-ghost"
              onClick={() => setDone(false)}
            >
              חזרה לעריכה
            </Button>
            <Link to="/pilot" className="p-btn p-btn-ghost">
              לדף הבית
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-section">
      <div className="p-wrap p-read">
        <p className="p-kicker">בקשת הצעה</p>
        <h1 className="p-h2 mt-2">
          {selected ? "המסלול שבחרתם כבר איתנו" : "ספרו לנו בקצרה על הטיול"}
        </h1>
        <p className="p-muted mt-3">נשאר רק לספר לנו מתי ומי נוסע.</p>
        <div className="mt-5">{notice}</div>

        {selected && (
          <div className="mt-6 flex flex-wrap items-center gap-3" aria-live="polite">
            <span className="p-chip">
              טרק: {selected.name}
              <Button
                variant="link"
                type="button"
                onClick={() => setKeepTrek(false)}
                aria-label={`הסרת ${selected.name}`}
                className="p-link text-[14px]"
              >
                הסרה
              </Button>
            </span>
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
          {(
            [
              ["name", "text", "name", true],
              ["phone", "tel", "tel", true],
              ["email", "email", "email", false],
              ["when", "text", "off", false],
            ] as const
          ).map(([k, type, ac, req]) => (
            <div key={k}>
              <label htmlFor={`f-${k}`} className="p-label">
                {LABELS[k]}
                {req ? " *" : " (לא חובה)"}
              </label>
              <input
                id={`f-${k}`}
                type={type}
                autoComplete={ac}
                value={form[k]}
                onChange={set(k)}
                className="p-field"
                aria-invalid={errors[k] ? true : undefined}
                aria-describedby={errors[k] ? `e-${k}` : undefined}
                placeholder={k === "when" ? "למשל: פסח, או אוקטובר" : undefined}
              />
              {errors[k] && (
                <p id={`e-${k}`} className="p-error">
                  {errors[k]}
                </p>
              )}
            </div>
          ))}
          <div>
            <label htmlFor="f-group" className="p-label">
              {LABELS.group} (לא חובה)
            </label>
            <select id="f-group" value={form.group} onChange={set("group")} className="p-field">
              <option value="">בחרו</option>
              <option>זוג</option>
              <option>משפחה</option>
              <option>קבוצת חברים</option>
              <option>לבד</option>
            </select>
          </div>
          <div>
            <label htmlFor="f-note" className="p-label">
              {LABELS.note} (לא חובה)
            </label>
            <textarea
              id="f-note"
              rows={4}
              value={form.note}
              onChange={set("note")}
              className="p-field"
            />
          </div>
          <Button type="submit" className="p-btn p-btn-primary w-full sm:w-auto">
            הצגת סיכום (הדמיה)
          </Button>
        </form>
      </div>
    </section>
  );
}
