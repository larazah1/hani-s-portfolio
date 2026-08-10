import { createFileRoute } from "@tanstack/react-router";
import { Section, EmptyNote } from "@/components/site/Section";
import {
  activities,
  biography,
  career,
  education,
  interests,
  languages,
  memberships,
  researchSpecialties,
  type LocalizedItem,
} from "@/content/site";
import { useLanguage } from "@/lib/language";

const title = "About — Dr. Hani Mahmoud Zahran";
const description =
  "Biography, education, experience, research specialties, memberships and scientific activities of Dr. Hani Mahmoud Zahran.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

function List({ items, empty }: { items: LocalizedItem[]; empty: string }) {
  const { pick } = useLanguage();
  if (items.length === 0) return <EmptyNote>{empty}</EmptyNote>;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((i) => (
        <li key={i.en} className="rounded-sm border border-border bg-card px-4 py-2 text-sm">
          {pick(i.en, i.ar)}
        </li>
      ))}
    </ul>
  );
}

function AboutPage() {
  const { t, pick } = useLanguage();

  return (
    <>
      <Section eyebrow={t("about")} title={t("biography")}>
        <div
          className="max-w-3xl space-y-4 text-[0.98rem] leading-relaxed text-muted-foreground"
          dir="ltr"
        >
          {biography.map((p) => (
            <p key={p.slice(0, 24)} className="text-left">
              {p}
            </p>
          ))}
        </div>
      </Section>

      <Section eyebrow={t("education")} title={t("academicBackground")}>
        {education.length === 0 ? (
          <EmptyNote>{t("emptyEducation")}</EmptyNote>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {education.map((e) => (
              <article
                key={`${e.degree}-${e.year}`}
                className="rounded-md border border-border bg-card p-6"
              >
                <p className="eyebrow">{e.year}</p>
                <h3 className="mt-2 text-lg font-semibold">
                  {pick(e.degree, e.degreeAr)} · {pick(e.field, e.fieldAr)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {pick(e.university, e.universityAr)}, {pick(e.location, e.locationAr)}
                </p>
                {e.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {pick(e.description, e.descriptionAr)}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section eyebrow={t("experience")} title={t("professionalExperience")}>
        {career.length === 0 ? (
          <EmptyNote>{t("emptyExperience")}</EmptyNote>
        ) : (
          <ol className="border-s border-border">
            {career.map((c) => (
              <li key={`${c.position}-${c.start}`} className="relative pb-10 ps-8">
                <span className="absolute -start-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent" />
                <p className="eyebrow">
                  {c.start} — {c.end === "Present" ? t("present") : c.end}
                </p>
                <h3 className="mt-1 text-xl font-semibold">{pick(c.position, c.positionAr)}</h3>
                <p className="text-sm text-muted-foreground">
                  {pick(c.organization, c.organizationAr)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section eyebrow={t("research")} title={t("researchSpecialties")}>
        <List items={researchSpecialties} empty={t("emptyResearchSpecialties")} />
      </Section>

      <Section eyebrow={t("affiliations")} title={t("membershipsCommittees")}>
        {memberships.length === 0 ? (
          <EmptyNote>{t("emptyMemberships")}</EmptyNote>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border bg-card">
            {memberships.map((m) => (
              <li key={m.title} className="px-6 py-4">
                <p className="text-base font-semibold">{pick(m.title, m.titleAr)}</p>
                {m.period && <p className="text-sm text-muted-foreground">{m.period}</p>}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section eyebrow={t("activities")} title={t("scientificActivities")}>
        <List items={activities} empty={t("emptyActivities")} />
      </Section>

      <Section eyebrow={t("languages")} title={t("languages")}>
        <List items={languages} empty={t("emptyLanguages")} />
      </Section>

      <Section eyebrow={t("personal")} title={t("interests")}>
        <List items={interests} empty={t("emptyInterests")} />
      </Section>
    </>
  );
}
