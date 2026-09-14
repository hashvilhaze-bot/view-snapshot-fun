import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Card, EffortBars, PageHero, Section } from "@/components/page";
import { treks, type Trek } from "@/lib/content";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

/**
 * Trek-to-trek only, built strictly on facts the trek content already states.
 * A row appears only if at least one chosen trek actually has that field.
 */
const ROWS: { label: string; render: (t: Trek) => React.ReactNode; has: (t: Trek) => boolean }[] = [
  { label: "ימי הליכה", render: (t) => t.days, has: (t) => Boolean(t.days) },
  {
    label: "ימים בנפאל",
    render: (t) => `מ־${t.totalDaysMin} ומעלה`,
    has: (t) => Boolean(t.totalDaysMin),
  },
  { label: "גובה מקסימלי", render: (t) => t.altitude, has: (t) => Boolean(t.altitude) },
  {
    label: "מאמץ",
    render: (t) => (
      <span className="flex flex-wrap items-center gap-2">
        <EffortBars level={t.effort} />
        <span className="text-[12.5px] text-ink/70">{t.effortLabel}</span>
      </span>
    ),
    has: (t) => Boolean(t.effort),
  },
  { label: "אופי", render: (t) => t.character, has: (t) => Boolean(t.character) },
  { label: "למי מתאים", render: (t) => t.fit, has: (t) => Boolean(t.fit) },
  { label: "פחות מתאים ל", render: (t) => t.notFor, has: (t) => Boolean(t.notFor) },
];

function ComparePage() {
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (slug: string) =>
    setPicked((cur) =>
      cur.includes(slug) ? cur.filter((s) => s !== slug) : cur.length >= 3 ? cur : [...cur, slug],
    );

  const chosen = treks.filter((t) => picked.includes(t.slug));
  const rows = ROWS.filter((r) => chosen.some((t) => r.has(t)));

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
        size="xwide"
      />

      <Section size="xwide" className="!pt-4 !pb-4">
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
                    : "bg-parchment text-ink/80 ring-ink/10"
                }`}
              >
                {on && <span className="me-1.5">✓</span>}
                {t.name}
              </button>
            );
          })}
        </div>
        {picked.length >= 3 && (
          <p className="mt-2 text-[12.5px] text-ink/65">אפשר להשוות עד שלושה מסלולים יחד.</p>
        )}
      </Section>

      {chosen.length === 0 ? (
        <Section size="xwide" className="!pt-0 !pb-12">
          <Card>
            <p className="text-[14px] leading-relaxed text-ink/75">
              בחרו מסלול או שניים כדי לראות אותם כאן זה מול זה.
            </p>
          </Card>
        </Section>
      ) : (
        <Section size="xwide" className="!pt-0 !pb-12">
          {/* Mobile: one card per trek. */}
          <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {chosen.map((t) => (
              <Card key={t.slug} className="h-full">
                <p className="font-display text-[17px] font-bold">{t.name}</p>
                <dl className="mt-3 space-y-2 text-[13px] text-ink/75">
                  {rows.map((r) => (
                    <div key={r.label} className="flex justify-between gap-3">
                      <dt className="shrink-0 text-ink/60">{r.label}</dt>
                      <dd className="text-end font-medium">{r.has(t) ? r.render(t) : "—"}</dd>
                    </div>
                  ))}
                </dl>
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

          {/* Desktop: a real side-by-side table. */}
          <div className="hidden overflow-hidden rounded-2xl border border-parchment/50 bg-parchment/85 ring-1 ring-ink/5 lg:block">
            <table className="w-full border-collapse text-start text-[13.5px]">
              <caption className="sr-only">השוואת נתוני המסלולים שנבחרו</caption>
              <thead>
                <tr className="border-b border-ink/10">
                  <th scope="col" className="w-40 px-4 py-3 text-start text-[12px] text-ink/60">
                    נתון
                  </th>
                  {chosen.map((t) => (
                    <th
                      key={t.slug}
                      scope="col"
                      className="px-4 py-3 text-start font-display text-[16px] font-bold text-ink"
                    >
                      <Link to="/treks/$slug" params={{ slug: t.slug }} className="hover:underline">
                        {t.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-ink/8 last:border-0">
                    <th
                      scope="row"
                      className="px-4 py-3 text-start align-top text-[12.5px] font-medium text-ink/60"
                    >
                      {r.label}
                    </th>
                    {chosen.map((t) => (
                      <td
                        key={t.slug}
                        className="px-4 py-3 align-top leading-relaxed text-ink/80"
                      >
                        {r.has(t) ? r.render(t) : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
