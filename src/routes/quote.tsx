import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Card, PageHero, Section, WhatsappButton } from "@/components/page";
import { useAuth } from "@/hooks/use-auth";
import {
  NEPAL_PARTNER_NAME,
  NEPAL_PARTNER_NOTE,
  NEPAL_PARTNER_ROLE,
  submitLead,
  whatsappHref,
} from "@/lib/leads";
import { readTripContext, type TripContext } from "@/lib/trip-context";

const INTERESTS = [
  "סובב מנאסלו",
  "סובב אנאפורנה",
  "מסלולים באזור האוורסט",
  "מסלולים נוספים בנפאל",
  "תרבות ונופים בנפאל",
  "רפטינג",
  "צ׳יטוואן, טבע וחיות",
  "בהוטן",
  "שילוב של כמה חוויות",
  "טיול בהתאמה אישית",
  "עדיין מתלבטים ורוצים להתייעץ",
] as const;

// After the match questionnaire we already know the direction — only ask what to add.
const EXTRA_INTERESTS = [
  "עוד מסלול או אזור בנפאל",
  "תרבות ונופים",
  "מנוחה / יוגה",
  "רפטינג",
  "בהוטן",
  "עדיין מתלבטים ורוצים להתייעץ",
] as const;

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
  const { user, name: authName } = useAuth();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "manual" | "failed">("idle");
  const [interests, setInterests] = useState<string[]>([]);
  const [context, setContext] = useState<TripContext | null>(null);
  const [form, setForm] = useState({
    dates: "",
    travelers: "",
    note: "",
    name: "",
    phone: "",
    email: "",
  });

  // What the visitor already told us elsewhere on the site — don't ask twice.
  useEffect(() => {
    const ctx = readTripContext();
    if (!ctx) return;
    setContext(ctx);
    setForm((f) => ({ ...f, dates: f.dates || (ctx.time ?? "") }));
    if (ctx.directions?.length) {
      setInterests((cur) => (cur.length ? cur : ctx.directions!.slice(0, 3)));
    }
  }, []);

  // Signed-in visitors shouldn't retype their name and email.
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name || (authName && !authName.includes("@") ? authName : ""),
      email: f.email || user.email || "",
    }));
  }, [user, authName]);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggle = (opt: string) =>
    setInterests((cur) => (cur.includes(opt) ? cur.filter((c) => c !== opt) : [...cur, opt]));

  const interestsText = interests.join(", ");

  const waMessage = `היי, הגעתי דרך 'השביל הזה' ואני רוצה הצעה לטיול בנפאל.
מעניין אותי: ${interestsText || "—"}
תקופה: ${form.dates || "—"}
נוסעים: ${form.travelers || "—"}
${form.note ? `הערה: ${form.note}` : ""}${context?.summary ? `\nמה שעניתי בשאלון: ${context.summary}` : ""}
שם: ${form.name || "—"} · טלפון: ${form.phone || "—"}${form.email ? ` · אימייל: ${form.email}` : ""}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const result = await submitLead({
      source: "quote-request",
      ...form,
      interests: interestsText,
      // Everything we already know, passed along with the lead as-is.
      quizAnswers: context?.summary ?? "",
      recommended: context?.directions?.join(", ") ?? "",
      contextSource: context?.source ?? "direct",
      signedIn: user ? "yes" : "no",
    });
    setState(result === "sent" ? "sent" : result === "unconfigured" ? "manual" : "failed");
  }


  if (state === "sent") {
    return (
      <>
        <PageHero
          kicker="קיבלנו"
          title="הבקשה נשלחה אלינו"
          lead="נחזור אליכם עם כיוון ראשוני והצעה. אם משהו דחוף, אפשר לכתוב לנו בוואטסאפ בינתיים."
        />
        <Section>
          <Card>
            <p className="text-[15px] leading-relaxed text-ink/75">
              עד שנחזור אליכם אפשר להסתובב עוד קצת: יש עמוד נפרד לכל מסלול, ומרכז ידע על נפאל.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/treks"
                className="rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
              >
                טרקים ומסלולים
              </Link>
              <Link
                to="/knowledge"
                className="rounded-xl bg-parchment px-5 py-3 text-[14px] font-medium text-ink ring-1 ring-ink/10"
              >
                מרכז ידע
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

      {context && (
        <Section>
          <Card>
            <p className="font-display text-[17px] font-bold">מה שכבר ספרתם לנו</p>
            {context.summary && (
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/65">{context.summary}</p>
            )}
            {context.directions?.length ? (
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/65">
                הכיוונים שיצאו לכם: <span className="font-semibold">{context.directions.join(" · ")}</span>
              </p>
            ) : null}
            <p className="mt-2.5 text-[13px] leading-relaxed text-ink/50">
              כל זה יישלח יחד עם הבקשה, כדי שלא תצטרכו לספר שוב. אפשר לשנות למטה כל דבר.
            </p>
          </Card>
        </Section>
      )}

      <Section>

        <form onSubmit={onSubmit} className="space-y-4">
          <fieldset>
            <legend className={label}>מה מעניין אתכם? אפשר לבחור כמה</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {INTERESTS.map((opt) => {
                const on = interests.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(opt)}
                    className={`rounded-xl px-4 py-2.5 text-start text-[14px] font-medium ring-1 transition-colors ${
                      on
                        ? "bg-saffron text-parchment ring-saffron"
                        : "bg-parchment text-ink/75 ring-ink/10"
                    }`}
                  >
                    {on && <span className="me-1.5">✓</span>}
                    {opt}
                  </button>
                );
              })}
            </div>
          </fieldset>


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

          <div>
            <label className={label} htmlFor="email">
              אימייל (לא חובה)
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              value={form.email}
              onChange={set("email")}
              className={field}
            />
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
                הטופס מוכן, אבל חסרה כאן כתובת השליחה של מנגנון הלידים — לכן הבקשה עדיין לא
                נשלחת אוטומטית. בינתיים אפשר לשלוח את אותם פרטים בוואטסאפ, או דרך{" "}
                <Link to="/contact" className="font-semibold text-saffron">
                  עמוד יצירת הקשר
                </Link>
                .
              </p>
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

      <Section title="מי מקבל את הבקשה">
        <Card>
          <p className="text-[14px] leading-relaxed text-ink/75">
            בארץ: אוהד הרץ. בנפאל: {NEPAL_PARTNER_NAME} — {NEPAL_PARTNER_ROLE}.
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink/50">{NEPAL_PARTNER_NOTE}</p>
        </Card>
      </Section>

      <Section title="עדיין מתלבטים?">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/match">
            <Card className="h-full p-4">
              <p className="font-display font-bold">מה מתאים לי?</p>
              <p className="mt-1 text-[13px] text-ink/60">שבע שאלות קצרות, ואז כמה כיוונים</p>
            </Card>
          </Link>
          <Link to="/treks">
            <Card className="h-full p-4">
              <p className="font-display font-bold">טרקים ומסלולים</p>
              <p className="mt-1 text-[13px] text-ink/60">משך, גובה ומאמץ במבט אחד</p>
            </Card>
          </Link>
        </div>
      </Section>
    </>
  );
}
