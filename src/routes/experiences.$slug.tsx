import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Card, Gallery, Insight, PageHero, Section, TalkCta } from "@/components/page";
import { experiences } from "@/lib/content";
import { galleries } from "@/lib/galleries";

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
  const others = experiences.filter((e) => e.slug !== item.slug).slice(0, 4);

  return (
    <>
      <PageHero kicker={item.kicker} title={item.name} lead={item.intro} />

      <Section title="מה יש שם">
        <ul className="space-y-3">
          {item.details.map((d) => (
            <li key={d} className="flex gap-3 text-[15px] leading-relaxed text-ink/75">
              <span className="font-bold text-saffron">·</span>
              {d}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="לשלב בטיול">
        <Card>
          <p className="text-[15px] leading-relaxed text-ink/75">{item.combine}</p>
          <Link
            to="/treks"
            className="mt-4 inline-block rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
          >
            לראות מסלולים
          </Link>
        </Card>
      </Section>

      <Section title="חוויות נוספות">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {others.map((e) => (
            <Link key={e.slug} to="/experiences/$slug" params={{ slug: e.slug }}>
              <Card className="h-full p-4">
                <p className="font-display text-[15px] font-bold">{e.name}</p>
                <p className="mt-1 text-[12px] text-ink/60">{e.kicker}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <TalkCta />
    </>
  );
}
