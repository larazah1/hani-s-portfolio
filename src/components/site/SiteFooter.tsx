import { Link } from "@tanstack/react-router";
import { profile, socialLinks } from "@/content/site";
import { useLanguage } from "@/lib/language";

export function SiteFooter() {
  const { t, pick } = useLanguage();

  return (
    <footer className="bg-contour-pattern mt-24 bg-surface-deep text-surface-deep-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
            {pick(profile.name, profile.nameAr)}, {pick(profile.credentials, profile.credentialsAr)}
          </h2>
          <p className="mt-3 max-w-xs text-sm opacity-70">{t("geophysicistSeismologist")}</p>
        </div>

        <div>
          <p className="eyebrow !text-current opacity-60">{t("quickLinks")}</p>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            <li>
              <Link to="/">{t("home")}</Link>
            </li>
            <li>
              <Link to="/about">{t("aboutMe")}</Link>
            </li>
            <li>
              <Link to="/publications">{t("publications")}</Link>
            </li>
            <li>
              <Link to="/interviews">{t("interviewsArticles")}</Link>
            </li>
            <li>
              <Link to="/contact">{t("contact")}</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow !text-current opacity-60">{t("contact")}</p>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            {profile.email && <li dir="ltr">{profile.email}</li>}
            {profile.phone && <li dir="ltr">{profile.phone}</li>}
            {profile.location && <li>{pick(profile.location, profile.locationAr)}</li>}
          </ul>
          {socialLinks.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-4 text-sm opacity-80">
              {socialLinks.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer noopener">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()}{" "}
        {pick(profile.name, profile.nameAr).replace(/^Dr\.\s*|^د\.\s*/, "")}.{" "}
        {t("allRightsReserved")}
      </div>
    </footer>
  );
}
