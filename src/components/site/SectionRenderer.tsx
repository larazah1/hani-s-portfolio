import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Download,
  type LucideIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Quote } from "lucide-react";
import heroImage from "@/assets/hero-seismic.jpg";
import portrait from "@/assets/hani.jpeg";
import { Section, EmptyNote } from "@/components/site/Section";
import { PublicationCard, type Publication } from "@/components/site/PublicationCard";
import { ArticleRow, MediaCard, VideoTile, type MediaItem } from "@/components/site/MediaCard";
import { CareerSteps, type CareerStep } from "@/components/site/CareerSteps";
import { ContactIcons } from "@/components/site/ContactIcons";
import { LoopCarousel } from "@/components/site/LoopCarousel";
import { StatsMarquee, type MarqueeStat } from "@/components/site/StatsMarquee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { publicationTypeAr } from "@/lib/publication-i18n";
import { useLanguage, type DictionaryKey } from "@/lib/language";
import type { SectionType } from "@/lib/section-types";
import { submitContactMessage } from "@/server-fns/contact";
import { submitRecommendation } from "@/server-fns/recommendations";

export type ResolvedSection = {
  id: string;
  type: SectionType;
  eyebrow: string | null;
  eyebrowAr: string | null;
  title: string | null;
  titleAr: string | null;
  config: Record<string, unknown>;
  data: unknown;
};

export type PublicProfile = {
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
  title: string;
  titleAr: string;
  tagline: string;
  taglineAr: string;
  primaryCtaLabel: string;
  primaryCtaLabelAr: string;
  primaryCtaTo: string;
  secondaryCtaLabel: string;
  secondaryCtaLabelAr: string;
  secondaryCtaTo: string;
  email: string;
  phone: string;
  cvUrl?: string | null;
};

function useHeading(section: ResolvedSection, titleKey: DictionaryKey) {
  const { t, pick } = useLanguage();
  const title = section.title ? pick(section.title, section.titleAr ?? section.title) : t(titleKey);
  return { title };
}

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

export function SectionRenderer({
  section,
  profile,
  socialLinks,
}: {
  section: ResolvedSection;
  profile: PublicProfile | null;
  socialLinks: { label: string; url: string }[];
}) {
  switch (section.type) {
    case "hero":
      return profile ? <HeroSection profile={profile} socialLinks={socialLinks} /> : null;
    case "quote":
      return <QuoteSection section={section} />;
    case "summary":
      return <SummarySection section={section} profile={profile} />;
    case "stats-row":
      return <StatsRowSection section={section} />;
    case "career-timeline":
      return <CareerTimelineSection section={section} />;
    case "experience-timeline":
      return <ExperienceTimelineSection section={section} />;
    case "expertise-grid":
      return <ExpertiseGridSection section={section} />;
    case "education-grid":
      return <EducationGridSection section={section} />;
    case "memberships-list":
      return <MembershipsListSection section={section} />;
    case "list-block":
      return <ListBlockSection section={section} />;
    case "publications-carousel":
      return <PublicationsCarouselSection section={section} />;
    case "media-carousel":
      return <MediaCarouselSection section={section} />;
    case "recommendations-grid":
      return <RecommendationsGridSection section={section} />;
    case "publications-full-list":
      return <PublicationsFullListSection section={section} />;
    case "media-full-grid":
      return <MediaFullGridSection section={section} />;
    case "rich-text":
      return <RichTextSection section={section} profile={profile} socialLinks={socialLinks} />;
    case "contact-block":
      return profile ? <ContactBlockSection profile={profile} socialLinks={socialLinks} /> : null;
    case "recommendation-form":
      return <RecommendationFormSection section={section} />;
    default:
      return null;
  }
}

