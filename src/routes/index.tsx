import { createFileRoute } from "@tanstack/react-router";

import heroHimalaya from "@/assets/hero-himalaya.jpg";
import kathmanduDusk from "@/assets/kathmandu-dusk.jpg";
import guidePortrait from "@/assets/guide-portrait.jpg";
import valleyGolden from "@/assets/valley-golden.jpg";

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
        content:
          "טרקים מקצרים ונגישים ועד מנאסלו, ולצידם קתמנדו, פוקרה, כפרים ותרבות. טיול שנבנה סביבכם.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
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

const treks = [
  {
    name: "עמק פוקרה והגבעות",
    level: "קל",
    bars: 1,
    text: "שלושה עד חמישה ימי הליכה בין כפרים, יערות ומרפסות אורז, בגובה שלא מחייב התאקלמות. ישנים בלודג'ים חמים, וכל בוקר נפתח על רכס אנאפורנה מעל האגם.",
    fit: "למי שרוצה טעם ראשון של ההימלאיה בלי לוותר על נוחות",
  },
  {
    name: "אנאפורנה בייס קמפ",
    level: "בינוני",
    bars: 2,
    text: "שבעה עד עשרה ימים שנכנסים אל תוך אמפיתאטרון של פסגות ומסתיימים ב-4,130 מטר, מוקפים בקיר הרים מכל הכיוונים. עלייה הדרגתית, מדרגות אבן ארוכות ומעיינות חמים בדרך חזרה.",
    fit: "למי שהולך טוב ורוצה להיות בתוך ההרים, לא רק מולם",
  },
  {
    name: "מנאסלו סירקיט",
    level: "מאתגר",
    bars: 3,
    text: "שנים עשר עד שישה עשר ימים סביב ההר השמיני בגובהו בעולם, עד מעבר לארקיה לה בגובה 5,106 מטר. אזור מוגבל שדורש היתר ומדריך מוסמך, ולכן שקט משמעותית מהמסלולים המרכזיים, עם כפרים טיבטיים לאורך הדרך.",
    fit: "למי שרוצה גובה אמיתי, ימים ארוכים ומעט אנשים בשביל",
  },
];

const beyond = ["קתמנדו", "פוקרה", "כפרים וטרסות", "רפטינג", "יוגה ומנוחה", "צ׳יטוואן"];

const suits = [
  "שבוע אחד",
  "שבועיים",
  "שלושה שבועות",
  "קצב רגוע",
  "אתגר פיזי",
  "גבהים",
  "תרבות ואנשים",
  "עם הזוג",
  "עם הילדים",
];

const steps = [
  {
    n: "01",
    title: "שיחה ראשונה",
    text: "לא מתחילים במסלול. מתחילים בכם: כמה זמן יש, מה כבר ראיתם בעולם, מה מסקרן ומה בכלל לא מתאים.",
  },
  {
    n: "02",
    title: "כמה כיוונים על השולחן",
    text: "מציגים שתיים או שלוש אפשרויות שונות באופי, עם ההבדלים ביניהן בגובה, במאמץ ובסוג החוויה, כדי שתבחרו מתוך הבנה.",
  },
  {
    n: "03",
    title: "בונים את המסלול לפרטים",
    text: "ימי התאקלמות, לודג'ים, מדריך ופורטרים, היתרים, טיסות פנים ותוספות כמו יומיים בקתמנדו או מנוחה בפוקרה בסוף.",
  },
  {
    n: "04",
    title: "ליווי גם בשטח",
    text: "הצוות המקומי שלנו נמצא ביעד. אם המזג אוויר, הגוף או הרצון משתנים באמצע, משנים את התוכנית בזמן אמת.",
  },
];

