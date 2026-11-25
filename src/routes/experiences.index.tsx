import { publicMeta } from "@/lib/public-meta";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Card, PageHero, Section } from "@/components/page";
import { experiencesByCategory } from "@/lib/catalog";
import { experiences } from "@/lib/content";
import { galleries } from "@/lib/galleries";

export const Route = createFileRoute("/experiences/")({
  component: ExperiencesPage,
  head: () => publicMeta(
    "חוויות בנפאל — ערים, כפרים, יוגה, נהרות וג׳ונגל | השביל הזה",
    "נפאל שמעבר לטרקים: קטמנדו ופוקרה, כפרים וטרסות, יוגה ומנוחה, רפטינג וצ׳יטוואן. כל אחת מהחוויות עומדת בזכות עצמה, וגם משתלבת לצד מסלול הליכה.",
    "/experiences", "website", galleries["kathmandu"]?.[0]?.src,
    { title: "חוויות בנפאל — מעבר לטרקים", description: "ערים ותרבות, כפרים ואנשים, טבע רגוע ויוגה, מים ואדרנלין, טבע וחיות." },
  ),
});

function ExperiencesPage() {
  const groups = experiencesByCategory();
  const bySlug = new Map(experiences.map((e) => [e.slug, e]));

  return (
    <>
      <PageHero
        kicker="חוויות"
        title="נפאל שמעבר לטרקים"
        lead="ערים ותרבות, כפרים, יוגה ומנוחה, נהרות וג׳ונגל. כל אחת מהחוויות עומדת בזכות עצמה, וכולן משתלבות גם לצד מסלול הליכה."
      />

      {groups.map((g) => (
        <Section key={g.category} title={g.category} className="py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {g.items.map((item) => {
              const full = bySlug.get(item.slug);
              const cover = galleries[item.slug]?.[0];
              return (
                <Link key={item.slug} to="/experiences/$slug" params={{ slug: item.slug }}>
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
                    <div className="p-4">
                      <p className="text-[0.6875rem] font-medium text-saffron">{item.meta}</p>
                      <p className="mt-1 font-display text-[1.0625rem] font-bold">{item.name}</p>
                      <p className="mt-1.5 text-[0.84375rem] leading-relaxed text-ink/70">
                        {item.teaser}
                      </p>
                      {full?.combine && (
                        <p className="mt-2 text-[0.78125rem] leading-relaxed text-ink/65">
                          {full.combine}
                        </p>
                      )}
                      <span className="mt-3 inline-block text-[0.8125rem] font-semibold text-saffron">
                        פרטים ←
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Section>
      ))}

      <Section className="pt-2 pb-12">
        <Card className="text-center">
          <p className="font-display text-[1.125rem] font-bold">לא בטוחים מה מתאים לכם?</p>
          <p className="mx-auto mt-2 max-w-[42ch] text-[0.875rem] leading-relaxed text-ink/70">
            כמה שאלות קצרות, ואז נציע לכם כמה כיוונים מתוך הטרקים והחוויות שלנו.
          </p>
          <Link
            to="/match"
            className="mt-4 inline-block rounded-xl bg-saffron px-6 py-3.5 text-[0.9375rem] font-semibold text-parchment"
          >
            בואו נמצא את השביל שלכם
          </Link>
        </Card>
      </Section>
    </>
  );
}
