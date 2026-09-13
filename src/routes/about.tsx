import { createFileRoute, Link } from "@tanstack/react-router";

import bedNathRegmi from "@/assets/bed-nath-regmi.jpg";
import kathmanduDusk from "@/assets/kathmandu-dusk.jpg";
import ohadPhoto from "@/assets/ohad.jpg";
import shalomTeam from "@/assets/shalom-team.jpg";
import { Accordion, Card, PageHero, Section } from "@/components/page";
import { galleries } from "@/lib/galleries";
import { NEPAL_PARTNER_NAME, NEPAL_PARTNER_ROLE } from "@/lib/leads";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "מי אנחנו — השביל הזה" },
      {
        name: "description",
        content:
          "היכרות אישית ותכנון בעברית עם אוהד, וניסיון מקומי עמוק בנפאל עם סוכנות שלום מקטמנדו — מעטפת אחת מהשיחה הראשונה ועד החזרה הביתה.",
      },
      { property: "og:title", content: "מי אנחנו — השביל הזה" },
      {
        property: "og:description",
        content: "האנשים, הניסיון המקומי והליווי שנמשך לאורך כל הטיול.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const cards = [
  {
    t: "מכירים אתכם כאן",
    d: "שיחה אישית בעברית, הקשבה ותכנון שמתחשב בזמן שיש לכם, בקצב, בניסיון ובמה שאתם רוצים לפגוש בדרך.",
  },
  {
    t: "ניסיון מקומי בנפאל",
    d: "סוכנות שלום מביאה היכרות עמוקה עם המדינה, מדריכים מוסמכים שגדלו באזורים שאליהם הולכים וצוות שיודע לנהל את הטיול בשטח.",
  },
  {
    t: "אתכם לאורך כל הדרך",
    d: "כתובת אחת וליווי רציף — מהשיחה הראשונה, דרך התכנון וההכנות, לאורך הטיול ועד החזרה הביתה.",
  },
];

const steps: [string, string, string][] = [
  [
    "01",
    "מכירים ומקשיבים",
    "שיחה שבה מבינים מה אתם מחפשים, כמה זמן יש, מי נוסע, מה מעניין אתכם ומה הניסיון שלכם.",
  ],
  [
    "02",
    "בוחנים את האפשרויות",
    "מציגים כמה כיוונים שיכולים באמת להתאים ומסבירים את ההבדלים, בלי להציף בעשרות מסלולים.",
  ],
  [
    "03",
    "בונים את הטיול",
    "מתאימים את המסלול, הקצב, מספר הימים, הלינה, ההתאקלמות, התחבורה והחוויות סביב הדרך.",
  ],
  [
    "04",
    "סוגרים את הפרטים",
    "אחרי אישור המסלול מטפלים בתיאומים ובהזמנות הרלוונטיים, ומכינים אתכם ליציאה בצורה מסודרת.",
  ],
  [
    "05",
    "מלווים גם בנפאל",
    "בזמן הטיול יש לכם כתובת לשאלות ולשינויים, וצוות מקומי מנוסה שיכול לפעול בשטח.",
  ],
  [
    "06",
    "עד שחוזרים הביתה",
    "הליווי לא נגמר בנחיתה בקטמנדו. אנחנו נשארים איתכם עד סוף הטיול והחזרה הביתה.",
  ],
];

