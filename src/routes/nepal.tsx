import { createFileRoute, Link } from "@tanstack/react-router";

import heroHimalaya from "@/assets/hero-himalaya.jpg";
import kathmanduDusk from "@/assets/kathmandu-dusk.jpg";
import { Card, DidYouKnow, Insight, PageHero, QuickFacts, Section, TalkCta } from "@/components/page";

export const Route = createFileRoute("/nepal")({
  component: NepalPage,
  head: () => ({
    meta: [
      { title: "נפאל — מה יש שם, ולמה זה מיוחד | השביל הזה" },
      {
        name: "description",
        content:
          "נפאל בכמה רגעים: בירה, מטבח, שפה, אזור זמן ועונות הטיול — ולצידם ההרים, הערים, הכפרים והג׳ונגל שבשפלה.",
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
    t: "מהפסגות הגבוהות בעולם נמצאות בנפאל, במדינה אחת קטנה.",
  },
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
        title="מדינה בגודל של ישראל, ובתוכה שמונה מעשר הפסגות הגבוהות בעולם"
        lead="מג׳ונגל טרופי בטראי, דרך עמקי אורז וכפרים על צלעות ההר, ועד קרחונים בגובה חמשת אלפים מטר."
        image={heroHimalaya}
        imageAlt="רכס מושלג בהימלאיה באור ראשון"
      />

      <Section kicker="נפאל בכמה רגעים" title="כרטיס ביקור מהיר">
        <QuickFacts />
        <Link to="/knowledge" className="mt-4 inline-block text-[14px] font-semibold text-saffron">
          למרכז הידע למטיילים בנפאל ←
        </Link>
      </Section>

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
          ההימלאיה בנפאל אינה מסלול אחד. יש הליכה של שלושה ימים בין כפרים בגבעות, ויש מעברים בגובה
          חמשת אלפים מטר שדורשים שבועיים. ההבדל האמיתי הוא בגובה, במספר הימים ובאופי החוויה.
        </p>
        <div className="mt-5">
          <Insight text="בנפאל לא מודדים את השנה כמו אצלנו: הלוח הרשמי הוא ביקראם סמבט, שמקדים את הלוח הלועזי בכ־57 שנים, והשנה החדשה שם מתחילה באמצע אפריל." />
        </div>
        <Link
          to="/treks"
          className="mt-4 inline-block rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
        >
          לטרקים ולמסלולים
        </Link>
      </Section>

      <section className="relative overflow-hidden">
        <img
          src={kathmanduDusk}
          alt="חצר מקדשים בקטמנדו בשעת בין ערביים"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-summit/75" />
        <div className="relative mx-auto max-w-3xl px-6 py-12">
          <h2 className="font-display text-[22px] font-bold text-balance text-parchment sm:text-2xl">
            ההימלאיה היא סיבה מצוינת להגיע לנפאל. היא ממש לא הסיבה היחידה להישאר
          </h2>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-parchment/85">
            סמטאות קטמנדו, בוקר מול ההרים בפוקרה, כפרים בין טרסות, רפטינג, ג׳ונגל ויוגה — ולפעמים
            דווקא יום שלא תוכנן הופך לזיכרון הכי חזק מהטיול.
          </p>
          <Link
            to="/treks"
            className="mt-5 inline-block rounded-xl bg-parchment/15 px-5 py-3 text-[14px] font-medium text-parchment ring-1 ring-parchment/25"
          >
            לגלות את נפאל שמעבר לטרקים
          </Link>
        </div>
      </section>

      <Section title="הנהרות">
        <DidYouKnow
          text="הנהרות הגדולים של נפאל מתחילים בהמסת שלגים בהימלאיה — ולכן עוצמת האשדות משתנה לפי העונה, לא לפי הגשם של אותו יום."
          action={
            <Link to="/experiences/$slug" params={{ slug: "rafting" }}>
              לחוויות הרפטינג בנפאל ←
            </Link>
          }
        />
      </Section>

      <Section kicker="להכיר את נפאל" title="תוכן לקרוא, גם בלי לתכנן טיול">
        <p className="text-[15px] leading-relaxed text-ink/70">
          דאל בהאט פעמיים ביום, מומו בדוכן ברחוב, מקדשים שהינדואיזם ובודהיזם חיים בהם זה לצד זה,
          ולוח שנה משלהם.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/knowledge/$slug"
            params={{ slug: "culture-food" }}
            className="rounded-xl bg-parchment px-5 py-3 text-[14px] font-medium text-ink ring-1 ring-ink/10"
          >
            אוכל, תרבות וחגים
          </Link>
          <Link
            to="/knowledge/$slug"
            params={{ slug: "day-on-trail" }}
            className="rounded-xl bg-parchment px-5 py-3 text-[14px] font-medium text-ink ring-1 ring-ink/10"
          >
            איך נראה יום בטרק
          </Link>
          <Link
            to="/knowledge"
            className="rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
          >
            לכל המאמרים במרכז הידע
          </Link>
        </div>
      </Section>

      <Section title="מתי כדאי לבוא">
        <p className="text-[15px] leading-relaxed text-ink/70">
          אוקטובר–נובמבר בהירות ויציבות, מרץ–אפריל ירוקות ופורחות, ויולי–אוגוסט הם מונסון.
        </p>
        <Link
          to="/knowledge/$slug"
          params={{ slug: "when-to-go" }}
          className="mt-3 inline-block font-medium text-saffron"
        >
          קראו עוד על העונות ←
        </Link>
      </Section>

      <TalkCta />
    </>
  );
}
