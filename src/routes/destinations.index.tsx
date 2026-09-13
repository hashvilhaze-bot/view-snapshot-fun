import { createFileRoute, Link } from "@tanstack/react-router";

import valleyGolden from "@/assets/valley-golden.jpg";
import { Card, PageHero, Section } from "@/components/page";
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

/** Country choice only: hero + country cards. The cards are the action. */
function DestinationsPage() {
  return (
    <>
      <PageHero
        kicker="יעדים"
        title="לאן השביל יכול לקחת אתכם?"
        lead="נפאל, בהוטן וטיבט נמצאות באותו אזור של העולם, אבל מציעות חוויות שונות מאוד."
        image={valleyGolden}
        imageAlt="עמק בהימלאיה באור זהוב"
      />

      <Section className="pb-10">
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
    </>
  );
}
