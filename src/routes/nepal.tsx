import { createFileRoute, Link } from "@tanstack/react-router";

import heroHimalaya from "@/assets/hero-himalaya.jpg";
import kathmanduDusk from "@/assets/kathmandu-dusk.jpg";
import annapurna1 from "@/assets/gallery/annapurna-1.jpg";
import kathmandu2 from "@/assets/gallery/kathmandu-2.jpg";
import { Card, Insight, PageHero, Section } from "@/components/page";

export const Route = createFileRoute("/nepal")({
  component: NepalPage,
  head: () => ({
    meta: [
      { title: "נפאל — מה יש שם, ולמה זה מיוחד | השביל הזה" },
      {
        name: "description",
        content:
          "נפאל בכמה רגעים: הרים, ערים, כפרים וג׳ונגל במדינה קטנה אחת — ומכאן הכניסה לטרקים, לחוויות שמעבר להם ולמרכז הידע.",
      },
      { property: "og:title", content: "נפאל — מה יש שם, ולמה זה מיוחד" },
      {
        property: "og:description",
        content: "מדינה קטנה שמכילה עולמות: הרים, עמקים, ערים ותרבות חיה.",
      },
    ],
  }),
});

/** Quick facts — three, on purpose. */
const facts = [
  { n: "8 מתוך 10", t: "מהפסגות הגבוהות בעולם נמצאות בנפאל, במדינה אחת קטנה." },
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
      <PageHero
        kicker="נפאל"
        title="נפאל היא הרבה יותר מטרק"
        lead="טרק מאתגר בגובה, כמה ימים רגועים בין כפרים, מפגש עם תרבות אחרת או שילוב של הכול — במדינה בגודל של ישראל שבתוכה שמונה מעשר הפסגות הגבוהות בעולם."
        image={heroHimalaya}
        imageAlt="רכס מושלג בהימלאיה באור ראשון"
      />

      <Section kicker="נפאל בכמה רגעים" className="!py-4 sm:!py-6">
        <div className="grid gap-2 sm:grid-cols-3">
          {facts.map((f) => (
            <Card key={f.n} className="!p-3.5">
              <p className="font-display text-[16px] font-bold text-saffron sm:text-xl">{f.n}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-ink/70 sm:mt-1 sm:text-[14px] sm:leading-relaxed">
                {f.t}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="ההרים, והכול מסביבם" className="!py-4 sm:!py-6">
        <p className="text-[15px] leading-relaxed text-ink/70">
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
                <p className="font-display text-[17px] font-bold">טרקים ומסלולים</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65">
                  מהליכה של שלושה ימים בגבעות ועד מסעות של שבועיים בגובה.
                </p>
                <span className="mt-3 inline-block text-[13px] font-semibold text-saffron">
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
                <p className="font-display text-[17px] font-bold">חוויות בנפאל</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65">
                  ערים ותרבות, כפרים, יוגה ומנוחה, נהרות וג׳ונגל.
                </p>
                <span className="mt-3 inline-block text-[13px] font-semibold text-saffron">
                  לחוויות בנפאל ←
                </span>
              </div>
            </Card>
          </Link>
        </div>

        <Link to="/knowledge" className="mt-4 inline-block text-[14px] font-semibold text-saffron">
          למרכז הידע למטיילים בנפאל ←
        </Link>
      </Section>

      <section className="relative overflow-hidden">
        <img
          src={kathmanduDusk}
          alt="חצר מקדשים בקטמנדו בשעת בין ערביים"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-summit/80" />
        <div className="relative mx-auto max-w-4xl px-6 py-9 text-center sm:py-10">
          <h2 className="font-display text-[21px] font-bold text-balance text-parchment sm:text-2xl">
            ההימלאיה היא סיבה מצוינת להגיע לנפאל. היא ממש לא הסיבה היחידה להישאר
          </h2>
          <p className="mx-auto mt-3 max-w-[46ch] text-[15px] leading-relaxed text-parchment/85">
            כמה שאלות קצרות, ואחריהן כמה כיוונים מתוך הטרקים והחוויות שלנו.
          </p>
          <Link
            to="/match"
            className="mt-5 inline-block rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment"
          >
            בואו נמצא את השביל שלכם
          </Link>
        </div>
      </section>
    </>
  );
}
