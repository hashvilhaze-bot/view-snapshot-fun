import { Link } from "@tanstack/react-router";
import { articles, treks, type Article, type Trek } from "@/lib/content";
import { coverForArticle } from "@/lib/article-cover";
import { galleries } from "@/lib/galleries";
import { MatchPrompt } from "./content-navigation";

function CardContent({
  photo,
  meta,
  title,
  summary,
}: {
  photo: { src: string; alt: string } | undefined;
  meta: string;
  title: string;
  summary: string;
}) {
  return (
    <>
      {photo && (
        <div className="archive-image">
          <img
            src={photo.src}
            alt={photo.alt}
            width={720}
            height={450}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="archive-copy">
        <span className="archive-meta">{meta}</span>
        <h3 className="p-h3">{title}</h3>
        <p>{summary}</p>
      </div>
    </>
  );
}
export function ArticleCard({ article: a }: { article: Article }) {
  const minutes =
    a.journal?.minutes ??
    Math.max(2, Math.round(a.body.join(" ").trim().split(/\s+/).length / 180));
  return (
    <Link to="/knowledge/$slug" params={{ slug: a.slug }} className="archive-card">
      <CardContent
        photo={coverForArticle(a.slug)}
        meta={a.category + " · " + minutes + " דקות קריאה"}
        title={a.title}
        summary={a.summary}
      />
    </Link>
  );
}
export function TrekCard({ trek }: { trek: Trek }) {
  return (
    <Link to="/treks/$slug" params={{ slug: trek.slug }} className="archive-card">
      <CardContent
        photo={galleries[trek.slug]?.[0]}
        meta={trek.days + " · " + trek.effortLabel}
        title={trek.name}
        summary={trek.teaser}
      />
    </Link>
  );
}
const readingRoutes: Record<string, string[]> = {
  altitude: ["everest-base-camp", "annapurna-circuit"],
  "when-to-go": ["poon-hill", "annapurna-base-camp"],
  "lodges-permits": ["manaslu-circuit", "langtang-valley"],
  "gear-money": ["mardi-himal", "everest-base-camp"],
  "choosing-trek": ["poon-hill", "manaslu-circuit"],
  "manaslu-vs-annapurna": ["manaslu-circuit", "annapurna-base-camp"],
  "day-on-trail": ["mardi-himal", "langtang-valley"],
  "culture-food": ["langtang-valley", "annapurna-circuit"],
};
export function RelatedArchive({ article }: { article: Article }) {
  const others = articles.filter((a) => a.slug !== article.slug);
  const related = article.journal
    ? article.journal.related.flatMap((slug) => others.filter((a) => a.slug === slug))
    : [
        ...others.filter((a) => a.category === article.category),
        ...others.filter((a) => a.category !== article.category),
      ].slice(0, 3);
  const routes = (article.journal?.treks ?? readingRoutes[article.slug] ?? []).flatMap((slug) =>
    treks.filter((t) => t.slug === slug),
  );
  return (
    <div className="site-frame content-archive">
      <section>
        <h2 className="p-h2">להמשיך לקרוא</h2>
        <div className="archive-grid">
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
      {routes.length > 0 && (
        <section>
          <h2 className="p-h2">מסלולים מהאזור</h2>
          <div className="archive-grid archive-pair">
            {routes.map((t) => (
              <TrekCard key={t.slug} trek={t} />
            ))}
          </div>
        </section>
      )}
      <MatchPrompt />
    </div>
  );
}
