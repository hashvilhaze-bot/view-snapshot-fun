import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Card, EffortBars, Gallery, Insight, PageHero, Section, TalkCta } from "@/components/page";
import { treks } from "@/lib/content";
import { galleries } from "@/lib/galleries";

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
      ],
    };
  },
  component: TrekPage,
});

function TrekPage() {
  const { trek } = Route.useLoaderData();
  const others = treks.filter((t) => t.slug !== trek.slug);

  return (
    <>
      <PageHero kicker="מסלול" title={trek.name} lead={trek.intro} />

      <Section>
        <Card>
          <dl className="grid grid-cols-2 gap-4 text-[13px] sm:grid-cols-4">
            <div>
              <dt className="text-ink/45">משך</dt>
              <dd className="mt-0.5 font-medium">{trek.days}</dd>
            </div>
            <div>
              <dt className="text-ink/45">גובה מקסימלי</dt>
              <dd className="mt-0.5 font-medium">{trek.altitude}</dd>
            </div>
            <div>
              <dt className="text-ink/45">רמת מאמץ</dt>
              <dd className="mt-1.5 flex items-center gap-2">
                <EffortBars level={trek.effort} />
                <span className="font-medium">{trek.effortLabel}</span>
              </dd>
            </div>
            <div>
              <dt className="text-ink/45">אופי</dt>
              <dd className="mt-0.5 font-medium">{trek.character}</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-ink/10 pt-4 text-[14px] text-ink/70">
            למי מתאים: {trek.fit}
          </p>
        </Card>
      </Section>

      <Section title="מה חשוב לדעת">
        <ul className="space-y-3">
          {trek.details.map((d) => (
            <li key={d} className="flex gap-3 text-[15px] leading-relaxed text-ink/75">
              <span className="font-bold text-saffron">·</span>
              {d}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="להעמיק">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/knowledge/$slug" params={{ slug: "altitude" }}>
            <Card className="h-full p-4">
              <p className="font-display font-bold">גובה והתאקלמות</p>
              <p className="mt-1 text-[13px] text-ink/60">מה שקובע את אורך המסלול</p>
            </Card>
          </Link>
          <Link to="/knowledge/$slug" params={{ slug: "when-to-go" }}>
            <Card className="h-full p-4">
              <p className="font-display font-bold">מתי נוסעים</p>
              <p className="mt-1 text-[13px] text-ink/60">עונות ומזג אוויר</p>
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

      <TalkCta
        title="בואו נבנה את הטיול שלכם"
        text={`אם ${trek.name} נשמע לכם נכון, נדבר על התאמות, ימים נוספים ושילובים.`}
      />
    </>
  );
}
