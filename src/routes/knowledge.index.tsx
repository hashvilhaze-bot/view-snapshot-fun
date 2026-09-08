import { createFileRoute, Link } from "@tanstack/react-router";

import { Card, PageHero, QuickFacts, Section, TalkCta } from "@/components/page";
import { articles } from "@/lib/content";

export const Route = createFileRoute("/knowledge/")({
  component: KnowledgePage,
  head: () => ({
    meta: [
      { title: "לפני שנוסעים — תשובות קצרות ותוכן על נפאל | השביל הזה" },
      {
        name: "description",
        content:
          "קודם תשובה קצרה: מתי נוסעים, איך עובד הגובה, איפה ישנים ואיך משלמים. ואחר כך תוכן להעמקה — איך בוחרים טרק, איך נראה יום בשביל, ואוכל וחגים בנפאל.",
      },
      { property: "og:title", content: "לפני שנוסעים — תשובות קצרות ותוכן על נפאל" },
      {
        property: "og:description",
        content: "תשובה פשוטה קודם, העמקה אחר כך. בלי לקרוא מאמר בשביל שאלה אחת.",
      },
    ],
  }),
});

function KnowledgePage() {
  const quick = articles.filter((a) => a.quickAnswer);
  const deep = articles.filter((a) => a.depth);

  return (
    <>
      <PageHero
        kicker="לפני שנוסעים"
        title="קודם תשובה קצרה, ואחר כך אפשר להעמיק"
        lead="השאלות שחוזרות בכל שיחה ראשונה — עם תשובה בשורה אחת, ולינק למי שרוצה את הפרטים."
      />

      <Section kicker="נפאל בכמה רגעים" title="כרטיס הביקור של המדינה">
        <QuickFacts />
      </Section>

      <Section title="תשובות קצרות">
        <div className="space-y-3">
          {quick.map((a) => (
            <Card key={a.slug}>
              <p className="font-display text-[16px] font-bold">{a.title}</p>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink/70">{a.quickAnswer}</p>
              <Link
                to="/knowledge/$slug"
                params={{ slug: a.slug }}
                className="mt-3 inline-block text-[13px] font-semibold text-saffron"
              >
                לקרוא את הפרטים ←
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section kicker="להכיר את נפאל" title="תוכן לקרוא, גם בלי לתכנן טיול">
        <div className="grid gap-3 sm:grid-cols-2">
          {deep.map((a) => (
            <Link key={a.slug} to="/knowledge/$slug" params={{ slug: a.slug }}>
              <Card className="h-full transition-colors hover:border-saffron/40">
                <p className="text-[11px] font-medium text-saffron">{a.kicker}</p>
                <p className="mt-1 font-display text-lg font-bold">{a.title}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{a.summary}</p>
                <span className="mt-3 inline-block text-[13px] font-semibold text-saffron">
                  לקרוא ←
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <Card>
          <p className="text-[15px] leading-relaxed text-ink/75">
            רוצים לדעת איזה מסלול מתאים לכם לפני שנכנסים לפרטים?
          </p>
          <Link
            to="/match"
            className="mt-4 inline-block rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
          >
            מצאו את השביל שמתאים לכם
          </Link>
        </Card>
      </Section>

      <TalkCta />
    </>
  );
}
