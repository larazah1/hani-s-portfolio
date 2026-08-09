import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Mail, Phone } from "lucide-react";
import { profile } from "@/content/site";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Me" },
  { to: "/publications", label: "Publications" },
  { to: "/interviews", label: "Interviews & Articles" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="min-w-0">
          <span className="block truncate font-[family-name:var(--font-display)] text-lg font-semibold leading-tight">
            {profile.name}
          </span>
          <span className="eyebrow block truncate">
            {profile.credentials} | Geophysicist &amp; Seismologist
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-sm text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 border-l border-border pl-4 text-sm text-muted-foreground lg:flex">
          <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Phone className="h-3.5 w-3.5" />
            {profile.phone}
          </a>
          <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Mail className="h-3.5 w-3.5" />
            {profile.email}
          </a>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="shrink-0 rounded-md border border-border p-2 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-[85vw] max-w-sm flex-col gap-0 p-0 sm:max-w-sm">
            <SheetTitle className="border-b border-border px-6 py-5 font-[family-name:var(--font-display)] text-base font-semibold">
              {profile.name}
            </SheetTitle>
            <nav className="flex flex-1 flex-col">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-border/60 px-6 py-4 text-base text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                  activeProps={{ className: "border-b border-border/60 px-6 py-4 text-base text-foreground bg-secondary/60" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="space-y-3 border-t border-border px-6 py-5 text-sm text-muted-foreground">
              <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2">
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
    </header>
  );
}
