import { createFileRoute, Link } from "@tanstack/react-router";

import guidePortrait from "@/assets/guide-portrait.jpg";
import heroHimalaya from "@/assets/hero-himalaya.jpg";
import kathmanduDusk from "@/assets/kathmandu-dusk.jpg";
import heroVideo from "@/assets/nepal-hero.mp4.asset.json";
import { HeroVideo } from "@/components/hero-video";
import {
  Card,
  DidYouKnow,
  EffortBars,
  Section,
  WhatsappButton,
} from "@/components/page";
import { articles, experiences, treks } from "@/lib/content";
import { galleries } from "@/lib/galleries";

const quickAnswers = articles.filter((a) => a.quickAnswer).slice(0, 3);


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

const facts = [
  { n: "8 מתוך 10", t: "מהפסגות הגבוהות בעולם נמצאות בנפאל" },
  { n: "מ־60 עד 8,849 מ׳", t: "מהשפלה הטרופית ועד פסגת האוורסט, במדינה אחת" },
  { n: "דגל אחד בעולם", t: "לנפאל הדגל הלאומי היחיד שאינו מרובע או מלבני" },
];

function Index() {
  const sunrise = galleries["pokhara-hills"]?.[2];

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[68svh] flex-col justify-end overflow-hidden sm:min-h-[80vh]">
        <img
          src={heroHimalaya}
          alt="רכס מושלג בהימלאיה בנפאל באור ראשון, עם ערפל שממלא את העמקים"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <HeroVideo src={heroVideo.url} poster={heroHimalaya} />
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
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Link
              to="/match"
              className="rounded-xl bg-saffron px-5 py-3.5 text-center text-[15px] font-semibold text-parchment"
            >
              בואו נמצא את השביל שלכם
            </Link>
            <Link
              to="/quote"
              className="rounded-xl bg-parchment/15 px-5 py-3.5 text-center text-[15px] font-medium text-parchment ring-1 ring-parchment/35 backdrop-blur-sm"
            >
              כבר יודעים מה אתם רוצים?
            </Link>
          </div>

        </div>
      </section>

      {/* WHY NEPAL */}
      <Section kicker="למה נפאל" title="קשה להסביר את נפאל בתמונה אחת">
        <p className="-mt-1 mb-4 text-[15px] leading-relaxed text-ink/70">
          ההימלאיה היא סיבה מצוינת להגיע. אבל אז מגיעים גם לסמטאות של קטמנדו, לכפרים בדרך, לזריחה
          מול ההרים, לנהר, למקדש באמצע הרחוב וליום אחד שלא תכננתם בכלל. אפשר ללכת גבוה ורחוק, ואפשר
          לקחת את נפאל בקצב אחר לגמרי — בדרך כלל הטיול הטוב נמצא איפשהו בשילוב.
        </p>

        {sunrise && (
          <img
            src={sunrise.src}
            alt={sunrise.alt}
            loading="lazy"
            width={1200}
            height={800}
            className="aspect-[16/9] w-full rounded-2xl object-cover"
          />
        )}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {facts.map((f) => (
            <Card key={f.n} className="p-3.5">
              <p className="font-display text-[15px] font-bold text-saffron sm:text-lg">{f.n}</p>
              <p className="mt-1 text-[12px] leading-snug text-ink/65 sm:text-[13px]">{f.t}</p>
            </Card>
          ))}
        </div>
        <Link to="/nepal" className="mt-4 inline-block text-[14px] font-semibold text-saffron">
          להכיר את נפאל ←
        </Link>
      </Section>

      {/* TREKS */}
      <Section kicker="ההימלאיה והטרקים" title="לא כל מי שחולם על ההימלאיה צריך ללכת לאוורסט">
        <p className="-mt-1 mb-5 text-[15px] leading-relaxed text-ink/70">
          יש טרקים של כמה ימים ויש מסעות של שבועיים ויותר. העניין הוא לא לבחור את הטרק הכי מפורסם —
          אלא את זה שמתאים לכם.
        </p>

        <div className="space-y-3">
          {treks
            .filter((t) =>
              ["pokhara-hills", "poon-hill", "annapurna-base-camp", "everest-base-camp"].includes(
                t.slug,
              ),
            )
            .map((t) => {
            const cover = galleries[t.slug]?.[0];
            return (
              <Link key={t.slug} to="/treks/$slug" params={{ slug: t.slug }} className="block">
                <Card className="overflow-hidden p-0 transition-colors hover:border-saffron/40">
                  <div className="grid grid-cols-[104px_minmax(0,1fr)] sm:grid-cols-[150px_minmax(0,1fr)]">
                    {cover && (
                      <img
                        src={cover.src}
                        alt={cover.alt}
                        loading="lazy"
                        width={1200}
                        height={800}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate font-display text-[17px] font-bold">{t.name}</h3>
                        <span className="shrink-0 text-[11px] font-semibold text-saffron">
                          {t.effortLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-[12.5px] text-ink/60">
                        {t.days} · {t.altitude}
                      </p>
                      <div className="mt-2">
                        <EffortBars level={t.effort} />
                      </div>
                      <p className="mt-2 text-[13px] leading-snug text-ink/60">{t.teaser}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
        <Link to="/treks" className="mt-4 inline-block text-[14px] font-semibold text-saffron">
          לכל המסלולים והחוויות ←
        </Link>
      </Section>

      {/* BEYOND TREKS */}
      <section className="relative overflow-hidden">
        <img
          src={kathmanduDusk}
          alt="חצר מקדשים בעיר העתיקה של קטמנדו בשעת בין ערביים"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-summit/78" />
        <div className="relative mx-auto max-w-4xl px-6 py-12">
          <p className="mb-2 text-xs font-medium text-saffron">מעבר לטרקים</p>
          <h2 className="font-display text-[21px] leading-snug font-bold text-parchment sm:text-2xl">
            סמטה בקטמנדו, בוקר על האגם וארוחה בבית בכפר
          </h2>
          <p className="mt-2.5 max-w-[44ch] text-[14.5px] leading-relaxed text-parchment/80">
            אפשר לשלב בטיול ימים שאינם הליכה בהרים: ערים היסטוריות, כפרים, נהרות והג׳ונגל בשפלה.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {experiences.map((e) => (
              <Link key={e.slug} to="/experiences/$slug" params={{ slug: e.slug }}>
                <div className="h-full rounded-xl bg-parchment/12 p-3 ring-1 ring-parchment/20 backdrop-blur-sm">
                  <p className="text-[14px] font-semibold text-parchment">{e.name}</p>
                  <p className="mt-0.5 text-[12px] text-parchment/65">{e.kicker}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to="/treks"
            className="mt-5 inline-block rounded-xl bg-parchment/15 px-5 py-3 text-[14px] font-medium text-parchment ring-1 ring-parchment/25"
          >
            לגלות את נפאל שמעבר לטרקים
          </Link>
        </div>
      </section>

      {/* DID YOU KNOW */}
      <Section>
        <DidYouKnow
          text="בנפאל השעון מקדים את ישראל לא בשעה שלמה — אלא גם ב־45 דקות. אזור הזמן שם הוא UTC+5:45. כן, גם הזמן שם עושה דברים קצת אחרת."
          action={<Link to="/knowledge">עוד דברים שכדאי לדעת לפני שנוסעים ←</Link>}
        />
      </Section>

      {/* THREE PATHS */}
      <Section kicker="מאיפה מתחילים" title="לא חייבים לדעת בדיוק מה רוצים">
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/nepal">
            <Card className="h-full p-4 transition-colors hover:border-saffron/40">
              <p className="font-display text-[15px] font-bold">רק מתחילים לחלום</p>
              <p className="mt-1 text-[13px] leading-snug text-ink/60">
                לגלות את נפאל, לקבל רעיונות ולראות לאן זה לוקח אתכם
              </p>
            </Card>
          </Link>
          <Link to="/match">
            <Card className="h-full p-4 transition-colors hover:border-saffron/40">
              <p className="font-display text-[15px] font-bold">רוצים לנסוע, עוד לא בטוחים לאן</p>
              <p className="mt-1 text-[13px] leading-snug text-ink/60">
                כמה שאלות קצרות יעזרו לנו להבין אילו כיוונים יכולים להתאים לכם
              </p>
            </Card>
          </Link>
          <Link to="/quote">
            <Card className="h-full p-4 transition-colors hover:border-saffron/40">
              <p className="font-display text-[15px] font-bold">כבר יודעים מה אתם רוצים</p>
              <p className="mt-1 text-[13px] leading-snug text-ink/60">
                טרק מסוים? שילוב של כמה מקומות? ספרו לנו מה יש לכם בראש ונמשיך משם
              </p>
            </Card>
          </Link>
        </div>
      </Section>


      {/* PROCESS */}
      <Section kicker="איך אנחנו עובדים" title="אתם לא צריכים להגיע עם מסלול. בשביל זה אנחנו כאן.">
        <p className="-mt-1 mb-5 text-[15px] leading-relaxed text-ink/70">
          מתחילים בשיחה: כמה זמן יש לכם, מה מושך אתכם, איזה קצב מתאים לכם ומה חשוב שלא יהיה בטיול.
          מכאן בונים את הכיוון יחד, ובעזרת צוות מקומי מנוסה בנפאל הופכים אותו לטיול שאפשר באמת לצאת
          אליו.
        </p>
        <ol className="flex flex-wrap items-center gap-2">
          {["מקשיבים", "מתאימים", "בונים", "יוצאים", "מלווים"].map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-full bg-parchment/80 px-4 py-2 text-[14px] font-semibold ring-1 ring-ink/5">
                {step}
              </span>
              {i < 4 && <span className="text-saffron">←</span>}
            </li>
          ))}
        </ol>
        <Link to="/about" className="mt-5 inline-block text-[14px] font-semibold text-saffron">
          מי האנשים מאחורי זה ←
        </Link>
      </Section>


      {/* KNOWLEDGE — simple answer first */}
      <Section kicker="לפני שנוסעים" title="שאלות שיש עליהן תשובה בשורה אחת">
        <div className="space-y-3">
          {quickAnswers.map((a) => (
            <Card key={a.slug} className="p-4">
              <p className="font-display text-[15px] font-bold">{a.title}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65">{a.quickAnswer}</p>
              <Link
                to="/knowledge/$slug"
                params={{ slug: a.slug }}
                className="mt-2 inline-block text-[13px] font-semibold text-saffron"
              >
                לפרטים ←
              </Link>
            </Card>
          ))}
        </div>
        <Link to="/knowledge" className="mt-4 inline-block text-[14px] font-semibold text-saffron">
          לכל התשובות ולתוכן על נפאל ←
        </Link>
      </Section>

      {/* ABOUT */}
      <Section kicker="מי אנחנו" title="מכירים אתכם כאן. מכירים את נפאל שם.">
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src={guidePortrait}
            alt="מדריך טרקים נפאלי מקומי בכפר הררי"
            loading="lazy"
            className="h-32 w-full shrink-0 rounded-xl object-cover sm:w-28"
          />
          <div>
            <p className="text-[15px] leading-relaxed text-ink/75">
              ״השביל הזה״ נולד מחיבור פשוט: מישהו כאן שמקשיב לכם, מבין מה אתם מחפשים ומלווה אתכם
              לאורך הדרך — וצוות מקומי ותיק בנפאל שמכיר את השבילים, המקומות והאנשים שמאחוריהם.
            </p>
            <Link to="/about" className="mt-3 inline-block text-[14px] font-semibold text-saffron">
              להכיר את האנשים שמאחורי השביל ←
            </Link>
          </div>
        </Card>
      </Section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 pt-2 pb-14">
        <div className="rounded-2xl bg-summit px-6 py-10 text-center">
          <h2 className="font-display text-[22px] font-bold text-parchment sm:text-2xl">
            בואו נדבר על השביל שלכם
          </h2>
          <p className="mx-auto mt-2 max-w-[40ch] text-[15px] leading-relaxed text-parchment/80">
            יש לכם כבר מסלול בראש? מצוין. יש לכם רק תחושה שהגיע הזמן לנסוע? גם מצוין. מכאן מתחילים.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row">
            <Link
              to="/contact"
              className="rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment"
            >
              בואו נדבר
            </Link>
            <WhatsappButton
              className="bg-parchment/15 text-parchment ring-parchment/30"
              label="כתבו לנו בוואטסאפ"
            />

          </div>
        </div>
      </section>

    </>
  );
}
