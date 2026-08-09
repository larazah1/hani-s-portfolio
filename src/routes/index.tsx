import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-seismic.jpg";
import { Section, EmptyNote } from "@/components/site/Section";
import {
  career,
  expertise,
  media,
  profile,
  publications,
  recommendations,
  stats,
  summary,
} from "@/content/site";

const title = "Dr. Hani Mahmoud Zahran — Applied Geophysics & Seismology";
const description =
  "Portfolio of Dr. Hani Mahmoud Zahran: research in seismology, seismic hazard assessment, volcanology and disaster risk reduction.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const featuredPublications = publications.filter((p) => p.featured).slice(0, 6);
  const featuredMedia = media.filter((m) => m.featured).slice(0, 4);
  const featuredRecs = recommendations.filter((r) => r.featured).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-surface-deep text-surface-deep-foreground">
        <img
          src={heroImage}
          alt=""
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:py-32">
          <p className="eyebrow !text-current opacity-70">{profile.location}</p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">{profile.name}</h1>
          <p className="mt-4 text-lg opacity-85 md:text-xl">{profile.title}</p>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed opacity-75 md:text-base">
            {profile.tagline}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to={profile.primaryCta.to}
              className="rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              {profile.primaryCta.label}
            </Link>
            <Link
              to={profile.secondaryCta.to}
              className="rounded-sm border border-white/30 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
            >
              {profile.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <Section eyebrow="Professional Summary" title="An overview">
        <div className="max-w-3xl space-y-4 text-[0.98rem] leading-relaxed text-muted-foreground">
          {summary.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </Section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 py-12 md:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-4 text-center">
              <p className="font-[family-name:var(--font-display)] text-4xl">{s.value}</p>
              <p className="eyebrow mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Section eyebrow="Career" title="Career highlights">
        {career.length === 0 ? (
          <EmptyNote>Career positions will appear here once added.</EmptyNote>
        ) : (
          <ol className="border-l border-border">
            {career.map((c) => (
              <li key={`${c.position}-${c.start}`} className="relative pb-10 pl-8">
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent" />
                <p className="eyebrow">{c.start} — {c.end}</p>
                <h3 className="mt-1 text-xl">{c.position}</h3>
                <p className="text-sm text-muted-foreground">{c.organization}</p>
                {c.description && (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section eyebrow="Expertise" title="Areas of expertise">
        <ul className="flex flex-wrap gap-2">
          {expertise.map((e) => (
            <li key={e} className="rounded-sm border border-border bg-card px-4 py-2 text-sm">
              {e}
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Publications" title="Selected publications">
        {featuredPublications.length === 0 ? (
          <EmptyNote>Featured publications will appear here once added.</EmptyNote>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {featuredPublications.map((p) => (
              <article key={p.id} className="rounded-md border border-border bg-card p-6">
                <p className="eyebrow">{p.year} · {p.type}</p>
                <h3 className="mt-2 text-lg leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.journal}</p>
              </article>
            ))}
          </div>
        )}
        <div className="mt-8">
          <Link to="/publications" className="text-sm underline underline-offset-4">
            View all publications
          </Link>
        </div>
      </Section>

      <Section eyebrow="Media" title="Interviews & articles">
        {featuredMedia.length === 0 ? (
          <EmptyNote>Featured interviews and articles will appear here once added.</EmptyNote>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {featuredMedia.map((m) => (
              <article key={m.id} className="rounded-md border border-border bg-card p-6">
                <p className="eyebrow">{m.date} · {m.type}</p>
                <h3 className="mt-2 text-lg leading-snug">{m.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.source}</p>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section eyebrow="Recommendations" title="What colleagues say">
        {featuredRecs.length === 0 ? (
          <EmptyNote>Recommendations will appear here once added.</EmptyNote>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {featuredRecs.map((r) => (
              <blockquote key={r.id} className="rounded-md border border-border bg-card p-6">
                <p className="text-sm leading-relaxed">{r.text}</p>
                <footer className="mt-4 text-sm">
                  <span className="font-medium">{r.name}</span>
                  <span className="block text-muted-foreground">{r.position}, {r.organization}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
