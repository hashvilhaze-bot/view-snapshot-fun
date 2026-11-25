import { publicMeta } from "@/lib/public-meta";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Accordion, Card, PageHero, QuickFacts, Section } from "@/components/page";
import { articles, knowledgeCategories, type KnowledgeCategory } from "@/lib/content";
import { coverForArticle } from "@/lib/article-cover";

function readMinutes(body: string[]) {
  const words = body.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 180));
}

export const Route = createFileRoute("/knowledge/")({
  component: KnowledgePage,
  head: () =>
    publicMeta(
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
});

function KnowledgePage() {
  const [active, setActive] = useState<KnowledgeCategory | "all">("all");

  const quick = articles.filter((a) => a.quickAnswer);
  const shown = active === "all" ? articles : articles.filter((a) => a.category === active);
  const counts = knowledgeCategories.map((c) => ({
    c,
    n: articles.filter((a) => a.category === c).length,
  }));

  return (
    <>
      <PageHero
        kicker="מרכז ידע"
        title="מרכז הידע למטיילים בנפאל"
        lead="תשובות קצרות לשאלות שחוזרות בכל שיחה ראשונה, ולצידן מדריכים מלאים למי שרוצה להעמיק — גם בלי לתכנן טיול עדיין."
      />

      <Section
        kicker="נפאל בכמה רגעים"
        title="כרטיס הביקור של המדינה"
        className="!pt-4 !pb-3 sm:!pb-4"
      >
        <QuickFacts />
      </Section>

      {/* Short answers: long list, so it opens on demand. */}
      <Section title="תשובות קצרות" className="!py-4">
        <Accordion
          items={quick.map((a) => ({
            title: a.title,
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

      <Section kicker="לפי נושא" title="כל התוכן" className="!pt-4 !pb-12">
        <div className="-mx-1 flex flex-wrap gap-2 px-1">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={`rounded-full px-4 py-2 text-[0.8125rem] font-medium ring-1 ${
              active === "all"
                ? "bg-saffron text-parchment ring-saffron"
                : "bg-parchment/70 text-ink/75 ring-ink/10"
            }`}
          >
            הכול
          </button>
          {counts.map(({ c, n }) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              disabled={n === 0}
              className={`rounded-full px-4 py-2 text-[0.8125rem] font-medium ring-1 disabled:opacity-40 ${
                active === c
                  ? "bg-saffron text-parchment ring-saffron"
                  : "bg-parchment/70 text-ink/75 ring-ink/10"
              }`}
            >
              {c}
              {n > 0 && <span className="ms-1.5 text-[0.6875rem] opacity-60">{n}</span>}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {shown.map((a) => {
            const cover = coverForArticle(a.slug);
            return (
              <Link key={a.slug} to="/knowledge/$slug" params={{ slug: a.slug }}>
                <Card className="h-full overflow-hidden p-0 transition-colors hover:border-saffron/40">
                  {cover && (
                    <img
                      src={cover.src}
                      alt={cover.alt}
                      loading="lazy"
                      width={1200}
                      height={800}
                      className="aspect-[21/9] w-full object-cover sm:aspect-[16/9]"
                    />
                  )}
                  <div className="p-4 sm:p-5">
                    <p className="text-[0.6875rem] font-medium text-saffron">
                      {a.category} · {a.journal?.minutes ?? readMinutes(a.body)} דקות קריאה
                    </p>
                    <p className="mt-1 font-display text-[1.03125rem] font-bold sm:text-lg">
                      {a.title}
                    </p>
                    <p className="mt-1.5 text-[0.84375rem] leading-snug text-ink/75 sm:mt-2 sm:text-[0.875rem] sm:leading-relaxed">
                      {a.summary}
                    </p>
                    <span className="mt-3 inline-block text-[0.8125rem] font-semibold text-saffron">
                      {a.journal ? "לקריאת המאמר" : "לקריאת המדריך"} ←
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {shown.length === 0 && (
          <p className="mt-5 text-[0.875rem] text-ink/60">בנושא הזה עוד לא כתבנו מדריך.</p>
        )}
      </Section>
    </>
  );
}
