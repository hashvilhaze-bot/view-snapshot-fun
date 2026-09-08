import { createFileRoute, Link } from "@tanstack/react-router";

import heroHimalaya from "@/assets/hero-himalaya.jpg";
import kathmanduDusk from "@/assets/kathmandu-dusk.jpg";
import { Card, PageHero, Section, TalkCta } from "@/components/page";

export const Route = createFileRoute("/nepal")({
  component: NepalPage,
  head: () => ({
    meta: [
      { title: "נפאל — מה יש שם, ולמה זה מיוחד | השביל הזה" },
      {
        name: "description",
        content:
          "נפאל בקצרה: שמונה מעשר הפסגות הגבוהות בעולם, מג׳ונגל טרופי ועד קרחונים, ושבילים שאנשים חיים עליהם דורות.",
      },
      { property: "og:title", content: "נפאל — מה יש שם, ולמה זה מיוחד" },
      {
        property: "og:description",
        content: "מדינה קטנה שמכילה עולמות: הרים, עמקים, ערים ותרבות חיה.",
      },
    ],
  }),
});

const facts = [
  {
    n: "8 מתוך 10",
    t: "מהפסגות הגבוהות בעולם עומדות בנפאל. שמונה מהן, במדינה אחת קטנה.",
  },
  {
    n: "60 → 8,849",
    t: "מגובה של כמה עשרות מטרים בשפלה הטרופית ועד פסגת האוורסט — הפרש הגבהים החד הזה הוא כל הסיפור של נפאל.",
  },
  {
    n: "הדגל היחיד",
    t: "נפאל היא המדינה היחידה בעולם שהדגל שלה אינו מרובע — שני משולשים, לא מלבן.",
  },
];

function NepalPage() {
  return (
    <>
      <PageHero
        kicker="נפאל"
        title="מדינה בגודל של ישראל, ובתוכה שמונה מעשר הפסגות הגבוהות בעולם"
        lead="מג׳ונגל טרופי בטראי, דרך עמקי אורז וכפרים על צלעות ההר, ועד קרחונים בגובה חמשת אלפים מטר."
        image={heroHimalaya}
        imageAlt="רכס מושלג בהימלאיה באור ראשון"
      />

      <Section title="שלושה דברים שכדאי לדעת">
        <div className="grid gap-3 sm:grid-cols-3">
          {facts.map((f) => (
            <Card key={f.n}>
              <p className="font-display text-xl font-bold text-saffron">{f.n}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink/70">{f.t}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="ההרים">
        <p className="text-[15px] leading-relaxed text-ink/70">
          ההימלאיה בנפאל אינה מסלול אחד. יש ספקטרום שלם, מהליכה קלה של שלושה ימים בגבעות ועד
          מסלולים גבוהים ומרוחקים. ההבדל האמיתי הוא בגובה, במספר הימים ובאופי החוויה.
        </p>
        <Link
          to="/treks"
          className="mt-4 inline-block rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
        >
          לטרקים ולחוויות
        </Link>
      </Section>

      <section className="relative overflow-hidden">
        <img
          src={kathmanduDusk}
          alt="חצר מקדשים בקתמנדו בשעת בין ערביים"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-summit/75" />
        <div className="relative mx-auto max-w-3xl px-6 py-12">
          <h2 className="font-display text-[22px] font-bold text-balance text-parchment sm:text-2xl">
            גם מי שלא הולך שבוע ברגל חוזר מלא
          </h2>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-parchment/85">
            ערים, מקדשים, כפרים, נהרות וג׳ונגל. אפשר לבנות טיול משמעותי גם עם יומיים של הליכה
            בסך הכול.
          </p>
          <Link
            to="/treks"
            className="mt-5 inline-block rounded-xl bg-parchment/15 px-5 py-3 text-[14px] font-medium text-parchment ring-1 ring-parchment/25"
          >
            נפאל שמעבר לטרקים
          </Link>
        </div>
      </section>

      <Section title="מתי כדאי לבוא">
        <p className="text-[15px] leading-relaxed text-ink/70">
          לעונות יש השפעה גדולה על מה שאפשר לעשות ועל מה שרואים.
        </p>
        <Link
          to="/knowledge/$slug"
          params={{ slug: "when-to-go" }}
          className="mt-3 inline-block font-medium text-saffron"
        >
          לעמוד העונות ←
        </Link>
      </Section>

      <TalkCta />
    </>
  );
}