function HeroSection({
  profile,
  socialLinks,
}: {
  profile: PublicProfile;
  socialLinks: { label: string; url: string }[];
}) {
  const { t, pick } = useLanguage();
  const name = pick(profile.name, profile.nameAr);
  const location = pick(profile.location, profile.locationAr);
  return (
    <section className="relative overflow-hidden bg-surface-deep text-surface-deep-foreground">
      <img
        src={heroImage}
        alt=""
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[minmax(0,1fr)_320px] md:py-28">
        <div>
          {/* Phones: a small round portrait with the location under it instead of the large photo. */}
          <div className="mb-6 flex flex-col items-start gap-3 md:hidden">
            <img
              src={portrait}
              alt={name}
              width={80}
              height={80}
              className="h-20 w-20 shrink-0 rounded-full bg-white object-cover object-top ring-2 ring-white/25"
            />
            <p className="eyebrow !text-current opacity-80">{location}</p>
          </div>
          <p className="eyebrow hidden !text-current opacity-70 md:block">{location}</p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">{name}</h1>
          <p className="mt-4 max-w-2xl text-lg opacity-85 md:text-xl">
            {pick(profile.title, profile.titleAr)}
          </p>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed opacity-75 md:text-base">
            {pick(profile.tagline, profile.taglineAr)}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to={profile.primaryCtaTo}
              className="rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              {pick(profile.primaryCtaLabel, profile.primaryCtaLabelAr)}
            </Link>
            <Link
              to={profile.secondaryCtaTo}
              className="rounded-sm border border-white/30 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
            >
              {pick(profile.secondaryCtaLabel, profile.secondaryCtaLabelAr)}
            </Link>
            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer noopener"
                download
                className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                {t("downloadCv")}
              </a>
            )}
          </div>
          <ContactIcons
            email={profile.email}
            phone={profile.phone}
            socialLinks={socialLinks}
            tone="dark"
            className="mt-6"
          />
        </div>

        <div className="hidden md:block">
          <div className="overflow-hidden rounded-md bg-white shadow-2xl ring-1 ring-white/15">
            <img
              src={portrait}
              alt={name}
              width={502}
              height={610}
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SummarySection({
  section,
  profile,
}: {
  section: ResolvedSection;
  profile: PublicProfile | null;
}) {
  const { t, pick } = useLanguage();
  const heading = useHeading(section, "anOverview");
  const data = section.data as { currentRole: Record<string, unknown> | null } | null;
  const config = section.config as { contentEn?: string[] };
  const paragraphs = config.contentEn ?? [];
  const currentRole = data?.currentRole;

  return (
    <Section title={heading.title}>
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div
          className="max-w-3xl space-y-4 text-[0.98rem] leading-relaxed text-muted-foreground"
          dir="ltr"
        >
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="text-left">
              {p}
            </p>
          ))}
        </div>
        {currentRole && (
          <aside className="h-fit rounded-lg border border-border bg-card p-6 shadow-soft">
            <p className="eyebrow">{t("currentRole")}</p>
            <h3 className="mt-2 text-lg font-semibold leading-snug">
              {pick(String(currentRole["position"]), String(currentRole["positionAr"]))}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {pick(String(currentRole["organization"]), String(currentRole["organizationAr"]))}
            </p>
            {profile && (
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                {pick(profile.location, profile.locationAr)}
              </div>
            )}
          </aside>
        )}
      </div>
    </Section>
  );
}

/** Stats rows from the DB, in the visitor's language, for the marquee. */
function useMarqueeStats(rows: Record<string, unknown>[]): MarqueeStat[] {
  const { pick } = useLanguage();
  return rows.map((s) => ({
    id: String(s["id"]),
    value: String(s["value"]),
    label: pick(String(s["label"]), String(s["labelAr"] ?? s["label"])),
  }));
}

/** Picks stats whose English label matches, e.g. /citation/i — so the admin
 * can rename the Arabic labels or reorder them freely. */
function matchStats(rows: Record<string, unknown>[], patterns: RegExp[]) {
  return patterns
    .map((re) => rows.find((r) => re.test(String(r["label"]))))
    .filter((r): r is Record<string, unknown> => r !== undefined);
}

function StatsRowSection({ section }: { section: ResolvedSection }) {
  const { t } = useLanguage();
  const stats = useMarqueeStats((section.data as Record<string, unknown>[] | null) ?? []);
  return <StatsMarquee stats={stats} label={t("keyFigures")} />;
}

/** Career rows from the DB → steps in the visitor's language. */
function useCareerSteps(rows: Record<string, unknown>[]): CareerStep[] {
  const { t, pick } = useLanguage();
  return rows.map((c) => ({
    id: String(c["id"]),
    position: pick(String(c["position"]), String(c["positionAr"])),
    organization: pick(String(c["organization"]), String(c["organizationAr"])),
    start: String(c["startLabel"]),
    end: c["endLabel"] === "Present" ? t("present") : String(c["endLabel"]),
  }));
}

