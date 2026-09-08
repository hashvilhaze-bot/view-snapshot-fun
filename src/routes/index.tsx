import { createFileRoute, Link } from "@tanstack/react-router";

import guidePortrait from "@/assets/guide-portrait.jpg";
import heroHimalaya from "@/assets/hero-himalaya.jpg";
import kathmanduDusk from "@/assets/kathmandu-dusk.jpg";
import { Card, EffortBars, Section } from "@/components/page";
import { articles, experiences, treks } from "@/lib/content";
import { galleries } from "@/lib/galleries";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "השביל הזה — טיולים אישיים בנפאל ובהימלאיה" },
      {
        name: "description",
        content:
          "לא מתחילים במסלול, מתחילים במה שאתם רוצים לחוות. תכנון וליווי של טיולים אישיים בנפאל ובהימלאיה, עם יכולת מקצועית מקומית ביעד.",
      },
      { property: "og:title", content: "השביל הזה — טיולים אישיים בנפאל ובהימלאיה" },
      {
        property: "og:description",
        content: "טרקים מקצרים ונגישים ועד מנאסלו, ולצידם קתמנדו, פוקרה, כפרים ותרבות.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: "השביל הזה",
          description:
            "תכנון וליווי של טיולים אישיים בנפאל ובהימלאיה, שנבנים סביב מה שהמטייל רוצה לחוות.",
          areaServed: "Nepal",
          inLanguage: "he",
        }),
      },
    ],
  }),
});

const facts = [
  { n: "8 מ־10", t: "מהפסגות הגבוהות בעולם עומדות כאן" },
  { n: "60 → 8,849", t: "טווח הגבהים במדינה אחת, במטרים" },
  { n: "לא מרובע", t: "הדגל היחיד בעולם שאינו מרובע" },
];

