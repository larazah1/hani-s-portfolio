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
  type LucideIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import heroImage from "@/assets/hero-seismic.jpg";
import { Section, EmptyNote } from "@/components/site/Section";
import { PublicationCard, type Publication } from "@/components/site/PublicationCard";
import { MediaCard, type MediaItem } from "@/components/site/MediaCard";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
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
};

function useHeading(section: ResolvedSection, eyebrowKey: DictionaryKey, titleKey: DictionaryKey) {
  const { t, pick } = useLanguage();
  const eyebrow = section.eyebrow
    ? pick(section.eyebrow, section.eyebrowAr ?? section.eyebrow)
    : t(eyebrowKey);
  const title = section.title ? pick(section.title, section.titleAr ?? section.title) : t(titleKey);
  return { eyebrow, title };
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
      return profile ? <HeroSection profile={profile} /> : null;
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
      return <RichTextSection section={section} />;
    case "contact-block":
      return profile ? <ContactBlockSection profile={profile} socialLinks={socialLinks} /> : null;
    case "recommendation-form":
      return <RecommendationFormSection section={section} />;
    default:
      return null;
  }
}

function HeroSection({ profile }: { profile: PublicProfile }) {
  const { pick } = useLanguage();
  return (
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
  const heading = useHeading(section, "professionalSummary", "anOverview");
  const data = section.data as { currentRole: Record<string, unknown> | null } | null;
  const config = section.config as { contentEn?: string[] };
  const paragraphs = config.contentEn ?? [];
  const currentRole = data?.currentRole;

  return (
    <Section eyebrow={heading.eyebrow} title={heading.title}>
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

function StatsRowSection({ section }: { section: ResolvedSection }) {
  const { pick } = useLanguage();
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 py-12 md:grid-cols-5">
        {rows.map((s) => (
          <div key={String(s["id"])} className="px-2 py-4 text-center">
            <p className="font-[family-name:var(--font-display)] text-4xl">{String(s["value"])}</p>
            <p className="eyebrow mt-2">{pick(String(s["label"]), String(s["labelAr"]))}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CareerTimelineSection({ section }: { section: ResolvedSection }) {
  const { t, pick } = useLanguage();
  const heading = useHeading(section, "career", "careerHighlights");
  const data = section.data as {
    career: Record<string, unknown>[];
    collaborations: Record<string, unknown>[];
  } | null;
  const career = data?.career ?? [];
  const collaborations = data?.collaborations ?? [];

  return (
    <Section eyebrow={heading.eyebrow} title={heading.title}>
      {career.length === 0 ? (
        <EmptyNote>{t("emptyCareer")}</EmptyNote>
      ) : (
        <ol className="border-s border-border">
          {career.map((c) => (
            <li key={String(c["id"])} className="group relative pb-2 ps-8">
              <span className="absolute -start-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
              <div className="-ms-3 rounded-md px-3 py-4 transition-colors group-hover:bg-secondary/50">
                <p className="eyebrow">
                  {String(c["startLabel"])} —{" "}
                  {c["endLabel"] === "Present" ? t("present") : String(c["endLabel"])}
                </p>
                <h3 className="mt-1 text-xl font-semibold">
                  {pick(String(c["position"]), String(c["positionAr"]))}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {pick(String(c["organization"]), String(c["organizationAr"]))}
                </p>
                {Boolean(c["description"]) && (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {pick(String(c["description"]), String(c["descriptionAr"] ?? c["description"]))}
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
      )}
    </Section>
  );
}

function ExperienceTimelineSection({ section }: { section: ResolvedSection }) {
  const { t, pick } = useLanguage();
  const heading = useHeading(section, "experience", "professionalExperience");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];

  return (
    <Section eyebrow={heading.eyebrow} title={heading.title}>
      {rows.length === 0 ? (
        <EmptyNote>{t("emptyExperience")}</EmptyNote>
      ) : (
        <ol className="border-s border-border">
          {rows.map((c) => (
            <li key={String(c["id"])} className="relative pb-10 ps-8">
              <span className="absolute -start-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent" />
              <p className="eyebrow">
                {String(c["startLabel"])} —{" "}
                {c["endLabel"] === "Present" ? t("present") : String(c["endLabel"])}
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                {pick(String(c["position"]), String(c["positionAr"]))}
              </h3>
              <p className="text-sm text-muted-foreground">
                {pick(String(c["organization"]), String(c["organizationAr"]))}
              </p>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}

function ExpertiseGridSection({ section }: { section: ResolvedSection }) {
  const { pick } = useLanguage();
  const heading = useHeading(section, "expertise", "keyExpertise");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];

  return (
    <Section eyebrow={heading.eyebrow} title={heading.title}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((e) => {
          const en = String(e["en"]);
          const Icon = expertiseIcons[en] ?? Compass;
          return (
            <div
              key={String(e["id"])}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent-foreground">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="text-sm font-medium">{pick(en, String(e["ar"]))}</span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function EducationGridSection({ section }: { section: ResolvedSection }) {
  const { t, pick } = useLanguage();
  const heading = useHeading(section, "education", "academicBackground");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];

  return (
    <Section eyebrow={heading.eyebrow} title={heading.title}>
      {rows.length === 0 ? (
        <EmptyNote>{t("emptyEducation")}</EmptyNote>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((e) => (
            <article key={String(e["id"])} className="rounded-md border border-border bg-card p-6">
              <p className="eyebrow">{String(e["year"])}</p>
              <h3 className="mt-2 text-lg font-semibold">
                {pick(String(e["degree"]), String(e["degreeAr"]))} ·{" "}
                {pick(String(e["field"]), String(e["fieldAr"]))}
              </h3>
              <p className="text-sm text-muted-foreground">
                {pick(String(e["university"]), String(e["universityAr"]))},{" "}
                {pick(String(e["location"]), String(e["locationAr"]))}
              </p>
              {Boolean(e["description"]) && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {pick(String(e["description"]), String(e["descriptionAr"] ?? e["description"]))}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}

function MembershipsListSection({ section }: { section: ResolvedSection }) {
  const { t, pick } = useLanguage();
  const heading = useHeading(section, "affiliations", "membershipsCommittees");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];

  return (
    <Section eyebrow={heading.eyebrow} title={heading.title}>
      {rows.length === 0 ? (
        <EmptyNote>{t("emptyMemberships")}</EmptyNote>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border bg-card">
          {rows.map((m) => (
            <li key={String(m["id"])} className="px-6 py-4">
              <p className="text-base font-semibold">
                {pick(String(m["title"]), String(m["titleAr"]))}
              </p>
              {Boolean(m["period"]) && (
                <p className="text-sm text-muted-foreground">{String(m["period"])}</p>
              )}
            </li>
          ))}
        </ul>
      )}
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
  const [eyebrowKey, titleKey, emptyKey] =
    LIST_BLOCK_HEADINGS[collection] ?? LIST_BLOCK_HEADINGS["researchSpecialties"]!;
  const heading = useHeading(section, eyebrowKey, titleKey);
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];

  return (
    <Section eyebrow={heading.eyebrow} title={heading.title}>
      {rows.length === 0 ? (
        <EmptyNote>{t(emptyKey)}</EmptyNote>
      ) : (
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
      )}
    </Section>
  );
}

function PublicationsCarouselSection({ section }: { section: ResolvedSection }) {
  const { t } = useLanguage();
  const heading = useHeading(section, "selectedResearch", "myPublications");
  const items = (section.data as Publication[] | null) ?? [];

  return (
    <Section eyebrow={heading.eyebrow} title={heading.title}>
      <p className="-mt-2 mb-8 max-w-2xl text-sm text-muted-foreground">{t("publicationsIntro")}</p>
      {items.length === 0 ? (
        <EmptyNote>{t("emptyFeaturedPublications")}</EmptyNote>
      ) : (
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {items.map((p) => (
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
  );
}

function MediaCarouselSection({ section }: { section: ResolvedSection }) {
  const { t } = useLanguage();
  const heading = useHeading(section, "media", "interviewsArticlesHeadline");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];
  const items: MediaItem[] = rows.map((m) => ({
    ...(m as unknown as MediaItem),
    date: String(m["dateLabel"]),
  }));

  return (
    <Section eyebrow={heading.eyebrow} title={heading.title}>
      {items.length === 0 ? (
        <EmptyNote>{t("emptyFeaturedMedia")}</EmptyNote>
      ) : (
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {items.map((m) => (
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
  );
}

function RecommendationsGridSection({ section }: { section: ResolvedSection }) {
  const { t } = useLanguage();
  const heading = useHeading(section, "recommendations", "recommendationsHeadline");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];

  return (
    <Section
      eyebrow={heading.eyebrow}
      title={heading.title}
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
        <div className="grid gap-4 md:grid-cols-3">
          {rows.map((r) => (
            <blockquote
              key={String(r["id"])}
              dir="ltr"
              className="rounded-md border border-border bg-card p-6 text-left"
            >
              <p className="text-sm leading-relaxed">{String(r["body"])}</p>
              <footer className="mt-4 text-sm">
                <span className="font-medium">{String(r["name"])}</span>
                <span className="block text-muted-foreground">
                  {String(r["position"])}
                  {r["organization"] ? `, ${String(r["organization"])}` : ""}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
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
  const heading = useHeading(section, "recommendations", "shareYourExperience");
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
    <Section id="recommendation-form" eyebrow={heading.eyebrow} title={heading.title}>
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
  const heading = useHeading(section, "researchOutput", "publicationsHeadline");
  const allItems = (section.data as Publication[] | null) ?? [];

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
    () => ["All", ...Array.from(new Set(allItems.map((p) => p.area))).sort()],
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
    <Section eyebrow={heading.eyebrow} title={heading.title}>
      <p className="-mt-4 mb-8 max-w-2xl text-sm text-muted-foreground">
        {t("publicationsPageIntro")}
      </p>

      <div className="mb-10 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
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
              {a === "All" ? t("allAreas") : a}
            </option>
          ))}
        </select>
      </div>

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
  const heading = useHeading(section, "media", "interviewsArticlesHeadline");
  const rows = (section.data as Record<string, unknown>[] | null) ?? [];
  const items: MediaItem[] = rows.map((m) => ({
    ...(m as unknown as MediaItem),
    date: String(m["dateLabel"]),
  }));

  return (
    <Section eyebrow={heading.eyebrow} title={heading.title}>
      <p className="-mt-4 mb-8 max-w-2xl text-sm text-muted-foreground">
        {t("interviewsArticlesIntro")}
      </p>
      {items.length === 0 ? (
        <EmptyNote>{t("emptyInterviews")}</EmptyNote>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <MediaCard key={m.id} item={m} />
          ))}
        </div>
      )}
    </Section>
  );
}

function RichTextSection({ section }: { section: ResolvedSection }) {
  const heading = useHeading(section, "about", "biography");
  const config = section.config as { contentEn?: string[] };
  const paragraphs = config.contentEn ?? [];

  return (
    <Section eyebrow={heading.eyebrow} title={heading.title}>
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
    </Section>
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
          <p className="eyebrow">{t("contact")}</p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">{t("letsConnect")}</h1>
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
