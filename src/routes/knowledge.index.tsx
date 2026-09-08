import { createFileRoute, Link } from "@tanstack/react-router";

import { Card, PageHero, Section, TalkCta } from "@/components/page";
import { articles } from "@/lib/content";

export const Route = createFileRoute("/knowledge/")({
  component: KnowledgePage,
  head: () => ({
    meta: [
      { title: "לפני שנוסעים — מרכז ידע על נפאל | השביל הזה" },
      {
        name: "description",
        content: "גובה והתאקלמות, עונות ומתי נוסעים, לודג׳ים והיתרים, ציוד וכספים.",
      },
      { property: "og:title", content: "לפני שנוסעים — מרכז ידע על נפאל" },
      {
        property: "og:description",
        content: "המידע המעשי שמשפיע על תכנון הטיול, בקצרה ולעניין.",
      },
    ],
  }),
});

function KnowledgePage() {
  return (
    <>
      <PageHero
        kicker="לפני שנוסעים"
        title="מרכז ידע"
        lead="הדברים המעשיים שמשפיעים על התכנון: גובה, עונות, לינה, היתרים וכספים."
      />

      <Section>
        <div className="grid gap-3 sm:grid-cols-2">
          {articles.map((a) => (
            <Link key={a.slug} to="/knowledge/$slug" params={{ slug: a.slug }}>
              <Card className="h-full transition-colors hover:border-saffron/40">
                <p className="text-[11px] font-medium text-saffron">{a.kicker}</p>
                <p className="mt-1 font-display text-lg font-bold">{a.title}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{a.summary}</p>
                <span className="mt-3 inline-block text-[13px] font-semibold text-saffron">
                  לקרוא ←
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <Card>
          <p className="text-[15px] leading-relaxed text-ink/75">
            רוצים לדעת איזה מסלול מתאים לכם לפני שנכנסים לפרטים?
          </p>
          <Link
            to="/match"
            className="mt-4 inline-block rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
          >
            מה מתאים לי?
          </Link>
        </Card>
      </Section>

      <TalkCta />
    </>
  );
}
