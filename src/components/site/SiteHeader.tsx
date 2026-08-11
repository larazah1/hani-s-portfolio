import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Mail, Phone, Languages } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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

function LanguageToggle({ className = "" }: { className?: string }) {
  const { t, toggleLanguage } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t("languageToggleLabel")}
      className={`flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-accent hover:text-foreground ${className}`}
    >
      <Languages className="h-3.5 w-3.5" />
      {t("switchToArabic")}
    </button>
  );
}

export function SiteHeader({ profile, navPages }: { profile: SiteProfile; navPages: NavPage[] }) {
  const [open, setOpen] = useState(false);
  const { dir, t, pick } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="min-w-0">
          <span className="block truncate font-[family-name:var(--font-display)] text-lg font-semibold leading-tight">
            {pick(profile.name, profile.nameAr)}
          </span>
          <span className="eyebrow block truncate">
            {pick(profile.credentials, profile.credentialsAr)} | {t("geophysicistSeismologist")}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
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

        <div className="hidden shrink-0 items-center gap-4 border-s border-border ps-4 text-sm text-muted-foreground lg:flex">
          <a
            href={`tel:${profile.phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Phone className="h-3.5 w-3.5" />
            {profile.phone}
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Mail className="h-3.5 w-3.5" />
            {profile.email}
          </a>
          <LanguageToggle />
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LanguageToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={t("openMenu")}
                className="shrink-0 rounded-md border border-border p-2"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent
              side={dir === "rtl" ? "left" : "right"}
              className="flex w-[85vw] max-w-sm flex-col gap-0 p-0 sm:max-w-sm"
            >
              <SheetTitle className="border-b border-border px-6 py-5 font-[family-name:var(--font-display)] text-base font-semibold">
                {pick(profile.name, profile.nameAr)}
              </SheetTitle>
              <nav className="flex flex-1 flex-col">
                {navPages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    onClick={() => setOpen(false)}
                    className="border-b border-border/60 px-6 py-4 text-base text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                    activeProps={{
                      className:
                        "border-b border-border/60 px-6 py-4 text-base text-foreground bg-secondary/60",
                    }}
                    activeOptions={{ exact: page.path === "/" }}
                  >
                    {pick(page.navLabel ?? page.title, page.navLabelAr ?? page.titleAr)}
                  </Link>
                ))}
              </nav>
              <div className="space-y-3 border-t border-border px-6 py-5 text-sm text-muted-foreground">
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  {profile.phone}
                </a>
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
