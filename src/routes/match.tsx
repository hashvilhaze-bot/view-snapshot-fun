import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Card, PageHero, Section, WhatsappButton } from "@/components/page";
import { experiences, treks } from "@/lib/content";
import { galleries } from "@/lib/galleries";
import { submitLead, whatsappHref } from "@/lib/leads";

export const Route = createFileRoute("/match")({
  component: MatchPage,
  head: () => ({
    meta: [
      { title: "מה מתאים לי? — מצאו את השביל שלכם בנפאל | השביל הזה" },
      {
        name: "description",
        content:
          "שש שאלות קצרות — זמן, ניסיון, מאמץ, נוחות ועם מי נוסעים — ובסוף שניים־שלושה כיוונים אפשריים לטיול בנפאל, עם הסבר למה כל אחד יכול להתאים לכם.",
      },
      { property: "og:title", content: "מה מתאים לי? — מצאו את השביל שלכם בנפאל" },
      { property: "og:description", content: "כיוונים, לא קטלוג. נקודת פתיחה לשיחה." },
    ],
  }),
});

const groups = [
  { key: "time", label: "כמה זמן יש לכם", options: ["עד שבוע", "שבועיים", "שלושה שבועות ויותר"] },
  {
    key: "experience",
    label: "ניסיון קודם בטרקים",
    options: ["אין כמעט", "כמה ימי הליכה", "טרקים ארוכים"],
  },
  { key: "effort", label: "רמת מאמץ שנוחה לכם", options: ["רגוע", "מאוזן", "מאתגר"] },
  {
    key: "interest",
    label: "מה מעניין אתכם יותר",
    options: ["ההרים עצמם", "אנשים ותרבות", "גם וגם"],
  },
  {
    key: "comfort",
    label: "רמת נוחות",
    options: ["חשוב לי מיטה נוחה", "בסדר עם פשוט", "לא אכפת לי בכלל"],
  },
  { key: "company", label: "עם מי נוסעים", options: ["לבד", "בזוג", "עם חברים", "עם משפחה"] },
] as const;

