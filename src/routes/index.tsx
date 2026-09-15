import { createFileRoute, Link } from "@tanstack/react-router";

import heroHimalaya from "@/assets/hero-himalaya.jpg";
import kathmanduDusk from "@/assets/kathmandu-dusk.jpg";
import ohadPhoto from "@/assets/ohad.jpg";
import shalomTeam from "@/assets/shalom-team.jpg";
import { Section } from "@/components/page";
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
        content: "טרקים מקצרים ונגישים ועד מנאסלו, ולצידם קטמנדו, פוקרה, כפרים ותרבות.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

/**
 * Nepal's range, shown rather than listed. Photos come from the site's own
 * galleries (same alt text), the labels are single words, and nothing here
 * links anywhere — this is a feeling, not a menu.
 */
const RANGE: { label: string; gallery: string; index?: number; cell: string }[] = [
  {
    label: "הרים",
    gallery: "annapurna-base-camp",
    cell: "col-span-2 row-span-2 lg:col-span-2 lg:row-span-2",
  },
  { label: "תרבות", gallery: "kathmandu", cell: "col-span-1 row-span-1" },
  { label: "פוקרה", gallery: "pokhara", cell: "col-span-1 row-span-1" },
  { label: "יוגה ורוגע", gallery: "yoga-rest", cell: "col-span-2 row-span-1" },
  { label: "כפרים", gallery: "villages", cell: "col-span-2 row-span-1 lg:col-span-1" },
];

function Index() {
  const range = RANGE.map((r) => ({
    label: r.label,
    photo: galleries[r.gallery]?.[r.index ?? 0],
  })).filter((r) => r.photo);

  return (
    <>
      {/* SECTION 1 — HERO */}
      <section className="relative flex min-h-[52svh] flex-col justify-end overflow-hidden sm:min-h-[60vh]">
        <img
          src={heroHimalaya}
          alt="רכס מושלג בהימלאיה בנפאל באור ראשון, עם ערפל שממלא את העמקים"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-summit via-summit/45 to-transparent" />

        <div className="relative mx-auto w-full max-w-5xl px-6 pb-10 sm:pb-12">
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
              עזרו לי למצוא כיוון
            </Link>
            <Link
              to="/quote"
              search={{ source: "direct" }}
              className="rounded-xl bg-parchment/15 px-5 py-3.5 text-center text-[15px] font-medium text-parchment ring-1 ring-parchment/30"
            >
              אני יודע מה אני רוצה
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 — NEPAL CAN BE MANY THINGS */}
      <Section
        kicker="נפאל"
        title="נפאל היא לא טרק אחד ולא סוג טיול אחד"
        size="xwide"
        className="py-7 sm:py-9"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {range.map((r) => (
            <figure key={r.label} className="relative overflow-hidden rounded-2xl">
              <img
                src={r.photo!.src}
                alt={r.photo!.alt}
                loading="lazy"
                width={1200}
                height={800}
                className="aspect-[4/5] w-full object-cover sm:aspect-[3/4]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-summit/90 to-transparent px-3 pt-8 pb-2.5">
                <figcaption className="font-display text-[14px] font-bold text-parchment sm:text-[15px]">
                  {r.label}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </Section>

      {/* SECTION 3 — THE IDEA */}
      <Section size="wide" className="py-6 sm:py-8">
        <div className="rounded-2xl border-e-4 border-saffron bg-parchment/70 px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-[12px] font-medium tracking-wide text-saffron">הדרך שלכם לנפאל</p>
          <p className="mt-2 max-w-[54ch] text-[16px] leading-relaxed text-ink/80 sm:text-[17px]">
            הטיול נבנה סביב מי שנוסע: הזמן שיש לכם, הקצב שנוח לכם והדברים שמעניינים אתכם. לא בוחרים
            מסלול מהמדף ומתאימים אליו את עצמכם.
          </p>
        </div>
      </Section>

      {/* SECTION 4 — TRUST */}
      <section className="relative overflow-hidden">
        <img
          src={kathmanduDusk}
          alt="חצר מקדשים בעיר העתיקה של קטמנדו בשעת בין ערביים"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-summit/82" />
        <div className="relative mx-auto max-w-5xl px-6 py-10">
          <p className="text-[12px] font-medium tracking-wide text-saffron">מי אנחנו</p>
          <h2 className="mt-1.5 font-display text-[21px] leading-snug font-bold text-parchment sm:text-2xl">
            מכירים אתכם כאן. מכירים את נפאל שם.
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center">
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
