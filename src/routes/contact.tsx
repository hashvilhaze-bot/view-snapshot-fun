import { createFileRoute, Link } from "@tanstack/react-router";

import { Card, PageHero, Section } from "@/components/page";
import { CONTACT_PLACEHOLDER } from "@/lib/content";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "דברו איתנו — בואו נבנה את הטיול שלכם | השביל הזה" },
      {
        name: "description",
        content:
          "שיחה אחת בלי התחייבות, גם אם עדיין אין מסלול בראש. מכאן מתחילים לבנות טיול אישי בנפאל.",
      },
      { property: "og:title", content: "דברו איתנו — בואו נבנה את הטיול שלכם" },
      { property: "og:description", content: "מתחילים בשיחה, לא בקטלוג." },
    ],
  }),
});

const steps = [
  { n: "01", t: "שיחה ראשונה", d: "כמה זמן יש, מה מסקרן ומה בכלל לא מתאים." },
  { n: "02", t: "כמה כיוונים", d: "שתיים־שלוש אפשרויות שונות באופי, עם ההבדלים ביניהן." },
  { n: "03", t: "בונים לפרטים", d: "ימי התאקלמות, לינה, מדריך, היתרים וטיסות פנים." },
  { n: "04", t: "ליווי גם בשטח", d: "הצוות המקומי נמצא ביעד, ואפשר לשנות תוכנית בזמן אמת." },
];

function ContactPage() {
  return (
    <>
      <PageHero
        kicker="דברו איתנו"
        title="מתחילים מכאן"
        lead="שיחה אחת, בלי התחייבות. גם אם אין לכם עדיין מסלול בראש, אלא רק תחושה שנפאל מסקרנת."
      />

      <Section>
        <Card>
          <p className="text-[13px] text-ink/55">דרכי יצירת קשר</p>
          <p className="mt-2 font-display text-lg font-bold">{CONTACT_PLACEHOLDER}</p>
          <p className="mt-3 text-[14px] leading-relaxed text-ink/70">
            נשמח לשמוע מתי בערך אתם חושבים לצאת, כמה ימים יש לכם, ומה מסקרן אותכם בנפאל.
          </p>
        </Card>
      </Section>

      <Section title="איך אנחנו עובדים">
        <ol className="space-y-4">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span className="font-display text-lg leading-none font-bold text-saffron">
                {s.n}
              </span>
              <div>
                <p className="text-[15px] font-semibold">{s.t}</p>
                <p className="text-[14px] leading-relaxed text-ink/70">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="לא בטוחים מה לבקש?">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/match">
            <Card className="h-full p-4">
              <p className="font-display font-bold">מה מתאים לי?</p>
              <p className="mt-1 text-[13px] text-ink/60">כמה בחירות ומקבלים כיוונים</p>
            </Card>
          </Link>
          <Link to="/knowledge">
            <Card className="h-full p-4">
              <p className="font-display font-bold">לפני שנוסעים</p>
              <p className="mt-1 text-[13px] text-ink/60">גובה, עונות, לינה וציוד</p>
            </Card>
          </Link>
        </div>
      </Section>
    </>
  );
}
