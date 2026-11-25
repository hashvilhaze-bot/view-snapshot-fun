import { publicMeta } from "@/lib/public-meta";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Accordion, PageHero, QuickFacts, Section } from "@/components/page";
import { articles, knowledgeCategories, type KnowledgeCategory } from "@/lib/content";
import { ArticleCard } from "@/components/archive-cards";
import { MatchLink } from "@/components/content-navigation";
import { journalPhotos } from "@/lib/journal/photos";
import { collectionData, structuredData } from "@/lib/navigation-meta";
import { faqSchema } from "@/lib/treks/itineraries";

const quickTitles: Record<string, string> = {
  altitude: "איך מתכננים התאקלמות בגובה?",
  "when-to-go": "מתי כדאי לטייל בנפאל?",
  "lodges-permits": "איפה ישנים ואילו היתרים נדרשים?",
  "gear-money": "איזה ציוד ואמצעי תשלום כדאי לקחת?",
};
const quick = articles.filter((a) => a.quickAnswer);
export const Route = createFileRoute("/knowledge/")({
  component: KnowledgePage,
  head: () => ({
    ...publicMeta(
      "מרכז ידע — נפאל, טרקים, תכנון ותרבות | השביל הזה",
      "כל התוכן המקצועי במקום אחד: תשובות קצרות למתי נוסעים ואיך עובד הגובה, ולצידן מאמרים על בחירת טרק, יום בשביל, אוכל ותרבות בנפאל.",
      "/knowledge",
      "website",
      undefined,
      {
        title: "מרכז ידע — נפאל, טרקים, תכנון ותרבות",
        description: "תשובה פשוטה קודם, העמקה אחר כך. תוכן שאפשר לקרוא גם בלי לתכנן טיול.",
      },
    ),
    scripts: [
      collectionData(
        "knowledge",
        articles.map((a) => ({ name: a.title, slug: a.slug })),
      ),
      structuredData(
        faqSchema(
          quick.map((a) => ({ question: quickTitles[a.slug] ?? a.title, answer: a.quickAnswer! })),
        ),
      ),
    ],
  }),
});

function KnowledgePage() {
  const [active, setActive] = useState<KnowledgeCategory | "all">("all");

  const shown = active === "all" ? articles : articles.filter((a) => a.category === active);
  const counts = knowledgeCategories.map((c) => ({
    c,
    n: articles.filter((a) => a.category === c).length,
  }));

  return (
    <>
      <PageHero
        kicker="השביל הזה · מרכז הידע"
        image={journalPhotos.stupa.src}
        imageAlt={journalPhotos.stupa.alt}
        actions={<MatchLink />}
        title="מרכז הידע למטיילים בנפאל"
        lead="מתי כדאי לנסוע, איך בוחרים טרק ומה מחכה מעבר להרים? כאן תמצאו מדריכים לתכנון הטיול וכתבות על האנשים, התרבות והשבילים של נפאל."
      />

      <Section kicker="לפי נושא" title="מדריכים וכתבות" className="!pt-4 !pb-12">
        <div className="hub-filters" role="group" aria-label="סינון מאמרים לפי נושא">
          <button type="button" aria-pressed={active === "all"} onClick={() => setActive("all")}>
            הכול
          </button>
          {counts
            .filter(({ n }) => n > 0)
            .map(({ c, n }) => (
              <button
                key={c}
                type="button"
                aria-pressed={active === c}
                onClick={() => setActive(c)}
              >
                {c} <span>({n})</span>
              </button>
            ))}
        </div>
        <div className="archive-grid hub-grid">
          {shown.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
        {shown.length === 0 && (
          <p className="mt-5 text-[0.875rem] text-ink/60">בנושא הזה עוד לא כתבנו מדריך.</p>
        )}
      </Section>
      <Section
        kicker="נפאל בכמה רגעים"
        title="כרטיס הביקור של המדינה"
        className="!pt-4 !pb-3 sm:!pb-4"
      >
        <QuickFacts />
      </Section>

      {/* Short answers: long list, so it opens on demand. */}
      <Section title="תשובות קצרות" className="hub-faq">
        <Accordion
          items={quick.map((a) => ({
            title: quickTitles[a.slug] ?? a.title,
            content: (
              <>
                <p>{a.quickAnswer}</p>
                <Link
                  to="/knowledge/$slug"
                  params={{ slug: a.slug }}
                  className="mt-2.5 inline-block text-[0.8125rem] font-semibold text-saffron"
                >
                  לקריאת המדריך ←
                </Link>
              </>
            ),
          }))}
        />
      </Section>
    </>
  );
}