function MatchPage() {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [view, setView] = useState<"quiz" | "results">("quiz");

  const answered = Object.keys(picked).length;

  const results = (() => {
    const wantsHigh = picked["effort"] === "מאתגר" || picked["experience"] === "טרקים ארוכים";
    const wantsLow = picked["effort"] === "רגוע" || picked["experience"] === "אין כמעט";
    const shortTime = picked["time"] === "עד שבוע";
    const longTime = picked["time"] === "שלושה שבועות ויותר";
    const culture = picked["interest"] === "אנשים ותרבות";
    const both = picked["interest"] === "גם וגם";
    const needsComfort = picked["comfort"] === "חשוב לי מיטה נוחה";
    const family = picked["company"] === "עם משפחה";

    return treks
      .map((t) => {
        let score = 0;
        const reasons: string[] = [];

        if (wantsHigh) {
          score += t.effort;
          if (t.effort === 3) reasons.push("אמרתם מאמץ גבוה — וזה מסלול עם גובה וימים ארוכים.");
        }
        if (wantsLow) {
          score += 4 - t.effort;
          if (t.effort === 1) reasons.push("אמרתם קצב רגוע — כאן הגבהים נמוכים והימים קצרים.");
        }
        if (shortTime) {
          score += t.effort === 1 ? 3 : t.effort === 2 ? 1 : -2;
          if (t.effort === 1) reasons.push("נכנס בנוחות לשבוע, כולל טיסות וימי חסד.");
          if (t.effort === 3) reasons.push("בשבוע אחד זה לא ריאלי — צריך יותר ימים.");
        }
        if (longTime) {
          score += t.effort === 3 ? 2 : 0;
          if (t.effort === 3) reasons.push("עם שלושה שבועות אפשר לעשות אותו בקצב נכון.");
        }
        if (culture || both) {
          score += t.effort === 1 ? 2 : 1;
          reasons.push("בדרך יש כפרים ואנשים, לא רק נוף.");
        }
        if (needsComfort) {
          score += t.effort === 3 ? -2 : 1;
          if (t.effort === 3) reasons.push("הלינה כאן בסיסית — כדאי לקחת את זה בחשבון.");
        }
        if (family) {
          score += t.effort === 1 ? 2 : t.effort === 2 ? 0 : -2;
          if (t.effort === 1) reasons.push("עובד טוב גם עם ילדים גדולים.");
        }

        return { t, score, reasons: reasons.slice(0, 2) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
  })();

  const extras = (() => {
    const slugs =
      picked["interest"] === "ההרים עצמם"
        ? ["pokhara", "yoga-rest"]
        : picked["comfort"] === "חשוב לי מיטה נוחה"
          ? ["kathmandu", "pokhara"]
          : ["kathmandu", "villages"];
    return experiences.filter((e) => slugs.includes(e.slug));
  })();

  if (view === "results") {
    return (
      <ResultsView
        results={results}
        extras={extras}
        picked={picked}
        onBack={() => setView("quiz")}
      />
    );
  }

  return (
    <>
      <PageHero
        kicker="מה מתאים לי?"
        title="שש שאלות, ואז נדבר"
        lead="זה לא מחשבון ולא תשובה מוחלטת. הרעיון הוא לצמצם לשניים־שלושה כיוונים שכדאי להסתכל עליהם — ולהסביר למה."
      />

      <Section>
        <div className="space-y-5">
          {groups.map((g) => (
            <div key={g.key}>
              <p className="mb-2 text-[13px] font-medium text-ink/60">{g.label}</p>
              <div className="flex flex-wrap gap-2">
                {g.options.map((o) => {
                  const active = picked[g.key] === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setPicked((p) => ({ ...p, [g.key]: o }))}
                      className={`rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors ${
                        active
                          ? "bg-saffron text-parchment"
                          : "bg-parchment text-ink ring-1 ring-ink/10"
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={answered === 0}
          onClick={() => {
            setView("results");
            window.scrollTo({ top: 0 });
          }}
          className="mt-7 w-full rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment disabled:opacity-40 sm:w-auto"
        >
          מצאו את השביל שלי
        </button>
        {answered > 0 && answered < groups.length && (
          <p className="mt-2 text-[12.5px] text-ink/50">
            ענו על עוד {groups.length - answered} שאלות ונוכל לדייק יותר.
          </p>
        )}
      </Section>
    </>
  );
}

type ResultItem = { t: (typeof treks)[number]; reasons: string[] };

function ResultsView({
  results,
  extras,
  picked,
  onBack,
}: {
  results: ResultItem[];
  extras: (typeof experiences)[number][];
  picked: Record<string, string>;
  onBack: () => void;
}) {
  const summary = Object.values(picked).join(" · ");
  const waMessage = `היי, הגעתי דרך 'השביל הזה'. עניתי על "מה מתאים לי?" (${summary}) והכיוונים שיצאו לי: ${results
    .map((r) => r.t.name)
    .join(", ")}. אשמח להתייעץ.`;

  return (
    <>
      <section className="bg-summit px-6 pt-9 pb-10">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={onBack}
            className="text-[13px] font-medium text-parchment/60"
          >
            → לשנות תשובות
          </button>
          <p className="mt-4 text-[12px] font-medium tracking-wide text-saffron">
            הכיוונים שלכם
          </p>
          <h1 className="mt-1.5 font-display text-[26px] leading-tight font-bold text-parchment sm:text-3xl">
            לפי מה שסיפרתם, אלה השבילים שהיינו מציעים לבדוק
          </h1>
          {summary && <p className="mt-3 text-[13.5px] leading-relaxed text-parchment/60">{summary}</p>}
        </div>
      </section>

      <Section>
        <div className="space-y-4">
          {results.map(({ t, reasons }, i) => {
            const cover = galleries[t.slug]?.[0];
            return (
              <Card key={t.slug} className="overflow-hidden p-0">
                {cover && (
                  <img
                    src={cover.src}
                    alt={cover.alt}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="aspect-[16/7] w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <p className="text-[11px] font-semibold tracking-wide text-saffron">
                    {i === 0 ? "הכיוון הראשון" : "כיוון נוסף שכדאי לשקול"}
                  </p>
                  <p className="mt-1 font-display text-lg font-bold">{t.name}</p>
                  <p className="mt-1 text-[13px] text-ink/60">
                    {t.days} · {t.altitude} · {t.effortLabel}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{t.teaser}</p>
                  {reasons.length > 0 && (
                    <>
                      <p className="mt-4 text-[12.5px] font-semibold text-ink/55">
                        למה זה יכול להתאים לכם
                      </p>
                      <ul className="mt-1.5 space-y-1.5">
                        {reasons.map((r) => (
                          <li
                            key={r}
                            className="flex gap-2 text-[13.5px] leading-relaxed text-ink/65"
                          >
                            <span className="font-bold text-saffron">·</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <p className="mt-3 text-[13px] leading-relaxed text-ink/55">
                    פחות מתאים ל{t.notFor}.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to="/treks/$slug"
                      params={{ slug: t.slug }}
                      className="rounded-xl bg-saffron px-4 py-2.5 text-[14px] font-semibold text-parchment"
                    >
                      לעמוד המסלול
                    </Link>
                    <Link
                      to="/quote"
                      className="rounded-xl bg-parchment px-4 py-2.5 text-[14px] font-medium text-ink ring-1 ring-ink/10"
                    >
                      לבקש הצעה על זה
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-6">
          <p className="text-[13px] font-medium text-ink/60">ולשלב סביב זה</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {extras.map((e) => (
              <Link key={e.slug} to="/experiences/$slug" params={{ slug: e.slug }}>
                <Card className="h-full p-4">
                  <p className="font-display text-[15px] font-bold">{e.name}</p>
                  <p className="mt-1 text-[12px] leading-snug text-ink/60">{e.teaser}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-5 text-[13px] leading-relaxed text-ink/55">
          אף אחד מהכיוונים האלה אינו סופי — כמעט כל מסלול נבנה אחרת בפועל, לפי הימים שיש לכם ולפי
          מה שמעניין אתכם בדרך.
        </p>
      </Section>

      <Section title="להמשיך מכאן">
        <MiniLeadForm waMessage={waMessage} directions={results.map((r) => r.t.name).join(", ")} />
      </Section>

      <Section>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/treks">
            <Card className="h-full p-4">
              <p className="font-display font-bold">לראות את כל המסלולים</p>
              <p className="mt-1 text-[13px] text-ink/60">כולל מה שלא יצא לכם כאן</p>
            </Card>
          </Link>
          <Link to="/knowledge/$slug" params={{ slug: "choosing-trek" }}>
            <Card className="h-full p-4">
              <p className="font-display font-bold">איך בוחרים טרק</p>
              <p className="mt-1 text-[13px] text-ink/60">מה באמת קובע את ההחלטה</p>
            </Card>
          </Link>
        </div>
      </Section>
    </>
  );
}

function MiniLeadForm({ waMessage, directions }: { waMessage: string; directions: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "manual" | "failed">("idle");

  if (state === "sent") {
    return (
      <Card>
        <p className="font-display text-lg font-bold">קיבלנו, {name || "תודה"}.</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink/70">
          נחזור אליכם ונדבר על הכיוונים האלה.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <p className="font-display text-lg font-bold">רוצים שנדבר על הכיוונים האלה?</p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink/70">
        השאירו שם וטלפון, או פשוט כתבו לנו בוואטסאפ — מה שנוח לכם.
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setState("sending");
          const res = await submitLead({ source: "match-results", name, phone, directions });
          setState(res === "sent" ? "sent" : res === "unconfigured" ? "manual" : "failed");
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="שם"
            className="w-full rounded-xl bg-parchment px-4 py-3 text-[15px] ring-1 ring-ink/10 outline-none placeholder:text-ink/35 focus:ring-2 focus:ring-saffron/60"
          />
          <input
            required
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="טלפון"
            className="w-full rounded-xl bg-parchment px-4 py-3 text-[15px] ring-1 ring-ink/10 outline-none placeholder:text-ink/35 focus:ring-2 focus:ring-saffron/60"
          />
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            type="submit"
            disabled={state === "sending"}
            className="rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment disabled:opacity-50"
          >
            {state === "sending" ? "שולח…" : "שנחזור אליכם"}
          </button>
          <WhatsappButton message={waMessage} />
        </div>
        {state === "manual" && (
          <p className="text-[13px] leading-relaxed text-ink/60">
            חסרה כאן כתובת השליחה של מנגנון הלידים הקיים, ולכן הפרטים לא נשלחים אוטומטית. בינתיים{" "}
            <Link to="/contact" className="font-semibold text-saffron">
              אפשר לפנות אלינו כאן
            </Link>
            {whatsappHref() ? " או בוואטסאפ." : "."}
          </p>
        )}
        {state === "failed" && (
          <p className="text-[13px] text-ink/60">השליחה לא עברה. אפשר לנסות שוב.</p>
        )}
      </form>
    </Card>
  );
}
