import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Card, PageHero, QuickFacts, Section, TalkCta } from "@/components/page";
import { articles, knowledgeCategories, type KnowledgeCategory } from "@/lib/content";
import { galleries } from "@/lib/galleries";

/** A photo from the site's own galleries that matches each guide's subject. */
const articleCover: Record<string, [string, number]> = {
  altitude: ["everest-base-camp", 2],
  "when-to-go": ["poon-hill", 0],
  "lodges-permits": ["annapurna-base-camp", 2],
  "gear-money": ["pokhara", 2],
  "choosing-trek": ["pokhara-hills", 0],
  "manaslu-vs-annapurna": ["manaslu-circuit", 1],
  "day-on-trail": ["villages", 2],
  "culture-food": ["kathmandu", 2],
};

function readMinutes(body: string[]) {
  const words = body.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 180));
}

export const Route = createFileRoute("/knowledge/")({
  component: KnowledgePage,
  head: () => ({
    meta: [
      { title: "מרכז ידע — נפאל, טרקים, תכנון ותרבות | השביל הזה" },
      {
        name: "description",
        content:
          "כל התוכן המקצועי במקום אחד: תשובות קצרות למתי נוסעים ואיך עובד הגובה, ולצידן מאמרים על בחירת טרק, יום בשביל, אוכל ותרבות בנפאל.",
      },
      { property: "og:title", content: "מרכז ידע — נפאל, טרקים, תכנון ותרבות" },
      {
        property: "og:description",
        content: "תשובה פשוטה קודם, העמקה אחר כך. תוכן שאפשר לקרוא גם בלי לתכנן טיול.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
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
                לקריאת המדריך ←
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section kicker="לפי נושא" title="כל התוכן">
        <div className="-mx-1 flex flex-wrap gap-2 px-1">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={`rounded-full px-4 py-2 text-[13px] font-medium ring-1 ${
              active === "all"
                ? "bg-saffron text-parchment ring-saffron"
                : "bg-parchment/70 text-ink/70 ring-ink/10"
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
              className={`rounded-full px-4 py-2 text-[13px] font-medium ring-1 disabled:opacity-40 ${
                active === c
                  ? "bg-saffron text-parchment ring-saffron"
                  : "bg-parchment/70 text-ink/70 ring-ink/10"
              }`}
            >
              {c}
              {n > 0 && <span className="ms-1.5 text-[11px] opacity-60">{n}</span>}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {shown.map((a) => {
            const ref = articleCover[a.slug];
            const cover = ref ? galleries[ref[0]]?.[ref[1]] : undefined;
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
                      className="aspect-[16/9] w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <p className="text-[11px] font-medium text-saffron">
                      {a.category} · {readMinutes(a.body)} דקות קריאה
                    </p>
                    <p className="mt-1 font-display text-lg font-bold">{a.title}</p>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{a.summary}</p>
                    <span className="mt-3 inline-block text-[13px] font-semibold text-saffron">
                      לקריאת המדריך ←
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {shown.length === 0 && (
          <p className="mt-5 text-[14px] text-ink/60">
            בנושא הזה עוד לא כתבנו מדריך. בינתיים אפשר לשאול אותנו ישירות.
          </p>
        )}
      </Section>

      <Section>
        <Card>
          <p className="text-[15px] leading-relaxed text-ink/75">
            רוצים לדעת איזה מסלול מתאים לכם, לפני שנכנסים לפרטים הקטנים?
          </p>
          <Link
            to="/match"
            className="mt-4 inline-block rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
          >
            בואו נמצא את השביל שלכם
          </Link>
        </Card>
      </Section>

      <TalkCta />
    </>
  );
}
