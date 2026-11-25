import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PilotCtas } from "@/components/pilot/pilot-ctas";
import { articles, treks } from "@/lib/content";
import { galleries } from "@/lib/galleries";

// The pilot covers one trek only.
const PILOT_TREKS = ["manaslu-circuit"];

export const Route = createFileRoute("/pilot/treks/$slug")({
  loader: ({ params }) => {
    const trek = PILOT_TREKS.includes(params.slug) ? treks.find((t) => t.slug === params.slug) : undefined;
    if (!trek) throw notFound();
    return { trek };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `פיילוט · ${loaderData.trek.name} | השביל הזה` : "פיילוט | השביל הזה" },
      { name: "description", content: loaderData?.trek.teaser ?? "פיילוט עיצוב פנימי." },
      { property: "og:title", content: loaderData ? `פיילוט · ${loaderData.trek.name}` : "פיילוט" },
      { property: "og:description", content: loaderData?.trek.teaser ?? "פיילוט עיצוב פנימי." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PilotTrek,
});

function PilotTrek() {
  const { trek } = Route.useLoaderData();
  const photos = galleries[trek.slug] ?? [];
  const hero = photos[0];
  const related = articles.find((a) => a.slug === "manaslu-vs-annapurna");
  const facts: [string, string][] = [
    ["משך ההליכה", trek.days],
    ["ימים בנפאל, לפחות", `${trek.totalDaysMin} ימים`],
    ["קושי", trek.effortLabel],
    ["גובה", trek.altitude],
    ["אופי האזור", trek.character],
  ];
  return (
    <>
      <div className="p-wrap pt-6">
        <nav aria-label="פירורי לחם" className="p-muted text-[15px]">
          <Link to="/pilot" className="p-link">בית</Link> <span aria-hidden>/</span> טרקים{" "}
          <span aria-hidden>/</span> <span aria-current="page">{trek.name}</span>
        </nav>
      </div>
      <section className="p-wrap pt-6">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="p-kicker">טרק בנפאל</p>
            <h1 className="p-h1 mt-2">{trek.name}</h1>
            <p className="p-lead mt-4">{trek.teaser}</p>
            <div className="mt-7"><PilotCtas trek={trek.slug} /></div>
          </div>
          {hero && <img src={hero.src} alt={hero.alt} className="aspect-[4/3] w-full rounded-[10px] object-cover" />}
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
            <p className="mt-6">{trek.intro}</p>
          </div>
          <div className="p-read">
            <h2 className="p-h2">רגעים בולטים</h2>
            <ul className="mt-4 space-y-3 ps-5">
              {trek.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
            <div className="p-card mt-6 p-5">
              <p className="p-kicker">שווה לדעת</p>
              <p className="mt-2">{trek.surprise}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="p-section p-mist">
        <div className="p-wrap grid gap-10 lg:grid-cols-2">
          <div className="p-read">
            <h2 className="p-h2">מה דורש היערכות</h2>
            <ul className="mt-4 space-y-3 ps-5">{trek.details.map((d) => <li key={d}>{d}</li>)}</ul>
          </div>
          <div className="p-read">
            <h2 className="p-h2">מה גמיש בתכנון</h2>
            <ul className="mt-4 space-y-3 ps-5">{trek.combine.map((d) => <li key={d}>{d}</li>)}</ul>
          </div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="p-section">
          <div className="p-wrap">
            <h2 className="p-h2">מהשביל</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {photos.map((p) => (
                <figure key={p.src} className="m-0">
                  <img src={p.src} alt={p.alt} loading="lazy" className="aspect-[3/2] w-full rounded-[10px] object-cover" />
                  <figcaption className="p-muted mt-2 text-[15px]">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {related && (
        <section className="p-wrap">
          <div className="p-card p-6">
            <p className="p-kicker">מדריך קשור</p>
            <h2 className="p-h3 mt-2">{related.title}</h2>
            <p className="p-muted mt-2">{related.summary}</p>
            <Link to="/knowledge/$slug" params={{ slug: related.slug }} className="p-link mt-3 inline-block">
              לקריאת המדריך
            </Link>
          </div>
        </section>
      )}

      <section className="p-section">
        <div className="p-wrap">
          <div className="p-band rounded-[10px] p-8 md:p-12">
            <h2 className="p-h2">רוצים לבנות טיול סביב {trek.name}?</h2>
            <p className="p-muted mt-3">ספרו לנו מתי ומי נוסע, ואוהד יחזור אליכם.</p>
            <div className="p-on-photo mt-7"><PilotCtas trek={trek.slug} /></div>
          </div>
        </div>
      </section>
    </>
  );
}
