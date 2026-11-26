import { Link, useLocation } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  MapPin,
  Users,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Download,
  Linkedin,
  Loader2,
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
import { ExpertiseList } from "@/components/site/ExpertiseList";
import { ResearchSpecialties } from "@/components/site/ResearchSpecialties";
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
      {/* The portrait lives in the site header now; the hero is a single text column. */}
      <div className="relative mx-auto max-w-6xl px-5 pt-10 pb-10 md:pt-16 md:pb-16">
        <div>
          <p className="eyebrow !text-current opacity-70">{location}</p>
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
  return <StatsMarquee stats={stats} label={t("keyFigures")} tone="dark" />;
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

  // Sticky title beside a numbered list; the row in the middle of the screen
  // turns gold while scrolling.
  return (
    <ExpertiseList
      title={heading.title}
      items={rows.map((e) => pick(String(e["en"]), String(e["ar"])))}
      className="!pt-0"
    />
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
  const { t, pick } = useLanguage();
  const collection = (section.config["collection"] as string) ?? "researchSpecialties";
  const [, titleKey] =
    LIST_BLOCK_HEADINGS[collection] ?? LIST_BLOCK_HEADINGS["researchSpecialties"]!;
  const heading = useHeading(section, titleKey);
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];
  if (rows.length === 0) return null;

  // Research specialties: sticky title beside an accordion that opens the
  // item in the middle of the screen while scrolling.
  if (collection === "researchSpecialties") {
    return (
      <ResearchSpecialties
        title={heading.title}
        linkLabel={t("exploreAllPublications")}
        items={rows.map((i) => ({
          id: String(i["id"]),
          title: pick(String(i["en"]), String(i["ar"])),
          description: i["description"]
            ? pick(String(i["description"]), String(i["descriptionAr"] ?? i["description"]))
            : null,
        }))}
        className="!pt-0"
      />
    );
  }

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
        <LoopCarousel
          emphasizeCenter
          label={heading.title}
          footer={<ExploreLink to="/publications" />}
        >
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
        <LoopCarousel
          emphasizeCenter
          label={heading.title}
          footer={<ExploreLink to="/interviews" />}
        >
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
      className="!pt-0 !pb-6 md:!pb-8"
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
        <LoopCarousel label={heading.title} loop={false}>
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
  const { pick } = useLanguage();
  const isHome = useLocation({ select: (l) => l.pathname === "/" });
  const c = section.config as {
    textEn?: string;
    textAr?: string;
    attributionEn?: string;
    attributionAr?: string;
  };
  const text = pick(c.textEn ?? "", c.textAr || c.textEn);
  if (!text) return null;
  const attribution = pick(c.attributionEn ?? "", c.attributionAr || c.attributionEn);
  const mark = "inline-block size-5 text-accent md:size-6";

  return (
    <section className="bg-surface-deep text-surface-deep-foreground">
      <figure className="mx-auto max-w-6xl px-5 py-10 md:py-12">
        <blockquote
          className={`max-w-4xl text-start font-[family-name:var(--font-display)] text-lg leading-relaxed md:text-xl ${
            isHome ? "italic" : ""
          }`}
        >
          <Quote className={`${mark} me-2 -translate-y-1 align-top rtl:-scale-x-100`} aria-hidden />
          {text}
          <Quote
            className={`${mark} ms-2 translate-y-1 rotate-180 align-bottom rtl:-scale-x-100`}
            aria-hidden
          />
        </blockquote>
        {attribution && (
          <figcaption className="mt-5 text-start text-sm opacity-70">— {attribution}</figcaption>
        )}
      </figure>
    </section>
  );
}

