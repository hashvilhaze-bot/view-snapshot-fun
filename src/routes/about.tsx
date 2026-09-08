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
          "תכנון בעברית מול מי שהלך בשבילים האלה, והפעלה בשטח עם צוות נפאלי קבוע: מדריכים מוסמכים, פורטרים מבוטחים ואיש קשר בקתמנדו.",
      },
      { property: "og:title", content: "מי אנחנו — השביל הזה" },
      { property: "og:description", content: "האנשים והיכולת המקומית שמאחורי הטיולים." },
    ],
  }),
});

function AboutPage() {
  return (
    <>
      <PageHero
        kicker="מי אנחנו"
        title="האנשים והיכולת המקומית"
        lead="תכנון בעברית, הפעלה עם צוות נפאלי קבוע ביעד."
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
              התכנון נעשה בעברית, מול מי שהלך בעצמו בשבילים האלה. ההפעלה בשטח נעשית עם צוות נפאלי
              קבוע: מדריכים מוסמכים שגדלו באזורים שאליהם אנחנו הולכים, פורטרים מבוטחים, ואיש קשר
              בקתמנדו שזמין לאורך כל הטיול.
            </p>
            <p>
              זה מה שמאפשר לשנות תוכנית באמצע הדרך, ולא רק להיצמד למה שנקבע מראש.
            </p>
            <p className="text-ink/50">[להשלמה: שמות אנשי הצוות והרקע שלהם]</p>
          </div>
        </div>
      </Section>

      <Section title="להמשיך">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link to="/treks">
            <Card className="h-full p-4">
              <p className="font-display font-bold">טרקים וחוויות</p>
            </Card>
          </Link>
          <Link to="/knowledge">
            <Card className="h-full p-4">
              <p className="font-display font-bold">לפני שנוסעים</p>
            </Card>
          </Link>
        </div>
      </Section>

      <TalkCta />
    </>
  );
}
