import { createFileRoute, Link } from "@tanstack/react-router";
import heroHimalaya from "@/assets/hero-himalaya.jpg";
import ohadPhotoAsset from "@/assets/ohad-coffee-portrait.jpg.asset.json";
import { ContactCtas } from "@/components/renewed/contact-ctas";
import { galleries } from "@/lib/galleries";
import { whatsappHref } from "@/lib/leads";
import { treks } from "@/lib/content";
import { HOME_FAQ, faqSchema } from "@/lib/treks/itineraries";
import { FaqList } from "@/components/renewed/faq";
import { homePhotos } from "@/lib/home-photos";
import { HomeHero } from "@/components/renewed/home-hero";

import { publicMeta } from "@/lib/public-meta";
import { heroPhotos } from "@/lib/home-hero-photos";

export const Route = createFileRoute("/")({
  head: () => ({
    ...publicMeta(
      "השביל הזה | טיולים אישיים וטרקים בנפאל",
      "תכנון טיול אישי בנפאל עם אוהד. מכירים את ההרים, את הכפרים ואת תשעת הטרקים, ובונים יחד דרך שמתאימה לכם.",
      "/",
      "website",
      heroPhotos[0].src,
    ),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqSchema(HOME_FAQ)) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: "השביל הזה",
          areaServed: "Nepal",
        }),
      },
    ],
  }),
  component: Home,
});

const STEPS: [string, string][] = [
  [
    "שיחה שמתחילה בכם",
    "מי נוסע, איך הקבוצה מורכבת, מה תרצו לראות, מה התקציב ואיזו רמת קושי מתאימה למשתתפים.",
  ],
  ["תוכנית מסודרת בעברית", "בונים לוח זמנים לטיול, עם זמן להליכות, לביקורים, למעברים ולמנוחה."],
  [
    "הכנה לקראת הנסיעה",
    "המלצות ציוד, טיפים מניסיון אישי והכוונה לגבי מה להביא מהארץ ומה אפשר לקנות בנפאל.",
  ],
  [
    "קשר עד החזרה",
    "החברה המקומית מארגנת ומבצעת בשטח. אני מלווה אתכם ומסייע בתיאום מולה לפי הצורך לאורך הטיול.",
  ],
];

