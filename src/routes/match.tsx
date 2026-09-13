import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Card, PageHero, Section } from "@/components/page";
import { INTEREST_TAGS } from "@/lib/catalog";
import {
  EXPERIENCE_OPTIONS,
  FITNESS_OPTIONS,
  PACE_OPTIONS,
  TIME_OPTIONS,
  needsFitnessQuestion,
  needsTrekQuestion,
  runMatch,
  type MatchAnswers,
} from "@/lib/match";
import { saveTripContext } from "@/lib/trip-context";

export const Route = createFileRoute("/match")({
  component: MatchPage,
  head: () => ({
    meta: [
      { title: "מה מתאים לי? — למצוא את השביל שלכם בנפאל | השביל הזה" },
      {
        name: "description",
        content:
          "כמה שאלות קצרות על זמן, קצב ומה שמעניין אתכם — ומהן כמה כיוונים מתוך הטרקים והחוויות שלנו, עם הסבר למה הם מתאימים.",
      },
      { property: "og:title", content: "מה מתאים לי? — למצוא את השביל שלכם בנפאל" },
      {
        property: "og:description",
        content: "לא קטלוג. כמה שאלות, ואז כיוונים שמתאימים לימים ולקצב שלכם.",
      },
    ],
  }),
});

type StepId = "time" | "pace" | "interests" | "fitness" | "trekExperience";

const LABELS: Record<StepId, string> = {
  time: "כמה זמן יש לכם לטיול?",
  pace: "באיזה קצב אתם רוצים לטייל?",
  interests: "מה מעניין אתכם? אפשר לבחור כמה",
  fitness: "איך אתם מגדירים את הכושר שלכם?",
  trekExperience: "מה הניסיון שלכם בטרקים?",
};

function MatchPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<MatchAnswers>({ interests: [] });
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);

  // Conditional questions: only asked when the earlier answers make them relevant.
  const steps: StepId[] = useMemo(() => {
    const s: StepId[] = ["time", "pace", "interests"];
    if (needsFitnessQuestion(answers)) s.push("fitness");
    if (needsTrekQuestion(answers)) s.push("trekExperience");
    return s;
  }, [answers]);

  const current = steps[Math.min(step, steps.length - 1)]!;
  const total = steps.length;

  const { results } = useMemo(() => (done ? runMatch(answers) : { results: [] }), [done, answers]);

  const setSingle = (id: StepId, value: string) => {
    setAnswers((a) => ({ ...a, [id]: value }));
    setTimeout(() => next(), 120);
  };

  const toggleInterest = (tag: string) =>
    setAnswers((a) => ({
      ...a,
      interests: a.interests.includes(tag)
        ? a.interests.filter((t) => t !== tag)
        : [...a.interests, tag],
    }));

  function next() {
    setStep((s) => {
      if (s + 1 >= total) {
        setDone(true);
        return s;
      }
      return s + 1;
    });
  }

  const answered =
    current === "interests" ? answers.interests.length > 0 : Boolean(answers[current]);

  const summary = [
    answers.time && `זמן: ${answers.time}`,
    answers.pace && `קצב: ${answers.pace}`,
    answers.interests.length > 0 && `מעניין אותם: ${answers.interests.join(", ")}`,
    answers.fitness && `כושר: ${answers.fitness}`,
    answers.trekExperience && `ניסיון בטרקים: ${answers.trekExperience}`,
  ]
    .filter(Boolean)
    .join(" · ");

  function toQuote() {
    const chosen = results.filter((r) => picked.includes(`${r.item.kind}:${r.item.slug}`));
    saveTripContext({
      source: "match",
      selected: chosen.map((r) => ({
        kind: r.item.kind,
        slug: r.item.slug,
        name: r.item.name,
      })),
      considered: results
        .filter((r) => !picked.includes(`${r.item.kind}:${r.item.slug}`))
        .map((r) => r.item.name),
      matchAnswers: {
        time: answers.time ?? "",
        pace: answers.pace ?? "",
        interests: answers.interests.join(", "),
        fitness: answers.fitness ?? "",
        trekExperience: answers.trekExperience ?? "",
      },
      fitScores: results.map((r) => ({ name: r.item.name, score: Math.round(r.score * 100) })),
      summary,
      directions: chosen.map((r) => r.item.name),
      ...(answers.time ? { time: answers.time } : {}),
    });
    void navigate({ to: "/quote" });
  }

  // ---------- RESULTS ----------
  if (done) {
    if (results.length === 0) {
      return (
        <>
          <PageHero
            kicker="סיימנו את השאלות"
            title="כאן שווה לדבר איתנו"
            lead="מה שסימנתם לא מצטרף לכיוון אחד ברור מתוך המסלולים והחוויות שכבר כתובים כאן — וזה בדיוק המקום שבו שיחה קצרה עוזרת יותר מרשימה."
          />
          <Section className="!pb-12">
            <Card>
              <p className="text-[14px] leading-relaxed text-ink/70">{summary}</p>
              <button
                type="button"
                onClick={toQuote}
                className="mt-4 rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment"
              >
                להעביר את זה אלינו
              </button>
            </Card>
          </Section>
        </>
      );
    }

    return (
      <>
        <PageHero
          kicker="סיימנו את השאלות"
          title="הכיוונים שמתאימים למה שסימנתם"
          lead="בחרו מה מסקרן אתכם — רק מה שתבחרו יעבור איתנו הלאה. את השאר נראה כרקע."
        />

        <Section className="!pt-4">
          <p className="text-[13.5px] leading-relaxed text-ink/60">{summary}</p>
        </Section>

        <Section className="!pt-3 !pb-4">
          <div className="space-y-3">
            {results.map((r, i) => {
              const key = `${r.item.kind}:${r.item.slug}`;
              const on = picked.includes(key);
              return (
                <Card
                  key={key}
                  className={`transition-colors ${on ? "ring-2 ring-saffron" : ""} ${
                    i === 0 ? "border-saffron/40" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-saffron/12 px-2.5 py-1 text-[11px] font-semibold text-saffron">
                      {r.item.kind === "trek" ? "טרק" : "חוויה"}
                    </span>
                    {i === 0 && (
                      <span className="text-[11px] font-semibold text-ink/45">
                        ההתאמה הגבוהה ביותר
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-display text-[19px] font-bold">{r.item.name}</p>
                  <p className="mt-0.5 text-[12.5px] text-ink/50">{r.item.meta}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{r.item.teaser}</p>
                  {r.reasons.length > 0 && (
                    <ul className="mt-2.5 space-y-1.5">
                      {r.reasons.map((reason) => (
                        <li
                          key={reason}
                          className="flex gap-2 text-[13px] leading-relaxed text-ink/65"
                        >
                          <span className="font-bold text-saffron">·</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setPicked((cur) =>
                          cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key],
                        )
                      }
                      className={`rounded-xl px-4 py-2.5 text-[13.5px] font-semibold ring-1 transition-colors ${
                        on
                          ? "bg-saffron text-parchment ring-saffron"
                          : "bg-parchment text-ink/75 ring-ink/10"
                      }`}
                    >
                      {on ? "✓ נבחר" : "מסקרן אותי"}
                    </button>
                    <Link
                      to={r.item.kind === "trek" ? "/treks/$slug" : "/experiences/$slug"}
                      params={{ slug: r.item.slug }}
                      className="text-[13px] font-semibold text-saffron"
                    >
                      פרטים ←
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section className="!pt-2 !pb-12">
          <button
            type="button"
            onClick={toQuote}
            disabled={picked.length === 0}
            className="rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment disabled:opacity-45"
          >
            {picked.length > 1 ? "לקבלת הצעה לכיוונים שבחרתי" : "לקבלת הצעה לכיוון שבחרתי"}
          </button>
          <p className="mt-2.5 text-[13px] text-ink/50">
            {picked.length === 0
              ? "בחרו לפחות כיוון אחד כדי להמשיך."
              : "השאר יעבור אלינו כרקע, לא כבקשה."}
          </p>
        </Section>
      </>
    );
  }

  // ---------- QUESTIONS ----------
  const options: readonly string[] =
    current === "time"
      ? TIME_OPTIONS
      : current === "pace"
        ? PACE_OPTIONS
        : current === "interests"
          ? INTEREST_TAGS
          : current === "fitness"
            ? FITNESS_OPTIONS
            : EXPERIENCE_OPTIONS;

  return (
    <>
      <PageHero
        kicker="מה מתאים לי?"
        title="בואו נמצא את השביל שלכם"
        lead="כמה שאלות קצרות, ואז כמה כיוונים מתוך הטרקים והחוויות שלנו."
      />

      <Section className="!pt-4 !pb-12">
        <p className="text-[12.5px] font-medium tracking-wide text-ink/45">
          שאלה {Math.min(step + 1, total)} מתוך {total}
        </p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-saffron transition-all"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>

        <div className="mt-5 min-h-[340px] sm:min-h-[400px]">
          <h2 className="font-display text-[21px] leading-snug font-bold sm:text-2xl">
            {LABELS[current]}
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {options.map((opt) => {
              const on =
                current === "interests" ? answers.interests.includes(opt) : answers[current] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    current === "interests" ? toggleInterest(opt) : setSingle(current, opt)
                  }
                  className={`rounded-xl px-4 py-3 text-[14.5px] font-medium ring-1 transition-colors ${
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

          <div className="mt-6 flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="text-[13.5px] font-medium text-ink/55"
              >
                ← חזרה
              </button>
            )}
            {current === "interests" && (
              <button
                type="button"
                onClick={next}
                disabled={!answered}
                className="rounded-xl bg-saffron px-5 py-3 text-[14.5px] font-semibold text-parchment disabled:opacity-45"
              >
                להמשיך
              </button>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