type ContactField = "name" | "email" | "subject" | "message";
const CONTACT_FIELDS: ContactField[] = ["name", "email", "subject", "message"];
const CONTACT_EMPTY = { name: "", email: "", subject: "", message: "", website: "" };
const CONTACT_LIMITS: Record<ContactField, number> = {
  name: 200,
  email: 200,
  subject: 300,
  message: 5000,
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact page (layout adapted from narsyss.com/contact): heading and a
 * contacts card on one side, the message form on the other. Each field is
 * checked when the visitor leaves it and again on send; messages go to the
 * admin inbox.
 */
function ContactBlockSection({
  profile,
  socialLinks,
}: {
  profile: PublicProfile;
  socialLinks: { label: string; url: string }[];
}) {
  const { t, pick } = useLanguage();
  const location = pick(profile.location, profile.locationAr);
  const [values, setValues] = useState(CONTACT_EMPTY);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const check = (k: ContactField, v: string) => {
    if (!v.trim()) return t("fieldRequired");
    if (k === "email" && !EMAIL_RE.test(v.trim())) return t("invalidEmail");
    return undefined;
  };
  const set =
    (k: ContactField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.target.value;
      setValues((s) => ({ ...s, [k]: v }));
      // Once a field shows an error, re-check it while typing so it clears when fixed.
      if (errors[k]) setErrors((er) => ({ ...er, [k]: check(k, v) }));
      if (status === "error" || status === "sent") setStatus("idle");
    };
  const blur = (k: ContactField) => () => {
    if (values[k]) setErrors((er) => ({ ...er, [k]: check(k, values[k]) }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const found: Partial<Record<ContactField, string>> = {};
    for (const k of CONTACT_FIELDS) {
      const m = check(k, values[k]);
      if (m) found[k] = m;
    }
    setErrors(found);
    const first = CONTACT_FIELDS.find((k) => found[k]);
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      await submitContactMessage({ data: values });
      setStatus("sent");
      setValues(CONTACT_EMPTY);
    } catch {
      setStatus("error");
    }
  }

  const linkedin = socialLinks.find((l) => /linkedin/i.test(l.label) || /linkedin/i.test(l.url));
  const channels = [
    profile.email && {
      Icon: Mail,
      label: t("email"),
      value: profile.email,
      href: `mailto:${profile.email}`,
      ltr: true,
    },
    profile.phone && {
      Icon: Phone,
      label: t("phone"),
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s+/g, "")}`,
      ltr: true,
    },
    linkedin && {
      Icon: Linkedin,
      label: "LinkedIn",
      value: t("viewProfile"),
      href: linkedin.url,
      external: true,
    },
    location && { Icon: MapPin, label: t("location"), value: location },
  ].filter(Boolean) as {
    Icon: LucideIcon;
    label: string;
    value: string;
    href?: string;
    ltr?: boolean;
    external?: boolean;
  }[];

  const field =
    "w-full rounded-md border bg-card px-4 text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30";
  const border = (k: ContactField) => (errors[k] ? "border-destructive" : "border-input");
  const aria = (k: ContactField) => ({
    id: `contact-${k}`,
    name: k,
    maxLength: CONTACT_LIMITS[k],
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `contact-${k}-error` : undefined,
  });
  const err = (k: ContactField) =>
    errors[k] && (
      <span id={`contact-${k}-error`} className="text-sm text-destructive">
        {errors[k]}
      </span>
    );
  const note =
    status === "sent"
      ? t("sendSuccess")
      : status === "error"
        ? t("sendError")
        : status === "idle"
          ? t("contactHint")
          : "";

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-10">
        {/* Heading */}
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="eyebrow">
            {t("contact")}
            {location ? ` · ${location}` : ""}
          </p>
          <h1 className="mt-6 text-4xl leading-[1.1] md:text-5xl lg:text-[3.25rem]">
            <span className="block text-muted-foreground/70">{t("contactHeadingMuted")}</span>
            <span className="mt-1 block">
              {t("contactHeadingLead")}
              <span className="text-accent">{t("contactHeadingAccent")}</span>
            </span>
          </h1>
        </div>

        {/* Form */}
        <div id="message" className="scroll-mt-28 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-6">
            {/* Spam trap: hidden from people and screen readers; bots fill it in. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0 [clip-path:inset(50%)]"
            >
              <label>
                Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={(e) => setValues((s) => ({ ...s, website: e.target.value }))}
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2.5">
                <span className="eyebrow">{t("fullName")}</span>
                <input
                  {...aria("name")}
                  required
                  autoComplete="name"
                  placeholder={t("fullNamePlaceholder")}
                  value={values.name}
                  onChange={set("name")}
                  onBlur={blur("name")}
                  className={`${field} h-12 ${border("name")}`}
                />
                {err("name")}
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="eyebrow">{t("email")}</span>
                <input
                  {...aria("email")}
                  required
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  dir="ltr"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={set("email")}
                  onBlur={blur("email")}
                  className={`${field} h-12 rtl:text-right ${border("email")}`}
                />
                {err("email")}
              </label>
            </div>
            <label className="flex flex-col gap-2.5">
              <span className="eyebrow">{t("subject")}</span>
              <input
                {...aria("subject")}
                required
                placeholder={t("subjectExample")}
                value={values.subject}
                onChange={set("subject")}
                onBlur={blur("subject")}
                className={`${field} h-12 ${border("subject")}`}
              />
              {err("subject")}
            </label>
            <label className="flex flex-col gap-2.5">
              <span className="eyebrow">{t("message")}</span>
              <textarea
                {...aria("message")}
                required
                rows={6}
                placeholder={t("messageExample")}
                value={values.message}
                onChange={set("message")}
                onBlur={blur("message")}
                className={`${field} min-h-40 resize-y py-3 ${border("message")}`}
              />
              {err("message")}
            </label>

            <div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex h-12 items-center gap-3 rounded-sm bg-primary ps-6 pe-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? t("sending") : t("sendMessage")}
                {status === "sending" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                    aria-hidden
                  />
                )}
              </button>
              <p
                aria-live="polite"
                className={`mt-5 text-sm ${
                  status === "error"
                    ? "text-destructive"
                    : status === "sent"
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {note}
              </p>
            </div>
          </form>
        </div>

        {/* Contacts card */}
        <div className="lg:col-start-1 lg:row-start-2 lg:self-end">
          <div className="rounded-md border border-border bg-card p-3">
            <p className="eyebrow px-3 pt-3 pb-2">{t("contactsLabel")}</p>
            <ul>
              {channels.map((ch) => {
                const inner = (
                  <>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <ch.Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-muted-foreground">{ch.label}</span>
                      <span
                        dir={ch.ltr ? "ltr" : undefined}
                        className="mt-0.5 block truncate text-base text-foreground"
                      >
                        {ch.value}
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={ch.label}>
                    {ch.href ? (
                      <a
                        href={ch.href}
                        {...(ch.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                        className="group flex items-center gap-4 rounded-md p-3 transition-colors duration-300 hover:bg-muted/60"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-3">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
