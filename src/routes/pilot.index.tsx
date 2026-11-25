import { createFileRoute, Link } from "@tanstack/react-router";
import heroHimalaya from "@/assets/hero-himalaya.jpg";
import ohadPhotoAsset from "@/assets/ohad-coffee-home-tight.jpg.asset.json";
import shalomTeam from "@/assets/shalom-team.jpg";
import { PilotCtas } from "@/components/pilot/pilot-ctas";
import { galleries } from "@/lib/galleries";
import { treks } from "@/lib/content";
import { NEPAL_PARTNER_NAME, NEPAL_PARTNER_ROLE } from "@/lib/leads";

export const Route = createFileRoute("/pilot/")({
  head: () => ({
    meta: [
      { title: "פיילוט · דף הבית | השביל הזה" },
      { name: "description", content: "פיילוט עיצוב פנימי לדף הבית של השביל הזה." },
      { property: "og:title", content: "פיילוט · דף הבית | השביל הזה" },
      { property: "og:description", content: "פיילוט עיצוב פנימי לדף הבית." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PilotHome,
});

const CATEGORIES = [
  { label: "הרים ושבילים", photo: galleries["manaslu-circuit"]?.[0], to: true },
  { label: "תרבות ואנשים", photo: galleries["kathmandu"]?.[0], to: false },
  { label: "טבע ומנוחה", photo: galleries["chitwan"]?.[0], to: false },
];

// Same steps as the existing About page.
const STEPS: [string, string][] = [
  ["מכירים ומקשיבים", "שיחה שבה מבינים מה אתם מחפשים, כמה זמן יש, מי נוסע, מה מעניין אתכם ומה הניסיון שלכם."],
  ["בוחנים את האפשרויות", "מציגים כמה כיוונים שיכולים באמת להתאים ומסבירים את ההבדלים, בלי להציף בעשרות מסלולים."],
  ["בונים את הטיול", "מתאימים את המסלול, הקצב, מספר הימים, הלינה, ההתאקלמות, התחבורה והחוויות סביב הדרך."],
  ["סוגרים את הפרטים", "אחרי אישור המסלול מטפלים בתיאומים ובהזמנות הרלוונטיים, ומכינים אתכם ליציאה בצורה מסודרת."],
  ["מלווים גם בנפאל", "בזמן הטיול יש לכם כתובת לשאלות ולשינויים, וצוות מקומי מנוסה שיכול לפעול בשטח."],
];

function PilotHome() {
  const manaslu = treks.find((t) => t.slug === "manaslu-circuit")!;
  const manasluPhoto = galleries["manaslu-circuit"]?.[3];
  return (
    <>
      <section className="p-on-photo relative flex min-h-[78svh] items-end overflow-hidden">
        <img
          src={heroHimalaya}
          alt="רכס מושלג בהימלאיה בנפאל באור ראשון, עם ערפל שממלא את העמקים"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="p-hero-shade absolute inset-0" />
        <div className="p-wrap relative w-full pb-12 pt-32 md:pb-20" style={{ color: "#fff" }}>
          <p className="p-kicker" style={{ color: "#F1B98E" }}>השביל הזה · נפאל</p>
          <h1 className="p-h1 mt-3 max-w-[14ch]">הטיול שלכם לנפאל מתחיל בהיכרות איתכם</h1>
          <p className="p-lead mt-5 max-w-[46ch]">
            הטיול נבנה סביב מי שנוסע: הזמן שיש לכם, הקצב שנוח לכם והדברים שמעניינים אתכם. לא בוחרים
            מסלול מהמדף ומתאימים אליו את עצמכם.
          </p>
          <div className="mt-8">
            <PilotCtas />
          </div>
        </div>
      </section>

      <section className="p-section">
        <div className="p-wrap">
          <p className="p-kicker">נפאל</p>
          <h2 className="p-h2 mt-2">נפאל היא לא טרק אחד ולא סוג טיול אחד</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {CATEGORIES.map((c) =>
              c.photo ? (
                <figure key={c.label} className="p-card m-0">
                  <img src={c.photo.src} alt={c.photo.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <figcaption className="p-h3 px-5 py-4">{c.label}</figcaption>
                </figure>
              ) : null,
            )}
          </div>
          <div className="p-mist mt-8 flex flex-col gap-3 rounded-[10px] p-6 md:flex-row md:items-center md:justify-between">
            <p className="m-0 font-semibold">עוד לא בטוחים מה מתאים לכם?</p>
            <Link to="/match" className="p-link">עזרו לי למצוא כיוון</Link>
          </div>
        </div>
      </section>

      <section className="p-section p-mist">
        <div className="p-wrap grid items-center gap-8 md:grid-cols-2">
          {manasluPhoto && (
            <img src={manasluPhoto.src} alt={manasluPhoto.alt} loading="lazy" className="aspect-[4/3] w-full rounded-[10px] object-cover" />
          )}
          <div>
            <p className="p-kicker">מסלול לדוגמה</p>
            <h2 className="p-h2 mt-2">{manaslu.name}</h2>
            <p className="p-lead mt-4">{manaslu.teaser}</p>
            <p className="p-muted mt-3">{manaslu.days} · {manaslu.effortLabel} · {manaslu.altitude}</p>
            <Link to="/pilot/treks/$slug" params={{ slug: manaslu.slug }} className="p-btn p-btn-ghost mt-6">
              לעמוד המסלול
            </Link>
          </div>
        </div>
      </section>

      <section className="p-section p-band">
        <div className="p-wrap">
          <p className="p-kicker">מי אנחנו</p>
          <h2 className="p-h2 mt-2">מכירים אתכם כאן. מכירים את נפאל שם.</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <img src={ohadPhotoAsset.url} alt="אוהד בהפסקת קפה בשביל בנפאל" loading="lazy" className="aspect-[4/3] w-full rounded-[10px] object-cover" />
              <div className="mt-5 space-y-3">
                <p>אני אוהד, מרמות מנשה. בנפאל התאהבתי — בנופים, בתרבות ובאנשים. מאז נפאל בליבי.</p>
                <p className="p-muted">
                  אני לא מוכר מסלולים מהמדף. כל טיול נבנה בשיחה, כי מה שמתאים לאחד לא מתאים לאחר — ולכן
                  חשוב שיהיה לכם עם מי לדבר גם לפני, וגם כשאתם שם.
                </p>
              </div>
            </div>
            <div>
              <img src={shalomTeam} alt="צוות סוכנות שלום במשרד בתאמל, קטמנדו" loading="lazy" className="aspect-[4/3] w-full rounded-[10px] object-cover" />
              <div className="mt-5 space-y-3">
                <p className="font-semibold">הצוות המקומי בנפאל</p>
                <p className="p-muted">{NEPAL_PARTNER_NAME} — {NEPAL_PARTNER_ROLE}. ההפעלה בשטח נעשית עם הצוות המקומי.</p>
                <Link to="/about" className="p-link">להכיר את האנשים שמאחורי השביל</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="p-section">
        <div className="p-wrap">
          <p className="p-kicker">איך זה עובד</p>
          <h2 className="p-h2 mt-2">מהשיחה הראשונה ועד החזרה</h2>
          <ol className="mt-8 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="p-card p-6">
                <span className="text-[15px] font-black" style={{ color: "var(--p-cta)" }}>0{i + 1}</span>
                <h3 className="p-h3 mt-2">{t}</h3>
                <p className="p-muted mt-2 text-[16px]">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
