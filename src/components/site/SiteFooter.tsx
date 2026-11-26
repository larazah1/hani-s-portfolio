import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import type { NavPage } from "@/components/site/SiteHeader";
import { ContactIcons } from "./ContactIcons";

type FooterProfile = {
  name: string;
  nameAr: string;
  credentials: string;
  credentialsAr: string;
  email: string;
  phone: string;
  location: string;
  locationAr: string;
  tagline: string;
  taglineAr: string;
};

type SocialLink = { label: string; url: string };

export function SiteFooter({
  profile,
  navPages,
  socialLinks,
}: {
  profile: FooterProfile;
  navPages: NavPage[];
  socialLinks: SocialLink[];
}) {
  const { t, pick } = useLanguage();

  return (
    <footer className="mt-12 bg-surface-deep text-surface-deep-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            {pick(profile.name, profile.nameAr)}
          </h2>
          <p className="mt-3 max-w-xs text-sm opacity-70">
            {pick(profile.tagline, profile.taglineAr)}
          </p>
        </div>

        <div>
          <p className="eyebrow !text-current opacity-60">{t("quickLinks")}</p>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            {navPages
              .filter((page) => page.path !== "/")
              .map((page) => (
                <li key={page.path}>
                  <Link to={page.path}>
                    {pick(page.navLabel ?? page.title, page.navLabelAr ?? page.titleAr)}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow !text-current opacity-60">{t("contact")}</p>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            {profile.email && <li dir="ltr">{profile.email}</li>}
            {profile.phone && <li dir="ltr">{profile.phone}</li>}
            {profile.location && <li>{pick(profile.location, profile.locationAr)}</li>}
          </ul>
          <ContactIcons
            email={profile.email}
            phone={profile.phone}
            socialLinks={socialLinks}
            tone="dark"
            className="mt-5"
          />
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()} {pick(profile.name, profile.nameAr)}. {t("allRightsReserved")}
      </div>
    </footer>
  );
}
