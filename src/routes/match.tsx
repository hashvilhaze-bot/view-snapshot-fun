import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Card, PageHero, Section } from "@/components/page";
import { treks } from "@/lib/content";

export const Route = createFileRoute("/match")({
  component: MatchPage,
  head: () => ({
    meta: [
      { title: "מה מתאים לי? — כלי התאמה לטיול בנפאל | השביל הזה" },
      {
        name: "description",
        content:
          "כמה בחירות פשוטות — זמן, קצב, גובה ואופי — ומקבלים שניים־שלושה כיוונים אפשריים לטיול בנפאל.",
      },
      { property: "og:title", content: "מה מתאים לי? — כלי התאמה לטיול בנפאל" },
      { property: "og:description", content: "כיוונים, לא קטלוג. נקודת פתיחה לשיחה." },
    ],
  }),
});

const groups = [
  { key: "time", label: "כמה זמן יש", options: ["שבוע", "שבועיים", "שלושה שבועות ויותר"] },
  { key: "pace", label: "קצב", options: ["רגוע", "מאוזן", "אתגר פיזי"] },
  { key: "altitude", label: "גובה", options: ["מעדיף נמוך", "בסדר עם גובה", "רוצה גובה אמיתי"] },
  { key: "vibe", label: "מה מסקרן", options: ["הרים", "תרבות ואנשים", "גם וגם"] },
] as const;

function MatchPage() {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);

  const answered = Object.keys(picked).length;

  const results = (() => {
    const list = [...treks];
    const wantsHigh = picked["altitude"] === "רוצה גובה אמיתי" || picked["pace"] === "אתגר פיזי";
    const wantsLow = picked["altitude"] === "מעדיף נמוך" || picked["pace"] === "רגוע";
    const shortTime = picked["time"] === "שבוע";
    return list
      .map((t) => {
        let score = 0;
        if (wantsHigh) score += t.effort;
        if (wantsLow) score += 4 - t.effort;
        if (shortTime) score += t.effort === 1 ? 2 : t.effort === 2 ? 1 : 0;
        if (picked["vibe"] === "תרבות ואנשים") score += t.effort === 1 ? 1 : 0;
        return { t, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((r) => r.t);
  })();

  return (
    <>
      <PageHero
        kicker="מה מתאים לי?"
        title="כמה בחירות, ואז נדבר"
        lead="זה לא מחשבון ולא תשובה מוחלטת — רק שניים־שלושה כיוונים שכדאי להסתכל עליהם."
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
                      onClick={() => {
                        setPicked((p) => ({ ...p, [g.key]: o }));
                        setShow(false);
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
          ))}
        </div>

        <button
          type="button"
          disabled={answered === 0}
          onClick={() => setShow(true)}
          className="mt-7 w-full rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment disabled:opacity-40 sm:w-auto"
        >
          להראות כיוונים
        </button>
      </Section>

      {show && (
        <Section title="כיוונים אפשריים">
          <div className="space-y-3">
            {results.map((t) => (
              <Card key={t.slug}>
                <p className="font-display text-lg font-bold">{t.name}</p>
                <p className="mt-1 text-[13px] text-ink/60">
                  {t.days} · {t.altitude} · {t.effortLabel}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{t.intro}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/treks/$slug"
                    params={{ slug: t.slug }}
                    className="rounded-xl bg-saffron px-4 py-2.5 text-[14px] font-semibold text-parchment"
                  >
                    לעמוד המסלול
                  </Link>
                  <Link
                    to="/contact"
                    className="rounded-xl bg-parchment px-4 py-2.5 text-[14px] font-medium text-ink ring-1 ring-ink/10"
                  >
                    בואו נדבר על זה
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-ink/55">
            אפשר גם לשלב ימים בערים, בכפרים או במנוחה — כמעט כל מסלול נבנה אחרת בפועל.
          </p>
        </Section>
      )}
    </>
  );
}