const knowledge = [
  "העונות: אוקטובר–נובמבר הן החלון הבהיר והיציב, מרץ–אפריל ירוקות ופורחות רודודנדרון, יולי–אוגוסט הם מונסון ולא מתאימים לטרקים גבוהים.",
  "גובה: מעל 3,000 מטר עולים לא יותר מ־500 מטר שינה ביום, ומשלבים יום התאקלמות. זה מה שמכתיב את אורך המסלול, לא כושר.",
  "לודג'ים: בשבילים המרכזיים ישנים בטיהאוסים, חדר פשוט עם שתי מיטות וארוחות חמות. מנאסלו והמסלולים המרוחקים בסיסיים יותר.",
  "היתרים: מנאסלו ואזורים מוגבלים דורשים היתר מיוחד ומדריך מוסמך, ואי אפשר לעשות אותם באופן עצמאי.",
  "כספים: כרטיסי אשראי כמעט לא עובדים על השביל. מוציאים מזומן בקתמנדו או בפוקרה לפני היציאה.",
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <header className="sticky top-0 z-50 border-b border-parchment/10 bg-summit/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <span className="font-display text-lg font-bold tracking-tight text-parchment">
            השביל הזה
          </span>
          <a
            href="#contact"
            className="rounded-full border border-parchment/25 px-4 py-2 text-[13px] font-medium text-parchment/80 transition-colors hover:border-parchment/50 hover:text-parchment"
          >
            שיחה ראשונה
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-[560px] items-end overflow-hidden">
        <img
          src={heroHimalaya}
          alt="רכס מושלג בהימלאיה בנפאל באור ראשון, עם ערפל שממלא את העמקים"
          width={1088}
          height={1440}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-summit/60 via-summit/25 to-summit/80" />
        <div className="relative w-full px-6 pt-24 pb-10">
          <div className="mx-auto max-w-xl rounded-2xl border border-parchment/40 bg-parchment/85 p-6 shadow-[0_24px_60px_-30px_oklch(0.185_0.006_285/0.7)] backdrop-blur-md">
            <p className="mb-3 text-sm font-semibold text-saffron">
              טיולים אישיים בנפאל ובהימלאיה
            </p>
            <h1 className="font-display text-[44px] leading-[1.05] font-black text-balance text-ink">
              המסע
              <br />
              מתחיל בך
            </h1>
            <p className="mt-4 max-w-[34ch] leading-relaxed text-ink/75">
              טיולים אישיים בנפאל ובהימלאיה שנבנים סביב האדם: הזמן שיש לכם, המאמץ שמתאים לכם
              והחוויה שאתם באמת מחפשים.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href="#contact"
                className="rounded-xl bg-saffron px-5 py-3.5 text-center text-[15px] font-semibold text-parchment transition-opacity hover:opacity-90"
              >
                בואו נבנה את הטיול שלי
              </a>
              <a
                href="#suits"
                className="rounded-xl bg-summit/10 px-5 py-3.5 text-center text-[15px] font-medium text-ink ring-1 ring-ink/10 transition-colors hover:bg-summit/15"
              >
                מה יכול להתאים לי?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY NEPAL */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <p className="mb-3 text-xs font-semibold tracking-wide text-saffron">למה נפאל</p>
        <h2 className="font-display text-3xl leading-tight font-bold text-balance">
          מדינה בגודל של ישראל, ובתוכה שמונה מתוך עשר הפסגות הגבוהות בעולם
        </h2>
        <p className="mt-4 leading-loose text-ink/70">
          בתוך מרחק של יום נסיעה עוברים מג'ונגל טרופי בטראי, דרך עמקי אורז וכפרים על צלעות ההר,
          ועד קרחונים בגובה חמשת אלפים מטר. אין עוד מקום שבו הליכה של שבוע מעבירה אותך בין כל
          כך הרבה עולמות, ואפשר לעשות את זה בשבילים שאנשים חיים עליהם דורות, ולישון בכל לילה
          בבית חם.
        </p>
      </section>

      {/* TREKS */}
      <section className="mx-auto max-w-3xl px-6 pb-14">
        <h2 className="font-display text-3xl font-bold text-balance">עולם של שבילים</h2>
        <p className="mt-3 leading-relaxed text-ink/60">
          לא מסלול אחד ולא רשימה. ספקטרום שלם, מהליכה קלה של שלושה ימים ועד מנאסלו. ההבדל האמיתי
          הוא בגובה, בימים ובאופי, ולא במחיר.
        </p>

        <div className="mt-8 space-y-4">
          {treks.map((t) => (
            <article
              key={t.name}
              className="rounded-2xl border border-parchment/40 bg-parchment/80 p-5 ring-1 ring-ink/5 backdrop-blur-md"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl font-bold">{t.name}</h3>
                <span className="shrink-0 text-[11px] font-semibold text-saffron">{t.level}</span>
              </div>
              <div className="mt-2 flex h-1.5 gap-1.5">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-full w-1/4 rounded-full ${
                      i <= t.bars ? "bg-saffron" : "bg-ink/10"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{t.text}</p>
              <p className="mt-2 text-[13px] font-medium text-ink/50">{t.fit}</p>
            </article>
          ))}
        </div>
      </section>

      {/* BEYOND TREKS */}
      <section className="relative overflow-hidden">
        <img
          src={kathmanduDusk}
          alt="חצר מקדשים בעיר העתיקה של קתמנדו בשעת בין ערביים, עם דגלי תפילה"
          width={1088}
          height={1280}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-summit/70" />
        <div className="relative mx-auto max-w-3xl px-6 py-16">
          <div className="max-w-[40ch]">
            <p className="mb-3 text-xs font-semibold tracking-wide text-saffron">
              מעבר לטרקים
            </p>
            <h2 className="font-display text-3xl leading-tight font-bold text-balance text-parchment">
              אפשר לחזור מנפאל מלאים גם בלי טרק ארוך
            </h2>
            <p className="mt-4 leading-loose text-parchment/85">
              קתמנדו היא לא רק שדה תעופה: בהאקטאפור ופאטאן הן ערים שלמות של חצרות מגולפות
              ומנזרים חיים. בפוקרה יש אגם, מרפסות והליכות בוקר קצרות. בין לבין: רפטינג בנהר
              טריסולי, ספארי בצ׳יטוואן, ארוחה בבית של משפחה בכפר, וימי יוגה ומנוחה. חלק
              מהטיולים היפים שבנינו כללו יומיים של הליכה בסך הכול.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {beyond.map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-parchment/15 px-3.5 py-2 text-[13px] font-medium text-parchment ring-1 ring-parchment/20 backdrop-blur-md"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT SUITS ME */}
      <section id="suits" className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="font-display text-3xl font-bold text-balance">מה מתאים לי?</h2>
        <p className="mt-3 leading-relaxed text-ink/60">
          סמנו כמה דברים שמתארים אותכם, ואנחנו נחזור עם שניים־שלושה כיוונים שמתאימים לכם, ולא
          עם קטלוג.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {suits.map((s) => (
            <span
              key={s}
              className="rounded-full bg-parchment px-4 py-2.5 text-[14px] font-medium text-ink ring-1 ring-ink/10"
            >
              {s}
            </span>
          ))}
        </div>
        <a
          href="#contact"
          className="mt-6 inline-block rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment transition-opacity hover:opacity-90"
        >
          לשלוח לנו את זה
        </a>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-3xl px-6 pb-14">
        <h2 className="font-display text-3xl font-bold text-balance">איך בונים טיול</h2>
        <ol className="mt-7 space-y-5">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span className="font-display text-2xl leading-none font-bold text-saffron">
                {s.n}
              </span>
              <div>
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="text-[15px] leading-relaxed text-ink/70">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* KNOWLEDGE */}
      <section className="mx-auto max-w-3xl px-6 pb-14">
        <h2 className="font-display text-3xl font-bold text-balance">לדעת לפני שיוצאים</h2>
        <div className="mt-6 space-y-4 rounded-2xl border border-parchment/40 bg-parchment/80 p-6 ring-1 ring-ink/5 backdrop-blur-md">
          {knowledge.map((k) => (
            <div key={k} className="flex gap-3">
              <span className="text-lg leading-none font-bold text-saffron">·</span>
              <p className="text-[15px] leading-relaxed text-ink/80">{k}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PEOPLE */}
      <section className="mx-auto max-w-3xl px-6 pb-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <img
            src={guidePortrait}
            alt="מדריך טרקים נפאלי בכפר הררי"
            width={800}
            height={1008}
            loading="lazy"
            className="h-32 w-28 shrink-0 rounded-xl object-cover"
          />
          <div>
            <h2 className="font-display text-2xl font-bold text-balance">
              האנשים והיכולת המקומית
            </h2>
            <p className="mt-3 leading-loose text-ink/70">
              התכנון נעשה בעברית, מול מי שהלך בעצמו בשבילים האלה. ההפעלה בשטח נעשית עם צוות
              נפאלי קבוע: מדריכים מוסמכים שגדלו באזורים שאליהם אנחנו הולכים, פורטרים מבוטחים,
              ואיש קשר בקתמנדו שזמין לאורך כל הטיול. זה מה שמאפשר לשנות תוכנית באמצע הדרך ולא
              רק להיצמד למה שנקבע מראש.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="relative overflow-hidden">
        <img
          src={valleyGolden}
          alt="עמק בהימלאיה באור זהוב עם דגלי תפילה מעל גשר אבן"
          width={1080}
          height={1280}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-summit/70" />
        <div className="relative mx-auto max-w-3xl px-6 py-16">
          <div className="max-w-[34ch]">
            <h2 className="font-display text-4xl leading-tight font-black text-balance text-parchment">
              בואו נדבר על הטיול
            </h2>
            <p className="mt-4 leading-loose text-parchment/85">
              שיחה אחת, בלי התחייבות. גם אם אין לכם עדיין מסלול בראש, אלא רק תחושה שנפאל
              מסקרנת אותך.
            </p>
            <a
              href="#contact"
              className="mt-6 inline-block rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment transition-opacity hover:opacity-90"
            >
              נפתח שיחה
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-summit px-6 py-8 text-parchment/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="font-display text-lg font-bold text-parchment">השביל הזה</span>
          <span className="text-[12px]">נפאל · הימלאיה</span>
        </div>
      </footer>
    </div>
  );
}
