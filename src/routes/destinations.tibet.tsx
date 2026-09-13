import { createFileRoute, Link } from "@tanstack/react-router";

import { Card, PageHero, Section, TalkCta, WhatsappButton } from "@/components/page";
import tibetImg from "@/assets/destinations/tibet.jpg";

export const Route = createFileRoute("/destinations/tibet")({
  component: TibetPage,
  head: () => ({
    meta: [
      { title: "טיבט — יעד שנפתח אצלנו בקרוב | השביל הזה" },
      {
        name: "description",
        content:
          "טיבט היא גובה ומרחב: רמה פתוחה, אורות חדים ומנזרים. אנחנו בונים כרגע את התוכן המקצועי ליעד, ואפשר לדבר איתנו על טיול בטיבט.",
      },
      { property: "og:title", content: "טיבט — גובה, מרחב ואופק רחוק" },
      {
        property: "og:description",
        content: "יעד שאנחנו בונים כרגע, בלי הבטחות ובלי פרטים שלא אימתנו.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function TibetPage() {
  return (
    <>
      <PageHero
        kicker="טיבט"
        title="גובה, מרחב ואופק רחוק"
        lead="טיבט היא בעיקר רמה גבוהה ופתוחה: מרחקים גדולים, אור חד, מנזרים ואזורים שהתכנון אליהם שונה לגמרי מטרק בנפאל. זו נסיעה שדורשת היערכות, ובדיוק בגלל זה שווה לתכנן אותה עם מי שמכיר."
        image={tibetImg}
        imageAlt="אגם טורקיז ברמה הטיבטית עם דגלי תפילה ורכסים מושלגים באופק"
      />

      <Section title="למי זה יכול להתאים">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <p className="text-[15px] leading-relaxed text-ink/75">
              למי שנמשך למרחבים ריקים יותר מלשבילים ירוקים, ומוכן לטיול שבו הגובה מורגש כמעט כל הזמן.
            </p>
          </Card>
          <Card>
            <p className="text-[15px] leading-relaxed text-ink/75">
              למי שרוצה לשלב את טיבט עם נפאל למסע אחד, ולראות את אותו רכס משני צדדים.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="מה כבר אפשר לעשות">
        <Card>
          <p className="text-[15px] leading-relaxed text-ink/75">
            התוכן המקצועי לטיבט — מסלולים, עונות, נהלי כניסה והיתרים ומידע שימושי — בבנייה. לא נכתוב
            כאן פרטים לפני שנאמת אותם. אם טיבט מעניינת אתכם, בואו נדבר ונספר מה המצב בפועל.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <WhatsappButton
              className="bg-saffron px-5 py-3 text-center font-semibold text-parchment ring-0"
              label="לדבר איתנו על טיבט"
              message="היי, טיבט מעניינת אותי — אפשר לשמוע מה כבר סגור?"
            />
            <Link
              to="/nepal"
              className="rounded-xl bg-parchment px-5 py-3 text-center text-[14px] font-medium text-ink ring-1 ring-ink/10"
            >
              בינתיים — לגלות את נפאל
            </Link>
          </div>
        </Card>
      </Section>

      <TalkCta
        title="רוצים לשמוע כשטיבט נפתחת?"
        text="כתבו לנו מה מעניין אתכם, ונחזור אליכם עם מידע אמיתי ברגע שיהיה."
      />
    </>
  );
}
