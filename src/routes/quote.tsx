import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Card, PageHero, Section, WhatsappButton } from "@/components/page";
import { treks } from "@/lib/content";
import { submitLead, whatsappHref } from "@/lib/leads";

export const Route = createFileRoute("/quote")({
  component: QuotePage,
  head: () => ({
    meta: [
      { title: "כבר יודעים מה אתם רוצים? בקשת הצעה | השביל הזה" },
      {
        name: "description",
        content:
          "מסלול מהיר למי שכבר סגור על הכיוון: כמה שדות קצרים — יעד, תקופה, מספר נוסעים — ומתחילים לבנות הצעה לטיול בנפאל.",
      },
      { property: "og:title", content: "כבר יודעים מה אתם רוצים? בקשת הצעה" },
      { property: "og:description", content: "טופס קצר, בלי שאלון. נחזור אליכם עם כיוון והצעה." },
    ],
  }),
});

const field =
  "mt-1.5 w-full rounded-xl bg-parchment px-4 py-3 text-[15px] text-ink ring-1 ring-ink/10 outline-none placeholder:text-ink/35 focus:ring-2 focus:ring-saffron/60";
const label = "text-[13px] font-medium text-ink/60";

function QuotePage() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "manual" | "failed">("idle");
  const [form, setForm] = useState({
    route: "",
    combine: "",
    dates: "",
    travelers: "",
    note: "",
    name: "",
    phone: "",
  });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const waMessage = `היי, הגעתי דרך 'השביל הזה' ואני רוצה הצעה לטיול בנפאל.
כיוון: ${form.route || "—"}
לשלב: ${form.combine || "—"}
תקופה: ${form.dates || "—"}
נוסעים: ${form.travelers || "—"}
${form.note ? `הערה: ${form.note}` : ""}
שם: ${form.name || "—"} · טלפון: ${form.phone || "—"}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const result = await submitLead({ source: "quote-request", ...form });
    setState(result === "sent" ? "sent" : result === "unconfigured" ? "manual" : "failed");
  }

  if (state === "sent") {
    return (
      <>
        <PageHero kicker="קיבלנו" title="הבקשה נשלחה" lead="נחזור אליכם עם כיוון ראשוני והצעה." />
        <Section>
          <Card>
            <p className="text-[15px] leading-relaxed text-ink/75">
              בזמן הזה אפשר להסתובב עוד קצת: יש עמוד לכל מסלול, ואזור תוכן על נפאל עצמה.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/treks"
                className="rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
              >
                טרקים וחוויות
              </Link>
              <Link
                to="/knowledge"
                className="rounded-xl bg-parchment px-5 py-3 text-[14px] font-medium text-ink ring-1 ring-ink/10"
              >
                לפני שנוסעים
              </Link>
            </div>
          </Card>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        kicker="מסלול מהיר"
        title="כבר סגורים על הכיוון?"
        lead="ספרו לנו בקצרה ונוכל להתחיל לבנות לכם הצעה. בלי שאלון — רק מה שצריך כדי לענות לעניין."
      />

      <Section>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={label} htmlFor="route">
              יעד או מסלול
            </label>
            <input
              id="route"
              list="trek-options"
              value={form.route}
              onChange={set("route")}
              placeholder="למשל: מנאסלו סירקיט, או ״טרק של שבוע באזור אנאפורנה״"
              className={field}
            />
            <datalist id="trek-options">
              {treks.map((t) => (
                <option key={t.slug} value={t.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className={label} htmlFor="combine">
              מה תרצו לשלב
            </label>
            <input
              id="combine"
              value={form.combine}
              onChange={set("combine")}
              placeholder="קתמנדו, פוקרה, כפרים, רפטינג, צ׳יטוואן, ימי מנוחה…"
              className={field}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="dates">
                תאריכים או תקופה
              </label>
              <input
                id="dates"
                value={form.dates}
                onChange={set("dates")}
                placeholder="אוקטובר, או תאריכים מדויקים"
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="travelers">
                מספר נוסעים
              </label>
              <input
                id="travelers"
                value={form.travelers}
                onChange={set("travelers")}
                placeholder="2"
                className={field}
              />
            </div>
          </div>

          <div>
            <label className={label} htmlFor="note">
              משהו שכדאי שנדע
            </label>
            <textarea
              id="note"
              rows={3}
              value={form.note}
              onChange={set("note")}
              placeholder="ניסיון קודם, מגבלות, מה חשוב לכם שיהיה בטיול"
              className={field}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="name">
                שם
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={set("name")}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="phone">
                טלפון
              </label>
              <input
                id="phone"
                required
                inputMode="tel"
                value={form.phone}
                onChange={set("phone")}
                className={field}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
            <button
              type="submit"
              disabled={state === "sending"}
              className="rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment disabled:opacity-50"
            >
              {state === "sending" ? "שולח…" : "שלחו בקשה להצעה"}
            </button>
            <WhatsappButton message={waMessage} label="לשלוח את זה בוואטסאפ" />
          </div>

          {state === "manual" && (
            <Card>
              <p className="text-[14px] leading-relaxed text-ink/75">
                הטופס מוכן, אבל חסרה כאן כתובת השליחה של מנגנון הלידים הקיים — לכן הבקשה עדיין לא
                נשלחת אוטומטית. בינתיים אפשר לשלוח את אותם פרטים בוואטסאפ, או דרך{" "}
                <Link to="/contact" className="font-semibold text-saffron">
                  עמוד יצירת הקשר
                </Link>
                .
              </p>
              {!whatsappHref() && (
                <p className="mt-2 text-[13px] text-ink/50">
                  [להשלמה: מספר וואטסאפ, טלפון ואימייל, וכתובת ה-Webhook של מנגנון הלידים]
                </p>
              )}
            </Card>
          )}

          {state === "failed" && (
            <Card>
              <p className="text-[14px] leading-relaxed text-ink/75">
                השליחה לא עברה. אפשר לנסות שוב, או לשלוח לנו את הפרטים בוואטסאפ.
              </p>
            </Card>
          )}
        </form>
      </Section>

      <Section title="עדיין מתלבטים?">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/match">
            <Card className="h-full p-4">
              <p className="font-display font-bold">מה מתאים לי?</p>
              <p className="mt-1 text-[13px] text-ink/60">שש שאלות, ואז כמה כיוונים</p>
            </Card>
          </Link>
          <Link to="/treks">
            <Card className="h-full p-4">
              <p className="font-display font-bold">טרקים וחוויות</p>
              <p className="mt-1 text-[13px] text-ink/60">משך, גובה ומאמץ במבט אחד</p>
            </Card>
          </Link>
        </div>
      </Section>
    </>
  );
}