function AboutPage() {
  const village = galleries["villages"]?.[0];
  const trail = galleries["manaslu-circuit"]?.[1];
  const river = galleries["rafting"]?.[0];

  return (
    <>
      <PageHero
        kicker="מי אנחנו"
        title="מעטפת אחת, מהרעיון הראשון ועד החזרה הביתה"
        lead="היכרות אישית ותכנון בעברית כאן, וניסיון מקומי עמוק בנפאל. מבחינתכם זו כתובת אחת ותהליך אחד."
        image={kathmanduDusk}
        imageAlt="חצר מקדשים בעיר העתיקה של קטמנדו בשעת בין ערביים"
      />

      <Section title="השביל הזה" className="py-6 sm:py-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
          <img
            src={ohadPhoto}
            alt="אוהד הרץ מול פסגות ההימלאיה בנפאל"
            loading="lazy"
            className="aspect-[3/2] w-full shrink-0 rounded-2xl object-cover sm:aspect-[4/5] sm:w-64 md:w-72"
          />
          <div className="space-y-3 text-[15px] leading-relaxed text-ink/75 sm:pt-1">
            <p>
              אני אוהד, מרמות מנשה. אחרי הצבא יצאתי כמו כולנו לטיול הגדול במזרח — בתכניות היו כל
              מדינות המזרח, אלא שהתגלגלתי להודו ולנפאל, ושם נשארתי הרבה יותר ממה שתכננתי.
            </p>
            <p>
              בנפאל התאהבתי — בנופים, בתרבות ובאנשים. מאז נפאל בליבי. ועכשיו אני מצליח סוף סוף
              לשלב את האהבה שלי לטיולים ולתרבות עם המדינה שאני כל כך אוהב. מקווה ממש שאצליח
              להעביר לכם קצת ממה שיש למדינה הזו ולאזור הזה לתת.
            </p>
            <p>
              אני לא מוכר מסלולים מהמדף. כל טיול נבנה בשיחה, כי מה שמתאים לאחד לא מתאים לאחר — ולכן
              חשוב שיהיה לכם עם מי לדבר גם לפני, וגם כשאתם שם.
            </p>
            <p className="font-semibold text-ink">אתם נהנים מהדרך, ואנחנו דואגים לפרטים.</p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-3 sm:grid-cols-3">
          {cards.map((c) => (
            <Card key={c.t} className="h-full">
              <p className="font-display text-[16px] font-bold">{c.t}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{c.d}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* SHALOM — the local capability, in depth */}
      <section className="bg-summit px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-[12px] font-medium tracking-wide text-saffron">השותף בנפאל</p>
          <h2 className="mt-1.5 max-w-[26ch] font-display text-[22px] leading-snug font-bold text-parchment sm:text-2xl">
            סוכנות שלום — הניסיון המקומי שמאחורי הטיול
          </h2>
          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:gap-7">
            <div className="shrink-0 sm:w-56 md:w-64">
              <img
                src={bedNathRegmi}
                alt={`${NEPAL_PARTNER_NAME} בבסיס אנאפורנה`}
                loading="lazy"
                className="aspect-[4/5] w-40 rounded-2xl object-cover object-top ring-1 ring-parchment/20 sm:w-full"
              />
              <p className="mt-2.5 text-[14px] leading-relaxed text-parchment/70">
                <span className="font-semibold text-parchment">{NEPAL_PARTNER_NAME}</span>
                <br />
                {NEPAL_PARTNER_ROLE} — איש הקשר הקבוע שלכם בצד הנפאלי.
              </p>
            </div>
            <div className="space-y-3 text-[14.5px] leading-relaxed text-parchment/80">
              <p>
                ההפעלה בשטח נעשית עם Shalom Rafting Treks &amp; Expedition — סוכנות מקומית רשומה
                מתאמל שבקטמנדו, שפועלת מ־2010 ומתמחה בטרקים, במסעות נהר ובטיולי תרבות וטבע בנפאל.
                איש הקשר שם הוא {NEPAL_PARTNER_NAME}, {NEPAL_PARTNER_ROLE}.
              </p>
              <p>
                מה זה אומר בפועל: מדריכים מוסמכים שגדלו באזורים שאליהם הולכים ומכירים את הכפרים, את
                בתי התה ואת מצב השבילים; פורטרים מבוטחים; היתרים מסודרים לאזורים המוגבלים; ואיש קשר
                בקטמנדו שזמין לאורך הטיול. כשמשהו משתנה — מזג אוויר, טיסה פנימית, קצב שלא מתאים —
                יש מי שמסדר את זה בשטח, ולא רק ממליץ מהמשרד.
              </p>
              <p>
                הסוכנות חברה באיגוד סוכנויות הטרקים של נפאל (TAAN), מספר רישום 69334/066/067,
                ועובדת עם מטיילים מישראל וממדינות נוספות. סוכנות שלום היא השותף המקצועי בשטח —
                אבל הקשר איתכם, התכנון וההצעות מנוהלים על ידי "השביל הזה".
              </p>
            </div>
          </div>
          <div className="mt-7 grid gap-2.5 sm:grid-cols-[3fr_2fr]">
            <figure>
              <img
                src={shalomTeam}
                alt="צוות סוכנות שלום במשרד בתאמל, קטמנדו"
                loading="lazy"
                width={1600}
                height={1069}
                className="aspect-[3/2] h-full w-full rounded-2xl object-cover"
              />
              <figcaption className="mt-1.5 px-1 text-[12px] text-parchment/50">
                הצוות של סוכנות שלום במשרד בתאמל, קטמנדו
              </figcaption>
            </figure>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-1">
              {[village, trail, river].map(
                (p) =>
                  p && (
                    <img
                      key={p.src}
                      src={p.src}
                      alt={p.alt}
                      loading="lazy"
                      width={1200}
                      height={800}
                      className="aspect-[4/3] w-full rounded-xl object-cover sm:aspect-auto sm:h-full"
                    />
                  ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* "How we work" lives only here, folded so the page stays short. */}
      <Section title="איך אנחנו עובדים" className="py-6 sm:py-7">
        <Accordion
          items={steps.map(([n, t, d]) => ({
            title: `${n} · ${t}`,
            content: <p>{d}</p>,
          }))}
        />
        <p className="mt-4 text-[14px] leading-relaxed text-ink/60">
          גם כשצריך לשנות תוכנית באמצע הטיול, יש מי שמטפל בזה — מי שנמצא בשטח יודע מה הובטח לכם, ומי
          שתכנן איתכם יודע מה קורה שם עכשיו.
        </p>
      </Section>

      <Section className="!pt-2 !pb-12">
        <Card className="text-center">
          <p className="font-display text-[18px] font-bold">נתחיל מהשיחה הראשונה?</p>
          <Link
            to="/match"
            className="mt-4 inline-block rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment"
          >
            בואו נמצא את השביל שלכם
          </Link>
        </Card>
      </Section>
    </>
  );
}
