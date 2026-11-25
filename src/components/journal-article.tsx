import { Fragment, type ReactNode } from "react";
import "@/journal.css";
import { Link } from "@tanstack/react-router";
import { articles, treks, type Article } from "@/lib/content";
import type { JournalMeta } from "@/lib/journal/catalog";
import type { ArticleChapter, JournalBody } from "@/lib/journal/load";
import { journalPhotos, type JournalPhoto, type PhotoKey } from "@/lib/journal/photos";

function linkedText(text: string): ReactNode {
  return text.split(/(\[[^\]]+\]\(\/[\w/-]+\))/g).map((part, index) => {
    const link = /^\[([^\]]+)\]\((\/[\w/-]+)\)$/.exec(part);
    return link ? (
      <a key={index} href={link[2]}>
        {link[1]}
      </a>
    ) : (
      part
    );
  });
}
function RichParagraph({ text }: { text: string }) {
  return (
    <p>
      {text
        .split("**")
        .map((part, i) =>
          i % 2 ? (
            <strong key={i}>{linkedText(part)}</strong>
          ) : (
            <Fragment key={i}>{linkedText(part)}</Fragment>
          ),
        )}
    </p>
  );
}
function Photo({ id, cover = false }: { id: PhotoKey; cover?: boolean }) {
  const photo: JournalPhoto = journalPhotos[id];
  return (
    <figure className={cover ? "jr-cover" : "jr-photo"}>
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={cover ? "(min-width: 56rem) 46vw, 100vw" : "(min-width: 56rem) 44rem, 94vw"}
        width={1200}
        height={800}
        alt={photo.alt}
        loading={cover ? "eager" : "lazy"}
        fetchPriority={cover ? "high" : "auto"}
      />
      <figcaption>
        {photo.name}
        <span>
          {" "}
          ·{" "}
          <a href={photo.source}>
            צילום <bdi>{photo.author}</bdi>
          </a>{" "}
          ·{" "}
          <a href={photo.licenseUrl}>
            <bdi>{photo.license}</bdi>
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
function ChapterLinks({ chapters }: { chapters: ArticleChapter[] }) {
  return (
    <ol>
      {chapters.map((section) => (
        <li key={section.id}>
          <a href={"#" + section.id}>{section.title}</a>
        </li>
      ))}
    </ol>
  );
}
export function JournalArticle({
  article,
  meta,
  body,
}: {
  article: Article;
  meta: JournalMeta;
  body: JournalBody;
}) {
  const related = meta.related.map((s) => articles.find((a) => a.slug === s)).filter((x) => !!x);
  const routes = meta.treks.map((s) => treks.find((t) => t.slug === s)).filter((x) => !!x);
  return (
    <article className="journal" lang="he" dir="rtl">
      <div className="site-frame jr-intro">
        <div className="jr-heading">
          <Link to="/knowledge" className="jr-back">
            מרכז הידע
          </Link>
          <p className="jr-meta">
            {article.kicker} <span aria-hidden="true">·</span> {meta.minutes} דקות קריאה
          </p>
          <h1>{article.title}</h1>
          <p className="jr-deck">{article.summary}</p>
        </div>
        <Photo id={meta.cover} cover />
      </div>
      <div className="site-frame jr-layout">
        <nav className="jr-contents" aria-label="תוכן העניינים">
          <div className="jr-side">
            <p>במאמר הזה</p>
            <ChapterLinks chapters={body.sections} />
          </div>
          <details className="jr-mobile">
            <summary>תוכן העניינים</summary>
            <ChapterLinks chapters={body.sections} />
          </details>
        </nav>
        <div className="jr-body">
          {body.intro.map((text, i) => (
            <RichParagraph key={i} text={text} />
          ))}
          {body.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={section.id + "-heading"}>
              <h2 id={section.id + "-heading"}>{section.title}</h2>
              {section.blocks.map((block, i) =>
                typeof block === "string" ? (
                  <RichParagraph key={i} text={block} />
                ) : (
                  <h3 key={i}>{block.heading}</h3>
                ),
              )}
              {meta.photos[section.id] && <Photo id={meta.photos[section.id]!} />}
            </section>
          ))}
          <aside className="jr-next" aria-label="המשך קריאה">
            <h2>להמשיך לקרוא</h2>
            <ul>
              {related.map((a) => (
                <li key={a.slug}>
                  <Link to="/knowledge/$slug" params={{ slug: a.slug }}>
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
            <h3>מסלולים מהאזור</h3>
            <ul>
              {routes.map((t) => (
                <li key={t.slug}>
                  <Link to="/treks/$slug" params={{ slug: t.slug }}>
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </article>
  );
}
