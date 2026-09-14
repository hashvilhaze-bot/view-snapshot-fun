import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "האזור האישי · השביל הזה" },
      {
        name: "description",
        content:
          "האזור האישי בהשביל הזה: השם והתמונה שלכם, והעדפות הטיול — תחומי עניין, תקופה מועדפת והרכב הקבוצה.",
      },
      { property: "og:title", content: "האזור האישי · השביל הזה" },
      {
        property: "og:description",
        content: "נהלו את פרטי הפרופיל והעדפות הטיול שלכם.",
      },
    ],
  }),
  component: ProfilePage,
});

const INTEREST_OPTIONS = [
  "טרק מנאסלו",
  "טרק באזור האוורסט",
  "טרק באזור האנאפורנה",
  "טיול תרבות ונופים בנפאל",
  "בהוטן",
  "רפטינג",
  "צ׳יטוואן / טבע וספארי",
  "שילוב של כמה חוויות",
] as const;

const SEASONS = ["אביב (מרץ–מאי)", "סתיו (אוקטובר–נובמבר)", "עדיין לא החלטנו"] as const;
const GROUPS = ["לבד", "זוג", "משפחה", "קבוצת חברים"] as const;

const label = "block text-[13px] font-medium text-ink/70";
const input =
  "mt-1.5 w-full rounded-xl bg-parchment px-4 py-3 text-[15px] text-ink ring-1 ring-ink/10 outline-none focus:ring-2 focus:ring-saffron/50";

function ProfilePage() {
  const { user, loading, name, avatarUrl, signOut } = useAuth();
  const [state, setState] = useState<"idle" | "loading" | "saving" | "saved" | "failed">("idle");
  const [form, setForm] = useState({
    display_name: "",
    preferred_season: "",
    group_size: "",
    notes: "",
  });
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setState("loading");
    supabase
      .from("profiles")
      .select("display_name, preferred_season, group_size, notes, interests")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setForm({
          display_name: data?.display_name ?? name ?? "",
          preferred_season: data?.preferred_season ?? "",
          group_size: data?.group_size ?? "",
          notes: data?.notes ?? "",
        });
        setInterests(data?.interests ?? []);
        setState("idle");
      });
    return () => {
      active = false;
    };
  }, [user, name]);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggle = (opt: string) =>
    setInterests((cur) => (cur.includes(opt) ? cur.filter((c) => c !== opt) : [...cur, opt]));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setState("saving");
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email ?? null,
      avatar_url: avatarUrl,
      display_name: form.display_name || null,
      preferred_season: form.preferred_season || null,
      group_size: form.group_size || null,
      notes: form.notes || null,
      interests,
    });
    setState(error ? "failed" : "saved");
  }

  if (loading) {
    return (
      <div className="bg-sand">
        <div className="mx-auto max-w-2xl px-4 py-16 text-[14px] text-ink/60 sm:px-5">רק רגע…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-sand">
        <div className="mx-auto max-w-md px-4 py-14 sm:px-5">
          <div className="rounded-2xl bg-parchment p-6 ring-1 ring-ink/10">
            <h1 className="font-display text-[26px] text-ink">האזור האישי</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
              כדי לראות ולערוך את הפרופיל וההעדפות שלכם, צריך להתחבר קודם.
            </p>
            <Link
              to="/auth"
              className="mt-5 inline-block rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
            >
              להתחברות
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sand">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-5">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover ring-1 ring-ink/10"
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-full bg-parchment text-[20px] font-semibold text-ink/60 ring-1 ring-ink/10">
              {(form.display_name || name || "?").slice(0, 1)}
            </div>
          )}
          <div>
            <h1 className="font-display text-[26px] leading-tight text-ink sm:text-[30px]">
              {form.display_name || name || "האזור האישי"}
            </h1>
            <p className="text-[13px] text-ink/60">{user.email}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div>
            <label className={label} htmlFor="display_name">
              שם לתצוגה
            </label>
            <input
              id="display_name"
              className={input}
              value={form.display_name}
              onChange={set("display_name")}
            />
          </div>

          <fieldset>
            <legend className={label}>מה מעניין אתכם? אפשר לבחור כמה</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((opt) => {
                const on = interests.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(opt)}
                    className={`rounded-xl px-4 py-2.5 text-start text-[14px] font-medium ring-1 transition-colors ${
                      on
                        ? "bg-saffron text-parchment ring-saffron"
                        : "bg-parchment text-ink/75 ring-ink/10"
                    }`}
                  >
                    {on && <span className="me-1.5">✓</span>}
                    {opt}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="season">
                תקופה מועדפת
              </label>
              <select
                id="season"
                className={input}
                value={form.preferred_season}
                onChange={set("preferred_season")}
              >
                <option value="">בחרו</option>
                {SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="group">
                עם מי נוסעים
              </label>
              <select
                id="group"
                className={input}
                value={form.group_size}
                onChange={set("group_size")}
              >
                <option value="">בחרו</option>
                {GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={label} htmlFor="notes">
              משהו שכדאי שנדע
            </label>
            <textarea
              id="notes"
              rows={4}
              className={input}
              value={form.notes}
              onChange={set("notes")}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={state === "saving"}
              className="rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment disabled:opacity-60"
            >
              {state === "saving" ? "שומרים…" : "שמירת העדפות"}
            </button>
            <button
              type="button"
              onClick={signOut}
              className="rounded-xl px-5 py-3 text-[14px] font-medium text-ink/70 ring-1 ring-ink/15"
            >
              התנתקות
            </button>
            {state === "saved" && <span className="text-[13px] text-ink/70">נשמר ✓</span>}
            {state === "failed" && (
              <span className="text-[13px] text-saffron">השמירה לא הצליחה. נסו שוב.</span>
            )}
          </div>
        </form>

        <p className="mt-8 text-[13px] text-ink/55">
          רוצים שנחזור אליכם עם הצעה?{" "}
          <Link to="/quote" className="underline decoration-saffron/60 underline-offset-4">
            לבקשת הצעה
          </Link>
        </p>
      </div>
    </div>
  );
}