function Home() {
  const mountains = galleries["manaslu-circuit"]?.[0];
  const alley = galleries["kathmandu"]?.[0];
  const lake = galleries["pokhara"]?.[0];
  const village = galleries["villages"]?.[0];
  const wa = whatsappHref();

  return (
    <>
      {/* HERO */}
      <HomeHero />

      {/* INTRO */}
      <section className="p-section">
        <div className="p-wrap grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <p className="p-kicker">קודם מכירים. אחר כך מתכננים.</p>
            <h2 className="p-h2 mt-3">מי נוסע איתכם, ומה חשוב לכם?</h2>
          </div>
          <div className="p-read space-y-4 p-muted">
            <p>
              בטיול קבוצתי יש כמה אנשים, ולכל אחד דברים אחרים שחשובים לו. אני מקשיב למה שתרצו לראות
              ולעשות, בודק איתכם את רמת הקושי והקצב, ומגבש תוכנית שמתאימה להרכב הקבוצה.
            </p>
            <p>
              יש לכם חופשה ארוכה בפסח, בראש השנה או במועד אחר? נתחיל מהזמן שעומד לרשותכם ומהתקציב,
              ונחשוב איך לשלב בו את המקומות והחוויות שמעניינים אתכם.
            </p>
            <a href="#process" className="p-link inline-block" style={{ color: "var(--p-ink)" }}>
              מה כולל התכנון והליווי ←
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="nepal" className="pb-12 md:pb-20" style={{ scrollMarginTop: 16 }}>
        <div className="p-wrap">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="p-kicker">טרקים, תרבות, כפרים וזמן מול האגם</p>
              <h2 className="p-h2 mt-2">יש הרבה דרכים לחוות את נפאל</h2>
            </div>
            <p className="p-muted max-w-[36ch] text-[16px]">
              נכיר את האפשרויות ונבחר מה מתאים. אפשר גם לשלב כמה כיוונים בטיול אחד.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-[1.3fr_1fr_1fr]">
            {mountains && (
              <Link to="/treks/$slug" params={{ slug: "manaslu-circuit" }} className="p-cat">
                <img src={mountains.src} alt={mountains.alt} loading="lazy" />
                <span className="p-cat-shade" />
                <span className="p-cat-body">
                  <span className="p-h3 block text-[26px]">ללכת אל ההרים</span>
                  <span className="mt-1 block text-[15px]">
                    הליכות קצרות וטרקים בהימלאיה · לדוגמה: סובב מנסלו
                  </span>
                </span>
              </Link>
            )}
            {alley && (
              <Link to="/experiences/$slug" params={{ slug: "kathmandu" }} className="p-cat">
                <img src={alley.src} alt={alley.alt} loading="lazy" />
                <span className="p-cat-shade" />
                <span className="p-cat-body">
                  <span className="p-h3 block text-[26px]">להכיר מקרוב</span>
                  <span className="mt-1 block text-[15px]">סמטאות, מקדשים וכפרים</span>
                </span>
              </Link>
            )}
            {lake && (
              <Link to="/experiences/$slug" params={{ slug: "pokhara" }} className="p-cat">
                <img src={lake.src} alt={lake.alt} loading="lazy" />
                <span className="p-cat-shade" />
                <span className="p-cat-body">
                  <span className="p-h3 block text-[26px]">לקחת את הזמן</span>
                  <span className="mt-1 block text-[15px]">אגם, נוף הרים וקצב רגוע</span>
                </span>
              </Link>
            )}
          </div>
          <nav aria-label="טרקים בנפאל" className="p-trek-links mt-7">
            {treks.map((t) => (
              <Link to="/treks/$slug" params={{ slug: t.slug }} key={t.slug}>
                {t.name}
              </Link>
            ))}
          </nav>
          <p className="mt-6 text-center">
            <Link to="/match" className="p-link" style={{ color: "var(--p-ink)" }}>
              עוד לא יודעים מה מתאים? עזרו לי למצוא כיוון ←
            </Link>
          </p>
        </div>
      </section>

      {/* OHAD */}
      <section className="p-section p-mist">
        <div className="p-wrap p-photo-pair">
          {homePhotos.slice(0, 2).map((p, i) => (
            <figure className="m-0" key={p.src}>
              <div className={i === 0 ? "p-depth-frame" : "p-photo-frame"}>
                <img
                  data-p-depth={i === 0 ? "" : undefined}
                  src={p.src}
                  srcSet={p.srcSet}
                  sizes="(max-width: 767px) calc(100vw - 40px), 640px"
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={800}
                />
              </div>
              <figcaption className="p-muted mt-3">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section id="about" className="p-mist" style={{ scrollMarginTop: 16 }}>
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="px-5 py-12 md:px-16 md:py-20">
            <div className="max-w-[560px]">
              <p className="p-kicker">נעים להכיר, אני אוהד</p>
              <h2 className="p-h2 mt-3">
                איתי מתכננים.
                <br />
                בנפאל יוצאים לדרך.
              </h2>
              <div className="mt-6 space-y-4 p-muted">
                <p>
                  הגעתי לנפאל אחרי הצבא, ונשארתי בה הרבה יותר ממה שתכננתי. היום אני מביא לתכנון
                  הטיול שלכם גם את ההיכרות שלי עם המקום וגם את תשומת הלב לאנשים שנוסעים.
                </p>
                <p>
                  כסוכן ומתכנן הטיול, אני מרכז את ההיכרות, בניית התוכנית וההכנה לנסיעה. במהלך הטיול
                  אני נשאר בקשר ומסייע בתיאום בין הקבוצה לחברה המקומית לפי הצורך, עד החזרה הביתה.
                </p>
              </div>
              <dl className="p-rule m-0 mt-8 grid gap-6 pt-6 sm:grid-cols-2">
                <div>
                  <dt className="p-kicker text-[13px]">אוהד הרץ</dt>
                  <dd className="m-0 mt-1 font-semibold">תכנון וקשר אישי</dd>
                  <dd className="m-0 p-muted text-[15px]">היכרות, הכנה ותיאום מול החברה המקומית</dd>
                </div>
                <div>
                  <dt className="p-kicker text-[13px]">סוכנות שלום בנפאל</dt>
                  <dd className="m-0 mt-1 font-semibold">ארגון וביצוע בשטח</dd>
                  <dd className="m-0 p-muted text-[15px]">הלינות, הנסיעות והשירותים שסוכמו</dd>
                </div>
              </dl>
              <Link
                to="/about"
                className="p-link mt-8 inline-block"
                style={{ color: "var(--p-ink)" }}
              >
                להכיר את האנשים שמאחורי השביל ←
              </Link>
            </div>
          </div>
          <div className="relative min-h-[420px]">
            <img
              src={ohadPhotoAsset.url}
              alt="אוהד בהפסקת קפה בשביל בנפאל, מחזיק שקית קפה"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="p-tag">אוהד הרץ · השביל הזה</span>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="p-section" style={{ scrollMarginTop: 16 }}>
        <div className="p-wrap">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="p-kicker">מהשיחה הראשונה ועד החזרה</p>
              <h2 className="p-h2 mt-2">מה מקבלים לאורך הדרך?</h2>
            </div>
            <p className="p-muted max-w-[34ch] text-[16px]">
              תכנון אישי, הכנה לנסיעה וקשר שממשיך גם במהלך הטיול.
            </p>
          </div>
          <ol className="mt-10 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="p-rule pt-5">
                <span className="text-[14px] font-semibold" style={{ color: "var(--p-cta)" }}>
                  0{i + 1}
                </span>
                <h3 className="p-h3 mt-2">{t}</h3>
                <p className="p-muted mt-2 text-[16px]">{d}</p>
              </li>
            ))}
          </ol>
          <div
            className="p-mist mt-10 grid gap-3 rounded-[6px] p-6 md:grid-cols-[auto_1fr] md:gap-10"
            style={{ borderInlineStart: "3px solid var(--p-accent)" }}
          >
            <p className="m-0 font-semibold">איך זה נראה בתכנון עצמו?</p>
            <p className="m-0 p-muted text-[16px]">
              אם בקבוצה יש העדפות שונות, נברר מי רוצה ללכת יותר ומי מעדיף זמן רגוע, כמה זמן להקדיש
              לכל מקום ואיך להכין את המעברים. את הבחירות האלה נתרגם לתוכנית ונתאם מול החברה המקומית.
            </p>
          </div>
        </div>
      </section>

      {/* EXAMPLE */}
      {village && (
        <section className="pb-12 md:pb-20">
          <div className="p-wrap grid items-center gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <p className="p-kicker">רעיון לטיול, כנקודת התחלה</p>
              <h2 className="p-h2 mt-3">
                קצת עיר.
                <br />
                קצת שבילים.
                <br />
                זמן פשוט להיות.
              </h2>
              <div className="mt-5 space-y-3 p-muted">
                <p>
                  להתחיל בסמטאות של קטמנדו, להמשיך להליכה בין כפרים ולסיים בכמה ימים מול האגם
                  בפוקרה.
                </p>
                <p>זה כיוון שאפשר לפתח יחד. את משך הטיול, ההליכות והסדר נתאים לעונה, לזמן ולכם.</p>
              </div>
              <p className="p-rule mt-6 pt-4 text-[15px]">קטמנדו ← כפרים ושבילים ← פוקרה</p>
            </div>
            <div className="relative">
              <img
                src={village.src}
                alt={village.alt}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-[6px] object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="pb-12 md:pb-20">
        <div className="p-wrap p-photo-pair p-photo-pair-reverse p-detail-pair">
          {homePhotos.slice(2).map((p) => (
            <figure className="m-0" key={p.src}>
              {p === homePhotos[3] ? (
                <div className="p-photo-story" data-p-photo-story>
                  <div className="p-story-wide" data-p-story-frame>
                    <img
                      src={p.src}
                      srcSet={p.srcSet}
                      sizes="(max-width: 767px) calc(100vw - 40px), 640px"
                      alt={p.alt}
                      loading="lazy"
                      decoding="async"
                      width={1200}
                      height={800}
                    />
                  </div>
                  <div className="p-story-details">
                    <div className="p-story-detail p-story-trail" data-p-story-frame>
                      <img
                        src={p.src}
                        alt="תקריב מתוך אותו צילום: מטיילים בשביל שבין הטרסות"
                        loading="lazy"
                        decoding="async"
                        width={960}
                        height={640}
                      />
                    </div>
                    <div className="p-story-detail p-story-bridge" data-p-story-frame>
                      <img
                        src={p.src}
                        alt="תקריב מתוך אותו צילום: גשר מעל הנחל ובתי הכפר על המדרון"
                        loading="lazy"
                        decoding="async"
                        width={960}
                        height={640}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={p.src}
                  srcSet={p.srcSet}
                  sizes="(max-width: 767px) calc(100vw - 40px), 640px"
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={800}
                />
              )}
              <figcaption className="p-muted mt-3">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section id="faq" className="p-section p-rule" style={{ scrollMarginTop: 16 }}>
        <div className="p-wrap grid gap-8 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div>
            <p className="p-kicker">לפני שמתחילים</p>
            <h2 className="p-h2 mt-3">מה חשוב לכם לדעת על הטיול?</h2>
            {wa && (
              <p className="p-muted mt-4 text-[16px]">
                יש שאלה נוספת?{" "}
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-link"
                  style={{ color: "var(--p-ink)" }}
                >
                  אפשר לשאול אותי
                </a>
              </p>
            )}
          </div>
          <div>
            <FaqList items={HOME_FAQ} />
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="p-band p-on-photo relative overflow-hidden">
        <img
          src={heroHimalaya}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="p-wrap relative py-16 text-center md:py-24">
          <p className="p-kicker">הצעד הראשון בתכנון</p>
          <h2 className="p-h2 mt-3">
            מה הייתם רוצים
            <br />
            לפגוש בנפאל?
          </h2>
          <p className="p-muted mx-auto mt-4 max-w-[44ch]">
            ספרו לי מי נוסע, מתי ומה חשוב לכם. משם נתחיל לבנות את הטיול שלכם.
          </p>
          <div className="mt-8 flex justify-center">
            <ContactCtas />
          </div>
        </div>
      </section>
    </>
  );
}
