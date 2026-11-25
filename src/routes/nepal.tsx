import { MatchPrompt, Breadcrumbs } from "@/components/content-navigation";
import { breadcrumbData } from "@/lib/navigation-meta";
import { managedMeta } from "@/lib/public-meta";
import { createFileRoute, Link } from "@tanstack/react-router";

import heroHimalaya from "@/assets/hero-himalaya.jpg";
import annapurna1 from "@/assets/gallery/annapurna-1.jpg";
import kathmandu2 from "@/assets/gallery/kathmandu-2.jpg";
import { Card, Insight, PageHero, Section } from "@/components/page";

export const Route = createFileRoute("/nepal")({
  component: NepalPage,
  head: ({ match }) => ({
    ...managedMeta(
      match.context.cms,
      "נפאל — מה יש שם, ולמה זה מיוחד | השביל הזה",
      "נפאל בכמה רגעים: הרים, ערים, כפרים וג׳ונגל במדינה קטנה אחת — ומכאן הכניסה לטרקים, לחוויות שמעבר להם ולמרכז הידע.",
      "/nepal",
      "website",
      heroHimalaya,
      {
        title: "נפאל — מה יש שם, ולמה זה מיוחד",
        description: "מדינה קטנה שמכילה עולמות: הרים, עמקים, ערים ותרבות חיה.",
      },
    ),
    scripts: [breadcrumbData("destinations", "nepal", "נפאל")],
  }),
});

/** Quick facts — three, on purpose. */
const facts = [
  { n: "8 מתוך 14", t: "מהפסגות שגובהן עולה על 8,000 מטר נמצאות בנפאל או על גבולה." },
  {
    n: "מ־60 עד 8,849 מ׳",
    t: "מהשפלה הטרופית ועד פסגת האוורסט. הפרש הגבהים הזה הוא כל הסיפור של נפאל.",
  },
  {
    n: "דגל אחד בעולם",
    t: "לנפאל הדגל הלאומי היחיד שאינו מרובע או מלבני: שני משולשים זה מעל זה.",
  },
];

function NepalPage() {
  return (
    <>
      <Breadcrumbs group="destinations" slug="nepal" name="נפאל" />
      <PageHero
        kicker="נפאל"
        title="נפאל היא הרבה יותר מטרק"
        lead="טרק בגובה, כמה ימים בין כפרים או ביקור בערים של עמק קטמנדו. בנפאל נמצאות שמונה מ־14 הפסגות בעולם שגובהן מעל 8,000 מטר, ומדרום להן משתרעים יערות ומישורים חמים."
        image={heroHimalaya}
        imageAlt="רכס מושלג בהימלאיה באור ראשון"
      />

      <Section kicker="נפאל בכמה רגעים" className="!py-4 sm:!py-6">
        <div className="grid gap-2 sm:grid-cols-3">
          {facts.map((f) => (
            <Card key={f.n} className="!p-3.5">
              <p className="font-display text-[1rem] font-bold text-saffron sm:text-xl">{f.n}</p>
              <p className="mt-0.5 text-[0.78125rem] leading-snug text-ink/70 sm:mt-1 sm:text-[0.875rem] sm:leading-relaxed">
                {f.t}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="ההרים, והכול מסביבם" className="!py-4 sm:!py-6">
        <p className="text-[0.9375rem] leading-relaxed text-ink/70">
          ההימלאיה בנפאל אינה מסלול אחד. יש הליכה של שלושה ימים בין כפרים בגבעות, ויש מעברים בגובה
          חמשת אלפים מטר שדורשים שבועיים. ומסביב להרים יש סמטאות קטמנדו, בוקר מול ההרים בפוקרה,
          כפרים בין טרסות, נהרות, ג׳ונגל ויוגה. לא חייבים לבחור בין טרק לטיול רגוע.
        </p>
        <div className="mt-4">
          <Insight text="בנפאל לא מודדים את השנה כמו אצלנו: הלוח הרשמי הוא ביקראם סמבט, שמקדים את הלוח הלועזי בכ־57 שנים, והשנה החדשה שם מתחילה באמצע אפריל." />
        </div>
      </Section>

      <Section title="מאיפה נכנסים" className="!py-4 sm:!py-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/treks" className="group block">
            <Card className="flex h-full flex-col overflow-hidden p-0 transition-colors group-hover:border-saffron/40">
              <div className="relative aspect-[16/9] sm:aspect-[16/10]">
                <img
                  src={annapurna1}
                  alt="מטיילים במחנה הבסיס של אנאפורנה מול קיר הפסגה באור בוקר"
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="p-3.5 sm:p-4">
                <p className="font-display text-[1.0625rem] font-bold">טרקים ומסלולים</p>
                <p className="mt-1 text-[0.84375rem] leading-relaxed text-ink/65">
                  מהליכה של שלושה ימים בגבעות ועד מסעות של שבועיים בגובה.
                </p>
                <span className="mt-3 inline-block text-[0.8125rem] font-semibold text-saffron">
                  לטרקים ולמסלולים ←
                </span>
              </div>
            </Card>
          </Link>

          <Link to="/experiences" className="group block">
            <Card className="flex h-full flex-col overflow-hidden p-0 transition-colors group-hover:border-saffron/40">
              <div className="relative aspect-[16/9] sm:aspect-[16/10]">
                <img
                  src={kathmandu2}
                  alt="כיכר מקדשים נווארית עם גגות פגודה מדורגים וקורות עץ מגולפים"
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="p-3.5 sm:p-4">
                <p className="font-display text-[1.0625rem] font-bold">חוויות בנפאל</p>
                <p className="mt-1 text-[0.84375rem] leading-relaxed text-ink/65">
                  ערים ותרבות, כפרים, יוגה ומנוחה, נהרות וג׳ונגל.
                </p>
                <span className="mt-3 inline-block text-[0.8125rem] font-semibold text-saffron">
                  לחוויות בנפאל ←
                </span>
              </div>
            </Card>
          </Link>
        </div>

        <Link
          to="/knowledge"
          className="mt-4 inline-block text-[0.875rem] font-semibold text-saffron"
        >
          למרכז הידע למטיילים בנפאל ←
        </Link>
      </Section>

      <Section>
        <MatchPrompt />
      </Section>
    </>
  );
}
