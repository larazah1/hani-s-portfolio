import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Languages, Menu, X } from "lucide-react";
import portrait from "@/assets/hani.jpeg";
import { useLanguage } from "@/lib/language";

export type NavPage = {
  path: string;
  title: string;
  titleAr: string;
  navLabel: string | null;
  navLabelAr: string | null;
};

export type SiteProfile = {
  name: string;
  nameAr: string;
  credentials: string;
  credentialsAr: string;
  email: string;
  phone: string;
};

/**
 * Site header (matches the zahran-portal design): portrait + name, the page
 * links and a language button; on phones a menu button opens the links in a
 * panel under the header.
 */
export function SiteHeader({ profile, navPages }: { profile: SiteProfile; navPages: NavPage[] }) {
  const [open, setOpen] = useState(false);
  const { t, pick, toggleLanguage } = useLanguage();

  const langToggle = (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t("languageToggleLabel")}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
    >
      <Languages className="h-4 w-4" aria-hidden />
      {t("switchToArabic")}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={portrait}
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full bg-white object-cover object-top ring-1 ring-border"
          />
          <span className="min-w-0">
            <span className="block truncate font-[family-name:var(--font-display)] text-lg leading-tight">
              {pick(profile.name, profile.nameAr)}
            </span>
            <span className="eyebrow block truncate">{t("headerSubtitle")}</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-7 md:flex">
            {navPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-sm text-foreground" }}
                activeOptions={{ exact: page.path === "/" }}
              >
                {pick(page.navLabel ?? page.title, page.navLabelAr ?? page.titleAr)}
              </Link>
            ))}
          </nav>

          {langToggle}

          <button
            type="button"
            aria-label={t("openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 rounded-md border border-border p-2 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border md:hidden">
          {navPages.map((page) => (
            <Link
              key={page.path}
              to={page.path}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 px-5 py-3 text-sm text-muted-foreground"
              activeProps={{
                className: "block border-b border-border/60 px-5 py-3 text-sm text-foreground",
              }}
              activeOptions={{ exact: page.path === "/" }}
            >
              {pick(page.navLabel ?? page.title, page.navLabelAr ?? page.titleAr)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
