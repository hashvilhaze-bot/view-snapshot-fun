import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  useRouterState,
  type ErrorComponentProps,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DEFAULT_LOCALE, documentAttrs } from "@/lib/i18n";
import { useSiteMotion } from "@/components/renewed/site-motion";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">לא מצאנו את העמוד</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          אפשר לחזור לדף הבית ולבחור משם מסלול או מדריך.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          העמוד לא נטען
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          אפשר לנסות לטעון אותו שוב או לחזור לדף הבית.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            לנסות שוב
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            לדף הבית
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:site_name", content: "השביל הזה" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { lang, dir } = documentAttrs(DEFAULT_LOCALE);

  return (
    <html lang={lang} dir={dir}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  // The /pilot design preview renders its own chrome.
  const isPilot = useRouterState({ select: (st) => st.location.pathname.startsWith("/pilot") });
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  useSiteMotion(isPilot ? "" : pathname);
  const [, section, slug] = pathname.split("/");
  const footerTrek = section === "treks" && slug !== "compare" ? slug : undefined;

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`${isPilot ? "" : "pilot site-public"} flex min-h-screen flex-col bg-background text-foreground antialiased`}
      >
        {!isPilot && <><a href="#main-content" className="site-skip">דילוג לתוכן העמוד</a><SiteHeader /></>}
        {isPilot ? (
          // The pilot layout renders its own single <main>.
          <Outlet />
        ) : (
          <main id="main-content" tabIndex={-1} className="flex-1">
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </main>
        )}
        {!isPilot && <SiteFooter {...(footerTrek ? { trek: footerTrek } : {})} />}
      </div>
    </QueryClientProvider>
  );
}
