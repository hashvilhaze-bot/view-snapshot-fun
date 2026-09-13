import { createFileRoute, Link } from "@tanstack/react-router";

import heroHimalaya from "@/assets/hero-himalaya.jpg";
import kathmanduDusk from "@/assets/kathmandu-dusk.jpg";
import ohadPhoto from "@/assets/ohad.jpg";
import shalomTeam from "@/assets/shalom-team.jpg";
import { Card, Section } from "@/components/page";
import { galleries } from "@/lib/galleries";
import { saveTripContext } from "@/lib/trip-context";

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
        content: "טרקים מקצרים ונגישים ועד מנאסלו, ולצידם קטמנדו, פוקרה, כפרים ותרבות.",
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

function Index() {
  const trekCover = galleries["annapurna-base-camp"]?.[0];
  const experienceCover = galleries["kathmandu"]?.[0];

  return (
    <>
      {/* SECTION 1 — HERO */}
      <section className="relative flex min-h-[56svh] flex-col justify-end overflow-hidden sm:min-h-[60vh]">
        <img
          src={heroHimalaya}
          alt="רכס מושלג בהימלאיה בנפאל באור ראשון, עם ערפל שממלא את העמקים"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-summit via-summit/45 to-transparent" />

        <div className="relative mx-auto w-full max-w-4xl px-6 pb-11">
          <p className="text-[12px] font-medium tracking-wide text-saffron">
            השביל הזה · מסעות בהתאמה אישית בהימלאיה
          </p>
          <h1 className="mt-2 font-display text-[32px] leading-[1.08] font-bold text-parchment drop-shadow-sm sm:text-[44px]">
            השביל שלכם מתחיל כאן
          </h1>
          <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-parchment/90">
            נפאל יכולה להיות שבועיים בהרים, כמה ימים של הליכה בין כפרים, טיול שמשלב טבע ותרבות — או
            משהו שעוד לא ידעתם שאפשר לעשות שם. אנחנו מתחילים במה שאתם רוצים לחוות, ומשם בונים את
            הטיול שמתאים לכם.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <Link
              to="/match"
              className="rounded-xl bg-saffron px-5 py-3.5 text-center text-[15px] font-semibold text-parchment"
            >
              בואו נמצא את השביל שלכם
            </Link>
            <Link
              to="/quote"
              onClick={() => saveTripContext({ source: "direct-selection" })}
              className="rounded-xl bg-parchment/15 px-5 py-3.5 text-center text-[15px] font-medium text-parchment ring-1 ring-parchment/30"
            >
              אני יודע מה אני רוצה
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 — TREKS + EXPERIENCES, equal footing */}
      <Section className="py-6 sm:py-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/treks" className="group block">
            <Card className="flex h-full flex-col overflow-hidden p-0 transition-colors group-hover:border-saffron/40">
              {trekCover && (
                <div className="relative aspect-[16/10]">
                  <img
                    src={trekCover.src}
                    alt={trekCover.alt}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <p className="text-[11px] font-semibold tracking-wide text-saffron">טרקים</p>
                <h2 className="mt-1 font-display text-[18px] font-bold">
                  יש יותר מדרך אחת לפגוש את ההימלאיה
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/65">
                  מסלולים של כמה ימים ועד מסעות של שבועיים, לפי גובה, מספר ימים ואופי החוויה.
                </p>
                <span className="mt-3 inline-block text-[13.5px] font-semibold text-saffron">
                  לטרקים ולמסלולים ←
                </span>
              </div>
            </Card>
          </Link>

          <Link to="/experiences" className="group block">
            <Card className="flex h-full flex-col overflow-hidden p-0 transition-colors group-hover:border-saffron/40">
              {experienceCover && (
                <div className="relative aspect-[16/10]">
                  <img
                    src={experienceCover.src}
                    alt={experienceCover.alt}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <p className="text-[11px] font-semibold tracking-wide text-saffron">חוויות</p>
                <h2 className="mt-1 font-display text-[18px] font-bold">
                  נפאל שמעבר לטרקים
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/65">
                  ערים ותרבות, כפרים, יוגה ומנוחה, נהרות וג׳ונגל — לבד או לצד טרק.
                </p>
                <span className="mt-3 inline-block text-[13.5px] font-semibold text-saffron">
                  לחוויות בנפאל ←
                </span>
              </div>
            </Card>
          </Link>
        </div>
      </Section>

      {/* SECTION 3 — TRUST / ABOUT TEASER */}
      <section className="relative overflow-hidden">
        <img
          src={kathmanduDusk}
          alt="חצר מקדשים בעיר העתיקה של קטמנדו בשעת בין ערביים"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-summit/82" />
        <div className="relative mx-auto max-w-4xl px-6 py-10">
          <p className="text-[12px] font-medium tracking-wide text-saffron">מי אנחנו</p>
          <h2 className="mt-1.5 font-display text-[21px] leading-snug font-bold text-parchment sm:text-2xl">
            מכירים אתכם כאן. מכירים את נפאל שם.
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center">
            <div className="grid grid-cols-2 gap-2">
              <img
                src={ohadPhoto}
                alt="אוהד הרץ מול פסגות ההימלאיה בנפאל"
                loading="lazy"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <img
                src={shalomTeam}
                alt="צוות סוכנות שלום במשרד בתאמל, קטמנדו"
                loading="lazy"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
            </div>
            <div>
              <p className="text-[15px] leading-relaxed text-parchment/85">
                ״השביל הזה״ נולד מחיבור פשוט: מישהו כאן שמקשיב לכם, מבין מה אתם מחפשים ומלווה אתכם
                לאורך הדרך — וצוות מקומי ותיק בנפאל שמכיר את השבילים, המקומות והאנשים שמאחוריהם.
              </p>
              <Link
                to="/about"
                className="mt-3 inline-block text-[14px] font-semibold text-saffron"
              >
                להכיר את האנשים שמאחורי השביל ←
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
