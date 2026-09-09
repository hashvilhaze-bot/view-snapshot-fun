import { createFileRoute, Link } from "@tanstack/react-router";

import guidePortrait from "@/assets/guide-portrait.jpg";
import { Card, PageHero, Section, TalkCta } from "@/components/page";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "מי אנחנו — השביל הזה" },
      {
        name: "description",
        content:
          "תכנון בעברית מול מי שהלך בשבילים האלה, והפעלה בשטח עם צוות נפאלי קבוע: מדריכים מוסמכים, פורטרים מבוטחים ואיש קשר בקטמנדו.",
      },
      { property: "og:title", content: "מי אנחנו — השביל הזה" },
      { property: "og:description", content: "האנשים והיכולת המקומית שמאחורי הטיולים." },
    ],
  }),
});

const sides = [
  {
    t: "הצד הישראלי",
    d: "התכנון, השיחות והליווי לפני הטיול נעשים בעברית, מול מי שהלך בעצמו בשבילים האלה — כולל השאלות הקטנות שצצות שבוע לפני הטיסה.",
    note: "[להשלמה: שם ורקע]",
  },
  {
    t: "הצד הנפאלי",
    d: "ההפעלה בשטח נעשית עם שותף מקומי שמפעיל טרקים ומסעות נהר מקטמנדו משנת 2010: מדריכים מוסמכים שגדלו באזורים שאליהם הולכים, פורטרים מבוטחים, ואיש קשר בקטמנדו שזמין לאורך הטיול.",
    note: "[להשלמה: שם השותף המקומי והרקע שלו]",
  },
  {
    t: "איך זה עובד יחד",
    d: "אתם מדברים עם אדם אחד לכל אורך הדרך, גם כשהתוכנית משתנה באמצע הטיול. מי שנמצא בשטח יודע מה הובטח לכם, ומי שתכנן איתכם יודע מה קורה שם עכשיו.",
  },
];

const steps = [
  ["01", "שיחה ראשונה", "כמה זמן יש, מה מסקרן ומה בכלל לא מתאים."],
  ["02", "כמה כיוונים", "שתיים־שלוש אפשרויות שונות באופי, עם ההבדלים ביניהן."],
  ["03", "בונים לפרטים", "ימי התאקלמות, לינה, מדריך, היתרים וטיסות פנים."],
  ["04", "יוצאים לדרך", "הצוות המקומי ביעד, ואפשר לשנות תוכנית בזמן אמת."],
];

function AboutPage() {
  return (
    <>
      <PageHero
        kicker="מי אנחנו"
        title="שני צדדים לאותו שביל"
        lead="תכנון בעברית מול מי שהלך שם, והפעלה עם צוות נפאלי קבוע ביעד."
      />

      <Section>
        <div className="flex flex-col gap-5 sm:flex-row">
          <img
            src={guidePortrait}
            alt="מדריך טרקים נפאלי בכפר הררי"
            loading="lazy"
            className="h-40 w-32 shrink-0 rounded-xl object-cover"
          />
          <div className="space-y-3 text-[15px] leading-relaxed text-ink/75">
            <p>
              אנחנו לא מוכרים מסלולים מהמדף. כל טיול נבנה בשיחה, ולכן חשוב שיהיה לכם עם מי לדבר —
              גם לפני, וגם כשאתם שם.
            </p>
            <p>זה גם מה שמאפשר לשנות תוכנית באמצע הדרך, ולא רק להיצמד למה שנקבע מראש.</p>
          </div>
        </div>
      </Section>

      <Section title="האנשים">
        <div className="grid gap-3 sm:grid-cols-3">
          {sides.map((s) => (
            <Card key={s.t} className="h-full">
              <p className="font-display text-[16px] font-bold">{s.t}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{s.d}</p>
              {s.note && <p className="mt-2 text-[12px] text-ink/45">{s.note}</p>}
            </Card>
          ))}
        </div>
      </Section>

      <Section title="מהשיחה הראשונה ועד היציאה לדרך">
        <ol className="space-y-4">
          {steps.map(([n, t, d]) => (
            <li key={n} className="flex gap-4">
              <span className="font-display text-lg leading-none font-bold text-saffron">{n}</span>
              <div>
                <p className="text-[15px] font-semibold">{t}</p>
                <p className="text-[14px] leading-relaxed text-ink/70">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="להמשיך">
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/treks">
            <Card className="h-full p-4">
              <p className="font-display font-bold">טרקים ולא רק</p>
            </Card>
          </Link>
          <Link to="/knowledge">
            <Card className="h-full p-4">
              <p className="font-display font-bold">לפני שנוסעים</p>
            </Card>
          </Link>
          <Link to="/match">
            <Card className="h-full p-4">
              <p className="font-display font-bold">מה מתאים לי?</p>
            </Card>
          </Link>
        </div>
      </Section>

      <TalkCta />
    </>
  );
}
