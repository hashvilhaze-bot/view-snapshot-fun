import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "התחברות · השביל הזה" },
      {
        name: "description",
        content:
          "התחברו עם חשבון גוגל או עם אימייל וסיסמה כדי לשמור את העדפות הטיול שלכם בהשביל הזה.",
      },
      { property: "og:title", content: "התחברות · השביל הזה" },
      {
        property: "og:description",
        content: "התחברות עם גוגל או עם אימייל לאזור האישי של השביל הזה.",
      },
    ],
  }),
  component: AuthPage,
});

const label = "block text-[13px] font-medium text-ink/70";
const input =
  "mt-1.5 w-full rounded-xl bg-parchment px-4 py-3 text-[15px] text-ink ring-1 ring-ink/10 outline-none focus:ring-2 focus:ring-saffron/50";

function AuthPage() {
  const { user, name, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      const t = setTimeout(() => navigate({ to: "/profile" }), 800);
      return () => clearTimeout(t);
    }
    return;
  }, [user, navigate]);

  async function signInWithGoogle() {
    setBusy(true);
    setError(null);
    setNotice(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      setError("ההתחברות דרך גוגל לא הושלמה. נסו שוב בבקשה.");
      return;
    }
    if (result.redirected) return;
    setBusy(false);
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setBusy(false);
      if (err) {
        setError(translateAuthError(err.message));
        return;
      }
      if (!data.session) {
        setNotice("שלחנו לכם מייל אימות — אשרו אותו ואז תוכלו להתחבר.");
      }
      return;
    }

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) setError(translateAuthError(err.message));
  }

  return (
    <div className="bg-sand">
      <div className="mx-auto max-w-md px-4 py-14 sm:px-5">
        <div className="rounded-2xl bg-parchment p-6 ring-1 ring-ink/10 sm:p-8">
          <h1 className="font-display text-[26px] leading-tight text-ink sm:text-[30px]">
            {mode === "signup" ? "פתיחת חשבון" : "התחברות"}
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
            ההתחברות אופציונלית — אפשר לשלוח פנייה גם בלעדיה. מי שמתחבר יכול לשמור את העדפות
            הטיול שלו ולחזור אליהן.
          </p>

          {loading ? (
            <p className="mt-6 text-[14px] text-ink/60">רק רגע…</p>
          ) : user ? (
            <div className="mt-6">
              <p className="text-[15px] text-ink">מחוברים{name ? ` בשם ${name}` : ""} ✓</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/profile"
                  className="rounded-xl bg-saffron px-5 py-3 text-[14px] font-semibold text-parchment"
                >
                  לאזור האישי
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-xl px-5 py-3 text-[14px] font-medium text-ink/70 ring-1 ring-ink/15"
                >
                  התנתקות
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-parchment px-5 py-3.5 text-[15px] font-semibold text-ink ring-1 ring-ink/15 transition-colors hover:bg-sand disabled:opacity-60"
              >
                <GoogleMark />
                התחברות עם Google
              </button>

              <div className="my-5 flex items-center gap-3 text-[12px] text-ink/60">
                <span className="h-px flex-1 bg-ink/10" />
                או עם אימייל
                <span className="h-px flex-1 bg-ink/10" />
              </div>

              <form onSubmit={onEmailSubmit} className="space-y-4">
                <div>
                  <label className={label} htmlFor="email">
                    אימייל
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    dir="ltr"
                    className={input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className={label} htmlFor="password">
                    סיסמה
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    dir="ltr"
                    className={input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {mode === "signup" && (
                    <p className="mt-1.5 text-[12px] text-ink/60">לפחות 8 תווים.</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-xl bg-saffron px-5 py-3.5 text-[15px] font-semibold text-parchment disabled:opacity-60"
                >
                  {busy ? "רק רגע…" : mode === "signup" ? "פתיחת חשבון" : "התחברות"}
                </button>
              </form>

              {error && <p className="mt-3 text-[13px] text-saffron">{error}</p>}
              {notice && <p className="mt-3 text-[13px] text-ink/75">{notice}</p>}

              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signup" ? "signin" : "signup");
                  setError(null);
                  setNotice(null);
                }}
                className="mt-4 text-[13px] text-ink/65 underline decoration-saffron/60 underline-offset-4"
              >
                {mode === "signup" ? "יש לי כבר חשבון — להתחברות" : "אין לי חשבון — פתיחת חשבון"}
              </button>
            </div>
          )}

          <p className="mt-6 text-[13px] text-ink/55">
            עדיין רק מסתכלים?{" "}
            <Link to="/treks" className="underline decoration-saffron/60 underline-offset-4">
              לטרקים ולחוויות
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function translateAuthError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("email signups are disabled") || m.includes("email_provider_disabled"))
    return "ההתחברות עם אימייל עדיין לא הופעלה בצד השרת. בינתיים אפשר להתחבר עם גוגל.";
  if (m.includes("invalid login credentials")) return "האימייל או הסיסמה לא נכונים.";
  if (m.includes("email not confirmed")) return "צריך לאשר את מייל האימות שנשלח אליכם.";
  if (m.includes("already registered")) return "כבר קיים חשבון עם האימייל הזה — נסו להתחבר.";
  if (m.includes("password")) return "הסיסמה חלשה מדי או קצרה מדי (לפחות 8 תווים).";
  return "משהו לא עבד. נסו שוב בבקשה.";
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.3 17.6 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v8.4h12.5c-.3 2.1-1.6 5.2-4.7 7.3l7.6 5.9c4.5-4.2 6.7-10.3 6.7-17.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.4 28.7A14.7 14.7 0 0 1 9.6 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.2 0 11.5-2 15.4-5.6l-7.6-5.9c-2 1.4-4.8 2.4-7.8 2.4-6.4 0-11.7-3.8-13.6-9.2l-7.8 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}
