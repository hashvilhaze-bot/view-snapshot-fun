import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Card, Gallery, Insight, PageHero, Section } from "@/components/page";
import { findCatalogItem } from "@/lib/catalog";
import { experiences } from "@/lib/content";
import { galleries } from "@/lib/galleries";
import { saveTripContext } from "@/lib/trip-context";

export const Route = createFileRoute("/experiences/$slug")({
  loader: ({ params }) => {
    const item = experiences.find((e) => e.slug === params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "לא נמצא" }, { name: "robots", content: "noindex" }] };
    }
    const { item } = loaderData;
    return {
      meta: [
        { title: `${item.name} — ${item.kicker} | השביל הזה` },
        { name: "description", content: item.intro },
        { property: "og:title", content: `${item.name} — ${item.kicker}` },
        { property: "og:description", content: item.intro },
      ],
    };
  },
  component: ExperiencePage,
});

function ExperiencePage() {
  const { item } = Route.useLoaderData();
  const photos = galleries[item.slug] ?? [];
  const catalogItem = findCatalogItem("experience", item.slug);
  const facts: { label: string; value: string }[] = [];
  if (catalogItem?.category) facts.push({ label: "עולם תוכן", value: catalogItem.category });
  if (catalogItem?.totalDaysMin) {
    facts.push({
      label: "כמה ימים לתכנן",
      value: catalogItem.totalDaysMin === 1 ? "יום אחד" : `${catalogItem.totalDaysMin} ימים ומעלה`,
    });
  }
  if (catalogItem) {
    facts.push({ label: "אופי", value: catalogItem.physical ? "כולל פעילות גופנית" : "רגוע" });
  }

  return (
    <>
      <PageHero kicker={item.kicker} title={item.name} lead={item.intro} />

      <Section>
        <Gallery photos={photos} />
      </Section>

      {facts.length > 0 && (
        <Section>
          <Card>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[12px] uppercase tracking-wide text-ink/50">{f.label}</dt>
                  <dd className="mt-0.5 text-[15px] font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </Section>
      )}


      <Section title="מה יש שם">
        <Insight text={item.surprise} />
        <ul className="mt-4 space-y-3">
          {item.details.map((d) => (
            <li key={d} className="flex gap-3 text-[15px] leading-relaxed text-ink/75">
              <span className="font-bold text-saffron">·</span>
              {d}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="משתלב טוב עם...">
        <Card>
          <p className="text-[15px] leading-relaxed text-ink/75">{item.combine}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/treks"
              className="rounded-xl bg-parchment px-4 py-2.5 text-[14px] font-medium text-ink ring-1 ring-ink/10"
            >
              לפרטי המסלולים
            </Link>
            <Link
              to="/quote"
              onClick={() =>
                saveTripContext({
                  source: "experience-page",
                  selected: [{ kind: "experience", slug: item.slug, name: item.name }],
                  directions: [item.name],
                  summary: `${item.name} — ${item.kicker}`,
                })
              }
              className="rounded-xl bg-saffron px-4 py-2.5 text-[14px] font-semibold text-parchment"
            >
              לקבלת הצעה שכוללת את זה
            </Link>
          </div>
        </Card>
      </Section>


    </>
  );
}
