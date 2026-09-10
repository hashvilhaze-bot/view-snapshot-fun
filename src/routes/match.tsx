import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Card, PageHero, Section, WhatsappButton } from "@/components/page";
import { experiences, treks } from "@/lib/content";
import { galleries } from "@/lib/galleries";
import { submitLead, whatsappHref } from "@/lib/leads";
import { saveTripContext } from "@/lib/trip-context";

export const Route = createFileRoute("/match")({
  component: MatchPage,
  head: () => ({
    meta: [
      { title: "מה מתאים לי? — בואו נמצא את השביל שלכם בנפאל | השביל הזה" },
      {
        name: "description",
        content:
          "שבע שאלות קצרות — ימים, גמישות, ניסיון, מאמץ, נוחות ועם מי נוסעים — ובסוף שניים־שלושה כיוונים אפשריים לטיול בנפאל, עם הסבר למה כל אחד יכול להתאים לכם.",
      },
      { property: "og:title", content: "מה מתאים לי? — בואו נמצא את השביל שלכם בנפאל" },
      { property: "og:description", content: "כיוונים לפתיחת שיחה, לא קטלוג מסלולים." },
    ],
  }),
});

const groups = [
  { key: "time", label: "כמה ימים יש לכם בנפאל בסך הכול", options: ["עד שבוע", "שבועיים", "שלושה שבועות ויותר"] },
  {
    key: "flex",
    label: "כמה גמישות יש בתאריכים",
    options: ["הימים קבועים", "אפשר להוסיף כמה ימים", "אפשר לבנות סביב המסלול"],
  },
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

const DAYS_BY_ANSWER: Record<string, number> = {
  "עד שבוע": 7,
  שבועיים: 14,
  "שלושה שבועות ויותר": 21,
};

const FLEX_BONUS: Record<string, number> = {
  "הימים קבועים": 0,
  "אפשר להוסיף כמה ימים": 3,
  "אפשר לבנות סביב המסלול": 7,
};

const ANSWERS_KEY = "hashvil:match-answers";

function MatchPage() {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [step, setStep] = useState(0);
  const [view, setView] = useState<"quiz" | "results">("quiz");

  // Answers survive a refresh or a walk to another page and back.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ANSWERS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { picked?: Record<string, string>; note?: string };
      if (saved.picked) setPicked(saved.picked);
      if (saved.note) setNote(saved.note);
    } catch {
      /* ignore unreadable storage */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(ANSWERS_KEY, JSON.stringify({ picked, note }));
    } catch {
      /* ignore unwritable storage */
    }
  }, [picked, note]);

  const answered = Object.keys(picked).length;

  const budgetDays = picked["time"]
    ? DAYS_BY_ANSWER[picked["time"]]! + (FLEX_BONUS[picked["flex"] ?? ""] ?? 0)
    : null;

  const { results, filteredOut } = (() => {
    const wantsHigh = picked["effort"] === "מאתגר" || picked["experience"] === "טרקים ארוכים";
    const wantsLow = picked["effort"] === "רגוע" || picked["experience"] === "אין כמעט";
    const culture = picked["interest"] === "אנשים ותרבות";
    const both = picked["interest"] === "גם וגם";
    const needsComfort = picked["comfort"] === "חשוב לי מיטה נוחה";
    const family = picked["company"] === "עם משפחה";

    // Hard filter first: a route that does not fit the days is not a recommendation.
    const fits = budgetDays ? treks.filter((t) => t.totalDaysMin <= budgetDays) : treks;
    const removed = budgetDays ? treks.filter((t) => t.totalDaysMin > budgetDays) : [];

    const pool = fits.length > 0 ? fits : [...treks].sort((a, b) => a.totalDaysMin - b.totalDaysMin).slice(0, 2);

    const scored = pool
      .map((t) => {
        let score = 0;
        const reasons: string[] = [];

        if (budgetDays) {
          reasons.push(
            `נכנס בנוחות ל${picked["time"]}: צריך בפועל בסביבות ${t.totalDaysMin} ימים בנפאל, כולל טיסות וימי חסד.`,
          );
          // A route that uses the days well scores better than one far below.
          score += 3 - Math.min(3, Math.floor((budgetDays - t.totalDaysMin) / 4));
        }
        if (wantsHigh) {
          score += t.effort;
          if (t.effort === 3) reasons.push("אמרתם מאמץ גבוה — וזה מסלול עם גובה וימים ארוכים.");
        }
        if (wantsLow) {
          score += 4 - t.effort;
          if (t.effort === 1) reasons.push("אמרתם קצב רגוע — כאן הגבהים נמוכים והימים קצרים.");
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

        return { t, score, reasons: reasons.slice(0, 3) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return { results: scored, filteredOut: removed };
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
        filteredOut={filteredOut}
        extras={extras}
        picked={picked}
        note={note}
        onBack={() => setView("quiz")}
      />
    );
  }

  const isNoteStep = step >= groups.length;
  const group = groups[Math.min(step, groups.length - 1)]!;
  const totalSteps = groups.length;
  const shownStep = Math.min(step + 1, totalSteps);

  return (
    <>
      <PageHero
        kicker="מה מתאים לי?"
        title="שבע שאלות קצרות, ואחריהן נדבר"
        lead="זה לא מחשבון ולא תשובה סופית. המטרה היא לצמצם לשניים־שלושה כיוונים שכדאי לבדוק, ולהסביר למה כל אחד מהם יכול להתאים לכם."
      />

      <Section className="pb-20 sm:pb-24">
        <div className="flex min-h-[52vh] flex-col">
        <div className="flex items-center gap-3">
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-valuenow={shownStep}
            aria-label="התקדמות בשאלון"
          >
            <div
              className="h-full rounded-full bg-saffron transition-all"
              style={{ width: `${(shownStep / totalSteps) * 100}%` }}
            />
          </div>
          <p className="shrink-0 text-[12.5px] font-medium text-ink/55">
            {isNoteStep ? "סיימנו את השאלות" : `שאלה ${shownStep} מתוך ${totalSteps}`}
          </p>
        </div>


        {isNoteStep ? (
          <div className="mt-6">
            <p className="font-display text-[17px] font-bold">משהו שכדאי שנדע? (לא חובה)</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/60">
              מגבלה בריאותית, חשש מגובה, אוכל, גיל הילדים או כל דבר אחר שישפיע על התכנון.
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="למשל: יש לי בעיה בברך, ואני מעדיף ימים קצרים יותר"
              className="mt-3 w-full rounded-xl bg-parchment px-4 py-3 text-[15px] leading-relaxed ring-1 ring-ink/10 outline-none placeholder:text-ink/35 focus:ring-2 focus:ring-saffron/60"
            />
          </div>
        ) : (
          <div className="mt-6">
            <p className="font-display text-[17px] leading-snug font-bold">{group.label}</p>
            <p className="mt-1 text-[12.5px] text-ink/50">בחרו תשובה אחת</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.options.map((o) => {
                const active = picked[group.key] === o;
                return (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setPicked((p) => ({ ...p, [group.key]: o }));
                      setStep((s) => Math.min(s + 1, groups.length));
                    }}
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
        )}

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row-reverse sm:justify-end">
          {isNoteStep || picked[group.key] ? (
            <button
              type="button"
              disabled={answered === 0}
              onClick={() => {
                if (isNoteStep) {
                  setView("results");
                  window.scrollTo({ top: 0 });
                } else {
                  setStep((s) => Math.min(s + 1, groups.length));
                }
              }}
              className="rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment disabled:opacity-40"
            >
              {isNoteStep ? "בואו נמצא את השביל שלי" : "לשאלה הבאה"}
            </button>
          ) : null}
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-xl bg-parchment px-6 py-3.5 text-[15px] font-medium text-ink ring-1 ring-ink/10"
            >
              לשאלה הקודמת
            </button>
          )}
        </div>

        {answered > 0 && (
          <button
            type="button"
            onClick={() => {
              setView("results");
              window.scrollTo({ top: 0 });
            }}
            className="mt-4 text-[13px] font-medium text-saffron"
          >
            לראות את הכיוונים לפי מה שעניתי עד כה ←
          </button>
        )}
      </Section>
    </>
  );
}


type ResultItem = { t: (typeof treks)[number]; reasons: string[] };

function ResultsView({
  results,
  filteredOut,
  extras,
  picked,
  note,
  onBack,
}: {
  results: ResultItem[];
  filteredOut: (typeof treks)[number][];
  extras: (typeof experiences)[number][];
  picked: Record<string, string>;
  note?: string;
  onBack: () => void;
}) {
  const summary = [...Object.values(picked), note?.trim() ? `הערה: ${note.trim()}` : ""]
    .filter(Boolean)
    .join(" · ");
  const directions = results.map((r) => r.t.name);

  // Remember the answers so the quote form does not ask for them again.
  useEffect(() => {
    saveTripContext({
      source: "match",
      summary,
      directions,
      time: picked["time"],
    });
  }, [summary, directions.join(","), picked["time"]]);

  const waMessage = `היי, הגעתי דרך 'השביל הזה'. עניתי על "מה מתאים לי?" (${summary}) והכיוונים שיצאו לי: ${directions.join(
    ", ",
  )}. אשמח להתייעץ.`;



  return (
    <>
      <section className="bg-summit px-6 pt-9 pb-10">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={onBack}
            className="text-[13px] font-medium text-parchment/60"
          >
            → לחזור ולשנות תשובות
          </button>
          <p className="mt-4 text-[12px] font-medium tracking-wide text-saffron">הכיוונים שלכם</p>
          <h1 className="mt-1.5 font-display text-[26px] leading-tight font-bold text-parchment sm:text-3xl">
            המסלול שנראה הכי מתאים לפי התשובות שלכם
          </h1>
          <p className="mt-2.5 max-w-[46ch] text-[14px] leading-relaxed text-parchment/75">
            זו נקודת פתיחה לשיחה, לא המלצה סופית. נתאים את המסלול אחרי שנכיר אתכם, את הקצב ואת
            הניסיון שלכם.
          </p>
          {summary && (
            <p className="mt-3 text-[13.5px] leading-relaxed text-parchment/55">{summary}</p>
          )}
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
                    {i === 0 ? "נראה הכי מתאים לפי התשובות שלכם" : "כיוון נוסף ששווה לשקול"}
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
                      לפרטי המסלול
                    </Link>
                    <Link
                      to="/quote"
                      className="rounded-xl bg-parchment px-4 py-2.5 text-[14px] font-medium text-ink ring-1 ring-ink/10"
                    >
                      לקבלת הצעה למסלול
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredOut.length > 0 && (
          <Card className="mt-5">
            <p className="text-[13px] font-semibold text-ink/60">מה לא נכנס לימים שיש לכם</p>
            <ul className="mt-2 space-y-1.5">
              {filteredOut.map((t) => (
                <li key={t.slug} className="text-[13.5px] leading-relaxed text-ink/65">
                  <span className="font-semibold">{t.name}</span> — צריך בפועל בסביבות{" "}
                  {t.totalDaysMin} ימים בנפאל.
                </li>
              ))}
            </ul>
            <p className="mt-2.5 text-[13px] leading-relaxed text-ink/55">
              אם יש גמישות של כמה ימים, שווה לחזור אחורה ולסמן אותה — זה משנה את התמונה.
            </p>
          </Card>
        )}



        <div className="mt-6">
          <p className="text-[13px] font-medium text-ink/60">מה אפשר לשלב סביב המסלול</p>
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
          כל אחד מהכיוונים האלה נבנה בפועל אחרת, לפי הימים שיש לכם ולפי מה שמעניין אתכם בדרך. אנחנו
          נשמח לעבור על זה איתכם בשיחה.
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
