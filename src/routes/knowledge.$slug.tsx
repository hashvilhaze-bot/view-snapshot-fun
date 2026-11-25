import { coverForArticle } from "@/lib/article-cover";
import { publicMeta } from "@/lib/public-meta";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Card, Insight, PageHero, Section } from "@/components/page";
import { articles } from "@/lib/content";
import { loadJournal } from "@/lib/journal/load";
import { JournalArticle } from "@/components/journal-article";

export const Route = createFileRoute("/knowledge/$slug")({
  loader: async ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    const body = article.journal ? await loadJournal(article.slug) : undefined;
    if (article.journal && !body) throw notFound();
    return { article, body };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "לא נמצא" }, { name: "robots", content: "noindex" }] };
    }
    const { article } = loaderData;
    const meta = publicMeta(
      article.title + " | השביל הזה",
      article.summary,
      "/knowledge/" + article.slug,
      "article",
      coverForArticle(article.slug)?.src,
    );
    return {
      ...meta,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.summary,
            inLanguage: "he",
            articleSection: article.category,
            image: meta.meta.find((tag) => "property" in tag && tag.property === "og:image")
              ?.content,
            mainEntityOfPage: meta.links[0]!.href,
          }).replace(/</g, "\\u003c"),
        },
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
    { to: "/treks", t: "טרקים ומסלולים", d: "מה מתאים לאיזו עונה" },
  ],
  "choosing-trek": [
    { to: "/match", t: "מה מתאים לי?", d: "שבע שאלות, ואז כיוונים" },
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
  { to: "/treks" as const, t: "טרקים ומסלולים", d: "משך, גובה ומאמץ במבט אחד" },
];

function ArticlePage() {
  const { article, body } = Route.useLoaderData();
  if (article.journal && body)
    return <JournalArticle article={article} meta={article.journal} body={body} />;
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
            <p key={p} className="text-[0.9375rem] leading-relaxed text-ink/75">
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
                <p className="mt-1 text-[0.8125rem] text-ink/60">{n.d}</p>
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
                <p className="font-display text-[0.9375rem] font-bold">{a.title}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
