import { createFileRoute, Link } from "@tanstack/react-router";

import valleyGolden from "@/assets/valley-golden.jpg";
import { Card, EffortBars, PageHero, Section } from "@/components/page";
import { treks } from "@/lib/content";
import { galleries } from "@/lib/galleries";

export const Route = createFileRoute("/treks/")({
  component: TreksPage,
  head: () => ({
    meta: [
      { title: "טרקים ומסלולים בנפאל | השביל הזה" },
      {
        name: "description",
        content:
          "מסלולים מקצרים ונגישים ועד מנאסלו, ולצידם קטמנדו, פוקרה, כפרים, רפטינג וצ׳יטוואן. משך, גובה, מאמץ ולמי זה מתאים.",
      },
      { property: "og:title", content: "טרקים ומסלולים בנפאל" },
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
        kicker="טרקים ומסלולים"
        title="יש יותר מדרך אחת לפגוש את ההימלאיה"
        lead="יש מי שרוצה ללכת גבוה ורחוק, ויש מי שמעדיף כמה ימים בהרים ואחריהם מרפסת מול האגם בפוקרה. ההבדל האמיתי הוא בגובה, במספר הימים ובאופי החוויה."
        image={valleyGolden}
        imageAlt="עמק בהימלאיה באור זהוב"
        size="xwide"
      />

      <Section size="xwide" className="!pt-6 !pb-2">
        <div className="rounded-2xl border-e-4 border-saffron bg-parchment/70 px-5 py-4">
          <p className="text-[15px] leading-relaxed text-ink/80">
            לא חייבים לבחור מסלול מתוך הרשימה. המסלולים כאן הם נקודת פתיחה ורעיונות — אפשר לקצר,
            להאריך, לשנות קצב ורמת קושי, לשלב כמה מסלולים או לבנות משהו אחר לגמרי לפי מי שנוסע.
          </p>
          <p className="mt-3">
            <Link to="/treks/compare" className="text-[13.5px] font-semibold text-saffron">
              להשוות בין מסלולים זה לצד זה ←
            </Link>
          </p>
        </div>
      </Section>

      <Section size="xwide" title="מסלולים" className="!pt-4 !pb-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {treks.map((t) => {
            const photo = galleries[t.slug]?.[0];
            return (
              <Link
                key={t.slug}
                to="/treks/$slug"
                params={{ slug: t.slug }}
                className="group block"
              >
                <Card className="flex h-full flex-col overflow-hidden !p-0 transition-colors group-hover:border-saffron/40">
                  {photo && (
                    <div className="relative">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        width={1200}
                        height={800}
                        className="aspect-[16/10] w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-summit/85 to-transparent px-4 pt-10 pb-3">
                        <h3 className="font-display text-lg leading-tight font-bold text-parchment">
                          {t.name}
                        </h3>
                      </div>
                      <span className="absolute top-3 end-3 rounded-full bg-parchment/90 px-2.5 py-1 text-[11px] font-semibold text-saffron">
                        {t.effortLabel}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    {!photo && <h3 className="font-display text-lg font-bold">{t.name}</h3>}
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px] text-ink/70">
                      <div>
                        <dt className="text-ink/60">משך</dt>
                        <dd className="font-medium">{t.days}</dd>
                      </div>
                      <div>
                        <dt className="text-ink/60">גובה</dt>
                        <dd className="font-medium">{t.altitude}</dd>
                      </div>
                      <div>
                        <dt className="text-ink/60">ימים בנפאל</dt>
                        <dd className="font-medium">מ־{t.totalDaysMin} ומעלה</dd>
                      </div>
                      <div>
                        <dt className="text-ink/60">מאמץ</dt>
                        <dd className="pt-1.5">
                          <EffortBars level={t.effort} />
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-2.5 mb-3 text-[13.5px] leading-relaxed text-ink/70">
                      <span className="text-ink/60">למי מתאים: </span>
                      {t.fit}
                    </p>
                    <span className="mt-auto inline-block self-start rounded-xl bg-parchment px-4 py-2 text-[13px] font-semibold text-saffron ring-1 ring-ink/10 group-hover:bg-saffron group-hover:text-parchment">
                      פרטים
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </Section>


      <Section size="xwide" className="!pt-2 !pb-10">
        <Card>
          <p className="text-[15px] leading-relaxed text-ink/75">
            לא בטוחים מה מתאים לכם? כמה שאלות קצרות, ואחריהן כמה כיוונים עם הסבר.
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <Link
              to="/match"
              className="rounded-xl bg-saffron px-5 py-3 text-center text-[14px] font-semibold text-parchment"
            >
              בואו נמצא את השביל שלכם
            </Link>
            <Link
              to="/treks/compare"
              className="rounded-xl bg-parchment px-5 py-3 text-center text-[14px] font-medium text-ink ring-1 ring-ink/10"
            >
              להשוות בין מסלולים
            </Link>
          </div>
        </Card>
      </Section>
    </>
  );
}
