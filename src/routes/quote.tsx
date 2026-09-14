import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Accordion, Card, PageHero, Section, WhatsappButton } from "@/components/page";
import { useAuth } from "@/hooks/use-auth";
import { experienceItems, trekItems } from "@/lib/catalog";
import { submitLead } from "@/lib/leads";
import { readTripContext, type SelectedItem, type TripContext } from "@/lib/trip-context";

/**
 * The quote route accepts its starting point in the URL as well as in session
 * context. That matters: a visitor who taps a trek CTA in the first fraction of
 * a second after the page loads (before React attached its handler) still
 * arrives here with the trek pre-selected, because the href itself carries it.
 */
type QuoteSearch = {
  trek?: string | undefined;
  experience?: string | undefined;
  source?: string | undefined;
};

const str = (v: unknown): string | undefined => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/quote")({
  component: QuotePage,
  validateSearch: (search: Record<string, unknown>): QuoteSearch => ({
    trek: str(search["trek"]),
    experience: str(search["experience"]),
    source: str(search["source"]),
  }),
  head: () => ({
    meta: [
      { title: "בקשת הצעה לטיול בנפאל | השביל הזה" },
      {
        name: "description",
        content:
          "בוחרים את המסלולים והחוויות שמעניינים אתכם, משאירים כמה פרטים קצרים — ומתחילים לבנות הצעה לטיול בנפאל.",
      },
      { property: "og:title", content: "בקשת הצעה לטיול בנפאל" },
      { property: "og:description", content: "טופס קצר. נחזור אליכם עם כיוון והצעה." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const field =
  "mt-1.5 w-full rounded-xl bg-parchment px-4 py-3 text-[15px] text-ink ring-1 ring-ink/10 outline-none placeholder:text-ink/35 focus:ring-2 focus:ring-saffron/60";
const label = "text-[13px] font-medium text-ink/65";

const SOURCE_INTRO: Record<string, { kicker: string; title: string; lead: string }> = {
  match: {
    kicker: "עוד רגע מסיימים",
    title: "נשארו רק הפרטים החסרים",
    lead: "את מה שסימנתם בשאלון אנחנו כבר מכירים — לא נבקש אותו שוב.",
  },
  "trek-page": {
    kicker: "בקשת הצעה",
    title: "המסלול שבחרתם כבר איתנו",
    lead: "נשאר רק לספר לנו מתי ומי נוסע.",
  },
  "experience-page": {
    kicker: "בקשת הצעה",
    title: "החוויה שבחרתם כבר איתנו",
    lead: "נשאר רק לספר לנו מתי ומי נוסע.",
  },
  comparison: {
    kicker: "בקשת הצעה",
    title: "המסלולים שהשוויתם כבר איתנו",
    lead: "נשאר רק לספר לנו מתי ומי נוסע.",
  },
  "direct-selection": {
    kicker: "מסלול מהיר",
    title: "כבר סגורים על הכיוון?",
    lead: "בחרו מה מעניין אתכם — אפשר יותר מדבר אחד — וספרו לנו בקצרה מתי ומי נוסע.",
  },
};

/** How the already-made choice is presented back. Not a cart. */
const SELECTED_LABEL: Record<string, string> = {
  "trek-page": "בונים טיול סביב",
  "experience-page": "הבקשה כוללת",
  comparison: "המסלולים שבחרתם",
  match: "מה שסימנתם",
  "direct-selection": "מה שבחרתם",
};

function QuotePage() {
  const search = Route.useSearch();
  const { user, name: authName } = useAuth();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "manual" | "failed">("idle");
  const [context, setContext] = useState<TripContext | null>(null);
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [urlSource, setUrlSource] = useState<string | null>(null);
  const [form, setForm] = useState({
    dates: "",
    travelers: "",
    note: "",
    name: "",
    phone: "",
    email: "",
  });

  // Whatever the visitor already told us elsewhere — never ask for it twice.
  useEffect(() => {
    const ctx = readTripContext();
    if (ctx) {
      setContext(ctx);
      if (ctx.selected?.length) setSelected(ctx.selected);
      setForm((f) => ({ ...f, dates: f.dates || (ctx.time ?? "") }));
    }

    // URL fallback, so an early click never loses the selection.
    if (search.trek) {
      const trek = trekItems.find((t) => t.slug === search.trek);
      if (trek) {
        setUrlSource("trek-page");
        if (!ctx?.selected?.length)
          setSelected([{ kind: "trek", slug: trek.slug, name: trek.name }]);
      }
    } else if (search.experience) {
      const exp = experienceItems.find((x) => x.slug === search.experience);
      if (exp) {
        setUrlSource("experience-page");
        if (!ctx?.selected?.length)
          setSelected([{ kind: "experience", slug: exp.slug, name: exp.name }]);
      }
    } else if (search.source === "direct") {
      setUrlSource("direct-selection");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const source = (context?.source as string) || urlSource || "direct-selection";
  const intro = SOURCE_INTRO[source] ?? SOURCE_INTRO["direct-selection"]!;
  const isPicker = source === "direct-selection";

  const has = (kind: SelectedItem["kind"], slug: string) =>
    selected.some((s) => s.kind === kind && s.slug === slug);

  const toggle = (item: SelectedItem) =>
    setSelected((cur) =>
      cur.some((s) => s.kind === item.kind && s.slug === item.slug)
        ? cur.filter((s) => !(s.kind === item.kind && s.slug === item.slug))
        : [...cur, item],
    );

  const selectedText = selected.map((s) => s.name).join(", ");

  const waMessage = `היי, הגעתי דרך 'השביל הזה' ואני רוצה הצעה לטיול בנפאל.
מעניין אותי: ${selectedText || "—"}
תקופה: ${form.dates || "—"}
נוסעים: ${form.travelers || "—"}
${form.note ? `הערה: ${form.note}` : ""}${context?.summary ? `\nמה שעניתי בשאלון: ${context.summary}` : ""}
שם: ${form.name || "—"} · טלפון: ${form.phone || "—"}${form.email ? ` · אימייל: ${form.email}` : ""}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const result = await submitLead({
      source: `quote-request:${source}`,
      ...form,
      interests: selectedText,
      selected: selected.map((s) => `${s.kind === "trek" ? "טרק" : "חוויה"}: ${s.name}`).join(", "),
      considered: context?.considered?.join(", ") ?? "",
      quizAnswers: context?.summary ?? "",
      matchAnswers: context?.matchAnswers ? JSON.stringify(context.matchAnswers) : "",
      fitScores: context?.fitScores?.map((f) => `${f.name}: ${f.score}%`).join(", ") ?? "",
      contextSource: source,
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
          lead="נחזור אליכם עם כיוון ראשוני והצעה."
          size="wide"
        />
        <Section size="wide" className="!pb-12">
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
      <PageHero kicker={intro.kicker} title={intro.title} lead={intro.lead} size="wide" />

      {/* Already chosen — shown back plainly. Removable only where the visitor
          is actively building a list (direct selection). */}
      {selected.length > 0 && (
        <Section size="wide" className="!pb-2">
          <Card>
            <p className="text-[12px] font-semibold tracking-wide text-saffron">
              {SELECTED_LABEL[source] ?? SELECTED_LABEL["direct-selection"]}
            </p>
            {isPicker ? (
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {selected.map((s) => (
                  <li key={`${s.kind}:${s.slug}`}>
                    <button
                      type="button"
                      onClick={() => toggle(s)}
                      aria-label={`להסיר את ${s.name}`}
                      className="rounded-xl bg-saffron px-4 py-2.5 text-[13.5px] font-semibold text-parchment"
                    >
                      {s.name}
                      <span className="ms-2 opacity-70">✕</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 font-display text-[18px] leading-snug font-bold">
                {selected.map((s) => s.name).join(" · ")}
              </p>
            )}
            {context?.summary && (
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink/70">{context.summary}</p>
            )}
            {context?.considered?.length ? (
              <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
                נעביר גם כרקע: {context.considered.join(" · ")}
              </p>
            ) : null}
          </Card>
        </Section>
      )}

      {/* Direct selection happens here — no separate route, no cart. */}
      {isPicker && (
        <Section size="wide" title="מה מעניין אתכם?" className="!pb-2">
          <p className="text-[13.5px] leading-relaxed text-ink/70">
            אפשר לבחור כמה מסלולים וחוויות יחד.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[12px] font-semibold tracking-wide text-saffron">טרקים</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {trekItems.map((t) => {
                  const on = has("trek", t.slug);
                  return (
                    <button
                      key={t.slug}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle({ kind: "trek", slug: t.slug, name: t.name })}
                      className={`rounded-xl px-4 py-2.5 text-[14px] font-medium ring-1 transition-colors ${
                        on
                          ? "bg-saffron text-parchment ring-saffron"
                          : "bg-parchment text-ink/80 ring-ink/10"
                      }`}
                    >
                      {on && <span className="me-1.5">✓</span>}
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold tracking-wide text-saffron">חוויות</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {experienceItems.map((x) => {
                  const on = has("experience", x.slug);
                  return (
                    <button
                      key={x.slug}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle({ kind: "experience", slug: x.slug, name: x.name })}
                      className={`rounded-xl px-4 py-2.5 text-[14px] font-medium ring-1 transition-colors ${
                        on
                          ? "bg-saffron text-parchment ring-saffron"
                          : "bg-parchment text-ink/80 ring-ink/10"
                      }`}
                    >
                      {on && <span className="me-1.5">✓</span>}
                      {x.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>
      )}

      <Section size="wide" className="!pb-12">
        <form onSubmit={onSubmit} className="space-y-4">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="name">
                שם
              </label>
              <input id="name" required value={form.name} onChange={set("name")} className={field} />
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

          {/* Everything optional folded away. */}
          <Accordion
            items={[
              {
                title: "פרטים נוספים (לא חובה)",
                content: (
                  <div className="space-y-4">
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
                    <div>
                      <label className={label} htmlFor="email">
                        אימייל
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
                  </div>
                ),
              },
            ]}
          />

          <div className="pt-1">
            <button
              type="submit"
              disabled={state === "sending"}
              className="w-full rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment disabled:opacity-50 sm:w-auto"
            >
              {state === "sending" ? "שולח…" : "שלחו בקשה להצעה"}
            </button>
          </div>

          {/* WhatsApp appears only as a technical fallback when sending fails. */}
          {state === "manual" && (
            <Card>
              <p className="text-[14px] leading-relaxed text-ink/75">
                הטופס מוכן, אבל חסרה כאן כתובת השליחה של מנגנון הלידים — לכן הבקשה עדיין לא נשלחת
                אוטומטית. בינתיים אפשר לשלוח את אותם פרטים בוואטסאפ.
              </p>
              <div className="mt-3">
                <WhatsappButton message={waMessage} label="לשלוח את הפרטים בוואטסאפ" />
              </div>
            </Card>
          )}

          {state === "failed" && (
            <Card>
              <p className="text-[14px] leading-relaxed text-ink/75">
                השליחה לא עברה. אפשר לנסות שוב, או לשלוח לנו את הפרטים בוואטסאפ.
              </p>
              <div className="mt-3">
                <WhatsappButton message={waMessage} label="לשלוח את הפרטים בוואטסאפ" />
              </div>
            </Card>
          )}
        </form>
      </Section>
    </>
  );
}
