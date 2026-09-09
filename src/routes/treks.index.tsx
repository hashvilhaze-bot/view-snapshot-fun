import { createFileRoute, Link } from "@tanstack/react-router";

import valleyGolden from "@/assets/valley-golden.jpg";
import { Card, EffortBars, PageHero, Section, TalkCta } from "@/components/page";
import { experiences, treks } from "@/lib/content";

export const Route = createFileRoute("/treks/")({
  component: TreksPage,
  head: () => ({
    meta: [
      { title: "טרקים ולא רק בנפאל | השביל הזה" },
      {
        name: "description",
        content:
          "מסלולים מקצרים ונגישים ועד מנאסלו, ולצידם קתמנדו, פוקרה, כפרים, רפטינג וצ׳יטוואן. משך, גובה, מאמץ ולמי זה מתאים.",
      },
      { property: "og:title", content: "טרקים ולא רק בנפאל" },
      {
        property: "og:description",
        content: "ספקטרום שלם של מסלולים וחוויות, עם הנתונים שחשובים באמת.",
      },
    ],
  }),
});

function TreksPage() {
  return (
    <>
      <PageHero
        kicker="טרקים ולא רק"
        title="יש יותר מדרך אחת לפגוש את ההימלאיה"
        lead="יש מי שרוצה ללכת גבוה ורחוק, ויש מי שמעדיף כמה ימים בהרים ולחזור לפוקרה. ההבדל האמיתי הוא בגובה, במספר הימים ובאופי החוויה."
        image={valleyGolden}
        imageAlt="עמק בהימלאיה באור זהוב"
      />

      <Section title="מסלולים">
        <div className="space-y-3">
          {treks.map((t) => (
            <Link key={t.slug} to="/treks/$slug" params={{ slug: t.slug }} className="block">
              <Card className="transition-colors hover:border-saffron/40">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <h3 className="truncate font-display text-lg font-bold">{t.name}</h3>
                  <span className="shrink-0 text-[11px] font-semibold text-saffron">
                    {t.effortLabel}
                  </span>
                </div>
                <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink/70">
                  <div>
                    <dt className="text-ink/45">משך</dt>
                    <dd className="font-medium">{t.days}</dd>
                  </div>
                  <div>
                    <dt className="text-ink/45">גובה</dt>
                    <dd className="font-medium">{t.altitude}</dd>
                  </div>
                  <div>
                    <dt className="text-ink/45">ימים בנפאל</dt>
                    <dd className="font-medium">מ־{t.totalDaysMin} ומעלה</dd>
                  </div>
                  <div>
                    <dt className="text-ink/45">מאמץ</dt>
                    <dd className="pt-1.5">
                      <EffortBars level={t.effort} />
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-[14px] leading-relaxed text-ink/70">{t.teaser}</p>
                <p className="mt-1 text-[13px] text-ink/50">אופי: {t.character}</p>
                <p className="mt-1 text-[13px] text-ink/50">למי מתאים: {t.fit}</p>
                <span className="mt-3 inline-block text-[13px] font-semibold text-saffron">
                  לעמוד המסלול ←
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="נפאל שמעבר לטרקים">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {experiences.map((e) => (
            <Link key={e.slug} to="/experiences/$slug" params={{ slug: e.slug }}>
              <Card className="h-full p-4 transition-colors hover:border-saffron/40">
                <p className="font-display text-[15px] font-bold">{e.name}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink/60">{e.kicker}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <Card>
          <p className="text-[15px] leading-relaxed text-ink/75">
            לא בטוחים מה מתאים לכם? יש כלי קצר שנותן שניים־שלושה כיוונים.
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
