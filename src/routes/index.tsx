import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  MapPin,
  Users,
  Compass,
  Activity,
  ShieldAlert,
  Waves,
  Mountain,
  AudioLines,
  ShieldCheck,
  Gem,
  Flame,
  Sigma,
  BarChart3,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import heroImage from "@/assets/hero-seismic.jpg";
import { Section, EmptyNote } from "@/components/site/Section";
import { PublicationCard } from "@/components/site/PublicationCard";
import { MediaCard } from "@/components/site/MediaCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  career,
  collaborations,
  expertise,
  media,
  profile,
  publications,
  recommendations,
  stats,
  summary,
} from "@/content/site";
import { useLanguage } from "@/lib/language";

const title = "Dr. Hani Mahmoud Zahran — Geophysicist & Seismologist";
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

const expertiseIcons: Record<string, LucideIcon> = {
  "Applied Geophysics": Compass,
  Seismology: Activity,
  "Seismic Hazard Assessment": ShieldAlert,
  "Earthquake Research": Waves,
  "Volcanic Hazard Assessment": Mountain,
  "Seismic Signal Processing": AudioLines,
  "Disaster Risk Reduction": ShieldCheck,
  "Mineral Exploration": Gem,
  "Geothermal Prospecting": Flame,
  "Numerical Simulation": Sigma,
  "Geophysical Data Analysis": BarChart3,
  "High-Performance Computing": Cpu,
};

function Index() {
  const { t, pick } = useLanguage();
  const featuredPublications = publications.filter((p) => p.featured);
  const featuredMedia = media.filter((m) => m.featured);
  const featuredRecs = recommendations.filter((r) => r.featured).slice(0, 3);
  const currentRole = career[0];

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
          <p className="eyebrow !text-current opacity-70">
            {pick(profile.location, profile.locationAr)}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            {pick(profile.name, profile.nameAr)}
          </h1>
          <p className="mt-4 max-w-2xl text-lg opacity-85 md:text-xl">
            {pick(profile.title, profile.titleAr)}
          </p>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed opacity-75 md:text-base">
            {pick(profile.tagline, profile.taglineAr)}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to={profile.primaryCta.to}
              className="rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              {pick(profile.primaryCta.label, profile.primaryCta.labelAr)}
            </Link>
            <Link
              to={profile.secondaryCta.to}
              className="rounded-sm border border-white/30 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
            >
              {pick(profile.secondaryCta.label, profile.secondaryCta.labelAr)}
            </Link>
          </div>
        </div>
      </section>

      <Section eyebrow={t("professionalSummary")} title={t("anOverview")}>
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div
            className="max-w-3xl space-y-4 text-[0.98rem] leading-relaxed text-muted-foreground"
            dir="ltr"
          >
            {summary.map((p) => (
              <p key={p.slice(0, 24)} className="text-left">
                {p}
              </p>
            ))}
          </div>
          {currentRole && (
            <aside className="h-fit rounded-lg border border-border bg-card p-6 shadow-soft">
              <p className="eyebrow">{t("currentRole")}</p>
              <h3 className="mt-2 text-lg font-semibold leading-snug">
                {pick(currentRole.position, currentRole.positionAr)}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {pick(currentRole.organization, currentRole.organizationAr)}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                {pick(profile.location, profile.locationAr)}
              </div>
            </aside>
          )}
        </div>
      </Section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 py-12 md:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-4 text-center">
              <p className="font-[family-name:var(--font-display)] text-4xl">{s.value}</p>
              <p className="eyebrow mt-2">{pick(s.label, s.labelAr)}</p>
            </div>
          ))}
        </div>
      </section>

      <Section eyebrow={t("career")} title={t("careerHighlights")}>
        {career.length === 0 ? (
          <EmptyNote>{t("emptyCareer")}</EmptyNote>
        ) : (
          <ol className="border-s border-border">
            {career.map((c) => (
              <li key={`${c.position}-${c.start}`} className="group relative pb-2 ps-8">
                <span className="absolute -start-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
                <div className="-ms-3 rounded-md px-3 py-4 transition-colors group-hover:bg-secondary/50">
                  <p className="eyebrow">
                    {c.start} — {c.end === "Present" ? t("present") : c.end}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold">{pick(c.position, c.positionAr)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pick(c.organization, c.organizationAr)}
                  </p>
                  {c.description && (
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {pick(c.description, c.descriptionAr)}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}

        {collaborations.length > 0 && (
          <div className="mt-8 flex items-start gap-4 rounded-lg border border-accent/30 bg-accent/5 p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent-foreground">
              <Users className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="eyebrow">{t("researchCollaboration")}</p>
              {collaborations.map((c) => (
                <div key={c.position} className="mt-1">
                  <h3 className="text-lg font-semibold leading-snug">
                    {pick(c.position, c.positionAr)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {pick(c.organization, c.organizationAr)} · {c.start} —{" "}
                    {c.end === "Present" ? t("present") : c.end}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      <Section eyebrow={t("expertise")} title={t("keyExpertise")}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((e) => {
            const Icon = expertiseIcons[e.en] ?? Compass;
            return (
              <div
                key={e.en}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent-foreground">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <span className="text-sm font-medium">{pick(e.en, e.ar)}</span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section eyebrow={t("selectedResearch")} title={t("myPublications")}>
        <p className="-mt-2 mb-8 max-w-2xl text-sm text-muted-foreground">
          {t("publicationsIntro")}
        </p>
        {featuredPublications.length === 0 ? (
          <EmptyNote>{t("emptyFeaturedPublications")}</EmptyNote>
        ) : (
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {featuredPublications.map((p) => (
                <CarouselItem key={p.id} className="sm:basis-1/2 lg:basis-1/3">
                  <PublicationCard publication={p} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6 flex justify-end gap-2">
              <CarouselPrevious className="static h-9 w-9 translate-y-0" />
              <CarouselNext className="static h-9 w-9 translate-y-0" />
            </div>
          </Carousel>
        )}
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/publications">
              {t("exploreAllPublications")}
              <ArrowRight className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </Section>

      <Section eyebrow={t("media")} title={t("interviewsArticlesHeadline")}>
        {featuredMedia.length === 0 ? (
          <EmptyNote>{t("emptyFeaturedMedia")}</EmptyNote>
        ) : (
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {featuredMedia.map((m) => (
                <CarouselItem key={m.id} className="sm:basis-1/2 lg:basis-1/3">
                  <MediaCard item={m} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6 flex justify-end gap-2">
              <CarouselPrevious className="static h-9 w-9 translate-y-0" />
              <CarouselNext className="static h-9 w-9 translate-y-0" />
            </div>
          </Carousel>
        )}
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/interviews">
              {t("exploreInterviewsArticles")}
              <ArrowRight className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </Section>

      <Section eyebrow={t("recommendations")} title={t("recommendationsHeadline")}>
        {featuredRecs.length === 0 ? (
          <EmptyNote>{t("emptyRecommendations")}</EmptyNote>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {featuredRecs.map((r) => (
              <blockquote
                key={r.id}
                dir="ltr"
                className="rounded-md border border-border bg-card p-6 text-left"
              >
                <p className="text-sm leading-relaxed">{r.text}</p>
                <footer className="mt-4 text-sm">
                  <span className="font-medium">{r.name}</span>
                  <span className="block text-muted-foreground">
                    {r.position}
                    {r.organization ? `, ${r.organization}` : ""}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
