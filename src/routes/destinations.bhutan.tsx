import { createFileRoute, Link } from "@tanstack/react-router";

import { Card, PageHero, Section, WhatsappButton } from "@/components/page";
import bhutanImg from "@/assets/destinations/bhutan.jpg";

export const Route = createFileRoute("/destinations/bhutan")({
  component: BhutanPage,
  head: () => ({
    meta: [
      { title: "בהוטן — יעד שנפתח אצלנו בקרוב | השביל הזה" },
      {
        name: "description",
        content:
          "בהוטן היא חוויה שקטה ומסודרת בהימלאיה המזרחית, שונה מאוד מנפאל. אנחנו בונים כרגע את התוכן המקצועי ליעד, ואפשר לדבר איתנו על טיול בבהוטן.",
      },
      { property: "og:title", content: "בהוטן — הימלאיה בקצב אחר" },
      {
        property: "og:description",
        content: "יעד שאנחנו בונים כרגע, בלי הבטחות ובלי פרטים שלא אימתנו.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function BhutanPage() {
  return (
    <>
      <PageHero
        kicker="בהוטן"
        title="הימלאיה בקצב אחר"
        lead="בהוטן היא מדינה קטנה בהימלאיה המזרחית, שקטה ומסודרת, עם נוכחות בודהיסטית חזקה ומספר מבקרים מוגבל. מי שמגיע לשם מחפש בדרך כלל משהו אחר ממי שהולך לטרק ארוך בנפאל."
        image={bhutanImg}
        imageAlt="מנזר בהוטני לבן על רכס מיוער מעל עמק אפוף ערפל"
      />

      <Section title="למי זה יכול להתאים">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <p className="text-[15px] leading-relaxed text-ink/75">
              למי שרוצה הימלאיה בלי מאמץ פיזי גדול, עם נופים, מנזרים ותרבות — ובלי ימים ארוכים של
              עלייה בגובה.
            </p>
          </Card>
          <Card>
            <p className="text-[15px] leading-relaxed text-ink/75">
              למי שכבר היה בנפאל ורוצה לראות פנים אחרות של אותו אזור, או לשלב בין השתיים באותו מסע.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="מה כבר אפשר לעשות">
        <Card>
          <p className="text-[15px] leading-relaxed text-ink/75">
            אנחנו בונים כרגע את התוכן המקצועי לבהוטן: מסלולים, עונות, נהלי כניסה ומידע שימושי. עד
            שהמידע יהיה מאומת לא נכתוב אותו כאן. בינתיים, אם בהוטן מעניינת אתכם, הדרך הטובה היא
            שיחה — נספר מה כבר סגור ומה עוד בבנייה.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <WhatsappButton
              className="bg-saffron px-5 py-3 text-center font-semibold text-parchment ring-0"
              label="לדבר איתנו על בהוטן"
              message="היי, בהוטן מעניינת אותי — אפשר לשמוע מה כבר סגור?"
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

    </>
  );
}
