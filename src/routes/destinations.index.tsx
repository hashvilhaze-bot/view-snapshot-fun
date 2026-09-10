import { createFileRoute, Link } from "@tanstack/react-router";

import valleyGolden from "@/assets/valley-golden.jpg";
import { Card, PageHero, Section, TalkCta } from "@/components/page";
import { destinations } from "@/lib/destinations";

export const Route = createFileRoute("/destinations/")({
  component: DestinationsPage,
  head: () => ({
    meta: [
      { title: "יעדים — נפאל, בהוטן וטיבט | השביל הזה" },
      {
        name: "description",
        content:
          "נפאל, בהוטן וטיבט נמצאות באותו אזור של העולם ומציעות חוויות שונות מאוד. אפשר להתחיל מיעד, ואפשר להתחיל מסוג החוויה שמחפשים.",
      },
      { property: "og:title", content: "לאן השביל יכול לקחת אתכם?" },
      {
        property: "og:description",
        content: "שלושה עולמות שונים באותו אזור של ההימלאיה — ודרך אחת למצוא את שלכם.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function DestinationsPage() {
  return (
    <>
      <PageHero
        kicker="יעדים"
        title="לאן השביל יכול לקחת אתכם?"
        lead="נפאל, בהוטן וטיבט נמצאות באותו אזור של העולם, אבל מציעות חוויות שונות מאוד. לפעמים מתחילים ממדינה שרוצים להגיע אליה, ולפעמים דווקא מסוג החוויה שמחפשים."
        image={valleyGolden}
        imageAlt="עמק בהימלאיה באור זהוב"
      />

      <Section>
        <div className="space-y-4">
          {destinations.map((d) => (
            <Card key={d.slug} className="overflow-hidden p-0">
              <div className="grid gap-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <img
                  src={d.image}
                  alt={d.imageAlt}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover sm:aspect-[4/3] sm:h-full"
                />
                <div className="flex flex-col justify-center p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-bold">{d.name}</h2>
                    {d.status === "opening" && (
                      <span className="rounded-full bg-mist/20 px-2.5 py-1 text-[11px] font-semibold text-ink/60">
                        נפתח בקרוב
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[13px] text-ink/55">{d.character}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink/75">{d.blurb}</p>
                  <Link
                    to={d.to}
                    className="mt-4 inline-block text-[14px] font-semibold text-saffron"
                  >
                    {d.cta} ←
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="ואם עוד לא בחרתם מדינה?">
        <Card>
          <p className="text-[15px] leading-relaxed text-ink/75">
            רוב האנשים שמדברים איתנו לא מתחילים ממדינה, אלא ממה שהם רוצים לחוות: כמה ימים יש להם,
            באיזה קצב הם רוצים ללכת, ומה חשוב להם באמת. אפשר להתחיל משם, ואת היעד נמצא ביחד.
          </p>
          <Link
            to="/match"
            className="mt-4 inline-block rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
          >
            בואו נמצא את השביל שלכם
          </Link>
        </Card>
      </Section>

      <TalkCta />
    </>
  );
}
