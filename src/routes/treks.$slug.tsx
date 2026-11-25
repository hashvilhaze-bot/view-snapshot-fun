import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ContactCtas } from "@/components/renewed/contact-ctas";
import { treks } from "@/lib/content";
import { galleries } from "@/lib/galleries";
import { examples, faqSchema, trekFaq } from "@/lib/treks/itineraries";
import { FaqList } from "@/components/renewed/faq";
import { Itinerary } from "@/components/renewed/itinerary";
import { publicMeta } from "@/lib/public-meta";
import { trekCopy } from "@/lib/treks/trek-copy";

export const Route = createFileRoute("/treks/$slug")({
  loader: ({ params }) => {
    if (params.slug === "pokhara-hills")
      throw redirect({ to: "/experiences/$slug", params: { slug: "pokhara" }, statusCode: 301 });
    const trek = treks.find((t) => t.slug === params.slug);
    const example = examples[params.slug];
    if (!trek || !example) throw notFound();
    return { trek, example, faq: trekFaq(trek.name, example, trek.fit, trek.combine) };
  },
  head: ({ loaderData }) => ({
    ...(loaderData
      ? publicMeta(
          loaderData.trek.name + " | טרקים בנפאל | השביל הזה",
          loaderData.example.description,
          "/treks/" + loaderData.trek.slug,
          "article",
          galleries[loaderData.trek.slug]?.[0]?.src,
        )
      : { meta: [{ name: "robots", content: "noindex" }] }),
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify(faqSchema(loaderData.faq)).replace(/</g, "\\u003c"),
          },
        ]
      : [],
  }),
  component: TrekPage,
});