function Index() {
  const sunrise = galleries["pokhara-hills"]?.[2];

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[82vh] flex-col justify-end overflow-hidden">
        <img
          src={heroHimalaya}
          alt="רכס מושלג בהימלאיה בנפאל באור ראשון, עם ערפל שממלא את העמקים"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-summit via-summit/45 to-transparent" />
        <div className="relative mx-auto w-full max-w-3xl px-6 pb-11">
          <p className="text-[12px] font-medium tracking-wide text-saffron">
            השביל הזה · מסעות בהתאמה אישית בהימלאיה
          </p>
          <h1 className="mt-2 font-display text-[32px] leading-[1.08] font-bold text-parchment drop-shadow-sm sm:text-[44px]">
            המסע מתחיל בך.
          </h1>
          <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-parchment/90">
            אנחנו בונים איתכם טיול בנפאל מהמקום שבו אתם נמצאים — לא מתוך קטלוג מסלולים.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Link
              to="/contact"
              className="rounded-xl bg-saffron px-5 py-3.5 text-center text-[15px] font-semibold text-parchment"
            >
              בואו נבנה את הטיול שלכם
            </Link>
            <Link
              to="/match"
              className="rounded-xl bg-parchment/15 px-5 py-3.5 text-center text-[15px] font-medium text-parchment ring-1 ring-parchment/35 backdrop-blur-sm"
            >
              מה מתאים לי?
            </Link>
          </div>
        </div>
      </section>

      {/* WHY NEPAL */}
      <Section kicker="למה נפאל" title="בוקר אחד אתם פותחים דלת של לודג׳ — ומול הפנים יש רכס">
        {sunrise && (
          <img
            src={sunrise.src}
            alt={sunrise.alt}
            loading="lazy"
            width={1200}
            height={800}
            className="aspect-[16/9] w-full rounded-2xl object-cover"
          />
        )}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {facts.map((f) => (
            <Card key={f.n} className="p-3.5">
              <p className="font-display text-[15px] font-bold text-saffron sm:text-lg">{f.n}</p>
              <p className="mt-1 text-[12px] leading-snug text-ink/65 sm:text-[13px]">{f.t}</p>
            </Card>
          ))}
        </div>
        <Link to="/nepal" className="mt-4 inline-block text-[14px] font-semibold text-saffron">
          עוד על נפאל ←
        </Link>
      </Section>

      {/* TREKS */}
      <Section kicker="ההימלאיה והטרקים" title="יש יותר מדרך אחת לפגוש את ההימלאיה">
        <p className="-mt-1 mb-5 text-[15px] leading-relaxed text-ink/70">
          יש מי שרוצה ללכת גבוה ורחוק. יש מי שמעדיף כמה ימים בהרים ולחזור לפוקרה. ויש מי שרוצה
          לשלב טרק, כפרים וכמה ימים שבהם לא ממהרים לשום מקום.
        </p>
        <div className="space-y-3">
          {treks.map((t) => {
            const cover = galleries[t.slug]?.[0];
            return (
              <Link key={t.slug} to="/treks/$slug" params={{ slug: t.slug }} className="block">
                <Card className="overflow-hidden p-0 transition-colors hover:border-saffron/40">
                  <div className="grid grid-cols-[104px_minmax(0,1fr)] sm:grid-cols-[150px_minmax(0,1fr)]">
                    {cover && (
                      <img
                        src={cover.src}
                        alt={cover.alt}
                        loading="lazy"
                        width={1200}
                        height={800}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate font-display text-[17px] font-bold">{t.name}</h3>
                        <span className="shrink-0 text-[11px] font-semibold text-saffron">
                          {t.effortLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-[12.5px] text-ink/60">
                        {t.days} · {t.altitude}
                      </p>
                      <div className="mt-2">
                        <EffortBars level={t.effort} />
                      </div>
                      <p className="mt-2 text-[13px] leading-snug text-ink/60">{t.teaser}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
        <Link to="/treks" className="mt-4 inline-block text-[14px] font-semibold text-saffron">
          כל המסלולים והחוויות ←
        </Link>
      </Section>

      {/* BEYOND TREKS */}
      <section className="relative overflow-hidden">
        <img
          src={kathmanduDusk}
          alt="חצר מקדשים בעיר העתיקה של קתמנדו בשעת בין ערביים"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-summit/78" />
        <div className="relative mx-auto max-w-3xl px-6 py-12">
          <p className="mb-2 text-xs font-medium text-saffron">מעבר לטרקים</p>
          <h2 className="font-display text-[21px] leading-snug font-bold text-parchment sm:text-2xl">
            סמטה בקתמנדו, בוקר על האגם, ארוחה בבית בכפר
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {experiences.map((e) => (
              <Link key={e.slug} to="/experiences/$slug" params={{ slug: e.slug }}>
                <div className="h-full rounded-xl bg-parchment/12 p-3 ring-1 ring-parchment/20 backdrop-blur-sm">
                  <p className="text-[14px] font-semibold text-parchment">{e.name}</p>
                  <p className="mt-0.5 text-[12px] text-parchment/65">{e.kicker}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MATCH */}
      <Section kicker="מה מתאים לי?" title="לא בוחרים חבילה — מבינים מה מתאים לכם">
        <Card>
          <p className="text-[15px] leading-relaxed text-ink/70">
            שש שאלות קצרות על זמן, ניסיון, מאמץ ונוחות — ובסוף שניים־שלושה כיוונים, עם הסבר למה
            כל אחד מהם עשוי להתאים לכם.
          </p>
          <Link
            to="/match"
            className="mt-4 inline-block rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
          >
            להתחיל
          </Link>
        </Card>
      </Section>

      {/* PROCESS */}
      <Section kicker="איך אנחנו עובדים" title="מתחילים בכם, לא במסלול">
        <ol className="grid gap-3 sm:grid-cols-2">
          {[
            ["01", "שיחה ראשונה"],
            ["02", "כמה כיוונים"],
            ["03", "בונים לפרטים"],
            ["04", "ליווי גם בשטח"],
          ].map(([n, t]) => (
            <li key={n} className="flex items-center gap-3 rounded-xl bg-parchment/70 px-4 py-3">
              <span className="font-display text-base font-bold text-saffron">{n}</span>
              <span className="text-[14px] font-medium">{t}</span>
            </li>
          ))}
        </ol>
        <Link to="/contact" className="mt-4 inline-block text-[14px] font-semibold text-saffron">
          התהליך במלואו ←
        </Link>
      </Section>

      {/* KNOWLEDGE */}
      <Section kicker="ידע שימושי" title="הדברים שמשפיעים על התכנון">
        <div className="grid grid-cols-2 gap-3">
          {articles.map((a) => (
            <Link key={a.slug} to="/knowledge/$slug" params={{ slug: a.slug }}>
              <Card className="h-full p-4 transition-colors hover:border-saffron/40">
                <p className="font-display text-[15px] font-bold">{a.title}</p>
                <p className="mt-1 text-[12px] leading-snug text-ink/60">{a.kicker}</p>
              </Card>
            </Link>
          ))}
        </div>
        <Link to="/knowledge" className="mt-4 inline-block text-[14px] font-semibold text-saffron">
          למרכז הידע ←
        </Link>
      </Section>

      {/* ABOUT */}
      <Section kicker="מי אנחנו">
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src={guidePortrait}
            alt="מדריך טרקים נפאלי בכפר הררי"
            loading="lazy"
            className="h-28 w-24 shrink-0 rounded-xl object-cover"
          />
          <div>
            <p className="text-[15px] leading-relaxed text-ink/75">
              תכנון בעברית מול מי שהלך בשבילים האלה, והפעלה בשטח עם צוות נפאלי קבוע.
            </p>
            <Link to="/about" className="mt-3 inline-block text-[14px] font-semibold text-saffron">
              עוד עלינו ←
            </Link>
          </div>
        </Card>
      </Section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 pt-2 pb-14">
        <div className="rounded-2xl bg-summit px-6 py-10 text-center">
          <h2 className="font-display text-[22px] font-bold text-parchment sm:text-2xl">
            בואו נדבר
          </h2>
          <p className="mx-auto mt-2 max-w-[40ch] text-[15px] leading-relaxed text-parchment/80">
            שיחה אחת, בלי התחייבות — גם אם יש רק תחושה שנפאל מסקרנת אתכם.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-block rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment"
          >
            מתחילים מכאן
          </Link>
        </div>
      </section>
    </>
  );
}
