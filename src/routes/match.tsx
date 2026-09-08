import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Card, PageHero, Section } from "@/components/page";
import { experiences, treks } from "@/lib/content";
import { galleries } from "@/lib/galleries";

export const Route = createFileRoute("/match")({
  component: MatchPage,
  head: () => ({
    meta: [
      { title: "מה מתאים לי? — כלי התאמה לטיול בנפאל | השביל הזה" },
      {
        name: "description",
        content:
          "שש שאלות קצרות — זמן, ניסיון, מאמץ, נוחות ועם מי נוסעים — ומקבלים שניים־שלושה כיוונים אפשריים לטיול בנפאל, עם הסבר למה.",
      },
      { property: "og:title", content: "מה מתאים לי? — כלי התאמה לטיול בנפאל" },
      { property: "og:description", content: "כיוונים, לא קטלוג. נקודת פתיחה לשיחה." },
    ],
  }),
});

const groups = [
  { key: "time", label: "כמה זמן יש לכם", options: ["עד שבוע", "שבועיים", "שלושה שבועות ויותר"] },
  {
    key: "experience",
    label: "ניסיון קודם בטרקים",
    options: ["אין כמעט", "כמה ימי הליכה", "טרקים ארוכים"],
  },
  { key: "effort", label: "רמת מאמץ שנוחה לכם", options: ["רגוע", "מאוזן", "מאתגר"] },
  {
    key: "interest",
    label: "מה מעניין אתכם יותר",
    options: ["ההרים עצמם", "אנשים ותרבות", "גם וגם"],
  },
  {
    key: "comfort",
    label: "רמת נוחות",
    options: ["חשוב לי מיטה נוחה", "בסדר עם פשוט", "לא אכפת לי בכלל"],
  },
  { key: "company", label: "עם מי נוסעים", options: ["לבד", "בזוג", "עם חברים", "עם משפחה"] },
] as const;