function TrekPage() {
  const { trek, example, faq } = Route.useLoaderData();
  const copy = trekCopy[trek.slug];
  const photos = galleries[trek.slug] ?? [];
  const hero = photos[0];
  const facts: [string, string][] = [
    ["ימי הליכה במסלול המוצע", String(example.stages.filter((s) => s.kind === "walk").length)],
    ["סך ימי המסלול", String(example.stages.length)],
    ["קושי", trek.effortLabel],
    ["הנקודה הגבוהה במסלול המוצע", example.altitude],
    ["אופי האזור", trek.character],
  ];
  return (
    <>
      <div className="p-wrap pt-6">
        <nav aria-label="פירורי לחם" className="p-muted text-[15px]">
          <Link to="/" className="p-link">
            בית
          </Link>{" "}
          <span aria-hidden>/</span>{" "}
          <Link to="/treks" className="p-link">
            טרקים
          </Link>{" "}
          <span aria-hidden>/</span> <span aria-current="page">{trek.name}</span>
        </nav>
      </div>
      <section className="p-wrap pt-6">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="p-kicker">טרק בנפאל</p>
            <h1 className="p-h1 mt-2">{trek.name}</h1>
            <p className="p-lead mt-4">{example.description}</p>
            <div className="mt-7">
              <ContactCtas trek={trek.slug} />
            </div>
          </div>
          {hero && (
            <figure className="m-0">
              <img
                src={hero.src}
                alt={hero.alt}
                className="aspect-[4/3] w-full rounded-[10px] object-cover"
              />
              {hero.credit && (
                <figcaption className="p-muted text-sm mt-2">
                  צילום{" "}
                  <a href={hero.credit.source} className="p-link">
                    {hero.credit.author}
                  </a>{" "}
                  ·{" "}
                  <a className="p-link" href="https://creativecommons.org/licenses/by-sa/4.0/">
                    CC BY-SA 4.0
                  </a>{" "}
                  · התאמת גודל
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </section>

      <section className="p-wrap mt-10">
        <dl className="p-mist m-0 grid gap-x-6 gap-y-4 rounded-[10px] p-6 sm:grid-cols-2 lg:grid-cols-5">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="p-muted text-[14px]">{k}</dt>
              <dd className="m-0 mt-1 font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="p-section">
        <div className="p-wrap grid gap-10 lg:grid-cols-2">
          <div className="p-read">
            <h2 className="p-h2">למי זה מתאים</h2>
            <p className="mt-4">{trek.fit}</p>
            <h3 className="p-h3 mt-6">למי פחות</h3>
            <p className="p-muted mt-2">{trek.notFor}</p>
            <p className="mt-6">
              כל מסלול כאן הוא נקודת התחלה. את הלינות, הקצב והימים מסביב נבנה לפי הזמן והאנשים
              שנוסעים.
            </p>
          </div>
          <div className="p-read">
            <h2 className="p-h2">רגעים בולטים</h2>
            <ul className="p-aligned-list mt-4 space-y-3">
              {(copy?.highlights ?? trek.highlights).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <div className="p-card mt-6 p-5">
              <p className="p-kicker">שווה לדעת</p>
              <p className="mt-2">{copy?.insight ?? trek.surprise}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="p-section p-mist">
        <div className="p-wrap grid gap-10 lg:grid-cols-2">
          <div className="p-read">
            <h2 className="p-h2">מה דורש היערכות</h2>
            <ul className="p-aligned-list mt-4 space-y-3">
              {(copy?.preparation ?? trek.details).map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div className="p-read">
            <h2 className="p-h2">מה גמיש בתכנון</h2>
            <ul className="p-aligned-list mt-4 space-y-3">
              {trek.combine.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {photos.length > 1 && (
        <section className="p-section">
          <div className="p-wrap">
            <h2 className="p-h2">מהשביל</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {photos.slice(1).map((p) => (
                <figure key={p.src} className="m-0">
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    className="aspect-[3/2] w-full rounded-[10px] object-cover"
                  />
                  <figcaption className="p-muted mt-2 text-[15px]">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="p-section p-mist">
        <div className="p-wrap">
          <h2 className="p-h2">איך הדרך יכולה להיראות</h2>
          <p className="p-muted mt-4 p-read">{example.difference}</p>
          <p className="p-notice mt-5">
            כך אפשר לחלק את הדרך. את התוכנית נבנה יחד לפי הקצב שלכם, הלינות והתנאים בשטח. הזמנים
            משוערים ואינם כוללים את כל העצירות או ימי השהייה בנפאל.
          </p>
          <Itinerary stages={example.stages} />
          <details className="p-rule mt-8">
            <summary>מקור נוסף על המסלול</summary>
            <p>{example.version}</p>
            <a href={example.source} target="_blank" rel="noopener noreferrer" className="p-link">
              לפירוט המסלול והזמנים
            </a>
            {example.backgroundSource && (
              <p>
                <a
                  href={example.backgroundSource}
                  className="p-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  רקע נוסף בעברית
                </a>
              </p>
            )}
            <p className="p-muted mt-3">
              ההפניה היא למידע על הדרך. את השירותים, ההיתרים וההיערכות לנסיעה נברר בנפרד כחלק
              מהתכנון שלכם.
            </p>
          </details>
          {example.extensions.map((extension) => (
            <article className="p-card mt-6 p-6" key={extension.title}>
              <h3 className="p-h3">{extension.title}</h3>
              <p className="p-read mt-3">{extension.description}</p>
              <a
                href={extension.source}
                className="p-link mt-3 inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                לקריאה נוספת על האפשרות הזאת
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="p-section">
        <div className="p-wrap grid gap-8 md:grid-cols-[1fr_1.6fr]">
          <h2 className="p-h2">שאלות על {trek.name}</h2>
          <FaqList items={faq} />
        </div>
      </section>

      <section className="p-section">
        <div className="p-wrap">
          <div className="p-band rounded-[10px] p-8 md:p-12">
            <h2 className="p-h2">רוצים לבנות טיול סביב {trek.name}?</h2>
            <p className="p-muted mt-3">ספרו לנו מתי ומי נוסע, ואוהד יחזור אליכם.</p>
            <div className="p-on-photo mt-7">
              <ContactCtas trek={trek.slug} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