function CareerTimelineSection({ section }: { section: ResolvedSection }) {
  const { t, pick } = useLanguage();
  const heading = useHeading(section, "careerHighlights");
  const data = section.data as {
    career: Record<string, unknown>[];
    collaborations: Record<string, unknown>[];
  } | null;
  const all = data?.career ?? [];
  const collaborations = data?.collaborations ?? [];
  // Only the positions marked "highlight" in the admin (all of them if none
  // are marked), oldest first so the steps read as a progression.
  const highlighted = all.filter((c) => c["highlight"] === true);
  const steps = useCareerSteps([...(highlighted.length > 0 ? highlighted : all)].reverse());

  if (all.length === 0) {
    return (
      <Section title={heading.title}>
        <EmptyNote>{t("emptyCareer")}</EmptyNote>
      </Section>
    );
  }

  return (
    <>
      <CareerSteps
        title={heading.title}
        steps={steps}
        footer={
          <Link to="/about" className="underline underline-offset-4">
            {t("viewCareer")}
          </Link>
        }
      />

      {collaborations.length > 0 && (
        <div className="mx-auto max-w-6xl px-5 pb-10">
          <div className="flex items-start gap-4 rounded-lg border border-accent/30 bg-accent/5 p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent-foreground">
              <Users className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="eyebrow">{t("researchCollaboration")}</p>
              {collaborations.map((c) => (
                <div key={String(c["id"])} className="mt-1">
                  <h3 className="text-lg font-semibold leading-snug">
                    {pick(String(c["position"]), String(c["positionAr"]))}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {pick(String(c["organization"]), String(c["organizationAr"]))} ·{" "}
                    {String(c["startLabel"])} —{" "}
                    {c["endLabel"] === "Present" ? t("present") : String(c["endLabel"])}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ExperienceTimelineSection({ section }: { section: ResolvedSection }) {
  const heading = useHeading(section, "professionalExperience");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];
  // Full career, oldest first, as one column of steps beside the heading.
  const steps = useCareerSteps([...rows].reverse());
  if (rows.length === 0) return null;
  return <CareerSteps layout="side" title={heading.title} steps={steps} />;
}

function ExpertiseGridSection({ section }: { section: ResolvedSection }) {
  const { pick } = useLanguage();
  const heading = useHeading(section, "keyExpertise");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];
  if (rows.length === 0) return null;

  // About page: a compact list of chips.
  if (section.config["layout"] === "chips") {
    return (
      <Section title={heading.title} className="!pt-0">
        <ul className="flex flex-wrap gap-2">
          {rows.map((e) => (
            <li
              key={String(e["id"])}
              className="rounded-sm border border-border bg-card px-4 py-2 text-sm"
            >
              {pick(String(e["en"]), String(e["ar"]))}
            </li>
          ))}
        </ul>
      </Section>
    );
  }

  return (
    <Section title={heading.title} className="!pt-0">
      <LoopCarousel label={heading.title}>
        {rows.map((e) => {
          const en = String(e["en"]);
          const Icon = expertiseIcons[en] ?? Compass;
          return (
            <div
              key={String(e["id"])}
              className="flex h-full min-h-44 flex-col justify-between gap-8 rounded-md border border-border bg-card p-6 md:p-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden />
              </span>
              <p className="text-xl leading-snug font-medium md:text-2xl">
                {pick(en, String(e["ar"]))}
              </p>
            </div>
          );
        })}
      </LoopCarousel>
    </Section>
  );
}

// About-page sections below are hidden entirely when they have no items.

function EducationGridSection({ section }: { section: ResolvedSection }) {
  const { pick } = useLanguage();
  const heading = useHeading(section, "academicBackground");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];
  if (rows.length === 0) return null;

  return (
    <Section title={heading.title} className="!pt-0">
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((e) => (
          <article key={String(e["id"])} className="rounded-md border border-border bg-card p-6">
            <p className="eyebrow">{String(e["year"])}</p>
            <h3 className="mt-2 text-lg">{pick(String(e["degree"]), String(e["degreeAr"]))}</h3>
            <p className="text-sm text-muted-foreground">
              {pick(String(e["university"]), String(e["universityAr"]))}
            </p>
            {Boolean(e["description"]) && (
              <p className="mt-2 text-sm text-muted-foreground">
                {pick(String(e["description"]), String(e["descriptionAr"] ?? e["description"]))}
              </p>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

function MembershipsListSection({ section }: { section: ResolvedSection }) {
  const { pick } = useLanguage();
  const heading = useHeading(section, "membershipsCommittees");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];
  if (rows.length === 0) return null;

  return (
    <Section title={heading.title} className="!pt-0">
      <ul className="divide-y divide-border rounded-md border border-border bg-card">
        {rows.map((m) => (
          <li key={String(m["id"])} className="px-6 py-4">
            <p className="text-base">{pick(String(m["title"]), String(m["titleAr"]))}</p>
            {Boolean(m["period"]) && (
              <p className="text-sm text-muted-foreground">{String(m["period"])}</p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

const LIST_BLOCK_HEADINGS: Record<string, [DictionaryKey, DictionaryKey, DictionaryKey]> = {
  researchSpecialties: ["research", "researchSpecialties", "emptyResearchSpecialties"],
  activities: ["activities", "scientificActivities", "emptyActivities"],
  languagesList: ["languages", "languages", "emptyLanguages"],
  interests: ["personal", "interests", "emptyInterests"],
};

function ListBlockSection({ section }: { section: ResolvedSection }) {
  const { pick } = useLanguage();
  const collection = (section.config["collection"] as string) ?? "researchSpecialties";
  const [, titleKey] =
    LIST_BLOCK_HEADINGS[collection] ?? LIST_BLOCK_HEADINGS["researchSpecialties"]!;
  const heading = useHeading(section, titleKey);
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];
  if (rows.length === 0) return null;

  // Activities are full sentences: a two-column list of cards. Others: chips.
  if (collection === "activities") {
    return (
      <Section title={heading.title} className="!pt-0">
        <ul className="grid gap-3 md:grid-cols-2">
          {rows.map((i) => (
            <li
              key={String(i["id"])}
              className="rounded-md border border-border bg-card px-5 py-4 text-sm"
            >
              {pick(String(i["en"]), String(i["ar"]))}
            </li>
          ))}
        </ul>
      </Section>
    );
  }

  return (
    <Section title={heading.title} className="!pt-0">
      <ul className="flex flex-wrap gap-2">
        {rows.map((i) => (
          <li
            key={String(i["id"])}
            className="rounded-sm border border-border bg-card px-4 py-2 text-sm"
          >
            {pick(String(i["en"]), String(i["ar"]))}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function PublicationsCarouselSection({ section }: { section: ResolvedSection }) {
  const { t } = useLanguage();
  const heading = useHeading(section, "myPublications");
  const items = (section.data as Publication[] | null) ?? [];

  return (
    <Section title={heading.title} className="!pt-0">
      {items.length === 0 ? (
        <EmptyNote>{t("emptyFeaturedPublications")}</EmptyNote>
      ) : (
        <LoopCarousel label={heading.title} footer={<ExploreLink to="/publications" />}>
          {items.map((p) => (
            <PublicationCard key={p.id} publication={p} compact />
          ))}
        </LoopCarousel>
      )}
    </Section>
  );
}

function ExploreLink({ to }: { to: "/publications" | "/interviews" }) {
  const { t } = useLanguage();
  return (
    <Link to={to} className="inline-flex items-center gap-1 underline underline-offset-4">
      {t(to === "/publications" ? "exploreAllPublications" : "exploreInterviewsArticles")}
      <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
    </Link>
  );
}

function MediaCarouselSection({ section }: { section: ResolvedSection }) {
  const { t } = useLanguage();
  const heading = useHeading(section, "interviewsArticlesHeadline");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];
  const items: MediaItem[] = rows.map((m) => ({
    ...(m as unknown as MediaItem),
    date: String(m["dateLabel"]),
  }));

  return (
    <Section title={heading.title} className="!pt-0">
      {items.length === 0 ? (
        <EmptyNote>{t("emptyFeaturedMedia")}</EmptyNote>
      ) : (
        <LoopCarousel label={heading.title} footer={<ExploreLink to="/interviews" />}>
          {items.map((m) => (
            <MediaCard key={m.id} item={m} />
          ))}
        </LoopCarousel>
      )}
    </Section>
  );
}

function RecommendationsGridSection({ section }: { section: ResolvedSection }) {
  const { t } = useLanguage();
  const heading = useHeading(section, "recommendationsHeadline");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];

  return (
    <Section
      title={heading.title}
      className="!pt-0"
      action={
        <Link
          to="/about"
          hash="recommendation-form"
          className="shrink-0 rounded-sm bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          {t("leaveARecommendation")}
        </Link>
      }
    >
      {rows.length === 0 ? (
        <EmptyNote>{t("emptyRecommendations")}</EmptyNote>
      ) : (
        <LoopCarousel label={heading.title} wide autoplay>
          {rows.map((r) => (
            <blockquote
              key={String(r["id"])}
              dir="auto"
              className="h-full rounded-md border border-border bg-card p-6 text-start md:p-8"
            >
              <Quote className="h-6 w-6 text-accent rtl:-scale-x-100" aria-hidden />
              <p className="mt-4 text-base leading-relaxed">{String(r["body"])}</p>
              <footer className="mt-6 text-sm">
                <span className="font-medium">{String(r["name"])}</span>
                <span className="block text-muted-foreground">
                  {String(r["position"])}
                  {r["organization"] ? `, ${String(r["organization"])}` : ""}
                </span>
              </footer>
            </blockquote>
          ))}
        </LoopCarousel>
      )}
    </Section>
  );
}

const recommendationFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  position: z.string().trim().min(2, "Please enter your position."),
  organization: z.string().trim(),
  body: z.string().trim().min(20, "Please write at least a few sentences."),
});
type RecommendationFormValues = z.infer<typeof recommendationFormSchema>;

function RecommendationFormSection({ section }: { section: ResolvedSection }) {
  const { t } = useLanguage();
  const heading = useHeading(section, "shareYourExperience");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: { name: "", position: "", organization: "", body: "" },
  });

  async function onSubmit(values: RecommendationFormValues) {
    setStatus("idle");
    try {
      await submitRecommendation({ data: values });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section id="recommendation-form" title={heading.title}>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {t("recommendationFormIntro")}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 max-w-2xl space-y-4"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fullName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("fullNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("recommendationPosition")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("recommendationPositionPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("recommendationOrganization")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("recommendationOrganizationPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("recommendationBody")}</FormLabel>
                <FormControl>
                  <Textarea rows={6} placeholder={t("recommendationBodyPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
            {form.formState.isSubmitting
              ? t("submittingRecommendation")
              : t("submitRecommendation")}
          </Button>

          {status === "success" && (
            <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-4 py-3 text-sm text-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-foreground" />
              {t("recommendationSubmitSuccess")}
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {t("recommendationSubmitError")}
            </div>
          )}
        </form>
      </Form>
    </Section>
  );
}

function PublicationsFullListSection({ section }: { section: ResolvedSection }) {
  const { t, pick } = useLanguage();
  const heading = useHeading(section, "publicationsHeadline");
  const data = section.data as { items: Publication[]; stats: Record<string, unknown>[] } | null;
  const allItems = useMemo(() => data?.items ?? [], [data]);
  const stats = useMarqueeStats(
    matchStats(data?.stats ?? [], [/publication/i, /citation/i, /h-?index/i, /book/i]),
  );

  const [query, setQuery] = useState("");
  const [year, setYear] = useState("All");
  const [type, setType] = useState("All");
  const [area, setArea] = useState("All");

  const selectClass =
    "rounded-sm border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-accent";

  const years = useMemo(
    () => ["All", ...Array.from(new Set(allItems.map((p) => p.year))).sort((a, b) => b - a)],
    [allItems],
  );
  const types = useMemo(
    () => ["All", ...Array.from(new Set(allItems.map((p) => p.type)))],
    [allItems],
  );
  const areas = useMemo(
    () => ["All", ...Array.from(new Set(allItems.map((p) => p.area).filter(Boolean))).sort()],
    [allItems],
  );
  const areaAr = useMemo(
    () => new Map(allItems.filter((p) => p.areaAr).map((p) => [p.area, p.areaAr!])),
    [allItems],
  );

  const filtered = allItems.filter((p) => {
    const matchesQuery = `${p.title} ${p.titleAr} ${p.authors} ${p.journal}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesYear = year === "All" || p.year === Number(year);
    const matchesType = type === "All" || p.type === type;
    const matchesArea = area === "All" || p.area === area;
    return matchesQuery && matchesYear && matchesType && matchesArea;
  });

  const groups: { headingKey: DictionaryKey; types: string[] }[] = [
    { headingKey: "journalArticles", types: ["Journal Article"] },
    { headingKey: "scientificBooks", types: ["Scientific Book"] },
    { headingKey: "reportsOther", types: ["Report", "Conference Paper", "Other"] },
  ];

  return (
    <Section title={heading.title}>
      <p className="-mt-4 mb-8 max-w-2xl text-sm text-muted-foreground">
        {t("publicationsPageIntro")}
      </p>

      {stats.length > 0 && (
        <div className="mb-14 -mx-5 md:mx-0">
          <StatsMarquee stats={stats} label={heading.title} />
        </div>
      )}

      <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPublications")}
          className={selectClass}
        />
        <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
          {years.map((y) => (
            <option key={y} value={y}>
              {y === "All" ? t("allYears") : y}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
          {types.map((ty) => (
            <option key={ty} value={ty}>
              {ty === "All" ? t("allTypes") : pick(ty, publicationTypeAr[ty] ?? ty)}
            </option>
          ))}
        </select>
        <select value={area} onChange={(e) => setArea(e.target.value)} className={selectClass}>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a === "All" ? t("allAreas") : pick(a, areaAr.get(a) ?? a)}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-10 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} / {allItems.length}
      </p>

      {filtered.length === 0 ? (
        <EmptyNote>{t("noPublicationsMatch")}</EmptyNote>
      ) : (
        <div className="space-y-14">
          {groups.map((group) => {
            const items = filtered.filter((p) => group.types.includes(p.type));
            if (items.length === 0) return null;
            return (
              <div key={group.headingKey}>
                <h3 className="mb-5 font-[family-name:var(--font-display)] text-2xl font-bold">
                  {t(group.headingKey)}
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => (
                    <PublicationCard key={p.id} publication={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}

function MediaFullGridSection({ section }: { section: ResolvedSection }) {
  const { t } = useLanguage();
  const heading = useHeading(section, "interviewsArticlesHeadline");
  const data = section.data as {
    items: Record<string, unknown>[];
    stats: Record<string, unknown>[];
  } | null;
  const items: MediaItem[] = (data?.items ?? []).map((m) => ({
    ...(m as unknown as MediaItem),
    date: String(m["dateLabel"] ?? ""),
  }));
  // Videos as tiles, everything else as a list of press articles.
  const videos = items.filter((m) => m.videoUrl);
  const articles = items.filter((m) => !m.videoUrl);

  // Profile figures plus live counts from the database.
  const statRows = data?.stats ?? [];
  const profileStats = useMarqueeStats([
    ...matchStats(statRows, [/interview|article|media/i]),
    ...matchStats(statRows, [/year/i]),
  ]);
  const stats: MarqueeStat[] = [
    ...profileStats.slice(0, 1),
    { id: "videos", value: String(videos.length), label: t("videoInterviews") },
    { id: "articles", value: String(articles.length), label: t("pressArticles") },
    ...profileStats.slice(1),
  ].filter((s) => s.value !== "0");

  return (
    <>
      <Section title={heading.title}>
        <p className="-mt-4 mb-8 max-w-2xl text-sm text-muted-foreground">
          {t("interviewsArticlesIntro")}
        </p>
        {items.length > 0 && (
          <div className="mb-14 -mx-5 md:mx-0">
            <StatsMarquee stats={stats} label={heading.title} />
          </div>
        )}
        {items.length === 0 && <EmptyNote>{t("emptyInterviews")}</EmptyNote>}

        {videos.length > 0 && (
          <>
            <h3 className="mb-6 text-2xl">{t("videoInterviews")}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((m) => (
                <VideoTile key={m.id} item={m} />
              ))}
            </div>
          </>
        )}
      </Section>

      {articles.length > 0 && (
        <Section title={t("pressArticles")} className="!pt-0">
          <ul className="divide-y divide-border rounded-md border border-border bg-card">
            {articles.map((m) => (
              <li key={m.id}>
                <ArticleRow item={m} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}

function RichTextSection({
  section,
  profile,
  socialLinks,
}: {
  section: ResolvedSection;
  profile: PublicProfile | null;
  socialLinks: { label: string; url: string }[];
}) {
  const { t, pick } = useLanguage();
  const heading = useHeading(section, "biography");
  const config = section.config as { contentEn?: string[]; showPortrait?: boolean };
  const paragraphs = config.contentEn ?? [];

  const text = (
    <div
      className="max-w-3xl space-y-4 text-[0.98rem] leading-relaxed text-muted-foreground"
      dir="ltr"
    >
      {paragraphs.map((p) => (
        <p key={p.slice(0, 24)} className="text-left">
          {p}
        </p>
      ))}
    </div>
  );

  if (!config.showPortrait) {
    return <Section title={heading.title}>{text}</Section>;
  }

  // About page biography: text with a contact button and icons, portrait beside it.
  return (
    <Section title={heading.title}>
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          {text}
          <div className="flex flex-wrap items-center gap-4 pt-8">
            <Link
              to="/contact"
              className="inline-block rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              {t("contact")}
            </Link>
            {profile && (
              <ContactIcons email={profile.email} phone={profile.phone} socialLinks={socialLinks} />
            )}
          </div>
        </div>
        <div className="order-first md:order-none">
          <div className="mx-auto max-w-[280px] overflow-hidden rounded-md border border-border bg-white md:max-w-none">
            <img
              src={portrait}
              alt={profile ? pick(profile.name, profile.nameAr) : ""}
              width={502}
              height={610}
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

/** A highlighted quote on a dark band (About page). */
function QuoteSection({ section }: { section: ResolvedSection }) {
  const { language, pick } = useLanguage();
  const c = section.config as {
    textEn?: string;
    textAr?: string;
    attributionEn?: string;
    attributionAr?: string;
  };
  const text = pick(c.textEn ?? "", c.textAr || c.textEn);
  if (!text) return null;
  const attribution = pick(c.attributionEn ?? "", c.attributionAr || c.attributionEn);

  return (
    <section className="bg-surface-deep text-surface-deep-foreground">
      <figure className="mx-auto max-w-4xl px-5 py-16 text-center md:py-20">
        <Quote className="mx-auto h-8 w-8 text-accent rtl:-scale-x-100" aria-hidden />
        <blockquote className="mt-6 font-[family-name:var(--font-display)] text-xl leading-relaxed md:text-2xl">
          {language === "ar" ? `«${text}»` : `“${text}”`}
        </blockquote>
        {attribution && (
          <figcaption className="mt-6 text-sm opacity-70">— {attribution}</figcaption>
        )}
      </figure>
    </section>
  );
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  subject: z.string().trim().min(3, "Please enter a subject."),
  message: z.string().trim().min(10, "Message should be at least 10 characters."),
});
type ContactValues = z.infer<typeof contactSchema>;

function ContactBlockSection({
  profile,
  socialLinks,
}: {
  profile: PublicProfile;
  socialLinks: { label: string; url: string }[];
}) {
  const { t, pick } = useLanguage();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: ContactValues) {
    setStatus("idle");
    try {
      await submitContactMessage({ data: values });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h1 className="text-3xl md:text-4xl">{t("letsConnect")}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("contactIntro")}
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_320px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fullName")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("fullNamePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t("emailPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subject")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("subjectPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("message")}</FormLabel>
                    <FormControl>
                      <Textarea rows={6} placeholder={t("messagePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
                {form.formState.isSubmitting ? t("sending") : t("sendMessage")}
              </Button>

              {status === "success" && (
                <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-4 py-3 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-foreground" />
                  {t("sendSuccess")}
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {t("sendError")}
                </div>
              )}
            </form>
          </Form>

          <aside className="space-y-4 text-sm">
            <div>
              <p className="eyebrow">{t("email")}</p>
              <a
                href={`mailto:${profile.email}`}
                dir="ltr"
                className="mt-1 flex items-center gap-2 hover:underline"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {profile.email}
              </a>
            </div>
            <div>
              <p className="eyebrow">{t("phone")}</p>
              <a
                href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                dir="ltr"
                className="mt-1 flex items-center gap-2 hover:underline"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {profile.phone}
              </a>
            </div>
            {profile.location && (
              <div>
                <p className="eyebrow">{t("location")}</p>
                <p className="mt-1">{pick(profile.location, profile.locationAr)}</p>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div>
                <p className="eyebrow">{t("profiles")}</p>
                <ul className="mt-1 space-y-1">
                  {socialLinks.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline underline-offset-4"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}
