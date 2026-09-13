import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Card, EffortBars, PageHero, Section } from "@/components/page";
import { treks } from "@/lib/content";
import { saveTripContext } from "@/lib/trip-context";

export const Route = createFileRoute("/treks/compare")({
  component: ComparePage,
  head: () => ({
    meta: [
      { title: "השוואת טרקים בנפאל — משך, גובה ומאמץ | השביל הזה" },
      {
        name: "description",
        content:
          "בוחרים שני מסלולים או שלושה ורואים אותם זה מול זה: משך, גובה מקסימלי, ימים בנפאל, רמת מאמץ ולמי המסלול מתאים.",
      },
      { property: "og:title", content: "השוואת טרקים בנפאל" },
      {
        property: "og:description",
        content: "מסלול מול מסלול — משך, גובה, ימים בנפאל ורמת מאמץ.",
      },
    ],
  }),
});

/** Trek-to-trek only, on the data the trek content already states. */
function ComparePage() {
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (slug: string) =>
    setPicked((cur) =>
      cur.includes(slug) ? cur.filter((s) => s !== slug) : cur.length >= 3 ? cur : [...cur, slug],
    );

  const chosen = treks.filter((t) => picked.includes(t.slug));

  function toQuote() {
    saveTripContext({
      source: "comparison",
      selected: chosen.map((t) => ({ kind: "trek" as const, slug: t.slug, name: t.name })),
      directions: chosen.map((t) => t.name),
    });
    void navigate({ to: "/quote" });
  }

  return (
    <>
      <PageHero
        kicker="השוואה"
        title="מסלול מול מסלול"
        lead="בוחרים עד שלושה מסלולים ורואים את הנתונים זה מול זה."
      />

      <Section className="!pt-4 !pb-4">
        <div className="flex flex-wrap gap-2">
          {treks.map((t) => {
            const on = picked.includes(t.slug);
            return (
              <button
                key={t.slug}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(t.slug)}
                className={`rounded-xl px-4 py-2.5 text-[13.5px] font-medium ring-1 transition-colors ${
                  on
                    ? "bg-saffron text-parchment ring-saffron"
                    : "bg-parchment text-ink/75 ring-ink/10"
                }`}
              >
                {on && <span className="me-1.5">✓</span>}
                {t.name}
              </button>
            );
          })}
        </div>
      </Section>

      {chosen.length === 0 ? (
        <Section className="!pt-0 !pb-12">
          <Card>
            <p className="text-[14px] leading-relaxed text-ink/70">
              בחרו מסלול או שניים כדי לראות אותם כאן זה מול זה.
            </p>
          </Card>
        </Section>
      ) : (
        <Section className="!pt-0 !pb-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {chosen.map((t) => (
              <Card key={t.slug} className="h-full">
                <p className="font-display text-[17px] font-bold">{t.name}</p>
                <dl className="mt-3 space-y-2 text-[13px] text-ink/70">
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink/45">משך</dt>
                    <dd className="font-medium">{t.days}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink/45">גובה</dt>
                    <dd className="font-medium">{t.altitude}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink/45">ימים בנפאל</dt>
                    <dd className="font-medium">מ־{t.totalDaysMin} ומעלה</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-ink/45">מאמץ</dt>
                    <dd>
                      <EffortBars level={t.effort} />
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/70">
                  <span className="text-ink/45">למי מתאים: </span>
                  {t.fit}
                </p>
                <Link
                  to="/treks/$slug"
                  params={{ slug: t.slug }}
                  className="mt-3 inline-block text-[13px] font-semibold text-saffron"
                >
                  לעמוד המסלול ←
                </Link>
              </Card>
            ))}
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={toQuote}
              className="rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment"
            >
              {chosen.length > 1 ? "לקבלת הצעה למסלולים האלה" : "לקבלת הצעה למסלול הזה"}
            </button>
          </div>
        </Section>
      )}
    </>
  );
}
