import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { Toaster } from "../components/ui/sonner";
import { LanguageProvider, useLanguage } from "../lib/language";
import { getSiteChrome } from "../server-fns/public-content";

// Runs before hydration so a stored Arabic preference applies immediately,
// avoiding a flash of LTR content on repeat visits. Skipped for /admin/* —
// the admin panel is always English/LTR, independent of the public site's
// language toggle.
const noFlashLanguageScript = `
(function () {
  try {
    if (window.location.pathname.indexOf("/admin") === 0) return;
    var lang = window.localStorage.getItem("site-lang");
    if (lang === "ar") {
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
    }
  } catch (e) {}
})();
`;

function NotFoundComponent() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("pageNotFound")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("pageNotFoundBody")}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{t("didntLoad")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("errorBody")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("tryAgain")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("goHome")}
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
      { title: "Dr. Hani Mahmoud Zahran" },
      {
        name: "description",
        content:
          "Professional portfolio of Dr. Hani Mahmoud Zahran, applied geophysics and seismology.",
      },
      { name: "author", content: "Dr. Hani Mahmoud Zahran" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600&family=Cairo:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  loader: async () => await getSiteChrome(),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashLanguageScript }} />
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
  const chrome = Route.useLoaderData();
  const isAdminRoute = useRouterState({
    select: (s) => s.location.pathname.startsWith("/admin"),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        {isAdminRoute ? (
          // The admin panel is a separate experience from the public
          // portfolio — no public header/footer/nav here. Each admin route
          // (or the shared admin layout) supplies its own chrome.
          <Outlet />
        ) : (
          <div className="flex min-h-screen flex-col">
            <SiteHeader profile={chrome.profile} navPages={chrome.navPages} />
            <main className="flex-1">
              {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
              <Outlet />
            </main>
            <SiteFooter
              profile={chrome.profile}
              navPages={chrome.navPages}
              socialLinks={chrome.socialLinks}
            />
          </div>
        )}
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