function MatchPage() {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);

  const answered = Object.keys(picked).length;

  const results = (() => {
    const wantsHigh = picked["effort"] === "מאתגר" || picked["experience"] === "טרקים ארוכים";
    const wantsLow = picked["effort"] === "רגוע" || picked["experience"] === "אין כמעט";
    const shortTime = picked["time"] === "עד שבוע";
    const longTime = picked["time"] === "שלושה שבועות ויותר";
    const culture = picked["interest"] === "אנשים ותרבות";
    const both = picked["interest"] === "גם וגם";
    const needsComfort = picked["comfort"] === "חשוב לי מיטה נוחה";
    const family = picked["company"] === "עם משפחה";

    return treks
      .map((t) => {
        let score = 0;
        const reasons: string[] = [];

        if (wantsHigh) {
          score += t.effort;
          if (t.effort === 3) reasons.push("אמרתם מאמץ גבוה — וזה מסלול עם גובה וימים ארוכים.");
        }
        if (wantsLow) {
          score += 4 - t.effort;
          if (t.effort === 1) reasons.push("אמרתם קצב רגוע — כאן הגבהים נמוכים והימים קצרים.");
        }
        if (shortTime) {
          score += t.effort === 1 ? 3 : t.effort === 2 ? 1 : -2;
          if (t.effort === 1) reasons.push("נכנס בנוחות לשבוע, כולל טיסות וימי חסד.");
          if (t.effort === 3) reasons.push("בשבוע אחד זה לא ריאלי — צריך יותר ימים.");
        }
        if (longTime) {
          score += t.effort === 3 ? 2 : 0;
          if (t.effort === 3) reasons.push("עם שלושה שבועות אפשר לעשות אותו בקצב נכון.");
        }
        if (culture || both) {
          score += t.effort === 1 ? 2 : 1;
          reasons.push("בדרך יש כפרים ואנשים, לא רק נוף.");
        }
        if (needsComfort) {
          score += t.effort === 3 ? -2 : 1;
          if (t.effort === 3) reasons.push("הלינה כאן בסיסית — כדאי לקחת את זה בחשבון.");
        }
        if (family) {
          score += t.effort === 1 ? 2 : t.effort === 2 ? 0 : -2;
          if (t.effort === 1) reasons.push("עובד טוב גם עם ילדים גדולים.");
        }

        return { t, score, reasons: reasons.slice(0, 2) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
  })();

  const extras = (() => {
    const slugs =
      picked["interest"] === "ההרים עצמם"
        ? ["pokhara", "yoga-rest"]
        : picked["comfort"] === "חשוב לי מיטה נוחה"
          ? ["kathmandu", "pokhara"]
          : ["kathmandu", "villages"];
    return experiences.filter((e) => slugs.includes(e.slug));
  })();

  return (
    <>
      <PageHero
        kicker="מה מתאים לי?"
        title="שש שאלות, ואז נדבר"
        lead="זה לא מחשבון ולא תשובה מוחלטת. הרעיון הוא לצמצם לשניים־שלושה כיוונים שכדאי להסתכל עליהם — ולהסביר למה."
      />

      <Section>
        <div className="space-y-5">
          {groups.map((g) => (
            <div key={g.key}>
              <p className="mb-2 text-[13px] font-medium text-ink/60">{g.label}</p>
              <div className="flex flex-wrap gap-2">
                {g.options.map((o) => {
                  const active = picked[g.key] === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => {
                        setPicked((p) => ({ ...p, [g.key]: o }));
                        setShow(false);
                      }}
                      className={`rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors ${
                        active
                          ? "bg-saffron text-parchment"
                          : "bg-parchment text-ink ring-1 ring-ink/10"
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={answered === 0}
          onClick={() => setShow(true)}
          className="mt-7 w-full rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment disabled:opacity-40 sm:w-auto"
        >
          להראות כיוונים
        </button>
      </Section>

      {show && (
        <Section title="כיוונים אפשריים">
          <div className="space-y-3">
            {results.map(({ t, reasons }) => {
              const cover = galleries[t.slug]?.[0];
              return (
                <Card key={t.slug} className="overflow-hidden p-0">
                  {cover && (
                    <img
                      src={cover.src}
                      alt={cover.alt}
                      loading="lazy"
                      width={1200}
                      height={800}
                      className="aspect-[16/7] w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <p className="font-display text-lg font-bold">{t.name}</p>
                    <p className="mt-1 text-[13px] text-ink/60">
                      {t.days} · {t.altitude} · {t.effortLabel}
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{t.teaser}</p>
                    {reasons.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {reasons.map((r) => (
                          <li key={r} className="flex gap-2 text-[13.5px] leading-relaxed text-ink/65">
                            <span className="font-bold text-saffron">·</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        to="/treks/$slug"
                        params={{ slug: t.slug }}
                        className="rounded-xl bg-saffron px-4 py-2.5 text-[14px] font-semibold text-parchment"
                      >
                        לעמוד המסלול
                      </Link>
                      <Link
                        to="/contact"
                        className="rounded-xl bg-parchment px-4 py-2.5 text-[14px] font-medium text-ink ring-1 ring-ink/10"
                      >
                        בואו נדבר על זה
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-6">
            <p className="text-[13px] font-medium text-ink/60">ולשלב סביב זה</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {extras.map((e) => (
                <Link key={e.slug} to="/experiences/$slug" params={{ slug: e.slug }}>
                  <Card className="h-full p-4">
                    <p className="font-display text-[15px] font-bold">{e.name}</p>
                    <p className="mt-1 text-[12px] leading-snug text-ink/60">{e.teaser}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-ink/55">
            אף אחד מהכיוונים האלה אינו סופי — כמעט כל מסלול נבנה אחרת בפועל, לפי הימים שיש לכם
            ולפי מה שמעניין אתכם בדרך.
          </p>
        </Section>
      )}
    </>
  );
}
