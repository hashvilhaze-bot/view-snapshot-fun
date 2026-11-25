import { createFileRoute } from "@tanstack/react-router";
import { HomeHero } from "@/components/renewed/home-hero";
import { RevisionEditor } from "@/components/admin/revision-editor";
import { DEFAULT_HOME, parseHomeContent, type HomeContent } from "@/lib/home-content";

export const Route = createFileRoute("/admin/home")({ component: HomeAdmin });
const shortFields = [
  ["kicker", "שורה מעל הכותרת", 140],
  ["titleStart", "תחילת הכותרת", 100],
  ["titleAccent", "מילים מודגשות בכותרת", 100],
  ["titleEnd", "סוף הכותרת", 100],
] as const;
function HomeAdmin() {
  return (
    <div className="cms-module">
      <h2 className="p-h2">עריכת הפתיחה של דף הבית</h2>
      <RevisionEditor<HomeContent>
        slug="home"
        defaults={DEFAULT_HOME}
        parseContent={parseHomeContent}
        publicPath="/"
        invalidMessage="צריך למלא את תחילת הכותרת ואת פסקת הפתיחה."
        renderFields={(form, change) => (
          <>
            {shortFields.map(([key, label, max]) => (
              <label key={key}>
                {label}
                <input
                  maxLength={max}
                  value={form[key]}
                  onChange={(event) => change({ ...form, [key]: event.target.value })}
                />
              </label>
            ))}
            <div>
              <label htmlFor="home-intro">פסקת פתיחה</label>
              <textarea
                id="home-intro"
                rows={4}
                maxLength={1500}
                value={form.intro}
                onChange={(event) => change({ ...form, intro: event.target.value })}
              />
            </div>
          </>
        )}
        renderPreview={(form) => (
          <div inert className="cms-home-preview">
            <HomeHero content={form} />
          </div>
        )}
      />
    </div>
  );
}
