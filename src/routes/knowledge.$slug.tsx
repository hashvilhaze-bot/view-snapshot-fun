import { coverForArticle } from "@/lib/article-cover";
import { publicMeta } from "@/lib/public-meta";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { Insight, PageHero } from "@/components/page";
import { breadcrumbData } from "@/lib/navigation-meta";
import { Breadcrumbs } from "@/components/content-navigation";
import { RelatedArchive } from "@/components/archive-cards";
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
      article.title + (article.journal ? " | השביל הזה" : " | מדריכים לנפאל | השביל הזה"),
      article.summary,
      "/knowledge/" + article.slug,
      "article",
      coverForArticle(article.slug)?.src,
    );
    return {
      ...meta,
      scripts: [
        breadcrumbData("knowledge", article.slug, article.title),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.summary,
            inLanguage: "he",
            publisher: { "@type": "Organization", name: "השביל הזה" },
            isPartOf: {
              "@type": "CollectionPage",
              name: "מרכז הידע",
              url: new URL("/knowledge", meta.links[0]!.href).href,
            },
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

function ArticlePage() {
  const { article, body } = Route.useLoaderData();
  if (article.journal && body)
    return <JournalArticle article={article} meta={article.journal} body={body} />;
  const cover = coverForArticle(article.slug);
  return (
    <article className="short-article">
      <Breadcrumbs group="knowledge" slug={article.slug} name={article.title} />
      <PageHero
        kicker={article.kicker}
        title={article.title}
        lead={article.summary}
        image={cover?.src}
        imageAlt={cover?.alt}
      />
      <div className="site-frame short-reading">
        <div>
          {article.quickAnswer && <Insight title="בקצרה" text={article.quickAnswer} />}
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
      <RelatedArchive article={article} />
    </article>
  );
}
