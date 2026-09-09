import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Card, Insight, PageHero, Section, TalkCta } from "@/components/page";
import { articles } from "@/lib/content";

export const Route = createFileRoute("/knowledge/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "לא נמצא" }, { name: "robots", content: "noindex" }] };
    }
    const { article } = loaderData;
    return {
      meta: [
        { title: `${article.title} — נפאל | השביל הזה` },
        { name: "description", content: article.summary },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.summary },
      ],
    };
  },
  component: ArticlePage,
});

/** The natural next step differs per article — not one generic CTA everywhere. */
const nextSteps: Record<string, { to: "/match" | "/treks" | "/quote"; t: string; d: string }[]> = {
  altitude: [
    { to: "/treks", t: "מסלולים לפי גובה", d: "לראות מה עולה לאן ובכמה ימים" },
    { to: "/match", t: "מה מתאים לי?", d: "לצמצם לשניים־שלושה כיוונים" },
  ],
  "when-to-go": [
    { to: "/quote", t: "יש לכם תאריכים?", d: "נבדוק מה אפשר לעשות בתקופה הזאת" },
    { to: "/treks", t: "טרקים ולא רק", d: "מה מתאים לאיזו עונה" },
  ],
  "choosing-trek": [
    { to: "/match", t: "מה מתאים לי?", d: "שש שאלות, ואז כיוונים" },
    { to: "/treks", t: "כל המסלולים", d: "משך, גובה ומאמץ במבט אחד" },
  ],
  "manaslu-vs-annapurna": [
    { to: "/treks", t: "לראות את שני המסלולים", d: "עמוד לכל אחד, עם תמונות" },
    { to: "/match", t: "מה מתאים לי?", d: "אם עדיין מתלבטים" },
  ],
  "culture-food": [
    { to: "/treks", t: "חוויות בקטמנדו ובכפרים", d: "לפגוש את זה מקרוב" },
    { to: "/match", t: "מה מתאים לי?", d: "לשלב תרבות בתוך הטיול" },
  ],
};

const defaultNext = [
  { to: "/match" as const, t: "מה מתאים לי?", d: "כלי קצר שנותן כמה כיוונים" },
  { to: "/treks" as const, t: "טרקים ולא רק", d: "משך, גובה ומאמץ במבט אחד" },
];

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const others = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const next = nextSteps[article.slug] ?? defaultNext;

  return (
    <>
      <PageHero kicker={article.kicker} title={article.title} lead={article.summary} />

      {article.quickAnswer && (
        <Section>
          <Insight title="בקצרה" text={article.quickAnswer} />
        </Section>
      )}

      <Section>
        <div className="space-y-4">
          {article.body.map((p) => (
            <p key={p} className="text-[15px] leading-relaxed text-ink/75">
              {p}
            </p>
          ))}
        </div>
      </Section>

      <Section title="להמשיך מכאן">
        <div className="grid gap-3 sm:grid-cols-2">
          {next.map((n) => (
            <Link key={n.t} to={n.to}>
              <Card className="h-full p-4 transition-colors hover:border-saffron/40">
                <p className="font-display font-bold">{n.t}</p>
                <p className="mt-1 text-[13px] text-ink/60">{n.d}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="עוד באזור הידע">
        <div className="grid gap-3 sm:grid-cols-3">
          {others.map((a) => (
            <Link key={a.slug} to="/knowledge/$slug" params={{ slug: a.slug }}>
              <Card className="h-full p-4">
                <p className="font-display text-[15px] font-bold">{a.title}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <TalkCta />
    </>
  );
}
