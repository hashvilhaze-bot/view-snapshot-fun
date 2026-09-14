import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Accordion, Card, EffortBars, Gallery, Insight, PageHero, Section } from "@/components/page";
import { treks } from "@/lib/content";
import { galleries } from "@/lib/galleries";
import { saveTripContext } from "@/lib/trip-context";

export const Route = createFileRoute("/treks/$slug")({
  loader: ({ params }) => {
    const trek = treks.find((t) => t.slug === params.slug);
    if (!trek) throw notFound();
    return { trek };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "מסלול לא נמצא" }, { name: "robots", content: "noindex" }] };
    }
    const { trek } = loaderData;
    return {
      meta: [
        { title: `${trek.name} — מסלול בנפאל | השביל הזה` },
        { name: "description", content: `${trek.intro} ${trek.days}, ${trek.altitude}.` },
        { property: "og:title", content: `${trek.name} — מסלול בנפאל` },
        { property: "og:description", content: trek.intro },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: TrekPage,
});

function TrekPage() {
  const { trek } = Route.useLoaderData();
  const others = treks.filter((t) => t.slug !== trek.slug);
  const photos = galleries[trek.slug] ?? [];
  const cover = photos[0];

  return (
    <>
      <PageHero
        kicker="מסלול"
        title={trek.name}
        lead={trek.intro}
        {...(cover ? { image: cover.src, imageAlt: cover.alt } : {})}
      />

      <Section>
        <Gallery photos={photos.slice(1)} />
      </Section>

      <Section>
        <Card>
          <dl className="grid grid-cols-2 gap-4 text-[13px] sm:grid-cols-4">
            <div>
              <dt className="text-ink/60">משך</dt>
              <dd className="mt-0.5 font-medium">{trek.days}</dd>
            </div>
            <div>
              <dt className="text-ink/60">גובה מקסימלי</dt>
              <dd className="mt-0.5 font-medium">{trek.altitude}</dd>
            </div>
            <div>
              <dt className="text-ink/60">רמת מאמץ</dt>
              <dd className="mt-1.5 flex items-center gap-2">
                <EffortBars level={trek.effort} />
                <span className="font-medium">{trek.effortLabel}</span>
              </dd>
            </div>
            <div>
              <dt className="text-ink/60">אופי</dt>
              <dd className="mt-0.5 font-medium">{trek.character}</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-ink/10 pt-4 text-[14px] leading-relaxed text-ink/70">
            <span className="font-semibold text-ink">כמה ימים לתכנן בנפאל: </span>
            בסביבות {trek.totalDaysMin} ימים ומעלה, כולל טיסות, יום־יומיים בקטמנדו וימי חסד —
            לא רק ימי ההליכה.
          </p>
          <div className="mt-4 grid gap-3 border-t border-ink/10 pt-4 text-[14px] leading-relaxed sm:grid-cols-2">
            <p className="text-ink/70">
              <span className="font-semibold text-ink">למי זה מתאים: </span>
              {trek.fit}.
            </p>
            <p className="text-ink/60">
              <span className="font-semibold text-ink">פחות מתאים ל: </span>
              {trek.notFor}.
            </p>
          </div>
        </Card>
      </Section>

      <Section title="מה מיוחד בו">
        <ul className="space-y-3">
          {trek.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-ink/75">
              <span className="font-bold text-saffron">·</span>
              {h}
            </li>
          ))}
        </ul>
      </Section>

      {/* Day by day — rendered only when real per-day content exists. */}
      {trek.dayByDay && trek.dayByDay.length > 0 && (
        <Section title="יום אחרי יום">
          <Accordion
            items={trek.dayByDay.map((d) => ({ title: d.title, content: <p>{d.text}</p> }))}
          />
        </Section>
      )}

      <Section title="כדאי לדעת">
        <Insight text={trek.surprise} />
        <ul className="mt-4 space-y-3">
          {trek.details.map((d) => (
            <li key={d} className="flex gap-3 text-[15px] leading-relaxed text-ink/75">
              <span className="font-bold text-saffron">·</span>
              {d}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="מה אפשר לשלב סביב המסלול">
        <ul className="space-y-3">
          {trek.combine.map((c) => (
            <li key={c} className="flex gap-3 text-[15px] leading-relaxed text-ink/75">
              <span className="font-bold text-saffron">·</span>
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Link to="/experiences" className="text-[13.5px] font-semibold text-saffron">
            לגלות את נפאל שמעבר לטרקים ←
          </Link>
        </p>
      </Section>

      {/* One primary action on the page. */}
      <Section>
        <Card className="text-center">
          <Link
            to="/quote"
            search={{ trek: trek.slug }}
            onClick={() =>
              saveTripContext({
                source: "trek-page",
                selected: [{ kind: "trek", slug: trek.slug, name: trek.name }],
                directions: [trek.name],
                summary: `${trek.name} · ${trek.days} · ${trek.altitude} · ${trek.effortLabel}`,
              })
            }
            className="inline-block rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment"
          >
            בואו נבנה טיול סביב {trek.name}
          </Link>
        </Card>
      </Section>

      <Section title="להעמיק">
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/knowledge/$slug" params={{ slug: "altitude" }}>
            <Card className="h-full p-4">
              <p className="font-display font-bold">גובה והתאקלמות</p>
              <p className="mt-1 text-[13px] text-ink/65">מה שקובע את אורך המסלול</p>
            </Card>
          </Link>
          <Link to="/knowledge/$slug" params={{ slug: "day-on-trail" }}>
            <Card className="h-full p-4">
              <p className="font-display font-bold">איך נראה יום בטרק</p>
              <p className="mt-1 text-[13px] text-ink/60">מהבוקר ועד ארוחת הערב</p>
            </Card>
          </Link>
          <Link to="/knowledge/$slug" params={{ slug: "manaslu-vs-annapurna" }}>
            <Card className="h-full p-4">
              <p className="font-display font-bold">מנאסלו מול אנאפורנה</p>
              <p className="mt-1 text-[13px] text-ink/60">שתי חוויות שונות לגמרי</p>
            </Card>
          </Link>
        </div>
      </Section>

      <Section title="מסלולים נוספים">
        <div className="grid gap-3 sm:grid-cols-2">
          {others.map((t) => (
            <Link key={t.slug} to="/treks/$slug" params={{ slug: t.slug }}>
              <Card className="h-full p-4">
                <p className="font-display font-bold">{t.name}</p>
                <p className="mt-1 text-[13px] text-ink/60">
                  {t.days} · {t.effortLabel}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

    </>
  );
}
