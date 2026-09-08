import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Card, PageHero, Section, TalkCta } from "@/components/page";
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

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const others = articles.filter((a) => a.slug !== article.slug);

  return (
    <>
      <PageHero kicker={article.kicker} title={article.title} lead={article.summary} />

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
          <Link to="/match">
            <Card className="h-full p-4">
              <p className="font-display font-bold">מה מתאים לי?</p>
              <p className="mt-1 text-[13px] text-ink/60">כלי קצר שנותן כמה כיוונים</p>
            </Card>
          </Link>
          <Link to="/treks">
            <Card className="h-full p-4">
              <p className="font-display font-bold">טרקים וחוויות</p>
              <p className="mt-1 text-[13px] text-ink/60">משך, גובה ומאמץ במבט אחד</p>
            </Card>
          </Link>
        </div>
      </Section>

      <Section title="עוד במרכז הידע">
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
