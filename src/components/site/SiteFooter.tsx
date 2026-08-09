import { Link } from "@tanstack/react-router";
import { profile, socialLinks } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="bg-contour-pattern mt-24 bg-surface-deep text-surface-deep-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
            {profile.name}, {profile.credentials}
          </h2>
          <p className="mt-3 max-w-xs text-sm opacity-70">Geophysicist &amp; Seismologist</p>
        </div>

        <div>
          <p className="eyebrow !text-current opacity-60">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/publications">Publications</Link></li>
            <li><Link to="/interviews">Interviews &amp; Articles</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow !text-current opacity-60">Contact</p>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            {profile.email && <li>{profile.email}</li>}
            {profile.phone && <li>{profile.phone}</li>}
            {profile.location && <li>{profile.location}</li>}
          </ul>
          {socialLinks.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-4 text-sm opacity-80">
              {socialLinks.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer noopener">{s.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()} {profile.name.replace(/^Dr\.\s*/, "")}. All rights reserved.
      </div>
    </footer>
  );
}