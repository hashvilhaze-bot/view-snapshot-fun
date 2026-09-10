import { createFileRoute, Link } from "@tanstack/react-router";

import heroHimalaya from "@/assets/hero-himalaya.jpg";
import kathmanduDusk from "@/assets/kathmandu-dusk.jpg";
import annapurna1 from "@/assets/gallery/annapurna-1.jpg";
import kathmandu2 from "@/assets/gallery/kathmandu-2.jpg";
import pokhara1 from "@/assets/gallery/pokhara-1.jpg";
import pokharaHills3 from "@/assets/gallery/pokhara-hills-3.jpg";
import rafting1 from "@/assets/gallery/rafting-1.jpg";
import villages2 from "@/assets/gallery/villages-2.jpg";
import yoga1 from "@/assets/gallery/yoga-rest-1.jpg";
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

const experiences = [
  {
    slug: "treks",
    title: "טרקים קצרים וארוכים",
    text: "מהליכה של שלושה ימים בגבעות ועד מסעות של שבועיים בגובה. בוחרים לפי זמן, קצב ומה שמושך אתכם.",
    image: annapurna1,
    imageAlt: "טבעת פסגות מושלגות סביב אגן גבוה באור זריחה ורוד",
    to: "/treks",
  },
  {
    slug: "kathmandu",
    title: "קטמנדו וחוויות תרבות",
    text: "סמטאות, כיכרות מקדשים, דוכני אוכל וחיים שמתרחשים בחוץ. אפשר לשלב יומיים בהתחלה או בסוף.",
    image: kathmandu2,
    imageAlt: "כיכר מקדשים נווארית עם גגות פגודה מדורגים וקורות עץ מגולפים",
    to: "/experiences/kathmandu",
  },
  {
    slug: "pokhara",
    title: "פוקרה וזמן רגוע",
    text: "אגם, מרפסות, בוקר מול ההרים. מקום טוב להתחיל בו, לסיים בו, או פשוט לנוח בו כמה ימים.",
    image: pokhara1,
    imageAlt: "סירות עץ על אגם שקט בפוקרה, גבעות ירוקות משתקפות במים",
    to: "/experiences/pokhara",
  },
  {
    slug: "villages",
    title: "כפרים ותרבות מקומית",
    text: "שבילים שאנשים חיים עליהם דורות, ארוחה בבית של משפחה, ושיחה שלא תהיה במסעדת תיירים.",
    image: villages2,
    imageAlt: "אישה מבשלת דאל בהאט על כירת חימר במטבח כפרי",
    to: "/experiences/villages",
  },
  {
    slug: "yoga-rest",
    title: "יוגה ושקט",
    text: "רחבה מול הגבעות, ערסל בגן, יום בלי לוח זמנים. מתאים לפני טרק, אחרי טרק, או בפני עצמו.",
    image: yoga1,
    imageAlt: "רחבת עץ פתוחה עם מזרנים מגולגלים מול גבעות ירוקות בזריחה",
    to: "/experiences/yoga-rest",
  },
  {
    slug: "rafting",
    title: "רפטינג כפעילות משלימה",
    text: "יום על הנהר בדרך מקטמנדו לפוקרה, או מסע של כמה ימים למי שרוצה יותר.",
    image: rafting1,
    imageAlt: "רפסודה צהובה עם חותרים בתוך אשד לבן בנהר נפאלי",
    to: "/experiences/rafting",
  },
  {
    slug: "combinations",
    title: "שילוב של כמה חוויות",
    text: "טרק קצר, יומיים בפוקרה, רפטינג בדרך חזרה וקטמנדו בסוף. הטיול בנוי סביבכם.",
    image: pokharaHills3,
    imageAlt: "זריחה מגבעה ירוקה: שורת פסגות מושלגות מעל ים של ערפל",
    to: "/match",
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

      <Section kicker="אז מה אפשר לעשות בנפאל?" title="נפאל היא לא סוג אחד של טיול">
        <p className="-mt-1 mb-4 text-[15px] leading-relaxed text-ink/70">
          לא חייבים לבחור בין טרק לטיול רגוע. אפשר לבנות את השילוב שמתאים לכם.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {experiences.map((e) => (
            <Link key={e.slug} to={e.to} className="block">
              <Card className="h-full overflow-hidden p-0 transition-colors hover:border-saffron/40">
                <img
                  src={e.image}
                  alt={e.imageAlt}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-display text-[16px] font-bold">{e.title}</h3>
                  <p className="mt-1 text-[13.5px] leading-snug text-ink/65">{e.text}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section kicker="נפאל בכמה רגעים" className="py-4 sm:py-5">
        <div className="rounded-2xl border border-parchment/50 bg-parchment/85 p-4 ring-1 ring-ink/5">
          <QuickFacts />
          <Link to="/knowledge" className="mt-3 inline-block text-[13px] font-semibold text-saffron">
            למרכז הידע למטיילים בנפאל ←
          </Link>
        </div>
      </Section>

      <Section title="שלושה דברים שכדאי לדעת">
        <div className="grid gap-3 sm:grid-cols-3">
          {facts.map((f) => (
            <Card key={f.n} className="p-4">
              <p className="font-display text-lg font-bold text-saffron sm:text-xl">{f.n}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink/70 sm:text-[14px]">{f.t}</p>
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
        <div className="relative mx-auto max-w-4xl px-6 py-12">
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

      <Section kicker="להכיר את נפאל" title="אוכל, תרבות וחיי יום־יום">
        <p className="text-[15px] leading-relaxed text-ink/70">
          דאל בהאט פעמיים ביום, מומו בדוכן ברחוב, מקדשים שהינדואיזם ובודהיזם חיים בהם זה לצד זה,
          ולוח שנה משלהם. זה חלק גדול מהחוויה, גם למי שלא הולך לטרק ארוך.
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
